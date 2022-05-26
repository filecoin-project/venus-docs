# Venus Auth

venus-auth 是venus集群统一授权服务

* 权限验证
* Trace 采集
* RESTful API
* 管理用户及请求限流信息

## 快速启动

### 下载代码

```shell script
git clone https://github.com/filecoin-project/venus-auth.git
```

### 编译

```shell script
make
```

### 启动服务

```shell script
./venus-auth run
```


## 配置文件

> 默认会在 ~/.venus-auth/config.tml 生成配置文件

```
# 服务使用端口
Port = "8989"
ReadTimeout = "1m"
WriteTimeout = "1m"
IdleTimeout = "1m"

[db]
  # 支持: badger (默认), mysql
  type = "badger"
  # 以下参数适用于MySQL
  DSN = "rennbon:111111@(127.0.0.1:3306)/auth_server?parseTime=true&loc=Local&charset=utf8mb4&collation=utf8mb4_unicode_ci&readTimeout=10s&writeTimeout=10s"
  # conns 1500 concurrent
  maxOpenConns = 64
  maxIdleConns = 128
  maxLifeTime = "120s"
  maxIdleTime = "30s"

[log]
  # trace,debug,info,warning,error,fatal,panic
  # 默认日志级别
  logLevel = trace
  # db type, 1:influxDB
  type = 1
  # db hook switch
  hookSwitch = true

[Trace]
  # 是否启用 trace
  JaegerTracingEnabled = true
  # 收集的频率
  ProbabilitySampler = 1.0
  JaegerEndpoint = "127.0.0.1:6831"
  ServerName = "venus-auth"
```

## CLI 操作指南

### 查看帮助

```shell script
./venus-auth -h

NAME:
   venus-auth - A new cli application

USAGE:
   venus-auth [global options] command [command options] [arguments...]

VERSION:
   1.0.0'+b502a60'

COMMANDS:
   run      run venus-auth daemon
   token    token command
   user     user command
   help, h  Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --config value, -c value  config dir path
   --help, -h                show help (default: false)
   --version, -v             print the version (default: false)
```

### venus auth 基础操作

#### token 相关

1. 生成token

```shell script
./venus-auth token gen --perm admin testminer

# res
generate token success: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo
```

2. 列出 token

```shell script
# show help
./venus-auth token list -h
NAME:
   venus-auth token list - list token info

USAGE:
   venus-auth token list [command options] [arguments...]

OPTIONS:
   --skip value   (default: 0)
   --limit value  max value:100 (default: 20) (default: 20)
   --help, -h     show help (default: false)

./venus-auth token list

# res
num    name             perm    createTime              token
1      testminer1       read    2021-05-27 15:33:24     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6InJlYWQiLCJleHQiOiIifQ.7BRN8IXzK9Gpe35OPgCelTC79UuirgM23mO7fHxKr2Q
2      testminer2       sign    2021-05-27 15:33:15     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6InNpZ24iLCJleHQiOiIifQ.D_IFz2qZjFRkLJEzmv4HkZ3rZxukYoYZXEjlBKZmGOA
3      testminer3       admin   2021-07-21 16:46:29     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo
4      testminer4       admin   2021-05-27 15:33:19     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.oakIfSg1Iiv1T2F1BtH1bsb_1GeXWuirdPSjvE5wQLs
5      testminer5       write   2021-05-27 15:33:29     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6IndyaXRlIiwiZXh0IjoiIn0.yVC2lZlmBQAxThTt0pLXH9cZgUZuuM6Us19aUw4DWNQ
```

3. 查询 token

> ./venus-auth token get --name [name] or --token [token]

```shell script
./venus-auth token get --name testminer2

# res
name:        testminer2
perm:        sign
create time: 2021-05-27 15:33:15 +0800 CST
token:       eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6InNpZ24iLCJleHQiOiIifQ.D_IFz2qZjFRkLJEzmv4HkZ3rZxukYoYZXEjlBKZmGOA
```

4. 删除 token

```shell script
./venus-auth token rm eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo

# res
remove token success: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo
```

5. 恢复 token

```shell script
./venus-auth token recover eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo

# res
recover token success: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo
```

#### user 相关

1. 增加 user

```shell script
./venus-auth user add --name testminer2

# res
add user success: f29d524a-1589-4784-b934-5b3432290f79
```

