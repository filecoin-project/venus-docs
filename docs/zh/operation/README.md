# 高可用节点的部署方案

这个方案的主要目的在于防止由于单个节点故障导致整体无法服务，由于节点程序可能可以运行，但是存在不同步的情况，因而单纯使用nginx服务无法做到自动选择良好的节点。 本方案中是在nginx和节点程序之间引入新的代理程序来解决问题，代理程序会自动的在多个节点中监控高度重量变化，每次请求只会选择正常的节点。另一个安全之处在于节点这里可以选择不同的实现，这样玩意某个实现出了问题也可以有其他实现的节点顶上去。

![](https://raw.githubusercontent.com/hunjixin/imgpool/master/chain-co.png)

## 部署节点

api auth suggest to use venus-auth but not local.  in local mode, when reimport snapshot, token will change

venus:
```sh
#build
git clone https://github.com/filecoin-project/venus.git
make
#run
./venus daemon --network <network-type> --auth-url <venus-auth url>
```

lotus:
```sh
#build
git clone https://github.com/ipfs-force-community/lotus.git
git checkout v1.11.2_incubation
make <network-type>
#run
./lotus daemon --auth-url <venus-auth url>
```

## 部署chain-co

```sh
#build
git clone https://github.com/ipfs-force-community/chain-co.git
make
#run
./chain-co  run -listen 0.0.0.0:<port> --auth-url <venus-auth url> --node <token:libp2p> --node<token:libp2p>
```

## 部署代理(可选)

代理可以有多种选择，包括nginx，slb等负载均衡方案，但是注意的是需要支持长链接以及自定义header头。这里以nginx为例子
安装： https://www.nginx.com/resources/wiki/start/topics/tutorials/install
配置文件参考：
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
            proxy_set_header Authorization $http_authorization;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
        }
   }
}
```

## 注意事项

1. 因为节点之间数据还是分离的，所以无法提供完全一致的接口访问，特别是在头部区块的处理上。
2. 如果部署lotus，需要使用定制后的版本，因为venus有一些特有的接口.
3. 如果存在问题，请提issue。