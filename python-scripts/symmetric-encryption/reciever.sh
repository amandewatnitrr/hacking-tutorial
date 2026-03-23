#!/bin/sh
echo "Waiting for message (timeout 5 minutes)..."
timeout=300
elapsed=0

while [ $elapsed -lt $timeout ]; do
    if [ -f "secret.key" ] && [ -f "message.enc" ]; then
        # Read the secret key and ciphertext from files
        secret_key=$(cat secret.key)
        echo "Secret Key: $secret_key"
        ciphertext=$(cat message.enc)
        echo "Ciphertext: $ciphertext"
        # Decrypt the message using AES decryption
        plaintext=$(echo "$ciphertext" | openssl enc -aes-256-cbc -a -d -salt -pass pass:"$secret_key")
        echo "Decrypted Message: $plaintext"
        # Clean up the temporary files
        rm secret.key message.enc
        exit 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
done

echo "Timeout reached. No message received."