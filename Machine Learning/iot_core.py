import joblib
import pandas as pd
import numpy as np
from groq import Groq

# --- CONFIGURATION ---
GROQ_API_KEY = "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" # <--- PASTE KEY HERE

SENTINEL_FEATURES = [
    'Sudden jumps in sensor data', 'Battery drain spikes', 'Irregular sending patterns', 
    'Physical tampering indicators', 'Unusual power supply events', 'Change in frequency', 
    'Change in payload size', 'ML model’s behaviour score', 'Threshold crossing events', 
    'Reason for behaviour change_Environmental Change', 'Reason for behaviour change_External Interference', 
    'Reason for behaviour change_Firmware Update', 'Reason for behaviour change_Routine Maintenance', 
    'Reason for behaviour change_Sensor Malfunction', 'Reason for behaviour change_Unexplained', 
    'Change in connection pattern_Consistent', 'Change in connection pattern_Dropped', 
    'Change in connection pattern_Frequent Reconnects', 'Change in connection pattern_Intermittent', 
    'Change in connection pattern_Stable', 'Change in connection pattern_Unexpected Disconnections', 
    'Gateway event logs_Critical', 'Gateway event logs_Debug', 'Gateway event logs_Error', 
    'Gateway event logs_Failed Authentication', 'Gateway event logs_Info', 
    'Gateway event logs_Normal operation', 'Gateway event logs_Unauthorized Access',
    'Gateway event logs_Warning'
]

ANALYST_FEATURES = [
    "connect_count", "freq_connect_attempts", "data_send_count", 
    "time_interval", "fw_update_count", "payload_size", 
    "batt_consumed_per_payload", "uptime_sec", "retry_count", "rssi"
]

class IoTIntelligenceCore:
    def __init__(self):
        print("⚡ Initializing Intelligence Node...")
        try: self.analyst = joblib.load("models/analyst.pkl")
        except: self.analyst = None
        try: self.sentinel = joblib.load("models/best_anomaly_model.pkl")
        except: self.sentinel = None
        try: self.llm_client = Groq(api_key=GROQ_API_KEY)
        except: self.llm_client = None

    def _preprocess_sentinel(self, log: dict):
        data = {f: 0 for f in SENTINEL_FEATURES}
        if log['anomaly']['sensorJump'] or log['telemetry']['temperature'] > 60:
            data['Sudden jumps in sensor data'] = 1
        if log['anomaly']['batterySpike']:
            data['Battery drain spikes'] = 1
        if log['anomaly']['tampering']:
            data['Physical tampering indicators'] = 1
        if log['behaviour']['connectionPattern'] != "stable":
            data['Irregular sending patterns'] = 1
            
        raw_pat = log['behaviour']['connectionPattern']
        found = False
        for feat in SENTINEL_FEATURES:
            if "Change in connection pattern" in feat and raw_pat.lower() in feat.lower():
                data[feat] = 1
                found = True
        if not found: data['Change in connection pattern_Stable'] = 1
            
        data['Gateway event logs_Normal operation'] = 1
        return pd.DataFrame([data])[SENTINEL_FEATURES]

    def _preprocess_analyst(self, log: dict):
        bat = log['battery']
        tel = log['telemetry']
        data = {
            "connect_count": bat['connectCount'],
            "freq_connect_attempts": bat['connAttemptCount'],
            "data_send_count": bat['sendCount'],
            "time_interval": int(bat['sendIntervalSec']),
            "fw_update_count": bat['firmwareUpdateCount'],
            "payload_size": bat['payloadSizeBytes'],
            "batt_consumed_per_payload": bat['batteryConsumedThisPayload'],
            "uptime_sec": tel['uptimeSeconds'],
            "retry_count": bat['retryCount'],
            "rssi": bat['wifiRSSI']
        }
        return pd.DataFrame([data])[ANALYST_FEATURES]

    def generate_reasoning(self, decision, trigger, log):
        if not self.llm_client: return f"Logic Trigger: {trigger}"
        prompt = f"Act as Cerberus AI. Explain decision '{decision}'. Trigger: {trigger}. Context: Bat {log['telemetry']['batteryPercentage']}%, Pattern {log['behaviour']['connectionPattern']}. Output: 1 professional sentence."
        try:
            res = self.llm_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192", max_tokens=60
            )
            return res.choices[0].message.content.strip().replace('"', '')
        except: return f"Trigger: {trigger}"

    def analyze(self, log: dict):
        # 1. SENTINEL LOGIC
        sentinel_res = {"is_anomaly": False, "score": 1.0, "trigger": "None"}
        if log['anomaly']['tampering']:
            sentinel_res["is_anomaly"] = True; sentinel_res["trigger"] = "Physical Tampering"
        elif log['telemetry']['temperature'] > 80:
            sentinel_res["is_anomaly"] = True; sentinel_res["trigger"] = "Critical Overheat"
        elif self.sentinel:
            feats = self._preprocess_sentinel(log)
            score = self.sentinel.decision_function(feats)[0]
            sentinel_res["score"] = score
            if score < 0.0:
                sentinel_res["is_anomaly"] = True
                sentinel_res["trigger"] = "Abnormal Pattern (ML)"

        # 2. ANALYST LOGIC
        analyst_res = {"hours_remaining": 0.0}
        if self.analyst:
            feats = self._preprocess_analyst(log)
            analyst_res["hours_remaining"] = self.analyst.predict(feats)[0]
        else:
            pct = log['telemetry']['batteryPercentage']
            drain = log['battery']['batteryConsumedThisPayload'] * 100
            if drain <= 0: drain = 0.1
            analyst_res["hours_remaining"] = (pct / 100 * 2000) / drain

        # --- NEW FEATURE: BATTERY STATUS TAG ---
        hours = analyst_res["hours_remaining"]
        if hours > 48:
            battery_status = "High"
        elif hours > 12:
            battery_status = "Moderate"
        else:
            battery_status = "Low"

        # 3. GOVERNOR LOGIC
        decision = "BALANCED"
        trigger = "System Nominal"
        if sentinel_res["is_anomaly"]:
            decision = "SECURITY_PRIORITY"
            trigger = sentinel_res["trigger"]
        elif log['telemetry']['batteryPercentage'] < 20:
            decision = "ECO_SAVER"
            trigger = "Critical Battery"

        reason = self.generate_reasoning(decision, trigger, log)

        return {
            "device_id": log['digitalTwin']['deviceId'],
            "status": decision,
            "explanation": reason,
            "metrics": {
                "anomaly_score": round(sentinel_res["score"], 3),
                "battery_prediction_hours": round(analyst_res["hours_remaining"], 1),
                "battery_status": battery_status # <--- ADDED HERE
            }
        }