# IoT Intelligence Node

> **The Neuro-Symbolic AI Core powering the Unified IoT Optimization Framework.**

This repository contains the machine learning logic, decision engines, and Large Language Model (LLM) integrations. It serves as the "Brain" of the Edge Gateway, intelligently balancing the trade-off between **Post-Quantum Security** and **Battery Longevity** in resource-constrained IoT environments.

---

## 🏗️ Architecture: The Trinity Agents

Instead of a monolithic model, we utilize a **Multi-Agent System (MAS)** comprising three specialized intelligences that work in tandem:

| Agent | Algorithm | Responsibility |
| :--- | :--- | :--- |
| **🛡️ The Sentinel** | `Isolation Forest` (Unsupervised) | **Security & Anomaly Detection.** Detects physical tampering, DoS attacks, and sensor malfunctions by analyzing 29 distinct behavioral features. |
| **🔋 The Analyst** | `Gradient Boosting Regressor` | **Predictive Maintenance.** Predicts Remaining Useful Life (RUL) using physics-informed feature engineering (Payload Cost + Signal Strength + Retry Counts). |
| **⚖️ The Governor** | `Rule-Based` + `Llama 3 (Groq)` | **Policy Orchestrator.** Aggregates scores from the Sentinel and Analyst to enforce the optimal operating mode (Balanced, Security Priority, or Eco Saver). |

---

## 🚀 Key Features

* **Physics-Informed ML:** The Analyst agent doesn't just guess; it calculates battery drain based on `payload_size` (bytes), `rssi` (signal strength), and `retry_count`, grounding predictions in hardware realities.
* **Hybrid Anomaly Detection:** Combines **"Hard Rules"** (e.g., Temp > 80°C = Critical) with **"Soft ML Patterns"** (e.g., irregular transmission intervals) to ensure zero-false-negative safety.
* **XAI (Explainable AI):** Utilizes **Groq (Llama 3)** to generate human-readable reasoning for every decision.
    * *Example Output:* *"Switching to Security Priority due to detected physical tampering indicators despite low battery reserves."*
* **Edge-Optimized:** Models are compressed into lightweight `.pkl` files (<5MB) using `scikit-learn` and `joblib`, optimized for running locally on Raspberry Pi gateways.

---

## 📂 Directory Structure

```text
/Machine Learning
├── analyst_model.pkl             # Pre-trained Battery Regression Model
├── sentinal.pkl  # Pre-trained Isolation Forest
├── iot_core.py                 # Main Class: Wraps Models, Logic & LLM
├── main.py          # FastAPI Entry Point (Hardware <-> AI <-> Cloud)
├── crypto_layer.py             # Kyber-512 + AES Hybrid Encryption
└── requirements.txt            # Python Dependencies
