export class DetailedRevenuVM {
    customerName: string | null;
    date: string | null;
    invoiceNumber: string | null;
    accountName: string | null;
    notes: string | null;
    project: string | null;
    projectType: string | null;
    payTypeName: string | null;
    totalValue: string | null;
    totalValueDepit: string | null;
    transactionTypeName: string | null;
    taxes: string | null;
    total: string | null;
    diff: string | null;
    transactionId: string | null;
    rad: string | null;
    type: string | null;
    total_TotalValue: string | null;
    total_Taxes: string | null;
    total_Total: string | null;
    customerName_W: string | null;
}

export class ClosingVouchers {
    accountId: number;
    lineNumber: number;
    accountName: string | null;
    creditDepit: string | null;
    costCenterName: string | null;
    costCenterId: number;
    notes: string | null;
    invoiceReference: string | null;
    creditOrDepitType: string | null;
    totalCredit: string | null;
    totalDepit: string | null;
}

export class CostCenterEX_REVM {
    costCenterId: number;
    exDepit: string | null;
    reCredit: string | null;
    eX_RE_Diff: string | null;
    costCenterCode: string | null;
    costCenterName: string | null;
    totalExDepit: string | null;
    totalReCredit: string | null;
    totalEX_RE_Diff: string | null;
    flag: string | null;
}