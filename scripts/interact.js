const {We} = require("@wavesenterprise/sdk")
const {TRANSACTIONS} = require("@wavesenterprise/transactions-factory")
const {Keypair} = require("@wavesenterprise/signer")


const SEED = 'thing action ugly exclude usage day victory file panel jeans oxygen melody upset employ tool'
const NODE_URL = 'https://hackathon.welocal.dev/node-0/';
const CONTRACT_ID = "CVtHxvqtKpMUDBs78UK3MDp4vGyRX4UyUEtPTSVqKb1s";
const sdk = new We(NODE_URL)
/*
Contract at 7x1VsK64f8dv5yscLMscEs8fEGLDkT2R2Xw3hFj4dGNc
*/
async function interact() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[104]
    const keypair = await Keypair.fromExistingSeedPhrase(SEED);
    const tx = TRANSACTIONS.CallContract.V5({
        contractId: CONTRACT_ID,
        params: [
            {
                key: 'action',
                value: 'getNumber',
                type: 'string'
            },
        ],
        senderPublicKey: await keypair.publicKey(),
        fee: fee,
        contractVersion: 1,
        payments: []

    })
    const signedTx = await sdk.signer.getSignedTx(tx, SEED);
    const res = await sdk.broadcast(signedTx);
    console.log(res)
}

interact()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)
