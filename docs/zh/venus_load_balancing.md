## 前期准备

1. 取消venus程序的jwt-token验证;
2. 本示例有两个venus节点: 192.168.1.125(mainnet),192.168.1.134(calibnet);
3. 192.168.1.134安装nginx作为负载均衡服务器;

## nginx配置

1. venus节点监听地址改为:/ip4/0.0.0.0/tcp/3453,文件: ~/.venus/api
   
2. 负载均衡配置

    ```sh
   ... ...

    http
        {
            ... ...

    server
        {
            listen 888;
            server_name phpmyadmin;
            index index.html index.htm index.php;
            root  /www/server/phpmyadmin;

            #error_page   404   /404.html;
            include enable-php.conf;
        
            location /
            {
                proxy_pass http://venussvr;
            }

            access_log  /www/wwwlogs/access.log;
        }

    upstream venussvr
        {
            server 192.168.1.125:3453 weight=1;
            server 192.168.1.134:3453 weight=1;
        }

    include /www/server/panel/vhost/nginx/*.conf;
    }
    ```

3. 重启nginx服务,这时就可以用nginx服务代理venus服务了
    ```
    # curl http://192.168.1.134:888/rpc/v0 -X POST -H "Content-Type: application/json"  -d '{"method": "Filecoin.StateNetworkName","params":[],"id":1}'
    {"jsonrpc":"2.0","result":"mainnet","id":1}
    # curl http://192.168.1.134:888/rpc/v0 -X POST -H "Content-Type: application/json"  -d '{"method": "Filecoin.StateNetworkName","params":[],"id":1}'
    {"jsonrpc":"2.0","result":"calibrationnet","id":1}
    ```
