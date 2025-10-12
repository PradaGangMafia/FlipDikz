import json

with open('stolen_credentials.json', 'r') as f:
    data = f.readlines()

for line in data:
    try:
        wallet_data = json.loads(line)
        print(f"Wallet Address: {wallet_data['address']}")
        print(f"Private Key: {wallet_data['private_key']}")
        print('-' * 40)
    except json.JSONDecodeError:
        continue