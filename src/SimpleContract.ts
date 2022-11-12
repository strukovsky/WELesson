import {
    Action,
    Contract,
    TVar,
    Var,
    Ctx,
    Param

} from "@wavesenterprise/contract-core";

@Contract()
export default class SimpleContract {

    @Var() myNumber: TVar<number>;

    @Action({onInit: true})
    async _constructor() {
        this.myNumber.set(10);
    }

}