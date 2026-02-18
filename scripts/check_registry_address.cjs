async function checkAddress() {
    const address = '0x8004A818BFB912233c491871b3d84c89A494BD9e';
    const rpcs = [
        'https://forno.celo-sepolia.celo-testnet.org',
        'https://alfajores-forno.celo-testnet.org',
        'https://rpc.ankr.com/celo_alfajores'
    ];

    for (const rpc of rpcs) {
        console.log(`Checking ${rpc}...`);
        try {
            const response = await fetch(rpc, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_getCode',
                    params: [address, 'latest']
                })
            });
            const data = await response.json();
            const code = data.result;
            if (code && code !== '0x') {
                console.log(`✅ FOUND code at ${address} on ${rpc}`);
            } else {
                console.log(`❌ No code at ${address} on ${rpc}`);
            }
        } catch (e) {
            console.log(`⚠️ Error checking ${rpc}: ${e.message}`);
        }
    }
}

checkAddress();
