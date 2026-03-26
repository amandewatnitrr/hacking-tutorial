#!/bin/sh
echo "Enter your password:"
read -r password
# Hash the password using SHA-256
hashed_password=$(echo -n "$password" | openssl dgst -sha256)
# Store the hashed password in a file (simulating a database)
echo "$hashed_password" > password.hash
echo "Password hashed and stored."

echo "Login attempt. Enter your password:"
read -r login_password
# Hash the login attempt password
hashed_login_password=$(echo -n "$login_password" | openssl dgst -sha256)
# Retrieve the stored hashed password
stored_hashed_password=$(cat password.hash)

if [ "$hashed_login_password" = "$stored_hashed_password" ]; then
    echo "Authentication successful!"
else
    echo "Authentication failed!"
fi