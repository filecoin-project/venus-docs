(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{387:function(s,t,e){"use strict";e.r(t);var a=e(17),r=Object(a.a)({},(function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("h2",{attrs:{id:"venus-multisig-wallet"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#venus-multisig-wallet"}},[s._v("#")]),s._v(" Venus: Multisig wallet")]),s._v(" "),e("p",[s._v("Multi-signature wallet is a wallet that needs multiple keys to authorize the same fil transaction. It is suitable for multi-party joint management. Set a percentage. When the proportion of managers supporting signature reaches this percentage, message signing is completed.")]),s._v(" "),e("h2",{attrs:{id:"cli-example"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#cli-example"}},[s._v("#")]),s._v(" CLI example")]),s._v(" "),e("ul",[e("li",[s._v('The following demonstration will use the "t0" address for easy reading. In fact, it also supports the "T3" address operation.')]),s._v(" "),e("li",[s._v("The example includes all the CLI operation modes of multi signature wallet, and introduces how to use multi signature wallet in a flow way.")]),s._v(" "),e("li",[s._v("Label of instruction\n"),e("ul",[e("li",[s._v('"[]"：Optional')]),s._v(" "),e("li",[s._v('"[--phrase]" ：With descriptor parameter, you need to specify "--phrase" to use')]),s._v(" "),e("li",[s._v('"<phrase>"：the parameters to fill in the vacancy do not need to specify the meaning, but need to be filled in strictly according to the sequence')]),s._v(" "),e("li",[s._v('"[--]"： The boundary of the above two parameters')])])])]),s._v(" "),e("blockquote",[e("p",[s._v("Example of instruction label: venus msig create [--phrase1=<phrase1>] [--] <phrase2> [<phrase3>]")]),s._v(" "),e("ol",[e("li",[s._v('phrase1: With descriptor parameter, optional. If it needs to be used, it must be specified with "--phrase1=xxx"')]),s._v(" "),e("li",[s._v("phrase2: Parameter used to fill in the vacancy, required")]),s._v(" "),e("li",[s._v("phrase3: Parameter used to fill in the vacancy, required")])])]),s._v(" "),e("h3",{attrs:{id:"create-multi-signature-wallet"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#create-multi-signature-wallet"}},[s._v("#")]),s._v(" Create multi signature Wallet")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig create [--required=<required>] [--value=<value>] [--duration=<duration>] [--from=<from>] [--] <addresses>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig create --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 --required"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v(" --value"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1000")]),s._v(" --duration"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("20000")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"t01001,t01002,t01003"')]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Created new multisig: t01004 <multiAddress>"')]),s._v("\n")])])]),e("ul",[e("li",[s._v("from: it takes gas to initiate the wallet address and generate create msg. When creating a multi signature wallet, the initiated wallet address is not added to the multi signature key by default. If it needs to be added, it needs to be specified additionally (for example, t01001 appears twice in the following instruction, and the second time is to specify that the address is included in the multi signature Wallet)")]),s._v(" "),e("li",[s._v("required: The number of signatures required for multiple wallets. The above wallets are set to 2 / 3, that is, when two of the three wallets contained in the multi signature wallets pass the resolution, they will take effect.")]),s._v(" "),e("li",[s._v("value: The amount of FIL for direct transfer after wallet creation is provided by ‘from’.")]),s._v(" "),e("li",[s._v("duration: The time period of fund unlocking, that is, the time period of amount locking in the created wallet.")])]),s._v(" "),e("h3",{attrs:{id:"query-the-status-of-the-created-multi-signature-wallet"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#query-the-status-of-the-created-multi-signature-wallet"}},[s._v("#")]),s._v(" Query the status of the created multi signature wallet")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig inspect [--vesting] [--decode-params] [--] <address>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig inspect t01004 --vesting"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("true --decode-params"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("true\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# status")]),s._v("\nBalance: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1000")]),s._v(" FIL\nSpendable: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3.15")]),s._v(" FIL\nInitialBalance: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1000")]),s._v(" FIL\nStartEpoch: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("\nUnlockDuration: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("20000")]),s._v("\nThreshold: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v(" / "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\nSigners:\nID      Address\nt01001  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("1")]),s._v(">")]),s._v("\nt01002  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),s._v("\nt01003  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("3")]),s._v(">")]),s._v("\nTransactions:  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("\n")])])]),e("ul",[e("li",[s._v("vesting: The default is false. When true, more information will be presented")]),s._v(" "),e("li",[s._v("decode-params: The params field of Transactions in the status is displayed in JSON format, and the default is hex format")])]),s._v(" "),e("h3",{attrs:{id:"transfer-fil-to-multisig-wallet"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#transfer-fil-to-multisig-wallet"}},[s._v("#")]),s._v(" Transfer FIL to Multisig wallet")]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus send t01004 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2000")]),s._v("\n")])])]),e("blockquote",[e("p",[s._v("After the success of MSG on the Blockchain, multisig wallet will increase by 2000FIL")])]),s._v(" "),e("h3",{attrs:{id:"add-a-new-wallet-address-to-the-multisig-wallet"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#add-a-new-wallet-address-to-the-multisig-wallet"}},[s._v("#")]),s._v(" Add a new wallet address to the multisig Wallet")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig add-propose [--increase-threshold] [--from=<from>] [--] <multisigAddress> <signer>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig add-propose --increase-threshold"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("false --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 t01005\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# reponse")]),s._v("\nsent "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" singer proposal "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" message: "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("msgCId"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nTxnID: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state")]),s._v("\nTransactions:  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\nID      State    Approvals  To             Value   Method        Params\n"),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("       pending  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("          t01004 "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("self"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" FIL   AddSigner"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("5")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Signer"')]),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"t01005"')]),s._v(","),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Increase"')]),s._v(":false"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),e("blockquote",[e("p",[s._v("Add t01005 to t01004 (multisig wallet), and the number of votes required for voting will not increase")])]),s._v(" "),e("ul",[e("li",[s._v("increase-threshold: Whether to automatically increase the number of votes required after adding a new address. The default is false")]),s._v(" "),e("li",[s._v("signer: The wallet address to be added is not included in the multisig wallet")])]),s._v(" "),e("h3",{attrs:{id:"agree-to-add-new-address"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#agree-to-add-new-address"}},[s._v("#")]),s._v(" Agree to add new address")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig add-approve [--from=<from>] [--] <multisigAddress> <proposerAddress> <txId> <newAddress> <increaseThreshold>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig add-approve --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01002 t01004 t01001 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" t01005 "),e("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# reponse")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"sent add approval in message: <msgCId>"')]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state")]),s._v("\nThreshold: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v(" / "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v("\nSigners:\nID      Address\nt01001  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("1")]),s._v(">")]),s._v("\nt01002  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),s._v("\nt01003  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("3")]),s._v(">")]),s._v("\nt01005  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("5")]),s._v(">")]),s._v("\n")])])]),e("blockquote",[e("p",[s._v("Because the previous voting ratio was 2 / 3, after an address is approved, the proposal will be implemented, and the voting threshold will become 2 / 4 due to the addition of new members")])]),s._v(" "),e("ul",[e("li",[s._v("proposerAddress: Address of the originator")]),s._v(" "),e("li",[s._v("txId: The ID corresponding to the Transactions in the multisig address state")]),s._v(" "),e("li",[s._v("newAddress: The new address to be added must be the same as the corresponding address under params in the status data")]),s._v(" "),e("li",[s._v("increaseThreshold: The number of votes affected must be the same as the corresponding increase under params in the status data")])]),s._v(" "),e("h3",{attrs:{id:"propose-to-amend-the-voting-threshold"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#propose-to-amend-the-voting-threshold"}},[s._v("#")]),s._v(" Propose to amend the voting threshold")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig propose-threshold [<multisigAddress>] <newM>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig propose-threshold --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# reponse")]),s._v("\nsent change threshold proposal "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" message: "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("msgCId"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nTxnID: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state")]),s._v("\nTransactions:  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\nID      State    Approvals  To             Value   Method                          Params\n"),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("       pending  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("          t01004 "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("self"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" FIL   ChangeNumApprovalsThreshold"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("8")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"NewThreshold"')]),s._v(":3"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),e("ul",[e("li",[s._v("newM: Total voting rights")])]),s._v(" "),e("h3",{attrs:{id:"agree-to-change-the-number-of-votes-required-approve-instruction-is-universal-consent-instruction"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#agree-to-change-the-number-of-votes-required-approve-instruction-is-universal-consent-instruction"}},[s._v("#")]),s._v(" Agree to change the number of votes required (approve instruction is universal consent instruction)")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig approve [--from=<from>] [--] <multisigAddress> <messageId> [<proposerAddress>] [<destination>] [<value>] [<methodId>] [<methodParams>]")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig approve --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01002 t01004 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# reponse")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"sent approval in message: <msgCId>"')]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state")]),s._v("\nThreshold: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v(" / "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v("\n")])])]),e("blockquote",[e("p",[s._v("Generally, to agree to a proposal, you only need to use the approve instruction and specify the multisig address and the ID in the multi signer address Transactions state")])]),s._v(" "),e("ul",[e("li",[s._v("multisigAddress: Operation multisig address")]),s._v(" "),e("li",[s._v("messageId: The TxID returned by the propose operation can be found in the inspect instruction")]),s._v(" "),e("li",[s._v("proposerAddress: Proposed originator wallet address")]),s._v(" "),e("li",[s._v("destination: Destination address (for example, when multisig addresses are transferred to other addresses, this field is the other address)")]),s._v(" "),e("li",[s._v("value: Amount of fil transferred")]),s._v(" "),e("li",[s._v("methodId: The methodNum corresponding to propose can be found in the inspect instruction\n"),e("ul",[e("li",[s._v("Propose: 2")]),s._v(" "),e("li",[s._v("Approve: 3")]),s._v(" "),e("li",[s._v("Cancel: 4")]),s._v(" "),e("li",[s._v("AddSigner: 5")]),s._v(" "),e("li",[s._v("RemoveSigner: 6")]),s._v(" "),e("li",[s._v("SwapSinger: 7")]),s._v(" "),e("li",[s._v("ChangeNumApprovalsThreshold: 8")]),s._v(" "),e("li",[s._v("LockBalance: 9")])])]),s._v(" "),e("li",[s._v("methodParams: The operation parameters of initiating ‘ proposal ’ , can be found in the inspect instruction")])]),s._v(" "),e("h3",{attrs:{id:"proposal-to-remove-multisigners"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#proposal-to-remove-multisigners"}},[s._v("#")]),s._v(" Proposal to remove multisigners")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig propose-remove [--decrease-threshold] [--from=<from>] [--] <multisigAddress> <signer>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig propose-remove --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 t01005 \n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# response")]),s._v("\nsent remove singer "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" message: "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("msgCId"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nTxnID: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state")]),s._v("\nThreshold: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v(" / "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v("\nSigners:\nID      Address\nt01001  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("1")]),s._v(">")]),s._v("\nt01002  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),s._v("\nt01003  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("3")]),s._v(">")]),s._v("\nt01005  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("5")]),s._v(">")]),s._v("\nTransactions:  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\nID      State    Approvals  To             Value   Method           Params\n"),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v("       pending  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("          t01004 "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("self"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" FIL   RemoveSigner"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("6")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Signer"')]),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"t01005"')]),s._v(","),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Decrease"')]),s._v(":false"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Propose-remove after approve")]),s._v("\nThreshold: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v(" / "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\nSigners:\nID      Address\nt01001  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("1")]),s._v(">")]),s._v("\nt01002  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),s._v("\nt01003  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("3")]),s._v(">")]),s._v("\n\n")])])]),e("h3",{attrs:{id:"propose-to-replace-multisigner"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#propose-to-replace-multisigner"}},[s._v("#")]),s._v(" Propose to replace multisigner")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig swap-propose [--from=<from>] [--] <multisigAddress> <oldAddress> <newAddress>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig swap-propose --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 t01003 t01005\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# response")]),s._v("\nsent swap singer "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" message: "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("msgCId"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nTxID: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state")]),s._v("\nThreshold: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v(" / "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\nSigners:\nID      Address\nt01001  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("1")]),s._v(">")]),s._v("\nt01002  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),s._v("\nt01003  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("3")]),s._v(">")]),s._v("\nTransactions:  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\nID      State    Approvals  To             Value   Method         Params\n"),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("       pending  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("          t01004 "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("self"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" FIL   SwapSigner"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("7")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"From"')]),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"t01003"')]),s._v(","),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"To"')]),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"t01005"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# After approve")]),s._v("\nThreshold: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v(" / "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v("\nSigners:\nID      Address\nt01001  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("1")]),s._v(">")]),s._v("\nt01002  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),s._v("\nt01005  "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("t3Address"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("5")]),s._v(">")]),s._v("\nTransactions:  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("\n\n")])])]),e("h3",{attrs:{id:"the-proposal-of-canceling-address-replacement-of-multisiger"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#the-proposal-of-canceling-address-replacement-of-multisiger"}},[s._v("#")]),s._v(" The proposal of canceling address replacement of multisiger")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig swap-cancel [<multisigAddress>] <txId> <oldAddress> <newAddress>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Launch a new replacement proposal")]),s._v("\n$ ./venus msig swap-propose --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 t01005 t01003\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state")]),s._v("\nTransactions:  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\nID      State    Approvals  To             Value   Method         Params\n"),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v("       pending  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("          t01004 "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("self"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" FIL   SwapSigner"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("7")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"From"')]),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"t01005"')]),s._v(","),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"To"')]),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"t01003"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n$ ./venus msig swap-cancel --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v(" t01005 t01003\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"sent swap cancellation in message: <msgCId>"')]),s._v("\n")])])]),e("h3",{attrs:{id:"query-the-number-of-fils-granted-by-multisig-address-in-the-specified-block-interval"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#query-the-number-of-fils-granted-by-multisig-address-in-the-specified-block-interval"}},[s._v("#")]),s._v(" Query the number of FILs granted by multisig address in the specified block interval")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig vested [--start-epoch=<start-epoch>] [--end-epoch=<end-epoch>] [--] <multisigAddress>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$  ./venus msig vested --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 --start-epoch"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),s._v(" --end-epoch"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("200")]),s._v(" t01004\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# response")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Vested: 9.5 FIL between 10 and 200"')]),s._v("\n")])])]),e("h3",{attrs:{id:"propose-to-freeze-part-of-fil-in-multisig-address"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#propose-to-freeze-part-of-fil-in-multisig-address"}},[s._v("#")]),s._v(" Propose to freeze part of FIL in multisig address")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig lock-propose [--from=<from>] [--] <multisigAddress> <startEpoch> <unlockDuration> <amount>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig lock-propose --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("500")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("100")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("50")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# response")]),s._v("\nsent lock balance "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" message: "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("msgCId"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nTxnID: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state")]),s._v("\nTransactions:  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\nID      State    Approvals  To             Value   Method          Params\n"),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("5")]),s._v("       pending  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("          t01004 "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("self"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" FIL   LockBalance"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("9")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"StartEpoch"')]),s._v(":1600,"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"UnlockDuration"')]),s._v(":100,"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Amount"')]),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"50000000000000000000"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n")])])]),e("ul",[e("li",[s._v("startEpoch: Effective block epoch")]),s._v(" "),e("li",[s._v("unlockDuration: Balance lock block span. After startEpoch + unlockduration, the locked balance will be automatically unlocked")]),s._v(" "),e("li",[s._v("amount: Locked FIL amount")])]),s._v(" "),e("h3",{attrs:{id:"proposal-to-lock"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#proposal-to-lock"}},[s._v("#")]),s._v(" Proposal to lock")]),s._v(" "),e("blockquote",[e("p",[s._v("./venus msig lock-cancel [--from=<from>] [--] <multisigAddress> <txId> <startEpoch> <unlockDuration> <amount>")])]),s._v(" "),e("div",{staticClass:"language-shell script extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("$ ./venus msig lock-cancel --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("5")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("500")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("100")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("50")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("### Agree to lock")]),s._v("\n$ ./venus msig lock-approve --from"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("t01001 t01004 t01001 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("5")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("100")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("50")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("50")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Change of state after consent")]),s._v("\nInitialBalance: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("50")]),s._v(" FIL\n")])])]),e("ul",[e("li",[s._v("startEpoch, unlockDuration and amount need to be the same parameters as lock-propose")]),s._v(" "),e("li",[s._v("After the proposal is approved, the balance under the multisign account will freeze and lock the specified amount of balance and display it as InitialBalance")])])])}),[],!1,null,null,null);t.default=r.exports}}]);