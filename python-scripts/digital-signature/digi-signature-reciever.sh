#!/bin/sh
echo "Waiting for message and signature (timeout 5 minutes)..."
timeout=300
elapsed=0
echo "Verifying public key exists..."
while [ $elapsed -lt $timeout ]; do
    if [ -f "sender_public.key" ] && [ -f "message.txt" ] && [ -f "signature.bin" ]; then
        # Read the message and digital signature from files
        message=$(cat message.txt)
        digital_signature=$(cat signature.bin)
        # Generate a hash of the received message
        message_hash=$(printf "%s" "$message" | openssl dgst -sha256)
        # Decrypt the digital signature using the sender's public key to retrieve the original hash
        decrypted_hash=$(printf "%s" "$digital_signature" | openssl rsautl -verify -inkey sender_public.key -pubin)
        # Compare the decrypted hash with the hash of the received message
        if [ "$decrypted_hash" = "$message_hash" ]; then
            echo "Digital signature is valid. Message is authentic and has not been altered."
        else
            echo "Digital signature is invalid. Message may have been tampered with or sender's identity cannot be verified."
        fi
        echo "Received Message: $message"
        # Clean up the temporary files
        rm sender_public.key message.txt signature.bin
        exit 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
done  
echo "Timeout reached. No message received."