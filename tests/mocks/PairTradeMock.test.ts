import {describe, beforeEach, it} from "mocha";
import {expect} from "chai";
import PairTradeMock from "../../src/PairTradeMock";
import AssetMock from "../../src/AssetMock";


describe("PairTradeMock", function () {
    beforeEach(function () {
        this.assetA = new AssetMock("A");
        this.assetB = new AssetMock("B");
        this.weightA = 2;
        this.weightB = 1;
        this.feeBasePoints = 30;
        this.contractId = "9MQZj7L2D8TnuWy5VJhdNrkjsArrvsie9ERdi1TWbqNS";
        this.feeCollector = "CgqRPcPnexY533gCh2SSvBXh5bca1qMs7KFGntawHGww";
        this.contract = new PairTradeMock(this.assetA, this.assetB, this.weightA, this.weightB, this.contractId, this.feeBasePoints, this.feeCollector);

        this.inputB = 10000;
    });

    describe("buyA test coverage", function () {
        beforeEach(function () {
            this.buyer = "3NxEmrzgH45ri9XRJ3a9qDbGvHgn7PBNNGN";
            this.amountB = 100000;
            this.assetB.mint(this.buyer, this.amountB);

            this.assetAmount = 10000000000;
            this.assetB.mint(this.contractId, this.assetAmount);
            this.assetA.mint(this.contractId, this.assetAmount);
        });

        it("should properly calculate exchangeable amount", function () {
            const inputB = 10000;
            const expectedExchangeableAmount = inputB * (10000 - this.feeBasePoints) / 10000;
            const actualExchangeableAmount = this.contract.applyFeeToAmount(inputB).exchangeableAmount;
            expect(expectedExchangeableAmount).to.be.eq(actualExchangeableAmount);
        });

        it("should properly calculate fee", function () {
            const inputB = 10000;
            const expectedFee = inputB * this.feeBasePoints / 10000;
            const actualFee = this.contract.applyFeeToAmount(inputB).feeAmount;
            expect(expectedFee).to.be.eq(actualFee);
        });

        it("should successfully perform trade", function () {
            const {exchangeableAmount, feeAmount} = this.contract.applyFeeToAmount(this.inputB);
            const changedBAmount = this.assetAmount + exchangeableAmount;
            const outputA = Math.floor(this.assetAmount * (1 - (this.assetAmount / changedBAmount) ** (this.weightB / this.weightA)));

            this.contract.buyA(this.buyer, this.inputB);

            expect(this.assetA.balanceOf(this.buyer)).to.be.eq(outputA);
            expect(this.assetB.balanceOf(this.feeCollector)).to.be.eq(feeAmount);
        });

        it("should decrease traded asset contract's balance", function () {
            const changedBAmount = this.assetAmount + this.contract.applyFeeToAmount(this.inputB).exchangeableAmount;
            const outputA = Math.floor(this.assetAmount * (1 - (this.assetAmount / changedBAmount) ** (this.weightB / this.weightA)));

            this.contract.buyA(this.buyer, this.inputB);

            expect(this.assetA.balanceOf(this.contractId)).to.be.eq(this.assetAmount - outputA);
        });

        it("should increase supplied asset contract's balance", function () {
            const changedBAmount = this.assetAmount + this.contract.applyFeeToAmount(this.inputB).exchangeableAmount;

            this.contract.buyA(this.buyer, this.inputB);

            expect(this.assetB.balanceOf(this.contractId)).to.be.eq(changedBAmount);
        });

    });
});