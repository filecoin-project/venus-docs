# CLI Commands

For a complete list of available commands, simply run `venus --help` in your terminal.

```
  START RUNNING FILECOIN
    venus config <key> [<value>] - Get and set filecoin config values
    venus daemon                 - Start a long-running daemon process
    venus wallet                 - Manage your filecoin wallets
  
  VIEW DATA STRUCTURES
    venus chain                  - Inspect the filecoin blockchain
    venus sync                             - Inspect the filecoin Sync
    venus dag                    - Interact with IPLD DAG objects
    venus show                   - Get human-readable representations of filecoin objects
  
  NETWORK COMMANDS
    venus swarm                  - Interact with the swarm
    venus drand                  - retrieve drand randomness
  
  MESSAGE COMMANDS
    venus send                   - Send message
    venus mpool                  - Manage the message pool
  
  State COMMANDS
    venus state wait-msg               - Wait for a message to appear on chain
    venus state search-msg             - Search to see whether a message has appeared on chain
    venus state power                  - Query network or miner power
    venus state sectors                - Query the sector set of a miner
    venus state active-sectors         - Query the active sector set of a miner
    venus state sector                 - Get miner sector info
    venus state get-actor              - Print actor information
    venus state lookup                 - Find corresponding ID address
    venus state sector-size            - Look up miners sector size
    venus state get-deal               - View on-chain deal info
    venus state miner-info             - Retrieve miner information
    venus state network-version        - MReturns the network version
    venus state list-actor             - list all actors
  
  TOOL COMMANDS
    venus inspect                - Show info about the venus node
    venus leb128                 - Leb128 cli encode/decode
    venus log                    - Interact with the daemon event log output
    venus protocol               - Show protocol parameter details
    venus version                - Show venus version information
    venus seed                   - Seal sectors for genesis miner
```


# Common commands

# Start a mainnet node

    ```sh
        ./venus daemon
    ```

## Query chain status

1. get current head tipset
   
   ```sh
        ./venus chain head

        {
            "Height": 449124,
            "ParentWeight": "9725370313",
            "Cids": [
                    {
                            "/": "bafy2bzacectt2udhaow37r53dfpnq6o3edvf5iswbpk77bcfiuce4xn5zkc3g"
                    },
                    {
                            "/": "bafy2bzacebjintkddt24xdqvma3xwqurp6bahdhqxvwc54kqvuxbi3tiy2rig"
                    },
                    {
                            "/": "bafy2bzaceczumkmzgjfasc4cpb2cqkhhv5eqgf2ikzgwgmw5554bgguivykf6"
                    },
                    {
                            "/": "bafy2bzacebd5jt744qsoi5pieisxme2xtmdgmlylma2wgbbu2vmrp3bjlflq2"
                    },
                    {
                            "/": "bafy2bzacedl3fvcvybsukh4odytkz2fxemrr2rln7t75oqj2wkj7yg2vohl3g"
                    }
            ],
            "Timestamp": "2021-01-28 04:42:00"
        }
   ```

2. list recent tipset
    ```sh
    ./venus chain ls
        [
        .......
            {
                    "Height": 449115,
                    "Timestamp": "2021-01-28 04:37:30",
                    "Blocks": [
                            {
                                    "Cid": {
                                            "/": "bafy2bzaceb2xn4hnnovksfeqjrig44bgxow5ixuymlo75nnftjad2mufzzjjw"
                                    },
                                    "Miner": "t0112667"
                            },
                            {
                                    "Cid": {
                                            "/": "bafy2bzacecoswf32ayvdhotbp3pcgabq6q34c5czqscugb5lfcig26igbkem2"
                                    },
                                    "Miner": "t030347"
                            },
                            {
                                    "Cid": {
                                            "/": "bafy2bzacedo3xucwhpz3ndralqbrgzmbzxvkj23btp46tppby2vadyovvtux6"
                                    },
                                    "Miner": "t03176"
                            },
                            {
                                    "Cid": {
                                            "/": "bafy2bzacecrnceor3dj3zixrizqkgcivxrevy7jkzh5wolgp7kok7cimcsoyu"
                                    },
                                    "Miner": "t089228"
                            },
                            {
                                    "Cid": {
                                            "/": "bafy2bzaceas2qb642iagyc2konpf3bdykw7kryv245dvsmuboikanj35ymes4"
                                    },
                                    "Miner": "t023152"
                            }
                    ]
            }
        ]
    ```