2. 查询 user

```shell script
./venus-auth user get testminer2

# res
name: testminer2
sourceType: 0   // miner:1
state 0         // 0: disable, 1: enable
comment:
createTime: Wed, 21 Jul 2021 16:56:50 CST
updateTime: Wed, 21 Jul 2021 16:56:50 CST
```

3. 列出 user

```shell script
# show help
./venus-auth user list -h
NAME:
   venus-auth user list - list users

USAGE:
   venus-auth user list [command options] [arguments...]

OPTIONS:
   --skip value        (default: 0)
   --limit value       (default: 20)
   --state value       (default: 0)
   --sourceType value  (default: 0)
   --help, -h          show help (default: false)

./venus-auth user list

# res
number: 1
name: testminer
sourceType: 0   // miner:1
state 0         // 0: disable, 1: enable
comment: test
createTime: Mon, 31 May 2021 18:41:55 CST
updateTime: Mon, 31 May 2021 18:41:55 CST

number: 2
name: li_sealer
sourceType: 0   // miner:1
state 0         // 0: disable, 1: enable
comment: li
createTime: Tue, 01 Jun 2021 14:35:35 CST
updateTime: Tue, 01 Jun 2021 14:35:35 CST
```

4. 更新 user

```shell script
# show help
./venus-auth user udpate -h
NAME:
   venus-auth user update - update user

USAGE:
   venus-auth user update [command options] [arguments...]

OPTIONS:
   --name value
   --comment value
   --sourceType value  (default: 0)
   --state value       (default: 0)
   --help, -h          show help (default: false)

./venus-auth user update --name testminer2 --state 1

# res
update user success
```

5. 查询 miner 是否存在

```shell script
./venus-auth user has f01570

# res
true
```

6. 激活 user

```shell script
./venus-auth user active testminer2

# res
active user success
```

7. 删除 user

```shell script
./venus-auth user rm testminer2

# res
remove user success
```

8. 恢复 user

```shell script
./venus-auth user recover testminer2

# res
recover user success
```

#### miner 相关

1. 增加矿工

```shell script
./venus-auth user miner testminer2 f010101

# res
create user:testminer2 miner:f010101 success.
```

2. 列出用户的下的矿工

```shell script
./venus-auth user miner list testminer2

# res
user: testminer2, miner count:1
idx  miner    create-time                    
0    f010101  Tue, 24 May 2022 16:58:49 CST 
```

3. 删除矿工

```shell script
./venus-auth user miner rm f010101

# res
remove miner:f010101 success.
```

#### 用户请求限流相关

```shell script
./venus-auth user rate-limit -h

# res
NAME:
   venus-auth user rate-limit - A new cli application

USAGE:
   venus-auth user rate-limit command [command options] [arguments...]

COMMANDS:
   add      add user request rate limit
   update   update user request rate limit
   get      get user request rate limit
   del      delete user request rate limit
   help, h  Shows a list of commands or help for one command

OPTIONS:
   --help, -h  show help (default: false)
```

1. 增加请求限流

```shell script
# show help
AME:
   venus-auth user rate-limit add - add user request rate limit

USAGE:
   venus-auth user rate-limit add [command options] user rate-limit add <name> <limitAmount> <duration(2h, 1h:20m, 2m10s)>

OPTIONS:
   --id value  rate limit id to update
   --help, -h  show help (default: false)

./venus-auth user rate-limit add testminer2 10 1m

# res
upsert user rate limit success: dee7e326-3b8b-4e38-9de7-1bee9bdffa9d
```

2. 更新请求限流

```shell script
./venus-auth user rate-limit update testminer2 dee7e326-3b8b-4e38-9de7-1bee9bdffa9d 100 1m

# res
upsert user rate limit success: dee7e326-3b8b-4e38-9de7-1bee9bdffa9d
```

3. 查新请求限流

```shell script
./venus-auth user rate-limit get testminer2

# res
user:testminer2, limit id:dee7e326-3b8b-4e38-9de7-1bee9bdffa9d, request limit amount:100, duration:0.02(h)
```

4. 删除请求限流

```shell script
./venus-auth user rate-limit del testminer2 dee7e326-3b8b-4e38-9de7-1bee9bdffa9d

# res
delete rate limit success, dee7e326-3b8b-4e38-9de7-1bee9bdffa9d
```

