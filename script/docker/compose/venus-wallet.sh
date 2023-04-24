#!/bin/sh

echo "Arg: $@"

PSWD=$(head -n 10 /dev/urandom | md5sum | head -c 20)

token=$(cat /env/token )

echo "token:"
echo ${token}

Args=""

Args="run --password=$PWD --gateway-api=/ip4/127.0.0.1/tcp/45132 --gateway-token=$token --support-accounts=admin"


echo "EXEC: ./venus-wallet $Args \n\n"
./venus-wallet $Args &


sleep 3
addr_exist=$( venus-wallet list )
if [ -z "$addr_exist" ]
then
    if [ -f /env/init.key ]; then
        ADDR=$(venus-wallet import /env/init.key)
        while [ $? -ne 0 ]; do
            ADDR=$(venus-wallet import /env/init.key)
        done
        echo "imported address: $ADDR"
    else
        ADDR=$(venus-wallet new bls)
        echo "new address: $ADDR"
    fi
    echo $ADDR > /env/wallet_address
fi

wallet_token=$(venus-wallet auth api-info --perm admin)
echo "wallet_token: $wallet_token"
echo $wallet_token > /env/wallet_token

wait
