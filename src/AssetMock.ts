export default class AssetMock {
    balances: object
    name: string

    constructor(name: string) {
        this.balances = {};
        this.name = name;
    }

    mint(to: string, amount: number) {
        if (this.balances[to] === undefined) {
            this.balances[to] = amount;
        } else {
            this.balances[to] += amount;
        }
    }

    transferFrom(from: string, to: string, amount: number) {
        if (this.balances[from] === undefined)
            throw new Error("No balance exists for this user")
        if (this.balances[from] < amount)
            throw new Error("No sufficient balance")
        if (this.balances[to] === undefined) {
            this.balances[to] = amount;
        } else {
            this.balances[to] += amount;
        }
        this.balances[from] -= amount;
    }

    balanceOf(user: string) {
        if (this.balances[user] === undefined) {
            return 0;
        }
        return this.balances[user];
    }
}