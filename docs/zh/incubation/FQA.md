# venus 分布式矿池常见问题

## 1. worker fil 不足未及时处理或venus节点出口流量被打满，大量任务卡在WaitSeed

&ensp;&ensp; 在venus-auth节点上使用./venus-messager msg list-fail命令打开失败的消息，然后使用./venus-messager msg mark-bad --really-do-it <失败消息id>命令将失败的消息打回sealer侧重启判断消息是否有问题；再次检查是否还有失败的消息


## 2. venus-messager中大量消息卡住

&ensp;&ensp; 默认每个worker地址30秒只往链上发送的消息数最多只有20条，可以根据实际体量进行稍微增加到30条（值越大同一高度往链上发送的消息数就越多，可能造成小部分的SysErrOutOfGas消息）
             
```sh
 $./venus-messager address set-sel-msg-num --num 30 <worker 地址>
```             
             

## 3. venus-miner无法出块
- 确认venus-miner连接的venus节点同步高度正常，并检查其日志是否正常；
- 在venus-miner节点上logs/venus-miner.log日志信息；使用 ./venus-miner address state 命令确认IsMining为true
```sh
$ ./venus-miner address state
[
    {
         "Addr": "f0xxx",     # 矿工号
         "IsMining": true,    # 是否在挖矿（出块）
         "Err": null          # 是否有报错信息
    }
]   
```

## 4. venus节点宕机或磁盘空间将满，切换备机
venus-message: 修改用户家目录下的messager.toml配置文件里的内容,指向新节点后，重启venus-message服务
```
$ cat ~/messager.toml
[node]
    url = "/ip4/192.168.1.134/tcp/3453"
    token= "eyJhbGciOIUacbciIsInR5cCI6I.iLCJwZXJtIjoic2lnbiIs.c65GtR7IVjJYE"
```  
kill掉之前的venus-messager进程后，再重新启动即可

venus-miner: 修改用户家目录下的配置文件，连接的ip地址
```
$ cat ~/.venusminer/config.toml
ListenAPI = "/ip4/192.168.0.98/tcp/3453/http"
Token = "eyJhbGciOiJIUzIsInR5c.eyJuYW1lIjoibWMmV4dCI6IiJ9.3P0x6StVjJYEhv198"
```
重新启动venus-miner服务

winning-post和sealer节点修改.lotus/api和.lotus/token值
```
$ cat .venus/api
/ip4/120.78.159.125/tcp/3453/http
```
修改完成后使用重启winning-post和sealer