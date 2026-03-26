#!/bin/sh
echo "Enter the message you want to sign:"
read -r message
# Generate a hash of the message
message_hash=$(printf '%s' "$message" | openssl dgst -sha256)
# Generate Private and Public Key Pair (if not already generated)
if [ ! -f sender_private.key ]; then
    openssl genpkey -algorithm RSA -out sender_private.key -pkeyopt rsa_keygen_bits:2048
    openssl rsa -pubout -in sender_private.key -out sender_public.key
fi
# Encrypt the hash with the senders private key to create the digital signature
digital_signature=$(printf '%s' "$message_hash" | openssl rsautl -sign -inkey sender_private.key)
# Save the message and digital signature to files to simulate sending
echo "$message" > message.txt
echo "$digital_signature" > signature.bin
echo "Message signed and sent."