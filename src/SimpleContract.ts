import {Contract, Ctx, ContractState, Action, Context, State} from "@wavesenterprise/contract-core";

export default class SimpleContract {

    @State() state: ContractState;
    @Ctx context: Context

     @Action({onInit: true})
    async _contructor() {

    }

    @Action()
    async getNumber() {
        return 10;
    }

}