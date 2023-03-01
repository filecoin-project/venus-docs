#!/bin/sh

echo "Arg: $@"
token=$(cat /env/token )
echo "token:"
echo ${token}


/app/venus-market run \
--node-url=/ip4/127.0.0.1/tcp/3453  \
--auth-url=http://127.0.0.1:8989 \
--gateway-url=/ip4/127.0.0.1/tcp/45132/ \
--messager-url=/ip4/127.0.0.1/tcp/39812/ \
--cs-token=${token} \
--signer-type="gateway" &

sleep 3
exist=$(/app/venus-market  piece-storage list | grep DefaultPieceStorage )
if [ -z "$exist" ]; then
    echo "add piece storage"
    /app/venus-market piece-storage add-fs --name DefaultPieceStorage --path /data/piece-storage
fi
wait
