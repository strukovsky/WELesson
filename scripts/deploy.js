const {We} = require("@wavesenterprise/sdk")
const {TRANSACTIONS} = require("@wavesenterprise/transactions-factory");
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'thing action ugly exclude usage day victory file panel jeans oxygen melody upset employ tool'
const NODE_URL = 'https://hackathon.welocal.dev/node-0/';

const sdk = new We(NODE_URL)

async function deploy() {
    const config = await sdk.node.config()
    const fee = 100000000;
    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx =TRANSACTIONS.CreateContract.V5({
        fee,
        imageHash: "c602b91154b557b7681e525e3d1c67781cc2483778c1b7bbf0bc35041ff558e9",
        image: "strukovsky/simple-contract:0.0.1 \n",
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        params: [],
        payments: [],
        contractName: "SimpleContract",
        apiVersion: "1.0",
    });

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);
    const sentTx = await sdk.broadcast(signedTx);
    console.log(sentTx);
}

deploy()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)