3. set tipset head
   
   ```sh
        ./venus chain set-head bafy2bzaceckeg7onfhua5jf4xrnrzt2erix5pibjov2r4vvdhcih6oql7vm24 bafy2bzacedt74pgv2rk7iddptz2nz4kfcsoccqnrb4q7mbluof6puw5iccqms
   ```

## Wallet command

1. create address

    ```sh
        ./venus wallet new
    ```

2. list address
    
    ```sh
        ./venus wallet ls

        Address                                                                                 Balance                     Nonce  Default  
        f1nixbb3trp2mujzf5z7mguidthwo4levnldy4s4a                                               0 FIL                       0               
        f1ytd5blzi3y2nsupqzye6ogpaphow3lljii3zkdi                                               0 FIL                       0               
        f3qmxlwlzmvvn6vwo73jhuzjufmo65lrdwecxcmd7poyv5yex5hqngvo26sqjzzdge4vj3yxmwn5x24igremna  0 FIL                       0      X        
        f3rjuxqnsjk7wuuzf3rqwsfxpbmqp23dn6ik5vyow2ntw5sgdxyijh7cfbujbmwtzdpii6ikunumez55jcxbbq  0 FIL                       0           
    ```

3. set default address

    ```sh
        ./venus wallet set-default f3qmxlwlzmvvn6vwo73jhuzjufmo65lrdwecxcmd7poyv5yex5hqngvo26sqjzzdge4vj3yxmwn5x24igremna
    ```

4. get default address

    ```sh
        ./venus wallet default
    ```

5. export/import address,compatible with the lotus private key format

    ```sh
        ./venus wallet import
        ./venus wallet export <password>
    ```

6. query balance of address

    ```sh
        ./venus wallet balance f3rjuxqnsjk7wuuzf3rqwsfxpbmqp23dn6ik5vyow2ntw5sgdxyijh7cfbujbmwtzdpii6ikunumez55jcxbbq
        0 FIL
    ```

7. set wallet password

    ```sh
        ./venus wallet set-password <password>
    ```

8. lock and unlock wallet

    ```sh
        ./venus wallet lock <password>
        ./venus wallet unlock <password>
    ```

##  Sync commnad

