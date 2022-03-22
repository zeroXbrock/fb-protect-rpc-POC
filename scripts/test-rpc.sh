BUNDLE_ID=42069
#BUNDLE_RPC_URL=https://rpc.flashbots.net/bundle?id=$BUNDLE_ID
BUNDLE_RPC_URL=http://localhost:9000/bundle?id=$BUNDLE_ID

if [ "$1" = "delete" ]; then
    echo "deleting bundle txns"
    curl -X POST $BUNDLE_RPC_URL
fi

while [ 1 -eq 1 ]; do
    curl -s $BUNDLE_RPC_URL  | jq > out.json
    echo [$(date +"%T")]
    node analyze.js
    sleep 5
done
