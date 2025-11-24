import serial
import json
import time
import requests
import threading
import queue
import os
from datetime import datetime
from fastapi import FastAPI, BackgroundTasks, HTTPException, UploadFile, File
from pydantic import BaseModel
import uvicorn
import uvicorn
from iot_core import IoTIntelligenceCore
from crypto_layer import QuantumSecurityLayer

# --- CONFIGURATION ---
SERIAL_PORT = "COM11"
BAUD_RATE = 115200
NODE_SERVER_REPORT_URL = "http://10.89.204.138:3000/report/report"
NODE_SERVER_ACTION_URL = "http://10.89.204.138:3000/api/action"
CHUNK_SIZE = 1024
DEFAULT_FIRMWARE_URL = "http://10.89.204.138:3000/file/firmware/latest"

# --- SHARED STATE ---
# This queue allows the API to talk to the Serial Thread safely
command_queue = queue.Queue()
ota_event = threading.Event()

# Initialize Systems
app = FastAPI(title="Cerberus Unified Gateway")
brain = IoTIntelligenceCore()
crypto = QuantumSecurityLayer()

# --- OTA ENGINE (Handles the file streaming) ---
def perform_ota_update(ser):
    print("\n🔁 STARTING OTA FIRMWARE UPDATE...")
    try:
        file_path = "latest_firmware.bin"
        
        # 1. Validation
        if not os.path.exists(file_path):
            print("❌ Error: No firmware file found to flash.")
            return

        file_size = os.path.getsize(file_path)
        
        # 2. Handshake (Tell ESP32 to get ready)
        print(f"   1. Sending OTA Start Command ({file_size} bytes)...")
        # We send size so ESP32 knows when to stop
        ser.write(f"OTA_START {file_size}\n".encode())
        
        # IMPORTANT: Wait for ESP32 to erase flash memory (takes 1-2s)
        time.sleep(2) 
        
        # 3. Stream File
        print("   2. Streaming Data...")
        with open(file_path, "rb") as f:
            chunk_num = 0
            while True:
                # Read 1KB chunk
                chunk = f.read(CHUNK_SIZE)
                if not chunk: break
                
                # Send Chunk
                ser.write(chunk)
                chunk_num += 1
                
                # FLOW CONTROL (Crucial for Bluetooth Serial)
                # Bluetooth buffers are small. If we send too fast, packets get dropped.
                # A small sleep allows the ESP32 to process the chunk.
                time.sleep(0.05) 
                
                if chunk_num % 10 == 0:
                    print(f"      -> Sent Chunk {chunk_num}...")

        # 4. Finish
        print("   3. Sending End Signal...")
        time.sleep(1) # Ensure buffer is clear
        ser.write(b"OTA_END\n")
        print("✅ OTA UPDATE COMPLETE. Device Rebooting.")
        
    except Exception as e:
        print(f"❌ OTA FAILED: {e}")

# --- SERIAL HANDLER (Updated Main Loop) ---
def serial_engine():
    print(f"⚡ Opening Serial Connection on {SERIAL_PORT}...")
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.1)
        print("✅ Serial Online.")
    except Exception as e:
        print(f"❌ Serial Failed: {e}")
        return

    while True:
        # --- PRIORITY 1: CHECK FOR OTA REQUEST (New) ---
        # If the API triggered an update, we pause everything else
        if ota_event.is_set():
            perform_ota_update(ser)
            ota_event.clear() # Reset flag so we go back to normal mode
            continue # Skip the rest of the loop to let device reboot

        # --- PRIORITY 2: WRITE ACTIONS (Existing) ---
        if not command_queue.empty():
            cmd = command_queue.get()
            try:
                print(f"   ⚡ SENDING ACTION: {cmd}")
                ser.write(f"{cmd}\n".encode())
            except Exception as e:
                print(f"   ❌ Write Error: {e}")

        # --- PRIORITY 3: READ TELEMETRY (Existing) ---
        try:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                if not line.startswith("{"): continue

                # 1. Parse & Analyze
                log_data = json.loads(line)
                ai_result = brain.analyze(log_data)

                # 2. Auto-Action
                if ai_result['status'] == "SECURITY_PRIORITY":
                    command_queue.put("LOCKDOWN")
                elif ai_result['status'] == "ECO_SAVER":
                    command_queue.put("DEEP_SLEEP")

                # 3. Prepare & Encrypt
                full_payload = log_data.copy()
                full_payload["cerberus_analysis"] = {
                    "decision": ai_result['status'],
                    "reasoning": ai_result['explanation'],
                    "metrics": ai_result['metrics'],
                    "processed_at": datetime.now().isoformat()
                }
                secure_packet = crypto.encrypt_payload(full_payload)

                # 4. Send to Cloud
                try:
                    requests.post(NODE_SERVER_REPORT_URL, json=secure_packet)
                except: pass

        except Exception as e:
            pass
        
        time.sleep(0.05)

