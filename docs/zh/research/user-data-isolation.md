<!--着重借鉴了FIP的模版：[这里](https://raw.githubusercontent.com/filecoin-project/FIPs/master/templates/template_FTP.md)-->

## Simple Summary (概述)
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the design.-->
<!--俗话说："如果你不能以简单的话解释，说明你还不够懂他"提供一个简单的，非技术人员也能理解的介绍。-->
链服务对其用户（SP等）数据隔离，并开放访问接口。

## Abstract (功能简介)
<!--A short (~200 word) description of the technical issue being addressed.-->
<!--一个简短的200字以内的，描述当前的功能设计。-->
`SP` 的很多业务数据保存在链服务端，并由其负责跟踪与维护。
为了 `SP` 用户能够管理自己的数据，如：订单，消息，出块，转账等，需要链服务对用户的数据进行隔离，并开放请求的接口.

关联：
- [x] 提案的[issue](https://github.com/filecoin-project/venus/issues/5384)

## Motivation (来源/背景)
<!--The motivation is critical for new feature design that want to change the product. It should clearly explain why the existing product specification is inadequate to address the problem that this new feature solves.-->
<!--功能设计动机是很重要的。当前现有产品的哪儿些不足，功能需求的来源和背景，等等。在这个feature（设计）完成后，哪儿些问题会得到解决？-->
`Venus` 系统分为 `云组件` 和 `本地组件` ，在多数情况下，`云组件` 和 `本地组件` 的维护者不是同一类人，比如孵化器就是专门维护一套链服务给众多的SP终端用户使用。`云组件` 在向不同用户提供服务的同时, 为了确保用户数据的安全, 也限制了用户对大部分 `用户数据` 的访问, 需要新增一种机制, 使得用户能够访问自己的 `用户数据`的同时, 隔离其他用户的数据, 确保每一位用户的数据安全

## Specification (feature Spec)
<!--The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow others to easily translate into product implementations. -->
<!--具体的技术spec，需要对feature的syntax，semantics进行描述。Spec需要能够让别人更容易的按照spec去实现这个feature。-->


- **`链服务`**: 是指 `Sophon` 所提供的, 包括 链上信息的查询, 发布消息 等细项在内的服务.
- **`订单服务`**: 是指 `Droplet` 提供的, 包括 `检索订单` 的创建和查询, `检索订单` 的创建和查询, 存储服务提供商定价查询 等细项在内的服务.
- **`用户`** 是指 `链服务` 的使用者,这要包括三类群体：
  - `SC`：借助部署在 `订单服务` 发起存储订单的客户；
  - `SP`：使用 `链服务` 和 `Filecoin 网络` 进行交互, 或者使用`订单服务`承接存储订单的存储服务提供商；
  - `其他`: 除了上述两个群体的其他用户,比如使用 `链服务` 获取链上数据或者和链进行交互的开发者等。
- **`云组件`**:  是指包括 `venus-auth`,`venus-gateway`,`venus`, `venus-messager`, `venus-miner`, `venus-market` 等系列软件在内的软件实体, 其特点是一套 `云组件` 可以为多个不同的 `用户` 提供服务. 云组件又可以划分为 `Sophon` 和 `Droplet` 两个部分, 其中 `Sophon` 负责提供 `链服务` , `Droplet`负责提供 `订单服务`.
- **`本地组件`**: 是指包括 `venus-cluster`, `venus-tool` 等软件在内的软件实体.  `本地组件` 依赖于 `云组件` 提供的服务, 一套 `本地组件` 一般只为一个 `用户` 提供服务.
- **`用户数据`** 是指用户在使用 `链服务`以及 `订单服务` 的过程中产生的与用户相关联的数据, 包括但不限于: 用户的公钥, 用户发出的消息, 用户发起的订单, 用户存储订单中的数据, 用户的个性化设置.

- **`服务接口`** 是指 `链服务` 和 `订单服务` 为用户提供的用于使用服务以及访问用户数据的接口, 主要是指 `链服务` 和 `订单服务` 所对应的软件实体提供*RPC访问接口*.

- **`用户数据隔离`**: 是指 `链服务` 和 `订单服务` 提供者限制用户只能访问和自己的 `用户数据`. 通过对 `服务接口` 进行访问控制, 限制用户只能访问自己的 `用户数据`, 是实现 `用户数据隔离` 的方式.

- **`用户权限`**: 是指 `链服务` 和 `订单服务` 控制用户访问 `服务接口` 的权限级别的划分, 包括: `读权限`, `写权限`, `签名权限`等三个用户级别权限, 和一个管理员级别权限: `管理权限`. 一般来说,用户具有用户级别最高权限, 即 `签名权限` , 但为了方便用户在不同使用情形下进行更加细致的访问控制, 用户可以申请更低权限级别的 `Token`, 比如: `读权限` 或者 `写权限`. 只有管理员才能获得 `管理权限`. 访问不同的服务端口需要不同的权限级别, 详细参见 [API Reference](https://venus.filecoin.io/zh/advanced/chain-api-v0.html)

- **`用户界面`** 是指用户能够用于访问 `服务接口` 的软件或者其他类型的工具, 包括但不限于: `Democles`, `venus-wallet`, `market-client`, `venus-tool` 等直接访问 `链服务` 或者 `订单服务` 服务的软件; 或者能够直接访问 `服务接口` 的 *curl* , 或者用户自己开发的工具.


## Design Rationale (设计思路)
<!--The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. -->
<!--设计思路基于上面的spec，描述了设计上的一些选择，以及为什么使用了这些选择。-->

通过 `Token` 区别不同用户身份, 以及访问级别. <br>
`服务接口` 的实现中针对不同的 `用户身份`, 进行不同的处理, 从而实现 `用户数据隔离`.

## Backwards Compatibility（兼容性）
<!--All design/feature that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The design/feature must explain how the author proposes to deal with these incompatibilities.-->
<!--所有功能设计都需要包含向前兼容性问题的描述。如，有哪儿些和之前版本不兼容的地方，不兼容地方的严重性，等等。功能设计文档需要包含作者如何处理/解决这些不兼容问题。-->

## Test Cases (测试用例)
<!--Test cases for an implementation. Links to test cases if applicable.-->
<!--测试用例，如果有的话。-->

## Security Considerations (安全考量)
<!--All design/feature must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed.-->
<!--安全问题，如果有的话。-->

- 应确保只有管理员能够获取到 'admin' 级别的权限, 防止用户数据泄漏

## Implementation（实施）
<!--Include any implementation details that you find may be helpful to elaborate your design. This may be a flow chart, an architecture diagram, system work flow chart.-->
<!--任何有助于展示设计意图的图标，等等都可以添加在这里。-->

### 用户身份识别

通过 `Token` 获取用户身份
```go
func JwtUserFromToken(token string) (string, error) {
	sks := strings.Split(token, ".")
	if len(sks) < 1 {
		return "", fmt.Errorf("can't parse user from input token")
	}
	dec, err := DecodeToBytes([]byte(sks[1]))
	if err != nil {
		return "", err
	}
	payload := &JWTPayload{}
	err = json.Unmarshal(dec, payload)

	return payload.Name, err
}
```

将用户名称注入到 `context` 中
```go
ctx = CtxWithName(ctx, name)

func CtxWithName(ctx context.Context, v string) context.Context {
	return ctxWithString(ctx, accountKey, v)
}
func ctxWithString(ctx context.Context, k CtxKey, v string) context.Context {
	return context.WithValue(ctx, k, v)
}
```

`服务接口` 中通过 `context` 获取用户名称
```go
func GetCtxName(ctx context.Context) string {
    return ctx.Value(accountKey).(string)
}
```


### 目标数据的识别

仅仅只是知道 `用户身份` 是不够的的, 我们还需要知道, 该用户访问的 `目标数据` 是什么, 以及该`目标数据` 是属于哪个 `用户` 的. 例如, 一个 `用户` 可能有多个 `矿工`, 但是他只能访问自己的 `矿工` 的数据, 不能访问其他 `用户` 的 `矿工` 的数据. 

绝大多数情况下,我们都可以通过 `用户` 所访问的 `服务接口` 来确定 `目标数据` 的类型, 可以根据 `目标数据` 类型中的 `关键字段` 来确定 `目标数据` 的归属. 例如当用户访问 消息相关的服务接口时, 可以通过 `消息类型` 的发送者字段来确定该数据的拥有者是谁, 进而判断访问者是否具有该数据的访问权限.

在现在的实现中, 我们可以通过三种类型的 `关键数据` , 来确定访问者是否具有访问 `目标数据` 的权限:
#### 用户名称

在用户管理相关的 `服务接口` 中, 往往会出现 `用户名称` 作为 `关键数据` 的情况, 例如 `用户` 的 `矿工` 列表, `用户` 的 `Signer` 列表等. 通过 `用户名称` 我们可以直接判断访问者是否具有访问该数据的权限.

```go
// checkPermissionByUser check weather the user has admin permission or is match the username passed in
func CheckPermissionByName(ctx context.Context, name string) error {
	if auth.HasPerm(ctx, []auth.Permission{}, core.PermAdmin) {
		return nil
	}
	user, exist := CtxGetName(ctx)
	if !exist || user != name {
		return ErrorPermissionDeny
	}
	return nil
}
```

#### 钱包地址

在和 `消息` 有关联的 `服务接口` 中, 往往会涉及到消息的发送者, 也就是签名该消息的钱包地址. 通过该地址, 我们可以判断该消息是否属于访问者的, 从而判断访问者是否具有访问该数据的权限.

```go

func CheckPermissionBySigner(ctx context.Context, client IAuthClient, addrs ...address.Address) error {
	if auth.HasPerm(ctx, []auth.Permission{}, core.PermAdmin) {
		return nil
	}
	user, exist := CtxGetName(ctx)
	if !exist {
		return ErrorUserNotFound
	}

	for _, wAddr := range addrs {
		ok, err := client.SignerExistInUser(ctx, user, wAddr)
		if err != nil {
			return fmt.Errorf("check signer exist in user fail %s failed when check permission: %s", wAddr.String(), err)
		}
		if !ok {
			return ErrorPermissionDeny
		}
	}
	return nil
}
```


#### 矿工地址


```go

func CheckPermissionByMiner(ctx context.Context, client IAuthClient, addrs ...address.Address) error {
	if auth.HasPerm(ctx, []auth.Permission{}, core.PermAdmin) {
		return nil
	}
	user, exist := CtxGetName(ctx)
	if !exist {
		return ErrorUserNotFound
	}
	for _, mAddr := range addrs {
		ok, err := client.MinerExistInUser(ctx, user, mAddr)
		if err != nil {
			return fmt.Errorf("check miner exist in user fail %s failed when check permission: %s", mAddr.String(), err)
		}
		if !ok {
			return ErrorPermissionDeny
		}
	}
	return nil
}
```

### 实现的细节

本小节主要叙述在实际实现的过程中涉及到的 `服务接口` 的变动. <br>
`venus` 组件不涉及 `用户数据`, 不需要做相应变动.<br>
`venus-gateway` 涉及 `用户数据` 部分的 `接口` 仅对管理员开放, 不需要变动.<br>
所以, 主要涉及到一下四个 `云组件` 的接口:

#### `venus-auth` 接口

`venus-auth` 本身并无 `用户身份` 和 `权限级别` 的检查, 新增如下:

```go
// Read 权限
Verify(ctx context.Context, token string) (*JWTPayload, error) // read

// Admin 权限:
GenerateToken(ctx context.Context, cp *JWTPayload) (string, error)
Tokens(ctx context.Context, skip, limit int64) ([]*TokenInfo, error)
GetToken(c context.Context, token string) (*TokenInfo, error)
CreateUser(ctx context.Context, req *CreateUserRequest) (*CreateUserResponse, error)
VerifyUsers(ctx context.Context, req *VerifyUsersReq) error
ListUsers(ctx context.Context, req *ListUsersRequest) (ListUsersResponse, error)
HasUser(ctx context.Context, req *HasUserRequest) (bool, error)
UpdateUser(ctx context.Context, req *UpdateUserRequest) error
DeleteUser(ctx *gin.Context, req *DeleteUserRequest) error
RecoverUser(ctx *gin.Context, req *RecoverUserRequest) error
GetUserRateLimits(ctx context.Context, req *GetUserRateLimitsReq) (GetUserRateLimitResponse, error)
UpsertUserRateLimit(ctx context.Context, req *UpsertUserRateLimitReq) (string, error)
DelUserRateLimit(ctx context.Context, req *DelUserRateLimitReq) error
HasMiner(ctx context.Context, req *HasMinerRequest) (bool, error)
GetUserByMiner(ctx context.Context, req *GetUserByMinerRequest) (*OutputUser, error)
RegisterSigners(ctx context.Context, req *RegisterSignersReq) error
UnregisterSigners(ctx context.Context, req *UnregisterSignersReq) error
HasSigner(ctx context.Context, req *HasSignerReq) (bool, error)
GetUserBySigner(ctx context.Context, req *GetUserBySignerReq) ([]*OutputUser, error)
UpsertMiner(ctx context.Context, req *UpsertMinerReq) (bool, error)

// Admin 权限 或者 目标数据拥有者 (意味着这部分接口会对部分非admin权限开放)
RemoveToken(ctx context.Context, token string) error // +tokenOwner
RecoverToken(ctx context.Context, token string) error // +tokenOwner
GetTokenByName(c context.Context, name string) ([]*TokenInfo, error) // +tokenOwner
GetUser(ctx context.Context, req *GetUserRequest) (*OutputUser, error) // +userOwner
MinerExistInUser(ctx context.Context, req *MinerExistInUserRequest) (bool, error) // +userOwner
ListMiners(ctx context.Context, req *ListMinerReq) (ListMinerResp, error) // +userOwner
DelMiner(ctx context.Context, req *DelMinerReq) (bool, error) // +minerOwner
SignerExistInUser(ctx context.Context, req *SignerExistInUserReq) (bool, error) // +userOwner
ListSigner(ctx context.Context, req *ListSignerReq) (ListSignerResp, error) // +userOwner
DelSigner(ctx context.Context, req *DelSignerReq) (bool, error) // +signerOwner
```


#### venus-miner 

在非 `管理权限` 的接口增加了`用户身份`的检查, 接口权限变动如下:

```go
UpdateAddress(context.Context, int64, int64) ([]types.MinerInfo, error)                                        //perm:write -> admin
WarmupForMiner(context.Context, address.Address) error                                                         //perm:admin -> write
Start(context.Context, []address.Address) error                                                                //perm:admin -> write
Stop(context.Context, []address.Address) error                                                                 //perm:admin -> write
ListAddress(context.Context) ([]types.MinerInfo, error)                                                        //perm:read
StatesForMining(context.Context, []address.Address) ([]types.MinerState, error)                                //perm:read
CountWinners(context.Context, []address.Address, abi.ChainEpoch, abi.ChainEpoch) ([]types.CountWinners, error) //perm:read
```


#### venus-messager


```go
// 不需要用户隔离的接口(管理员级别的接口或者公开数据接口)
SetSharedParams(ctx context.Context, params *mtypes.SharedSpec) //perm:admin
SetLogLevel(ctx context.Context, subsystem, level string) //perm:admin
SaveNode(ctx context.Context, node *mtypes.Node) //perm:admin
ListNode(ctx context.Context) //perm:admin
HasNode(ctx context.Context, name string) //perm:admin
GetSharedParams(ctx context.Context) //perm:admin
GetNode(ctx context.Context, name string) //perm:admin
DeleteNode(ctx context.Context, name string) //perm:admin
ListMessageByAddress(ctx context.Context, addr address.Address) //perm:admin
ListMessageByFromState(ctx context.Context, from address.Address, state mtypes.MessageState, isAsc bool, pageIndex, pageSize int) //perm:admin
UpdateAllFilledMessage(ctx context.Context) //perm:admin
RepublishMessage(ctx context.Context, id string) //perm:admin
LogList(context.Context) //perm:write -> admin
NetPeers() //perm:read -> admin
NetFindPeer() //perm:read -> admin
NetAddrListen() //perm:read -> admin
NetConnect() //perm:admin
UpdateNonce(ctx context.Context, addr address.Address, nonce uint64) //perm:admin
HasMessageByUid(ctx context.Context, id string) //perm:read

// 已经实现用户隔离的接口
HasAddress(ctx context.Context, addr address.Address) //perm:read
GetMessageByUnsignedCid(ctx context.Context, cid cid.Cid) //perm:read
GetMessageByUid(ctx context.Context, id string) //perm:read
GetMessageBySignedCid(ctx context.Context, cid cid.Cid) //perm:read
GetMessageByFromAndNonce(ctx context.Context, from address.Address, nonce uint64) //perm:read
PushMessageWithId(ctx context.Context, id string, msg *types.Message, meta *mtypes.SendSpec) //perm:write
PushMessage(ctx context.Context, msg *types.Message, meta *mtypes.SendSpec) //perm:write
WalletHas(ctx context.Context, addr address.Address) //perm:read
WaitMessage(ctx context.Context, id string, confidence uint64) //perm:read
UpdateMessageStateByID(ctx context.Context, id string, state mtypes.MessageState) //perm:admin -> write
UpdateFilledMessageByID(ctx context.Context, id string) //perm:admin -> write
SetFeeParams(ctx context.Context, params *mtypes.AddressSpec) //perm:admin -> write
ReplaceMessage(ctx context.Context, params *mtypes.ReplacMessageParams) //perm:admin -> write
RecoverFailedMsg(ctx context.Context, addr address.Address) //perm:admin -> write
MarkBadMessage(ctx context.Context, id string) //perm:admin -> write
ListMessage(ctx context.Context , p *types.MsgQueryParams) //perm:admin -> read
ListFailedMessage(ctx context.Context) //perm:admin -> read
ListBlockedMessage(ctx context.Context, addr address.Address, d time.Duration) //perm:admin -> read
ListAddress(ctx context.Context) //perm:admin -> read
GetAddress(ctx context.Context, addr address.Address) //perm:admin -> read
ForbiddenAddress(ctx context.Context, addr address.Address) //perm:admin -> write
DeleteAddress(ctx context.Context, addr address.Address) //perm:admin -> write
ClearUnFillMessage(ctx context.Context, addr address.Address) //perm:admin ->write
ActiveAddress(ctx context.Context, addr address.Address) //perm:admin ->write
Send(ctx context.Context, params mtypes.QuickSendParams) //perm:admin -> sign
SetSelectMsgNum(ctx context.Context, addr address.Address, num uint64) //perm:admin -> write


// 参数变动
ListMessage(ctx context.Context ) -> ListMessage(ctx context.Context , p *types.MsgQueryParams)
```

#### venus-market

```go
// 不需要做用户数据隔离的接口(开放数据)
PiecesListPieces //perm:read
PiecesListCidInfos //perm:read
PiecesGetPieceInfo //perm:read
PiecesGetCIDInfo //perm:read
MessagerWaitMessage //perm:read
MessagerGetMessage //perm:read
NetAddrsListen //perm:read
ID //perm:read
ResponseMarketEvent //perm:read
ListenMarketEvent //perm:read
ListPieceStorageInfos //perm:read
MarketListAsk //perm:read
MarketListRetrievalAsk //perm:read

// 不对普通用户开放的接口 (管理员级别的接口)
MarketListDataTransfers //perm:read -> admin
MarketDataTransferUpdates //perm:read -> admin
MarketRestartDataTransfer //perm:read -> admin
MarketCancelDataTransfer //perm:read -> admin
ImportV1Data //perm:admin
MarketPublishPendingDeals //perm:admin
DagstoreListShards //perm:admin
DagstoreInitializeShard //perm:admin
DagstoreRecoverShard //perm:admin
DagstoreInitializeAll //perm:admin
DagstoreInitializeStorage //perm:admin
DagstoreGC //perm:admin
AddFsPieceStorage //perm:admin
AddS3PieceStorage //perm:admin
RemovePieceStorage //perm:admin

// 暂时不进行用户数据隔离的接口 
MarketListRetrievalDeals //perm:read

// 进行用户数据隔离的接口
ActorList //perm:read
ActorExist //perm:read
ActorSectorSize //perm:read
MarketListDeals //perm:read

MarketGetDealUpdates //perm:read
MarketListIncompleteDeals //perm:read
MarketGetAsk //perm:read

MarketGetRetrievalAsk //perm:read

DealsConsiderOnlineStorageDeals //perm:read
DealsConsiderOnlineRetrievalDeals //perm:read
DealsPieceCidBlocklist //perm:read
DealsConsiderOfflineStorageDeals //perm:read
DealsConsiderOfflineRetrievalDeals //perm:read
DealsConsiderVerifiedStorageDeals //perm:read
DealsConsiderUnverifiedStorageDeals //perm:read
SectorGetExpectedSealDuration //perm:read
DealsMaxStartDelay //perm:read

DealsPublishMsgPeriod //perm:read
MarketMaxDealsPerPublishMsg //perm:read

DealsMaxProviderCollateralMultiplier //perm:read
DealsMaxPublishFee //perm:read
MarketMaxBalanceAddFee //perm:read

GetDeals //perm:read
GetUnPackedDeals //perm:read

PaychVoucherList //perm:read

GetStorageDealStatistic //perm:read
GetRetrievalDealStatistic //perm:read

MarketImportDealData //perm:write
MarketImportPublishedDeal //perm:write

MarketPendingDeals //perm:write
DealsSetConsiderOnlineStorageDeals //perm:write
DealsSetConsiderOnlineRetrievalDeals //perm:write
DealsSetPieceCidBlocklist //perm:write
DealsSetConsiderOfflineStorageDeals //perm:write
DealsSetConsiderOfflineRetrievalDeals //perm:write
DealsSetConsiderVerifiedStorageDeals //perm:write
DealsSetConsiderUnverifiedStorageDeals //perm:write
SectorSetExpectedSealDuration //perm:write
DealsSetMaxStartDelay //perm:write

DealsSetPublishMsgPeriod //perm:write
MarketSetMaxDealsPerPublishMsg //perm:write
DealsSetMaxProviderCollateralMultiplier //perm:write
DealsSetMaxPublishFee //perm:write
MarketSetMaxBalanceAddFee //perm:write
MessagerPushMessage //perm:write
MarkDealsAsPacking //perm:write
UpdateDealOnPacking //perm:write
UpdateDealStatus //perm:write
AssignUnPackedDeals //perm:write
UpdateStorageDealStatus //perm:write

MarketAddBalance //perm:sign
MarketGetReserved //perm:sign
MarketReserveFunds //perm:sign
MarketReleaseFunds //perm:sign
MarketWithdraw //perm:sign

MarketSetAsk //perm:admin
MarketSetRetrievalAsk //perm:admin
DealsImportData //perm:admin
OfflineDealImport //perm:admin
MarketDataTransferPath //perm:admin
MarketSetDataTransferPath //perm:admin

// 被删除接口
ImportV1Data //perm:admin


```
