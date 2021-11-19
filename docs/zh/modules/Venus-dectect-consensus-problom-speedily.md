## Venus Tipset Execution trace比较工具使用说明

execution-trace比较工具是用于当venus链同步发生共识错误导致同步异常时,
用于快速定位不一致的消息及其执行细节,帮助精准定位问题.

### 原理
此工具通过API接口在lotus和venus上执行整个tipset中的消息, 并获取所有的execution-trace进行比较,
通常共识错误发生时, execution-traced的细节也是不一致的.

### 操作步骤:

#### 编译lotus,并启动
在原力区维护的lotus, v1.12.0/incubation分支上,支持了相关接口,
编译时添加`ENABLE_GAS_TARCE=1`
```shell
git clone https://github.com/ipfs-force-community/lotus.git 
git checkout -b v1.12.0/incubation oriign/v1.12.0/incubation
make lotus ENABLE_GAS_TRACE=1
```

#### 获取execution-trace分析工具
```shell
git clone https://github.com/zl03jsj/filecoin-head-comparer.git
```

#### 配置execution-trace分析工具
在项目的跟目录下打开配置文件`./cfg_exec_trace.json`
编辑配置venus和lotus的节点信息:
```json
{
  "lotus": {
    "url": "http://192.168.200.21:1234/rpc/v0",
    "token": ""
  },
  "venus": {
    "url": "http://192.168.1.125:3453/rpc/v0",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.oLkKAMWEiUA6oK-stwd3Spiwrx9TlGOuVFgrgn7JPwU"
  }
}
```

#### 启动execution-trace工具开始问题检测
由于共识问题, 导致链同步时问题时, 通过日志, 很容易就可以定位有问题的tipset epoch,
在根目录执行命令,在参数中指定高度,就可以对指定的tipset进行分析比较了.

