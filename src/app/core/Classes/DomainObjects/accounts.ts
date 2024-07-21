import { Auditable } from "./auditable";
import { Transactions } from "./transactions";

export class Accounts extends Auditable {
    accountId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    type: number | null;
    nature: number | null;
    parentId: number | null;
    level: number | null;
    currencyId: number | null;
    classification: number | null;
    halala: boolean | null;
    active: boolean | null;
    branchId: number;
    isMain: boolean | null;
    notes: string | null;
    transferedAccId: number | null;
    isMainCustAcc: boolean | null;
    balance: number | null;
    openingBalance: number | null;
    expensesAccId: number | null;
    accountIdAhlak: number | null;
    openAccCredit: number | null;
    openAccDepit: number | null;
    accountCodeNew: string | null;
    publicRev: number | null;
    otherRev: number | null;
    parentAccount: Accounts | null;
    transactions: Transactions[] | null;
    childsAccount: Accounts[] | null;
}
