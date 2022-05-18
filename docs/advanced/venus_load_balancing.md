:::warning
For a more complex chain service, please refer to [this document](/operation/) for a full scale HA solution.
:::

## Preparation

1. Cancel the jwt-token verification of Venus program;
2. This example has two Venus nodes: 192.168.1.125 (mainnet) and 192.168.1.134 (calibnet);
3. 192.168.1.134 install nginx as the load balancing server;

## Configure nginx

1. The monitoring address of Venus node is changed to / ip4 / 0.0.0.0/tcp/3453, file: ~ /. venus / api
   
2. Configure load balancing

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

3. Restart the nginx service. You can use nginx service to proxy venus service
    ```
    # curl http://192.168.1.134:888/rpc/v0 -X POST -H "Content-Type: application/json"  -d '{"method": "Filecoin.StateNetworkName","params":[],"id":1}'
    {"jsonrpc":"2.0","result":"mainnet","id":1}
    # curl http://192.168.1.134:888/rpc/v0 -X POST -H "Content-Type: application/json"  -d '{"method": "Filecoin.StateNetworkName","params":[],"id":1}'
    {"jsonrpc":"2.0","result":"calibrationnet","id":1}
    ```