```shell
python3 ./exec_trace_cmp.py 1288233
venus url:http://192.168.1.125:3453/rpc/v0
lotus url:http://192.168.200.21:1234/rpc/v0

    Venus and lotus got the same state root(bafy2bzacebhpihnow4fwuebtxenpl27kvl4k7aeozlsruwcdj3berrposkfgs) after apply tipset(1288233)

    start compile tipset(1288233) traces
    venus total message count(contain implicit)= 481
    lotus total message count(contain implicit)= 481
    
idx:  0, Compare msg(bafy2bzacebo67zpnnaqb4jzz3peflh6mu3hczu7isd4yxkymvlao5li6lrqwi) stateAfterApply: bafy2bzaceaijdjyg263zawvczt3alkciu2ptrzv3pftu434gvxjujqmam2nxe execution-traces: ok
idx:  1, Compare msg(bafy2bzaceavrkj7coojud5amhn2ukrhrkntaxk6r7esnilldbjocia7ut7jzw) stateAfterApply: bafy2bzacedus5agquqptf3o3yy3cylg7j2jb2sil24clvtyff4vcoedzxdaha execution-traces: ok
idx:  2, Compare msg(bafy2bzaceaadqo5lv75q7qvsbgx3prm5oh7nqfz6volerwleyt65jizhcyxqa) stateAfterApply: bafy2bzacebkdqv25av4bjabifpe2vye74j73ou62le3hztyx33pxy254cul5u execution-traces: ok
idx:  3, Compare msg(bafy2bzacebrmjo2ahojpjj5rvdd6fxqvtgntoovvb722o25dmwmlub4u6icdw) stateAfterApply: bafy2bzacebzez4rvo4yteqjtsdmwmaqpz7vadepdoikbaqcvnzqnhkuhkzt5y execution-traces: ok
idx:  4, Compare msg(bafy2bzaceapwk7p5c7gy35buhy6mqs42rv36kxvczca3siwl6h2evufsld5b6) stateAfterApply: bafy2bzaceahpmfeq46nagmbzpvjnabrsem2zjrvcy77cxldaf43aniclduqik execution-traces: ok
idx:  5, Compare msg(bafy2bzacecdl2zt4bd4nwhxnehlqejtlikvqwztnk3leil54dsmnx6koz42zu) stateAfterApply: bafy2bzacec7uk7o6rbnxdwyluvlm3fsposlvangkqdaj5fargbwlbwws4ezuo execution-traces: ok
idx:  6, Compare msg(bafy2bzaceakhot2tzgn4zt3nr6aokq2brcity2eh2d67gc2iqrpswlgch5ng6) stateAfterApply: bafy2bzacea3n7ku4epbmqq2ecebmgifpb26etb2hrww4ryqmhiumzwpsvf7es execution-traces: ok
idx:  7, Compare msg(bafy2bzacecc5zqh2fm55hno66f56pqji5245huk45xqpxzt7b5hz63o7nh622) stateAfterApply: bafy2bzaceb223qjyqk53zic5th7npzik3redyvy723egt47dsgwlshmaksqr6 execution-traces: ok
idx:  8, Compare msg(bafy2bzacedoohork3gnnzfvv5kme3gqfxrygw4otcwh5lklfbdz3mxy2evinq) stateAfterApply: bafy2bzacea6ks7weiqy65m6m426dvihljvapmbts6cdlu6ytirrpveupvoj2y execution-traces: ok
idx:  9, Compare msg(bafy2bzacecivu4pfhvvdiwfk23ntidy2aein2y646uzrt4hotve46mejtgjsa) stateAfterApply: bafy2bzaceaqjbks2bjmdal6tu7yoxrecygrcn2s2pmwxwkukzj23p5lsjms2s execution-traces: ok
idx: 10, Compare msg(bafy2bzacecn6mfxfspglrrwu26uvj3fcirbz2femaeyv7f63vh7ochrwt76ay) stateAfterApply: bafy2bzacec5rnu4a6xunucqpvks5eujn5t3cywpqwieoirex25mgycucbesky execution-traces: ok
idx: 11, Compare msg(bafy2bzacebvxwcnorwmplriluvus6jjvqvfcknkn44lzf37ptbe5oeiwpt3vu) stateAfterApply: bafy2bzaceaobqsuortebd4nujtqinnwnc7dgs44majmnnkdtt4dqow3wyxah2 execution-traces: ok
idx: 12, Compare msg(bafy2bzacear7yqpsjwvz5cofocunlyesh3q43ppvqgcs5pcnbsjmxqd4gbmtm) stateAfterApply: bafy2bzacecxjuehhuu2hadecr4avab4qwyy5nenyilbftuuppdoxmohj7emjs execution-traces: ok
idx: 13, Compare msg(bafy2bzacedqliipes5nh74aeyy3wbn4md6t33kkgqx7m2ukke7qvajp2lrbkw) stateAfterApply: bafy2bzaceb37mvzapylc67d3vtz5fcbusziz2bofdicwny6zehonlkd3zwhus execution-traces: ok
idx: 14, Compare msg(bafy2bzaceas2brzrd3qhto26hfdi7diouff3yzemsvje5yyv66st3vgqzbjcg) stateAfterApply: bafy2bzacec27fdotcosdnj423naofdqczrykexqblhvu3iey4eptaublp4aeq execution-traces: ok
idx: 15, Compare msg(bafy2bzacebuyl637qzpqzw46jossgq4tef6j7bh62ec237mghrx4yj4ltu6h6) stateAfterApply: bafy2bzacec3hijr5nvasludlrpa37muy4o64326tofzii7hop4zxynao3oquc execution-traces: ok
idx: 16, Compare msg(bafy2bzaceagr3ucrm3exnpnm62sq6qrpnyjb74u257by2i52axnqjtvsy5t5m) stateAfterApply: bafy2bzacecbhtzedpwlpdr7imuv7j47rsbj3vsilibcp5j6ocrtqr4qiekp7s execution-traces: ok
idx: 17, Compare msg(bafy2bzacedqpta5vr5ha4wvezsenbu7qczhctnwndu2yiclgp52ienbk6oljk) stateAfterApply: bafy2bzacedblssnkunnlr2zl3rji5457mlgtc2oxunc6q37swqygtopu47eck execution-traces: ok
idx: 18, Compare msg(bafy2bzaceduw75wrsj6fdokywn4mm72hzvsfk74i2bu7zjmvmvntmupztsa62) stateAfterApply: bafy2bzaceapkogzfoym2n4q6mwnjfvkiqp2ff5ueampjxa2o3htjy2sknq4hm execution-traces: ok
idx: 19, Compare msg(bafy2bzacea4eoihdgbaui4rchhz66pk5ybeeyyv63qtnb3zbednp5p6m7prtq) stateAfterApply: bafy2bzacebqhutaiusljv4cgwh235cyvd3mrwbruypz7utk7tmwjf5esxekjq execution-traces: ok
idx: 20, Compare msg(bafy2bzaceatyz5v6cxbnb7lw4zrw574aogec4aaeaxy2rwzs3fvr2qnvvoc6g) stateAfterApply: bafy2bzaceczfrg57g4fhmxugaf53s3h7a3hgqyziv5h6ztq7jdsinuaickr6c execution-traces: ok
          .......................................
```

当执行一致时, 会看到下面的输出.
```
Venus and lotus got the same state root(bafy2bzacebhpihnow4fwuebtxenpl27kvl4k7aeozlsruwcdj3berrposkfgs) after apply tipset(1288233)
```

