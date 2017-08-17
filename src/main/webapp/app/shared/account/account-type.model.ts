export enum AccountType {
    Default,
    Bank,
    Loan,
    'Credit card'
}

export namespace AccountTypeToRoute {
    export function getValue(accountType: string): string {
        switch (accountType) {
            case AccountType[AccountType.Default]:
                return 'add-default';
            case AccountType[AccountType.Bank]:
                return 'add-bank';
            case AccountType[AccountType.Loan]:
                return 'add-loan';
        }
    }
}
