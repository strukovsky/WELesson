import AssetMock from "./AssetMock";


export default class PairTradeMock {
    assetA: AssetMock // actually assetId here should be placed
    assetB: AssetMock // actually assetId here should be placed
    weightA: number
    weightB: number
    feeBasePoints: number
    feeCollector: string

    __contractId: string // equals to address of contract

    constructor(assetA: AssetMock, assetB: AssetMock, weightA: number, weightB: number, __contractId: string, feeBasePoints: number, feeCollector: string) {
        this.assetA = assetA;
        this.assetB = assetB;
        this.weightA = weightA;
        this.weightB = weightB;
        this.__contractId = __contractId;
        this.feeCollector = feeCollector;
        this.feeBasePoints = feeBasePoints;
    }

    buyA(buyer: string, inputB: number) {
        this.__assert(this.assetB.balanceOf(buyer) >= inputB, this.BUYER_INSUFFICIENT_TOKEN_B);

        const contractBalanceB = this.assetB.balanceOf(this.__contractId);
        const contractBalanceA = this.assetA.balanceOf(this.__contractId);
        const {exchangeableAmount, feeAmount} = this.applyFeeToAmount(inputB);
        const changedAmountB = contractBalanceB + exchangeableAmount;
        // Discuss: what strategy is better: ceil, floor, round
        const changedAmountA = contractBalanceA * Math.pow((contractBalanceB / changedAmountB), (this.weightB / this.weightA));
        const outputA =  Math.floor(contractBalanceA - changedAmountA);


        // NOTE: in this asser is strictly >, because if exchange leads us to 0 balance will cause some math errors
        this.__assert(this.assetA.balanceOf(this.__contractId) > outputA, this.CONTRACT_INSUFFICIENT_TOKEN_A);
        this.assetB.transferFrom(buyer, this.__contractId, inputB);
        this.assetA.transferFrom(this.__contractId, buyer, outputA);
        this.assetB.transferFrom(this.__contractId, this.feeCollector, feeAmount);
    }

    buyB(buyer: string, inputA: number) {
        this.__assert(this.assetA.balanceOf(buyer) >= inputA, this.BUYER_INSUFFICIENT_TOKEN_A);

        const contractBalanceA = this.assetA.balanceOf(this.__contractId);
        const contractBalanceB = this.assetB.balanceOf(this.__contractId);
        const {exchangeableAmount, feeAmount} = this.applyFeeToAmount(inputA);
        const changedAmountA = contractBalanceA + exchangeableAmount;
        const changedAmountB = contractBalanceB * Math.pow((contractBalanceA / changedAmountA), (this.weightA / this.weightB));
        const outputB = contractBalanceB - changedAmountB;

        // NOTE: in this asser is strictly >, because if exchange leads us to 0 balance will cause some math errors
        this.__assert(this.assetB.balanceOf(this.__contractId) > outputB, this.CONTRACT_INSUFFICIENT_TOKEN_B);
        this.assetA.transferFrom(buyer, this.__contractId, inputA);
        this.assetB.transferFrom(this.__contractId, buyer, outputB);
        this.assetA.transferFrom(this.__contractId, this.feeCollector, feeAmount);
    }

    applyFeeToAmount(amount: number) {
        const feeAmount = Math.floor(amount * this.feeBasePoints / 10000);
        const exchangeableAmount = Math.floor(amount - feeAmount);
        return {exchangeableAmount, feeAmount};
    }

    __assert(condition: boolean, message: string) {
        if (!condition)
            throw new Error(message);
    }

    CONTRACT_INSUFFICIENT_TOKEN_A = "CONTRACT_INSUFFICIENT_TOKEN_A";
    BUYER_INSUFFICIENT_TOKEN_B = "BUYER_INSUFFICIENT_TOKEN_B";

    CONTRACT_INSUFFICIENT_TOKEN_B = "CONTRACT_INSUFFICIENT_TOKEN_B";
    BUYER_INSUFFICIENT_TOKEN_A = "BUYER_INSUFFICIENT_TOKEN_A";
}