1. query sync status

    ```sh
        ./venus sync status

        Syncing:
        SyncTarget: 1
                Base: 450231 { bafy2bzaceby6aq4obp5pjgjsxtyneqgsrcou4tgx2rsgqptoxgb4pyxh4asae bafy2bzacebancasvojeszwqnfvexlmn52vgcq7ns45nnwzixr67dzsel2kolu bafy2bzaced37mxrstmq2ij4x3szso446fodutq4jaarns6n2vdijeem2k44be bafy2bzacebtxektwn3mndyhpwnj6rkhnf6mfnfa2fyds4jv2xxb3nukuy26d6 bafy2bzacedmjrn42yzfl4yzuzn66ir33exrjxotahtets7btjfm4x36rdcsgu }
                Target: 450239 { bafy2bzaceb6ulfdjeak6uaxrsd62jobtuilee4wkk3bj5ta4qfi7ll52tbyrm bafy2bzacebkbsyo2hp4qgrsfgzjz5qvyrgfz6n6nsq6kfxvw7s4s66yfynpwi }
                Current: 450232 { bafy2bzacedwjdxb5jx5wo4zwg7emwfhbw34bvs3hvo362r3um25nisdakrl7g bafy2bzaced4jq6hx56o4symynuwqhlhf4kzo3qdqofeilizzflejvgjjr2bmq }
                Status: syncing
                Err: <nil>

        SyncTarget: 2
                Base: 450231 { bafy2bzaceby6aq4obp5pjgjsxtyneqgsrcou4tgx2rsgqptoxgb4pyxh4asae bafy2bzacebancasvojeszwqnfvexlmn52vgcq7ns45nnwzixr67dzsel2kolu bafy2bzaced37mxrstmq2ij4x3szso446fodutq4jaarns6n2vdijeem2k44be bafy2bzacebtxektwn3mndyhpwnj6rkhnf6mfnfa2fyds4jv2xxb3nukuy26d6 bafy2bzacedmjrn42yzfl4yzuzn66ir33exrjxotahtets7btjfm4x36rdcsgu }
                Target: 450238 { bafy2bzacebtf2l5y34acbfnie6ilvvhxj5gyrnknnygintqzqkoxcsnmmuado bafy2bzacedswqjogt57cf7q22ebbrnbw3qygxd6q3z6vhm74b6tyzqjlrvox4 bafy2bzacecrv2kxpvuocgrtfjlot3da57655zbvrcu2reuospak3vdxa3u7v2 bafy2bzacecahv6twxmeihivncobqadfm7xyh3gvnrpjhs47i7537er7uyeote }
                Current: 450233 { bafy2bzaceb4ybtg3p63fd7hvrajj5cw7oi52ie3zj2r3apxvod4u4e3y3svac bafy2bzacecmasydskhxrcrdih6na4qxpcdpavj6d5wydgft7ba574mx57ij76 bafy2bzacedrxgj2cjq537zoe24qhzizkx5ix4g7rpzbjl73qfm4ldom2kt7pq bafy2bzaceat2eg6ujh2qmlwwvna5qmntbayquvesvik55jfbrfkcgugcl6dmq bafy2bzaceawwc3hp3b5bl2a3gjmvehxytqvxtabtwosj77lnbcmu5ln4gh77u bafy2bzaceabwkrifkce2rraystlg2ouxudklyd2b3pmck2ineguidz4r3x35o bafy2bzacebfxvqczftyzoxosdrlxylhupurmovpqhympe6anukleg2z7emmbo bafy2bzaceb2bbk4ykijqz7em4zgag5eikvqzierp6mevw2bytnj4xrbb2dthc }
                Status: syncing
                Err: <nil>

        SyncTarget: 3
                Base: 450231 { bafy2bzaceby6aq4obp5pjgjsxtyneqgsrcou4tgx2rsgqptoxgb4pyxh4asae bafy2bzacebancasvojeszwqnfvexlmn52vgcq7ns45nnwzixr67dzsel2kolu bafy2bzaced37mxrstmq2ij4x3szso446fodutq4jaarns6n2vdijeem2k44be bafy2bzacebtxektwn3mndyhpwnj6rkhnf6mfnfa2fyds4jv2xxb3nukuy26d6 bafy2bzacedmjrn42yzfl4yzuzn66ir33exrjxotahtets7btjfm4x36rdcsgu }
                Target: 450237 { bafy2bzaceavndy2pgdjpacapy4gs6pszbvxssvwrnw4uydnne4boowvyjlzjm bafy2bzacedutkurnrzna3hctqwxkrghhy6ufkanonfbq54cjcaoquoss4galy bafy2bzaced477xs5udb2r2xkomt6webzmjcwvy257bhpvgxrq6v573o66ywsy bafy2bzaceddjcr45kqhrwikemn7lfuhe5k3cqhhebrrzucsemv4bbxh755hx4 }
                Current: 450233 { bafy2bzaceb4ybtg3p63fd7hvrajj5cw7oi52ie3zj2r3apxvod4u4e3y3svac bafy2bzacecmasydskhxrcrdih6na4qxpcdpavj6d5wydgft7ba574mx57ij76 bafy2bzacedrxgj2cjq537zoe24qhzizkx5ix4g7rpzbjl73qfm4ldom2kt7pq bafy2bzaceat2eg6ujh2qmlwwvna5qmntbayquvesvik55jfbrfkcgugcl6dmq bafy2bzaceawwc3hp3b5bl2a3gjmvehxytqvxtabtwosj77lnbcmu5ln4gh77u bafy2bzaceabwkrifkce2rraystlg2ouxudklyd2b3pmck2ineguidz4r3x35o bafy2bzacebfxvqczftyzoxosdrlxylhupurmovpqhympe6anukleg2z7emmbo bafy2bzaceb2bbk4ykijqz7em4zgag5eikvqzierp6mevw2bytnj4xrbb2dthc }
                Status: syncing
                Err: <nil>

        Waiting:
        SyncTarget: 4
                Base: 450231 { bafy2bzaceby6aq4obp5pjgjsxtyneqgsrcou4tgx2rsgqptoxgb4pyxh4asae bafy2bzacebancasvojeszwqnfvexlmn52vgcq7ns45nnwzixr67dzsel2kolu bafy2bzaced37mxrstmq2ij4x3szso446fodutq4jaarns6n2vdijeem2k44be bafy2bzacebtxektwn3mndyhpwnj6rkhnf6mfnfa2fyds4jv2xxb3nukuy26d6 bafy2bzacedmjrn42yzfl4yzuzn66ir33exrjxotahtets7btjfm4x36rdcsgu }
                Target: 450239 { bafy2bzaceb6ulfdjeak6uaxrsd62jobtuilee4wkk3bj5ta4qfi7ll52tbyrm bafy2bzacebkbsyo2hp4qgrsfgzjz5qvyrgfz6n6nsq6kfxvw7s4s66yfynpwi bafy2bzacebca26ouxt6tv32ul46457zftb5ozy6lmeejtrw2w5srb4zgnflou }
                Current:
                Status: wait
                Err: <nil>

        History:
    ```