当执行不一致是, 会看到如下的输出
```shell
....
idx:477, Compare msg(bafy2bzaceclyunwu6ig3pvwurm34vxengjc33igcax3rxmmazo4ypevkcc4xg) stateAfterApply: bafy2bzacebmfzfvdp7x6fg7yk7i7p7gbvu56afosgbxyju6236b4ytpllv2tg execution-traces: ok
idx:478, Compare msg(bafy2bzaceaftdrisbrnb2yppgx37dahsp4ko23l47wsfg7g6gczx6czmtdvoa) stateAfterApply: bafy2bzaceaj3jyduelozrbaggwu2v5mokmbds67ouh5s6gdajneqrp6pdbxem execution-traces: ok
-> this is a cron message: <-
implicit message(f00 -> f03, method : 2, nonce:1288233)
idx:479, Compare msg({'/': 'bafy2bzacedqbx4tfp7qwpe7oylrwueiye4ipfx6ii7f2p4r5w55thwayci44q'}) stateAfterApply: bafy2bzacea2o5ylrpovsg6f3bvufgolcd6z46kxgfohzp3c27gendhpirug5i execution-traces: ok
-> this is a cron message: <-

    message trace(283) not equals:
    message details : cid:{'/': 'bafy2bzacebka5xwpzelt4cl5pa452k3oi45mbcy7pyrlc3om7sfnul4cz7dcu'}, from:f00, to:f03, nonce:1288233
-----> lotus_trace:---------------
{
    "Name": "OnMethodInvocation",
    "loc": [
        {
            "File": "/root/theduan/lotus-src/chain/vm/vm.go",
            "Line": 333,
            "Function": "github.com/filecoin-project/lotus/chain/vm.(*VM).send.func3"
        },
        {
            "File": "/root/theduan/lotus-src/chain/vm/vm.go",
            "Line": 354,
            "Function": "github.com/filecoin-project/lotus/chain/vm.(*VM).send"
        },
        {
            "File": "/root/theduan/lotus-src/chain/vm/runtime.go",
            "Line": 445,
            "Function": "github.com/filecoin-project/lotus/chain/vm.(*Runtime).internalSend"
        },
        {
            "File": "/root/theduan/lotus-src/chain/vm/runtime.go",
            "Line": 402,
            "Function": "github.com/filecoin-project/lotus/chain/vm.(*Runtime).Send"
        },
        {
            "File": "/root/go/pkg/mod/github.com/filecoin-project/specs-actors/v6@v6.0.0/actors/builtin/power/power_actor.go",
            "Line": 450,
            "Function": "github.com/filecoin-project/specs-actors/v6/actors/builtin/power.Actor.processBatchProofVerifies"
        },
        {
            "File": "/root/go/pkg/mod/github.com/filecoin-project/specs-actors/v6@v6.0.0/actors/builtin/power/power_actor.go",
            "Line": 222,
            "Function": "github.com/filecoin-project/specs-actors/v6/actors/builtin/power.Actor.OnEpochTickEnd"
        },
        {
            "File": "/usr/lib/go/src/reflect/value.go",
            "Line": 543,
            "Function": "reflect.Value.call"
        },
        {
            "File": "/usr/lib/go/src/reflect/value.go",
            "Line": 339,
            "Function": "reflect.Value.Call"
        },
        {
            "File": "/root/theduan/lotus-src/chain/vm/invoker.go",
            "Line": 247,
            "Function": "github.com/filecoin-project/lotus/chain/vm.(*ActorRegistry).transform.func2.1"
        },
        {
            "File": "/root/theduan/lotus-src/chain/vm/runtime.go",
            "Line": 171,
            "Function": "github.com/filecoin-project/lotus/chain/vm.(*Runtime).shimCall"
        }
    ],
    "tg": 23856,
    "cg": 23856,
    "sg": 0,
    "vtg": 23856,
    "vcg": 23856,
    "vsg": 0,
    "tt": 2830,
    "ex": "i"
}  
-----> venus_trace:---------------
{
    "Name": "OnVerifySeal",
    "loc": [
        {
            "File": "/home/zl/venus-src/pkg/vm/vmcontext/syscalls.go",
            "Line": 106,
            "Function": "github.com/filecoin-project/venus/pkg/vm/vmcontext.syscalls.BatchVerifySeals.func1"
        },
        {
            "File": "/root/go/src/runtime/asm_amd64.s",
            "Line": 1371,
            "Function": "runtime.goexit"
        }
    ],
    "tg": 2000,
    "cg": 2000,
    "sg": 0,
    "vtg": 0,
    "vcg": 2000,
    "vsg": 0,
    "tt": 0
}

implicit message(f00 -> f03, method : 2, nonce:1288233)
idx:480, Compare msg({'/': 'bafy2bzacebka5xwpzelt4cl5pa452k3oi45mbcy7pyrlc3om7sfnul4cz7dcu'}) stateAfterApply: bafy2bzacebhpihnow4fwuebtxenpl27kvl4k7aeozlsruwcdj3berrposkfgs execution-traces: failed
```

程序会打印出不同的execution-trace的消息, 以及不匹配的调用堆栈,可以方便快速定位问题.