# --- API ENDPOINTS (The Interface) ---

class ActionRequest(BaseModel):
    action_type: str  # e.g., "RESTART", "LOCKDOWN", "BLINK_LED"
    reason: str       # "Manual override by admin"

def notify_node_of_action(action, reason):
    """Tells the Node server that an action was taken"""
    payload = {
        "event": "ACTION_TAKEN",
        "action": action,
        "initiator": "API_REQUEST",
        "reason": reason,
        "timestamp": datetime.now().isoformat()
    }
    # Encrypt this too so the dashboard is secure!
    secure = crypto.encrypt_payload(payload)
    try:
        requests.post(NODE_SERVER_ACTION_URL, json=secure)
        print("   ☁️  Action Logged to Cloud")
    except:
        print("   ⚠️ Failed to log action to cloud")

class FirmwareRequest(BaseModel):
    url: str = DEFAULT_FIRMWARE_URL

@app.post("/trigger-ota-pull")
async def trigger_update(req: FirmwareRequest):
    """
    1. Downloads .bin from Node Server.
    2. Saves it as 'latest_firmware.bin'.
    3. Tells Serial Engine to flash it.
    """
    print(f"\n📥 INITIATING OTA PULL FROM: {req.url}")
    
    try:
        # 1. Download
        with requests.get(req.url, stream=True) as r:
            r.raise_for_status()
            with open("latest_firmware.bin", "wb") as f:
                for chunk in r.iter_content(chunk_size=8192): 
                    f.write(chunk)
        
        size = os.path.getsize("latest_firmware.bin")
        print(f"   💾 Downloaded {size} bytes.")
        
        # 2. Trigger Flash
        ota_event.set()
        
        return {"status": "OTA Started", "file_size": size}
        
    except Exception as e:
        print(f"   ❌ Download Failed: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/act")
async def take_action(req: ActionRequest, background_tasks: BackgroundTasks):
    """
    ENDPOINT: Tells the hardware to do something via Bluetooth.
    Example Body: { "action_type": "FORCE_RESET", "reason": "Demo" }
    """
    print(f"\n🎮 API RECEIVED COMMAND: {req.action_type}")
    
    # 1. Add to Queue (The Serial Thread will pick this up instantly)
    command_queue.put(req.action_type)
    
    # 2. Notify Cloud (Background)
    background_tasks.add_task(notify_node_of_action, req.action_type, req.reason)
    
    return {"status": "Queued", "command": req.action_type}

# --- STARTUP ---
    """
    Node.js sends the .bin file here.
    We save it and trigger the Serial Engine to flash it.
    """
    try:
        print(f"\n📥 RECEIVED FIRMWARE: {file.filename}")
        
        # 1. Save File Locally
        with open("latest_firmware.bin", "wb") as f:
            content = await file.read()
            f.write(content)
            
        print("   💾 Saved to disk. Queuing Update...")
        
        # 2. Trigger the Serial Loop
        ota_event.set()
        
        return {"status": "Update Queued", "size": len(content)}
    except Exception as e:
        return {"status": "Error", "detail": str(e)}

# --- STARTUP ---
if __name__ == "__main__":
    t = threading.Thread(target=serial_engine)
    t.daemon = True
    t.start()
    uvicorn.run(app, host="0.0.0.0", port=8000)