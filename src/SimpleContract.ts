import {Contract, ContractState, Ctx, Action} from "@wavesenterprise/contract-core";

@Contract()
class SimpleContract {

    @Action({onInit: true})
    initialize() {

    }

    @Action
    simple() {
        return "dimple";
    }
}
