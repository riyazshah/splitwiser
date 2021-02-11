export class Transaction {

    readonly description: string;
    readonly totalAmount: number;
    readonly date: string;
    readonly riyazPays: number;
    readonly xioPays: number;
    readonly isAbsoluteAmounts: boolean;

    constructor(transactionBuilder: TransactionBuilder) {
        this.description = transactionBuilder.description;
        this.totalAmount = transactionBuilder.totalAmount;
        this.date = new Date(transactionBuilder.date).toISOString();
        this.riyazPays = transactionBuilder.riyazPays;
        this.xioPays = transactionBuilder.xioPays;
        this.isAbsoluteAmounts = transactionBuilder.isAbsoluteAmounts;
    }
}

export class TransactionBuilder {
    description: string;
    totalAmount: number;
    date: string;
    riyazPays: number;
    xioPays: number;
    isAbsoluteAmounts: boolean;

    constructor(){}

    withDescription(description: string) {
        this.description = description;
        return this;
    }

    withTotalAmount(amount: number) {
        this.totalAmount = amount;
        return this;
    }

    withDate(date: string) {
        this.date = date;
        return this;
    }

    withRiyazPays(amount: number) {
        this.riyazPays = amount;
        return this;
    }

    withXioPays(amount: number) {
        this.xioPays = amount;
        return this;
    }

    withIsAbsoluteAmounts(isAbsoluteAmount: boolean) {
        this.isAbsoluteAmounts = isAbsoluteAmount;
        return this;
    }

    build() {
        return new Transaction(this);
    }
}