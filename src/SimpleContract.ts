import {Contract, Ctx, ContractState, Action} from "@wavesenterprise/contract-core";

@Contract()
class SimpleContract {

    @Action({onInit: true})
    initialize() {

    }

    @Action()
    getNumber() {
        return 10;
    }

}