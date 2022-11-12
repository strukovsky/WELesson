const {We} = require("@wavesenterprise/sdk");
const {TRANSACTIONS} = require("@wavesenterprise/transactions-factory")
const {Keypair} = require("@wavesenterprise/signer")

const SEED = 'thing action ugly exclude usage day victory file panel jeans oxygen melody upset employ tool'
const NODE_URL = 'https://hackathon.welocal.dev/node-0/';

const sdk = new We(NODE_URL);

async function deploy() {
    const config = await sdk.node.config();
    const fee = 100000000;
    const keyPair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CreateContract.V5({
        fee,
        imageHash: "fa58f60431c98c780ecb6bb2d336c5cff494b18dc3d4f8a321e5f5a3f8e5672c",
        image: "strukovsky/demo_simple_contract:1.0.1",
        validationPolicy: {type: "any"},
        senderPublicKey: await keyPair.publicKey(),
        params: [],
        payments: [],
        contractName: "DemoContract",
        apiVersion: "1.0"
    });

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);
    const sentTx = await sdk.broadcast(signedTx);
    console.log(sentTx);
}

deploy().then(() => {
    console.log("Success");
}).catch(console.error);
