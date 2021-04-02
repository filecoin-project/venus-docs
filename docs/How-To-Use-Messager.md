# How to use venus messager

messager is a component used to manage local messages, with the purpose of saving address messages, managing message status, and controlling the frequency of push messages.

[TOC]

## Getting start

#### Clone this git repository to your machine

```
git clone git@github.com:ipfs-force-community/venus-messager.git
```

#### Install Dependencies

1. First, load all the Git submodules.

```
git submodule update --init --recursive
```

2. Initialize build dependencies.

```
make deps
```

#### Build and run tests

```
# First, build the binary
make

# Then, run the tests.
make test
```

#### Start messager

1. Modify config.toml

```
[node]
  # If the connection is a venus node, the url is in ~/.venus/api
  url = "/ip4/127.0.0.1/tcp/3453"
  # If the connection is a venus node, the token is in ~/.venus/token
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJhbGwiXX0.S5ucwvhFM6tkuLInwZi0VSBEl1T570oLVfp47KBWcXo"
```

2. run messager

```
# default -c=messager.toml
./venus-messager -c=path to messager.toml
```

3. Set global config, when the messager is running

**If push message arrives at the messager that the expireEpoch or gasOverEstimation or maxFee or maxFeeCap is not set, the global value is used**

```
# expireEpoch is the expiration height of the message, 0 means it will not expire
# selMsgNum is the maximum number of messages pushed to mpool by a single address at a time
# scanInterval is the interval to scan the remote wallet
# maxEstFailNumOfMsg is the number of failures allowed to estimate gas consumption
./venus-messager share-params set "{\"expireEpoch\": 0, \"gasOverEstimation\": 0, \"maxFee\": 100000, \"maxFeeCap\": 20000, \"selMsgNum\": 12, \"scanInterval\": 8, \"maxEstFailNumOfMsg\": 5}"
```

4. If you want to connect to a remote wallet, use this command

```
# there will be a few seconds delay in getting the wallet address
./venus-messager wallet add --name=<wallet name> --url=<remote wallet url> --token=<remote wallet token>
```

## Commands

### Message commands

1. search message

```
./venus-messager msg search --id=<message_id>
```

2. list all message

```
./venus-messager msg list
```

3. manual update one filled message state

```
./venus-messager msg update_filled_msg --id=<message_id>
```

4. manual update all filled message state

```
./venus-messager msg update_all_filled_msg
```

5. wait a messager msg id for result

```
./venus-messager msg wait <message_id>
```

6. republish a message by id

```
./venus-messager msg republish <message_id>
```

7. replace a message

```
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <message-id>
# or
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <from> <nonce>
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
./venus-messager share-params set "{\"expireEpoch\": 0, \"gasOverEstimation\": 0, \"maxFee\": 100000, \"maxFeeCap\": 20000, \"selMsgNum\": 12, \"scanInterval\": 8, \"maxEstFailNumOfMsg\": 5}"
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