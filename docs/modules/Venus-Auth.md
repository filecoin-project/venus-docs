# venus-auth

venus-auth is the unified authorization service of venus chain services (venus shared modules/components).

* Permission validation
* Trace collection
* RESTful API
* Manage users
* Request rate limit

## Start venus-auth

Download source code.

```shell script
git clone https://github.com/filecoin-project/venus-auth.git
```

Compile.

```shell script
make
```

Start daemon.

```shell script
$ ./venus-auth run
```


## Configurations

```toml
# Service Ports
Port = "8989"
ReadTimeout = "1m"
WriteTimeout = "1m"
IdleTimeout = "1m"

[db]
  # Supports: badger (default), mysql
  type = "badger"
  # following params only applies to MySQL
  DSN = "rennbon:111111@(127.0.0.1:3306)/auth_server?parseTime=true&loc=Local&charset=utf8mb4&collation=utf8mb4_unicode_ci&readTimeout=10s&writeTimeout=10s"
  # conns 1500 concurrent
  maxOpenConns = 64
  maxIdleConns = 128
  maxLifeTime = "120s"
  maxIdleTime = "30s"

[log]
  # trace, debug, info, warning, error, fatal, panic
  # default log level
  logLevel = trace
  # db type, 1 -> influxDB
  type = 1
  # db hook switch
  hookSwitch = true

[Trace]
  # enable trace or not
  JaegerTracingEnabled = true
  # collection rate
  ProbabilitySampler = 1.0
  JaegerEndpoint = "127.0.0.1:6831"
  ServerName = "venus-auth"
```

:::tip

Default config file path is ` ~/.venus-auth/config.tml`.

:::

## CLI commands

Check help informations.

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

### Notable commands

#### token related

Generate tokens.

```shell script
$ ./venus-auth token gen --perm admin testminer

# output
generate token success: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo
```

List all tokens

```shell script
# show help
$ ./venus-auth token list -h
NAME:
   venus-auth token list - list token info

USAGE:
   venus-auth token list [command options] [arguments...]

OPTIONS:
   --skip value   (default: 0)
   --limit value  max value:100 (default: 20) (default: 20)
   --help, -h     show help (default: false)

$ ./venus-auth token list

# output
num    name             perm    createTime              token
1      testminer1       read    2021-05-27 15:33:24     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6InJlYWQiLCJleHQiOiIifQ.7BRN8IXzK9Gpe35OPgCelTC79UuirgM23mO7fHxKr2Q
2      testminer2       sign    2021-05-27 15:33:15     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6InNpZ24iLCJleHQiOiIifQ.D_IFz2qZjFRkLJEzmv4HkZ3rZxukYoYZXEjlBKZmGOA
3      testminer3       admin   2021-07-21 16:46:29     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo
4      testminer4       admin   2021-05-27 15:33:19     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.oakIfSg1Iiv1T2F1BtH1bsb_1GeXWuirdPSjvE5wQLs
5      testminer5       write   2021-05-27 15:33:29     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6IndyaXRlIiwiZXh0IjoiIn0.yVC2lZlmBQAxThTt0pLXH9cZgUZuuM6Us19aUw4DWNQ
```

Remove token.

```shell script
$ ./venus-auth token rm eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo

# output
remove token success: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.8yNodOcALJ8fy4h-Hh5yLfaR27cD4a8ePd9BkmWlfEo
```

#### user related

Add user.

```shell script
$ ./venus-auth user add --name testminer2 --miner f01569

# output
add user success: f29d524a-1589-4784-b934-5b3432290f79
```

Query user.

```shell script
$ ./venus-auth user get testminer2

# output
name: testminer2
miner: f01569
sourceType: 0   // miner:1
state 0         // 0: disable, 1: enable
comment:
createTime: Wed, 21 Jul 2021 16:56:50 CST
updateTime: Wed, 21 Jul 2021 16:56:50 CST
```

List users.

```shell script
# show help
$ ./venus-auth user list -h
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

$ ./venus-auth user list

# output
number: 1
name: testminer
miner: f01561
sourceType: 0   // miner:1
state 0         // 0: disable, 1: enable
comment: test
createTime: Mon, 31 May 2021 18:41:55 CST
updateTime: Mon, 31 May 2021 18:41:55 CST

number: 2
name: li_sealer
miner: f02256
sourceType: 0   // miner:1
state 0         // 0: disable, 1: enable
comment: li
createTime: Tue, 01 Jun 2021 14:35:35 CST
updateTime: Tue, 01 Jun 2021 14:35:35 CST
```

Update user.

```shell script
# show help
$ ./venus-auth user udpate -h
NAME:
   venus-auth user update - update user

USAGE:
   venus-auth user update [command options] [arguments...]

OPTIONS:
   --name value
   --miner value
   --comment value
   --sourceType value  (default: 0)
   --state value       (default: 0)
   --help, -h          show help (default: false)

$ ./venus-auth user update --name testminer2 --miner f01570

# output
update user success
```

Check if miner exists.

```shell script
$ ./venus-auth user has f01570

# output
true
```

Activate user.

```shell script
./venus-auth user active testminer2

# output
active user success
```

#### User request rate limit related

```shell script
$ ./venus-auth user rate-limit -h

# output
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

Add rate limit.

```shell script
# show help
AME:
   venus-auth user rate-limit add - add user request rate limit

USAGE:
   venus-auth user rate-limit add [command options] user rate-limit add <name> <limitAmount> <duration(2h, 1h:20m, 2m10s)>

OPTIONS:
   --id value  rate limit id to update
   --help, -h  show help (default: false)

$ ./venus-auth user rate-limit add testminer2 10 1m

# output
upsert user rate limit success: dee7e326-3b8b-4e38-9de7-1bee9bdffa9d
```

Update rate limit.

```shell script
$ ./venus-auth user rate-limit update testminer2 dee7e326-3b8b-4e38-9de7-1bee9bdffa9d 100 1m

# output
upsert user rate limit success: dee7e326-3b8b-4e38-9de7-1bee9bdffa9d
```

Query rate limit.

```shell script
$ ./venus-auth user rate-limit get testminer2

# output
user:testminer2, limit id:dee7e326-3b8b-4e38-9de7-1bee9bdffa9d, request limit amount:100, duration:0.02(h)
```

Remove rate limit.

```shell script
$ ./venus-auth user rate-limit del testminer2 dee7e326-3b8b-4e38-9de7-1bee9bdffa9d

# output
delete rate limit success, dee7e326-3b8b-4e38-9de7-1bee9bdffa9d
```

