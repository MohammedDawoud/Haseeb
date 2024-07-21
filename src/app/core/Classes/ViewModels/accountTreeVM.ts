export class AccountTreeVM {
    id: string | null;
    parent: string | null;
    text: string | null;
}

export class TasksVM {
    id: string | null;
    parent: string | null;
    text: string | null;
}

export class TrainBalanceVM {
    accountId: number;
    accCode: string | null;
    acc_NameAr: string | null;
    opDipet: string | null;
    opCredit: string | null;
    creditTotal: string | null;
    debitTotal: string | null;
    netCreditTotal: string | null;
    netDebitTotal: string | null;
    accNature: string | null;
    totalDebitEnd: string | null;
    totalCriditEnd: string | null;
    accID: string | null;
    parentID: string | null;
    level: string | null;
}

export class DetailsMonitorVM {
    transactionId: number;
    transactionDate: string | null;
    invoiceId: number;
    type: number;
    accountId: number;
    costCenterId: string | null;
    credit: string | null;
    depit: string | null;
    details: string | null;
    notes: string | null;
    branchid: number;
    typeName: string | null;
    projectNo: string | null;
    customername: string | null;
    servicesName: string | null;
    accountName: string | null;
    branchName: string | null;
    cus_Emp_Sup: number;
    accountCodeNew: string | null;
}

export class CostCenterExpRevVM {
    cashIncome: string | null;
    bankIncome: string | null;
    totalIncome: string | null;
    operationalExpenses: string | null;
    generalExpenses: string | null;
    totalExpenses: string | null;
}

export class IncomeStatmentVM {
    iD: string | null;
    catName: string | null;
    incomePartual: string | null;
    incomeTotal: string | null;
}

export class IncomeStatmentVMWithLevels {
    iD: number;
    accountID: string | null;
    accountCode: string | null;
    accountCodeNew: string | null;
    accountNameCode: string | null;
    accountName: string | null;
    accountLevel: string | null;
    totalResult: (string | null)[];
}

export class GeneralBudgetVM {
    accCode: string | null;
    gBName: string | null;
    gBPartual: string | null;
    gBTotal: string | null;
    gBBalance: string | null;
    acclvl: string | null;
    parid: string | null;
    isfixed: string | null;
}

export class GeneralmanagerRevVM {
    invId: string | null;
    projNum: string | null;
    date: string | null;
    amount: string | null;
    taxes: string | null;
}

export class AccountStatmentVM {
    transID: string | null;
    cDate: string | null;
    hdate: string | null;
    description: string | null;
    debit: string | null;
    credit: string | null;
    costCenter: string | null;
    balance: string | null;
}

export class GetTotalExpRevByCCVM {
    totalExp: string | null;
    totalRev: string | null;
}