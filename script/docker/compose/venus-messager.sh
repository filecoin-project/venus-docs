#!/bin/sh

echo "Arg: $@"
token=$(cat /env/token )
echo ${token}

/app/venus-messager run \
--auth-url=http://127.0.0.1:8989 \
--node-url /ip4/127.0.0.1/tcp/3453 \
--gateway-url=/ip4/127.0.0.1/tcp/45132 \
--auth-token ${token}