2. set the number of synchronizations

    ```sh
        ./venus sync set-concurrent 1
    ```

## Network command

1. print local node information

    ```sh
        ./venus swarm id

        {
            "Addresses": [
                    "/ip4/192.168.1.151/tcp/6000/p2p/QmTBY16KjbJifqrepWriHNaSVxBJRKg63G8hJrAZAstCQt",
                    "/ip4/127.0.0.1/tcp/6000/p2p/QmTBY16KjbJifqrepWriHNaSVxBJRKg63G8hJrAZAstCQt"
            ],
            "ID": "QmTBY16KjbJifqrepWriHNaSVxBJRKg63G8hJrAZAstCQt"
        }
    ```

2. query the peers that the node is connected to
    ```sh
        ./venus swarm peers

        {
            "Peers": [
                    {
                            "Addr": "/ip4/101.206.156.202/tcp/23151",
                            "Peer": "12D3KooWNhc5Rzgc1c8p9kvBVhrLUB4ZZniwnpi4yQd1WVf952tp",
                            "Latency": "",
                            "Muxer": "",
                            "Streams": null
                    },
                    {
                            "Addr": "/ip4/103.40.249.175/tcp/12350",
                            "Peer": "12D3KooWNfUzbXzVXqLV9pEubVenJoQHkWtkrR3aSvwyoXc7Kpys",
                            "Latency": "",
                            "Muxer": "",
                            "Streams": null
                    }
        }
    ```

3. connect to other node

    ```
        ./venus swarm connect /ip4/192.168.1.151/tcp/6000/p2p/QmTBY16KjbJifqrepWriHNaSVxBJRKg63G8hJrAZAstCQt
    ```

## Query state of actor

