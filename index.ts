import {initContract} from "@wavesenterprise/contract-core";

initContract({
    contractPath: './src/SimpleContract'
})
.then(() => {
    console.log('contract started');
});
