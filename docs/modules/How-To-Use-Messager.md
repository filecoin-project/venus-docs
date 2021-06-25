# How to use venus messager

messager is a component used to manage local messages, with the purpose of saving address messages, managing message status, and controlling the frequency of push messages.

[[TOC]]

## Getting start

### Clone this git repository to your machine

```
git clone git@github.com:ipfs-force-community/venus-messager.git
```

### Install Dependencies

1. First, load all the Git submodules.

```
git submodule update --init --recursive
```

2. Initialize build dependencies.

```
make deps
```

### Build and run tests

```
# First, build the binary
make

# Then, run the tests.
make test
```

### Start messager

```
# --config | -c        specify config file (default: "./messager.toml")
# --auth-url           url for auth server (default: "http://127.0.0.1:8989")
# --node-url           url for connection lotus/venus
# --node-token         token auth for lotus/venus
# --db-type            which db to use. sqlite/mysql (default: "sqlite")
# --sqlite-path        sqlite db path (default: "./message.db")
# --mysql-dsn          mysql connection string

# use sqlite db
./venus-messager run --config <config path> --auth-url <auth url> --node-url <node url> --node-token <node token> --db-type sqlite --sqlite-path <sqlite path>
# use mysql db
./venus-messager run --config <config path> --auth-url <auth url> --node-url <node url> --node-token <node token> --db-type mysql --mysql-dsn <mysql dsn>
```

## Commands

### Message commands

1. search message

```
./venus-messager msg search --id=<message id>
```

2. list message

```
./venus-messager msg list
# list messages with the same address
./venus-messager msg list --from <address>
```

3. manual update one filled message state

```
./venus-messager msg update_filled_msg --id=<message id>
```

4. manual update all filled message state

```
./venus-messager msg update_all_filled_msg
```

5. wait a messager msg id for result

```
./venus-messager msg wait <message id>
```

6. republish a message by id

```
./venus-messager msg republish <message id>
```

7. replace a message

```
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <message-id>
# or
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <from> <nonce>
```

8. list failed messages, maybe signed message failed or gas estimate failed

```
./venus-messager msg list-fail
```

9. lists message that have not been chained for a period of time

```
./venus-messager msg list-blocked
```

10. manual mark error messages

```
./venus-messager msg mark-bad <message id>
```

### Address commands

1. search address

```
./venus-messager address search <address>
```

2. list address

```
./venus-messager address list
```

3. update address nonce

```
./venus-messager address update_nonce --nonce=5 <address>
```

4. forbidden address

```
./venus-messager address forbidden <address>
```

5. activate a frozen address

```
./venus-messager address active <address>
```

6. set the number of address selection messages

```
./venus-messager address set_sel_msg_num --num=5 <address>
```

### Wallet commands

1. search wallet by name

```
./venus-messager wallet search <wallet-name>
```

2. add wallet

```
./venus-messager wallet add --name=<wallet-name> --url=<wallet-url> --token=<wallet-token>
```

3. list wallet

```
./venus-messager wallet list
```

4. list remote wallet address

```
./venus-messager wallet list-addr --uuid=<wallet-id>
# or
./venus-messager wallet list-addr --name=<wallet-name>
```

5. delete wallet by name

```
./venus-messager wallet del <name>
```

### shared params commands

1. get shared params

```
./venus-messager share-params get
```

2. set shared params

```
# expireEpoch is the expiration height of the message, 0 means it will not expire
# selMsgNum is the maximum number of messages pushed to mpool by a single address at a time
# scanInterval is the interval to scan the remote wallet
# maxEstFailNumOfMsg is the number of failures allowed to estimate gas consumption

./venus-messager share-params set "{\"expireEpoch\": 0, \"gasOverEstimation\": 1.25, \"maxFee\": 7000000000000000, \"maxFeeCap\": 0, \"selMsgNum\": 20, \"scanInterval\": 10, \"maxEstFailNumOfMsg\": 50}"
```

3. manual refresh shared params from DB

```
./venus-messager share-params refresh
```

### node commands

1. search node info by name

```
./venus-messager node search <name>
```

2. add node info

```
./venus-messager node add --name=<node-name> --url=<node-url> --token=<node-token>
```

3. list node info

```
./venus-messager node list
```

4. del node info by name

```
./venus-messager node del <name>
```