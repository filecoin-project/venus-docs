#!/bin/sh

echo "Arg: $@"

token=$(cat /env/token )
echo "token:"
echo ${token}


if [ ! -d "/root/.venusminer" ];
then
    echo "not found ~/.venusminer"
    /app/venus-miner init  --auth-api http://127.0.0.1:8989 --token ${token} --gateway-api /ip4/127.0.0.1/tcp/45132 --api /ip4/127.0.0.1/tcp/3453 --slash-filter local
fi

/app/venus-miner run 
