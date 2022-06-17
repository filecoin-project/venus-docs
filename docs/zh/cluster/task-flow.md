# 任务状态流转

了解任务的状态流转，有助于使用者了解 `venus-worker` 的状态，并对暂停的扇区任务进行有针对性的恢复。

任务的状态流转，和任务的类型有关，即 [`sealing_thread` 中的 `plan` 选项](./03.venus-worker的配置解析.md#基础配置范例-3)，因此我们将会分别描述。

在下面的描述中，以 `State::` 为 前缀出现的，是状态，以 `Event::` 为前缀出现的，是事件或过程。类似

```
State::A => {
	Event::B => State::C,
	Event::D => State::E,
}
```

表示：

当任务处于 `A` 状态时

1. 如果出现 `B` 事件，则转向 `C` 状态
2. 如果出现 `D` 事件，则转向 `E` 状态

同时还需要说明：

1. 每种状态，都可能发生向一个或多个其他状态的转换，即 `{}` 中可能出现一行或多行

2. 除了罗列出来的具体状态，还存在一些特殊状态，如：

   - `State::Abort`，表示扇区未正常完成

     1. 任何逻辑判断中，属于 `abort` 级别的异常，都会使得任务转为 `Abort` 状态，任务将被终止，当前 `sealing_thread` 将会转向下一任务

     2. 使用者向暂停中的任务发送恢复指令时，如果附带 `Abort` 状态，也会实现上述效果

        因此使用者可以利用这一机制来处理难以恢复，但又尚未被定义为 `abort` 级别的异常

   - `State::Finished` 表示扇区正常完成



## 封装 （sealer） 任务的状态流转

```
// 空状态，即尚未分配扇区
State::Empty => {
	// 申请新扇区
	Event::Allocate(_) => State::Allocated,
},

// 新扇区已分配
State::Allocated => {
	// 申请订单
	Event::AcquireDeals(_) => State::DealsAcquired,
},

// 订单已申请
State::DealsAcquired => {
	// 填充 piece 数据
	Event::AddPiece(_) => State::PieceAdded,
},

// 数据已填充
State::PieceAdded => {
	// 构造 TreeD
	Event::BuildTreeD => State::TreeDBuilt,
},

// TreeD 已生成
State::TreeDBuilt => {
	// 申请 pc1 所需的链上随机数
	Event::AssignTicket(_) => State::TicketAssigned,
},

// pc1 所需的链上随机数已获得
State::TicketAssigned => {
	// 执行 pc1
	Event::PC1(_, _) => State::PC1Done,
},

// pc1 已完成
State::PC1Done => {
	// 执行 pc2
	Event::PC2(_) => State::PC2Done,
},

// pc2 已完成
State::PC2Done => {
	// 提交 PreCommit 上链信息
	Event::SubmitPC => State::PCSubmitted,
},

// PreCommit 上链信息已提交
State::PCSubmitted => {
	// 上链失败，需要重新提交
	Event::ReSubmitPC => State::PC2Done,
	// 上链成功
	Event::CheckPC => State::PCLanded,
},

// PreCommit 信息已上链
State::PCLanded => {
	// 执行扇区文件持久化
	Event::Persist(_) => State::Persisted,
},

// 扇区文件已持久化
State::Persisted => {
	// 通过持久化文件检查
	Event::SubmitPersistance => State::PersistanceSubmitted,
},

// 持久化文件已确认
State::PersistanceSubmitted => {
	// 申请 c1 所需的链上随机数
	Event::AssignSeed(_) => State::SeedAssigned,
},

// c1 所需的链上随机数已获得
State::SeedAssigned => {
	// 执行 c1
	Event::C1(_) => State::C1Done,
},

// c1 已完成
State::C1Done => {
	// 执行 c2
	Event::C2(_) => State::C2Done,
},

// c2 已完成
State::C2Done => {
	// 提交 CommitProof 信息
	Event::SubmitProof => State::ProofSubmitted,
},

// CommitProof 信息已提交
State::ProofSubmitted => {
	// 上链失败，需要重新提交 
	Event::ReSubmitProof => State::C2Done,
	// 上链成功或跳过上链检查
	Event::Finish => State::Finished,
},
```



## 升级 （snapup） 任务的状态流转

```
// 空状态，即尚未分配扇区
State::Empty => {
	// 分配用于升级的扇区和订单
	Event::AllocatedSnapUpSector(_, _, _) => State::Allocated,
},

// 升级扇区和订单已分配
State::Allocated => {
	// 填充 piece 数据
	Event::AddPiece(_) => State::PieceAdded,
},

// 数据已填充
State::PieceAdded => {
	// 构造 TreeD
	Event::BuildTreeD => State::TreeDBuilt,
},

// TreeD 已生成
State::TreeDBuilt => {
	// 执行 Snap 编码
	Event::SnapEncode(_) => State::SnapEncoded,
},

// Snap 编码已完成
State::SnapEncoded => {
	// 执行 Snap 证明
	Event::SnapProve(_) => State::SnapProved,
},

// Snap 证明已生成
State::SnapProved => {
	// 执行扇区文件持久化
	Event::Persist(_) => State::Persisted,
},

// 扇区文件已持久化
State::Persisted => {
	// 文件未通过检查
	Event::RePersist => State::SnapProved,
	// 文件已通过检查
	Event::Finish => State::Finished,
},
```



## 与 worker 管理工具结合的使用范例

1. 对于一个已经报错暂停，且无法恢复的扇区封装任务，如 ticket 已过期，可以通过

   ```
   venus-worker worker -c <config file path> resume --state Abort --index <index>
   ```

   或

   ```
   venus-sector-manager util worker resume <worker instance name or address> <thread index> Abort
   ```

   终止当前任务。

2. 对于一个已经报错暂停，但认为可以重新从之前某个阶段开始重试的扇区封装任务，同样如 ticket 已过期，可以通过

   ```
   venus-worker worker -c <config file path> resume --state TreeDBuilt --index <index>
   ```

   或

   ```
   venus-sector-manager util worker resume <worker instance name or address> <thread index> TreeDBuilt
   ```

   令其回退到之前的状态进行尝试。
