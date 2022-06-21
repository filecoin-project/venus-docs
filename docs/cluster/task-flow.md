# Task status flow

Understanding the status flow of tasks will help users understand the status of `venus-worker` and perform targeted recovery of suspended sector tasks.

The status flow of the task is related to the type of the task, that is, the `plan` option in `sealing_thread`] (./03. venus-worker's configuration analysis.md#Basic configuration example-3), so we will describe it separately .

In the description below, occurrences prefixed with `State::` are states, and occurrences prefixed with `Event::` are events or procedures. similar

````
State::A => {
Event::B => State::C,
Event::D => State::E,
}
````

express:

When the task is in `A` state

1. If `B` event occurs, go to `C` state
2. If `D` event occurs, go to `E` state

Also need to explain:

1. For each state, transitions to one or more other states may occur, that is, one or more lines may appear in `{}`

2. In addition to the specific states listed, there are also some special states, such as:

   - `State::Abort`, indicating that the sector did not complete normally

     1. In any logical judgment, an exception belonging to the `abort` level will cause the task to change to the `Abort` state, the task will be terminated, and the current `sealing_thread` will move to the next task

     2. When the user sends the resume command to the suspended task, if the `Abort` state is attached, the above effect will also be achieved

        Therefore, users can use this mechanism to handle exceptions that are difficult to recover, but have not yet been defined as `abort` level

   - `State::Finished` indicates that the sector completed normally



## The state flow of the sealer task

````
// Empty state, that is, the sector has not been allocated yet
State::Empty => {
// apply for a new sector
Event::Allocate(_) => State::Allocated,
},

// new sector is allocated
State::Allocated => {
// request an order
Event::AcquireDeals(_) => State::DealsAcquired,
},

// order has been applied
State::DealsAcquired => {
// fill piece data
Event::AddPiece(_) => State::PieceAdded,
},

// data is filled
State::PieceAdded => {
// construct TreeD
Event::BuildTreeD => State::TreeDBuilt,
},

// TreeD has been generated
State::TreeDBuilt => {
// Request on-chain random number required by pc1
Event::AssignTicket(_) => State::TicketAssigned,
},

// The on-chain random number required by pc1 has been obtained
State::TicketAssigned => {
// execute pc1
Event::PC1(_, _) => State::PC1Done,
},

// pc1 is done
State::PC1Done => {
// execute pc2
Event::PC2(_) => State::PC2Done,
},

// pc2 is done
State::PC2Done => {
// Submit PreCommit on-chain information
Event::SubmitPC => State::PCSubmitted,
},

// PreCommit on-chain information has been submitted
State::PCSubmitted => {
// Failed to upload, need to resubmit
Event::ReSubmitPC => State::PC2Done,
// Successfully uploaded
Event::CheckPC => State::PCLanded,
},

// PreCommit information has been uploaded
State::PCLanded => {
//Perform sector file persistence
Event::Persist(_) => State::Persisted,
},

// sector file is persisted
State::Persisted => {
// Check by persistent file
Event::SubmitPersistance => State::PersistanceSubmitted,
},

// Persistence file is confirmed
State::PersistanceSubmitted => {
// Request on-chain random number required for c1
Event::AssignSeed(_) => State::SeedAssigned,
},

// The on-chain random number required by c1 has been obtained
State::SeedAssigned => {
// execute c1
Event::C1(_) => State::C1Done,
},

// c1 is done
State::C1Done => {
// execute c2
Event::C2(_) => State::C2Done,
},

// c2 is done
State::C2Done => {
// Submit CommitProof information
Event::SubmitProof => State::ProofSubmitted,
},

// CommitProof information has been submitted
State::ProofSubmitted => {
// Failed to upload, need to resubmit
Event::ReSubmitProof => State::C2Done,
// Successful on-chain or skip on-chain check
Event::Finish => State::Finished,
},
````



## Upgrade (snapup) task status flow

````
// Empty state, that is, the sector has not been allocated yet
State::Empty => {
// Allocate sectors and orders for upgrade
Event::AllocatedSnapUpSector(_, _, _) => State::Allocated,
},

// Upgrade sectors and orders are allocated
State::Allocated => {
// fill piece data
Event::AddPiece(_) => State::PieceAdded,
},

// data is filled
State::PieceAdded => {
// construct TreeD
Event::BuildTreeD => State::TreeDBuilt,
},

// TreeD has been generated
State::TreeDBuilt => {
// perform Snap encoding
Event::SnapEncode(_) => State::SnapEncoded,
},

// Snap encoding is done
State::SnapEncoded => {
// Execute Snap proof
Event::SnapProve(_) => State::SnapProved,
},

// Snap proof has been generated
State::SnapProved => {
//Perform sector file persistence
Event::Persist(_) => State::Persisted,
},

// sector file is persisted
State::Persisted => {
// file fails check
Event::RePersist => State::SnapProved,
// file passed the check
Event::Finish => State::Finished,
},
````



## Example of use in combination with worker management tools

1. For a sector encapsulation task that has been suspended due to an error and cannot be resumed, such as the ticket has expired, you can pass the

   ````bash
   venus-worker worker -c <config file path> resume --state Abort --index <index>
   ````

   or

   ````bash
   venus-sector-manager util worker resume <worker instance name or address> <thread index> Abort
   ````

   Terminate the current task.

2. For a sector encapsulation task that has been suspended with an error, but it is considered that it can be retried from a previous stage, also if the ticket has expired, you can pass the

   ````bash
   venus-worker worker -c <config file path> resume --state TreeDBuilt --index <index>
   ````

   or

   ````bash
   venus-sector-manager util worker resume <worker instance name or address> <thread index> TreeDBuilt
   ````

   Let it fall back to the previous state to try.