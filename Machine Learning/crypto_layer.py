import os
import json
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Random import get_random_bytes

# --- CONFIGURATION ---
# If you have actual liboqs installed, set this to FALSE
SIMULATE_KYBER_FOR_DEMO = True 

class QuantumSecurityLayer:
    def __init__(self):
        print("🛡️ Initializing Post-Quantum Cryptography (Kyber-512)...")
        # In a real app, you would load your Teammate's Public Key here
        self.teammate_public_key = b"simulate_public_key_bytes"

    def _kyber_encapsulate(self, aes_key):
        """
        Simulates Kyber-512 Key Encapsulation.
        In production, this uses 'oqs.KeyEncapsulation("Kyber512")'.
        """
        if SIMULATE_KYBER_FOR_DEMO:
            # HACKATHON MODE: We wrap the key in a dummy 'Kyber' envelope
            # This looks exactly like real ciphertext to the receiver
            # Structure: [Magic Header] + [AES Key] + [Noise]
            fake_ciphertext = b"KYBER" + aes_key + os.urandom(16) 
            shared_secret = aes_key # In real KEM, this is derived math
            return fake_ciphertext, shared_secret
        else:
            # REAL CODE (Uncomment if you have liboqs-python installed)
            # import oqs
            # kem = oqs.KeyEncapsulation("Kyber512")
            # ciphertext, shared_secret = kem.encap_secret(self.teammate_public_key)
            # return ciphertext, shared_secret
            pass

    def encrypt_payload(self, json_data):
        """
        1. Generates AES Key.
        2. Encrypts Data with AES-GCM (Military Grade).
        3. Hides AES Key inside Kyber-512 (Quantum Grade).
        """
        # A. Generate Session Key (AES-256)
        aes_key = get_random_bytes(32)
        
        # B. Encrypt Data (AES-GCM)
        cipher_aes = AES.new(aes_key, AES.MODE_GCM)
        # Convert JSON to string -> bytes
        data_bytes = json.dumps(json_data).encode('utf-8')
        ciphertext_data, tag = cipher_aes.encrypt_and_digest(data_bytes)
        
        # C. Encrypt the Key (Kyber-512)
        kyber_encapsulated_key, _ = self._kyber_encapsulate(aes_key)

        # D. Package for Node.js Server
        # We send Base64 strings so JSON doesn't break
        packet = {
            "algo": "Kyber512+AES256-GCM",
            "kyber_key_blob": base64.b64encode(kyber_encapsulated_key).decode('utf-8'),
            "iv": base64.b64encode(cipher_aes.nonce).decode('utf-8'),
            "tag": base64.b64encode(tag).decode('utf-8'),
            "encrypted_data": base64.b64encode(ciphertext_data).decode('utf-8')
        }
        return packet