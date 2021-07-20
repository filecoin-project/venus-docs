# How to use venus messager

messager is a component used to manage local messages, with the purpose of saving address messages, managing message status, and controlling the frequency of push messages.

## Getting start

### Clone this git repository to your machine

```bash
git clone https://github.com/filecoin-project/venus-messager.git
```

### Install Dependencies and Build

```bash
make
```

### Run messager

> ./venus-messager --config=xx.toml run [options]

* Specify the directory of the configuration file by `--config=xxx.toml`，default: `./messager.toml`
* If the specified configuration file does not exist at startup, a configuration file with the corresponding name will be generated and the value of the set parameter will be written to the configuration file
* When the specified configuration file exists at startup, the values of the set parameters will be used, but will not be written to the configuration file. If the parameters are not set, the values of the parameters in the configuration file will be used

```bash
options：
  --auth-url           url for auth server
  --auth-token         token for auth server
  --node-url           url for connection lotus/venus
  --node-token         token auth for lotus/venus
  --db-type            which db to use. sqlite/mysql
  --sqlite-path        sqlite db file. eg. ~/sqlite/message.db
  --mysql-dsn          mysql connection string
  --gateway-url        url for gateway server
  --gateway-token      token for gateway server
  --rate-limit-redis   limit flow using redis
```

## Commands

### Message commands

1. search message

```bash
./venus-messager msg search --id=<message id>
```

2. list message

```bash
./venus-messager msg list
# list messages with the same address
./venus-messager msg list --from <address>
```

3. update one filled message state

```bash
./venus-messager msg update_filled_msg --id=<message id>
```

4. update all filled message state

```bash
./venus-messager msg update_all_filled_msg
```

5. wait a message result by id

```bash
./venus-messager msg wait <message id>
```

6. republish a message by id

```bash
./venus-messager msg republish <message id>
```

7. replace a message

```bash
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <message-id>
# or
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <from> <nonce>
```

8. list failed messages, maybe signed message failed or gas estimate failed

```bash
./venus-messager msg list-fail
```

9. lists message that have not been chained for a period of time

```bash
./venus-messager msg list-blocked
```

10. manual mark error messages

```bash
./venus-messager msg mark-bad <message id>
```

### Address commands

1. search address

```bash
./venus-messager address search <address>
```

2. list address

```bash
./venus-messager address list
```

3. reset address

> The nonce of the address is set to nonce on the chain, and all unchain messages are marked as failed messages

```bash
./venus-messager reset <address>
```

4. forbidden address

```bash
./venus-messager address forbidden <address>
```

5. activate a frozen address

```bash
./venus-messager address active <address>
```

6. set the number of address selection messages

```bash
./venus-messager address set-sel-msg-num --num=5 <address>
```

7. set parameters related to address fee

> venus message address set-fee-params [options] address

```bash
 # options
 # --gas-overestimation value  Estimate the coefficient of gas (default: 0)
 # --max-feecap value          Max feecap for a message (burn and pay to miner, attoFIL/GasUnit)
 # --max-fee value             Spend up to X attoFIL for message

./venus-messager address set-fee-params <address>
```

### shared params commands

1. get shared params

```bash
./venus-messager share-params get
```

2. set shared params

```bash
./venus-messager share-params set --gas-over-estimation=1.25 --max-feecap="0" --max-fee="7000000000000000" --sel-msg-num=20
```

3. manual refresh shared params from DB

```bash
./venus-messager share-params refresh
```

### node commands

1. search node info by name

```bash
./venus-messager node search <name>
```

2. add node info

```bash
./venus-messager node add --name=<node-name> --url=<node-url> --token=<node-token>
```

3. list node info

```bash
./venus-messager node list
```

4. del node info by name

```bash
./venus-messager node del <name>
```

### log

1. set log level

```bash
# eg. trace,debug,info,warn|warning,error,fatal,panic
./venus-messager log set-level
```

### send 命令

> send message
> venus-messager send [command options] [targetAddress] [amount]

```bash
   options:
   --from value         optionally specify the address to send
   --gas-premium value  specify gas price to use in AttoFIL (default: "0")
   --gas-feecap value   specify gas fee cap to use in AttoFIL (default: "0")
   --gas-limit value    specify gas limit (default: 0)
   --method value       specify method to invoke (default: 0)
   --params-json value  specify invocation parameters in json
   --params-hex value   specify invocation parameters in hex
   --account value      optionally specify the account to send
```
