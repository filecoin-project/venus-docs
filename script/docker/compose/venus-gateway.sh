#!/bin/sh

echo "Arg: $@"
token=$(cat /env/token )
echo ${token}

/app/venus-gateway --listen=/ip4/0.0.0.0/tcp/45132 \
run \
--auth-url=http://127.0.0.1:8989 \
--auth-token ${token}
