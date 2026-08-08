#!/usr/bin/env python3
import hashlib
import hmac
import base64
import argparse

def xor_bytes(b1: bytes, b2: bytes) -> bytes:
    """XOR two byte arrays of the same length."""
    return bytes(x ^ y for x, y in zip(b1, b2))

def h(data: bytes) -> bytes:
    """Cryptographic hash function (SHA-256)."""
    return hashlib.sha256(data).digest()

def hmac_sha256(key: bytes, msg: bytes) -> bytes:
    """HMAC using SHA-256."""
    return hmac.new(key, msg, hashlib.sha256).digest()

def hi(password: bytes, salt: bytes, iterations: int) -> bytes:
    """PBKDF2-HMAC-SHA256 key derivation function."""
    return hashlib.pbkdf2_hmac('sha256', password, salt, iterations)

def generate_scram_proofs(password: str, salt_b64: str, iterations: int, auth_message: str):
    print("--- SCRAM-SHA-256 Cryptography ---")
    
    # 1. Decode inputs
    pwd_bytes = password.encode('utf-8')  # Note: A strict implementation uses SASLprep here
    salt_bytes = base64.b64decode(salt_b64)
    auth_msg_bytes = auth_message.encode('utf-8')

    # 2. Derive SaltedPassword: Hi(Normalize(password), salt, i)
    salted_password = hi(pwd_bytes, salt_bytes, iterations)
    
    # 3. Client Key & Stored Key
    client_key = hmac_sha256(salted_password, b"Client Key")
    stored_key = h(client_key)
    
    # 4. Client Signature & Proof
    client_signature = hmac_sha256(stored_key, auth_msg_bytes)
    client_proof = xor_bytes(client_key, client_signature)
    
    # 5. Server Key & Signature
    server_key = hmac_sha256(salted_password, b"Server Key")
    server_signature = hmac_sha256(server_key, auth_msg_bytes)

    # Output results
    print(f"Password:      {password}")
    print(f"Salt (b64):    {salt_b64}")
    print(f"Iterations:    {iterations}")
    print(f"Auth Message:  {auth_message}")
    print("-" * 34)
    print(f"ClientKey (b64):       {base64.b64encode(client_key).decode('utf-8')}")
    print(f"StoredKey (b64):       {base64.b64encode(stored_key).decode('utf-8')}")
    print(f"ClientProof (b64):     {base64.b64encode(client_proof).decode('utf-8')}")
    print(f"ServerSignature (b64): {base64.b64encode(server_signature).decode('utf-8')}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SCRAM-SHA-256 Calculator")
    parser.add_argument("-p", "--password", default="pencils", help="User's password")
    parser.add_argument("-s", "--salt", default="QSXCR+Q6sek8bf92", help="Base64 encoded salt")
    parser.add_argument("-i", "--iterations", type=int, default=4096, help="PBKDF2 Iteration count")
    parser.add_argument("-a", "--authmsg", 
                        default="n=user,r=fyko+d2lbbFgONRv9qkxdawL,r=fyko+d2lbbFgONRv9qkxdawL3rfcNHYJY1ZVvWVs7j,s=QSXCR+Q6sek8bf92,i=4096,c=biws,r=fyko+d2lbbFgONRv9qkxdawL3rfcNHYJY1ZVvWVs7j", 
                        help="AuthMessage (c-f-m-bare + ',' + s-f-m + ',' + c-f-m-without-proof)")
    
    args = parser.parse_args()
    generate_scram_proofs(args.password, args.salt, args.iterations, args.authmsg)