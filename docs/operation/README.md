# Deployment highly available daemon

The main purpose of this solution is to prevent the overall failure of service due to a single node failure. Since the node program may be able to be running, but there is a situation of out of synchronization(daemon still running), it is impossible to automatically select a good node using the nginx service simply. In this solution, a new proxy program is used between nginx and the node program to solve the problem. The proxy program will automatically monitor the height and weight changes in multiple nodes, and only the best node will be selected for each request. Another security feature is that nodes can choose different implementations, so that if something goes wrong with one implementation, nodes with other implementations can also work.

![](https://raw.githubusercontent.com/hunjixin/imgpool/master/chain-co.png)

## daemon

api auth suggest to use venus-auth but not local.  in local mode, when reimport snapshot, token will change.

venus:
```sh
#build
git clone https://github.com/filecoin-project/venus.git
git checkout <latest tag>
make
#run
./venus daemon --network <network-type> --auth-url <venus-auth url> --auth-token <venus-auth token>
```

lotus:
```sh
#build
git clone https://github.com/ipfs-force-community/lotus.git
git checkout <latest tag>
make <network-type>
#run
./lotus daemon --auth-url <venus-auth url> --auth-token <venus-auth token>
```

## chain-co agent

```sh
#build
git clone https://github.com/ipfs-force-community/chain-co.git
git checkout <latest tag>
make
#run
./chain-co --listen 0.0.0.0:<port>  run --auth <toke:url> --node <token:rpc-url> --node<token:rpc-url>
```

## proxy(optional)

There are many options for the proxy, including load balancing such as nginx, slb, etc., but note that it needs to support websocket and custom http headers. Take nginx as an example here
install nginx： https://www.nginx.com/resources/wiki/start/topics/tutorials/install

nginx config：
```
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

worker_rlimit_nofile 655350;
# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 655350;
}

http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }
 
    upstream websocket {
        server <endpoint>;
    }
 
    server {
        listen 34530;
      #  listen 34531 ssl; #https

      #  server_name <server name>;       

      #  access_log  /root/proxy.access.log;
      #  error_log   /root/proxy.error.log;

      #  ssl_certificate  <ssl>;
      #  ssl_certificate_key <key>;
         ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        location / {
            proxy_pass http://websocket;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Authorization $http_authorization;    #import
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
        }
   }
}
```

:::warning
- Because the data between nodes is still separated, it is impossible to provide completely consistent api, especially in the processing of the top header block. Therefore, when writing a program, it is necessary to take into condisider the possible inconsistencies of different nodes.
- If you deploy lotus, you need to use a customized version, because venus has some unique api.
- If there is a problem, please make an issue on venus. 
:::
