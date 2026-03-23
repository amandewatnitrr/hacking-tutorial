#!/bin/sh
echo "Enter the message you want to send:"
read -r message
# Generate a random secret key
secret_key=$(openssl rand -hex 16)
# Encrypt the message using AES encryption
ciphertext=$(echo "$message" | openssl enc -aes-256-cbc -a -salt -pass pass:"$secret_key")
# Save the secret key and ciphertext to files to simulate sending
echo "$secret_key" > secret.key
echo "Secret key generated and saved to secret.key: $secret_key"
echo "$ciphertext" > message.enc
echo "Ciphertext generated and saved to message.enc: $ciphertext"
echo "Message encrypted and sent."