import { TransactionsVM } from "./transactionsVM";

export class JournalsVM {
    journalId: number;
    journalNo: number | null;
    voucherId: number | null;
    voucherType: number | null;
    branchId: number | null;
    userId: number | null;
    date: string | null;
    voucherNo: number | null;
    voucherTypeName: string | null;
    accountCode: string | null;
    accountName: string | null;
    notes: string | null;
    depit: number | null;
    credit: number | null;
    referenceNo: string | null;
    transactions: TransactionsVM[] | null;
}