1. get actor infomation

    ```sh
        ./venus get-actor f02438

        {
            "Address": "f02438",
            "Balance": "659448.801619331229682404 FIL",
            "Nonce": 0,
            "Code": "bafkqaetgnfwc6mrpon2g64tbm5sw22lomvza (fil/2/storageminer)",
            "Head": "bafy2bzacedexilt4kyzffmagjwpyenct5eddn7cazfjquz4v7b3b4czitn3au"
        } 
    ```

2. query information of miner

    ```sh
        ./venus state miner-info f02438

        Available Balance: 8867.856318782083445622 FIL
        Owner:  f077316
        Worker: f0117055
        Control 0:      f0117046
        Control 1:      f0117042
        Control 2:      f0117040
        PeerID: 12D3KooWMrDPhKaMeJFenXRFd4Rb9Zt111CBY7uY6AoZ93MTbLHw
        Multiaddrs:     /ip4/47.115.10.99/tcp/14567 
        Consensus Fault End:    -1
        SectorSize:     32 GiB (34359738368)
        Byte Power:   35.78 PiB / 2.143 EiB (1.6305%)
        Actual Power: 35.8 Pi / 2.14 Ei (1.6302%)

        Proving Period Start:   447666 (21 hours 36 minutes ago)
    ```

3. get sector infomation of miner

    ```sh
        ./venus state sector f02438 100001

        SectorNumber:  100001
        SealProof:  3
        SealedCID:  bagboea4b5abcaps45jsrklqqa3dw26jd7rybpzwsneapwvx6s4pqludkhie3hflh
        DealIDs:  []

        Activation:  898 (22 weeks 2 days ago)
        Expiration:  1553585 (in 1 year 2 weeks)

        DealWeight:  0
        VerifiedDealWeight:  0
        InitialPledge:  0.99999998430674944 FIL
        ExpectedDayReward:  0.503660272286038996 FIL
        ExpectedStoragePledge:  1.42807706338520528 FIL

        Deadline:  0
        Partition:  0
    ```
    
4. search msg by id

    ```sh
        ./venus state search-msg bafy2bzaceckluouswlxpaujhihar4yngk3dx6daqbjfoyolbfvlelwgapmzxg 

        message was executed in tipset: [bafy2bzacebek5gtutmhdvt5rpt6s2k7exk2ve2tj3f2h36nswnw7ehbbmirec bafy2bzaceaem7ljdwxl3eqncy7r7cc3225sx24g6oyzbsf4p7pavcxasuzcs2 bafy2bzacecty4e55ryfjmdjc24jwp2iwobk6pqk4mrsmsjdjtpchsizyervqe bafy2bzacecbldsf73ekzxqsgxawupwhx4cm5xvy6qp43ne5qkss42xvnfjcic bafy2bzaceajgyz6y26fbhsirnrizdt4yt55374abobm5lzugl3eik3yd23afk]
        Exit Code: 0
        Gas Used: 13133828
    ```

5. wait for msg result of msgid

    ```sh
        ./venus state wait-msg bafy2bzaceanbalwsqc5fetxcdfamfovlpkdjd2s5eje4bwsaxnrrbyswjv5g4

        message was executed in tipset: [bafy2bzacebek5gtutmhdvt5rpt6s2k7exk2ve2tj3f2h36nswnw7ehbbmirec bafy2bzaceaem7ljdwxl3eqncy7r7cc3225sx24g6oyzbsf4p7pavcxasuzcs2 bafy2bzacecty4e55ryfjmdjc24jwp2iwobk6pqk4mrsmsjdjtpchsizyervqe bafy2bzacecbldsf73ekzxqsgxawupwhx4cm5xvy6qp43ne5qkss42xvnfjcic bafy2bzaceajgyz6y26fbhsirnrizdt4yt55374abobm5lzugl3eik3yd23afk]
        Exit Code: 0
        Gas Used: 44152257
        Return: 
    ```
