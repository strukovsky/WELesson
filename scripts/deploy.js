const {We} = require("@wavesenterprise/sdk");
const {TRANSACTIONS} = require("@wavesenterprise/transactions-factory")
const {Keypair} = require("@wavesenterprise/signer")

const SEED = 'thing action ugly exclude usage day victory file panel jeans oxygen melody upset employ tool'
const NODE_URL = 'https://hackathon.welocal.dev/node-0/';

const sdk = new We(NODE_URL);
// 2V7NjBXXD16m1vnko4SK3E2JQeUqS8MyczAQZYyUds1x
async function deploy() {
    const config = await sdk.node.config();
    const fee = 100000000;
    const keyPair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CreateContract.V5({
        fee,
        imageHash: "9edecfc0b33210847d6799a1ca7bed4f48cf59b9f95f2a7eebe61110bd66047a",
        image: "strukovsky/simple-contract:1.1.6",
        validationPolicy: {type: "any"},
        senderPublicKey: await keyPair.publicKey(),
        params: [],
        payments: [],
        contractName: "SimpleContract",
        apiVersion: "1.0"
    });

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);
    const sentTx = await sdk.broadcast(signedTx);
    console.log(sentTx);
}

deploy().then(() => {
    console.log("Success");
}).catch(console.error);
