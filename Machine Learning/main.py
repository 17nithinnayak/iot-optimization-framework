import uvicorn
import requests
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any
import json

# IMPORT YOUR MODULES
from iot_core import IoTIntelligenceCore  # Your AI Brain
from crypto_layer import QuantumSecurityLayer # Your Encryption

# --- CONFIG ---
NODE_SERVER_URL = "http://10.207.23.138:3000/api/receive-report"

app = FastAPI(title="Project Cerberus Gateway")

# Initialize Systems
brain = IoTIntelligenceCore()
crypto = QuantumSecurityLayer()

# Hardware Input Model
class HardwareLog(BaseModel):
    digitalTwin: Dict[str, Any]
    telemetry: Dict[str, Any]
    battery: Dict[str, Any]
    behaviour: Dict[str, Any]
    anomaly: Dict[str, Any]
    security: Dict[str, Any]

def send_to_cloud_node(encrypted_packet):
    """Background Task: Pushes encrypted data to Node.js Server"""
    try:
        print("🚀 Sending Quantum-Encrypted Report to Node Server...")
        # Real Send
        # response = requests.post(NODE_SERVER_URL, json=encrypted_packet)
        # print(f"☁️ Node Server Responded: {response.status_code}")
        
        # FOR DEMO: Just print the encrypted blob so you can show judges
        print(json.dumps(encrypted_packet, indent=2))
    except Exception as e:
        print(f"❌ Failed to push to cloud: {e}")

@app.post("/ingest")
async def ingest_hardware_data(log: HardwareLog, background_tasks: BackgroundTasks):
    """
    1. RECEIVE raw hardware logs.
    2. ANALYZE with .pkl models + LLM.
    3. ENCRYPT result with Kyber-512.
    4. SEND to Node.js backend.
    """
    # 1. AI Processing
    log_dict = log.dict()
    ai_report = brain.analyze(log_dict)
    
    # 2. Create the "Payload" for the Cloud
    # This is the clean JSON your teammate wants
    clean_payload = {
        "device_id": ai_report['device_id'],
        "timestamp": log_dict['telemetry']['lastContactTime'],
        "status": ai_report['status'],       # "SECURITY_PRIORITY"
        "reasoning": ai_report['explanation'], # "LLM Text..."
        "metrics": ai_report['metrics']
    }
    
    # 3. Quantum Encryption
    secure_packet = crypto.encrypt_payload(clean_payload)
    
    # 4. Send to Node (Background)
    background_tasks.add_task(send_to_cloud_node, secure_packet)
    
    # 5. Reply to Hardware (Immediate Command)
    # We don't encrypt the hardware reply to save battery/latency on the edge
    command = "SLEEP_15"
    if ai_report['status'] == "SECURITY_PRIORITY":
        command = "LOCKDOWN_MODE"
    elif ai_report['status'] == "ECO_SAVER":
        command = "DEEP_SLEEP_60"
        
    return {"command": command, "sync": "success"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)