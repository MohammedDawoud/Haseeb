import { Auditable } from "./auditable";
import { Banks } from "./banks";

export class Checks extends Auditable {
    checkId: number;
    checkNumber: string | null;
    amount: number | null;
    date: string | null;
    hijriDate: string | null;
    bankId: number | null;
    beneficiaryName: string | null;
    userId: number | null;
    branchId: number | null;
    actionDate: string | null;
    invoiceId: number | null;
    totalAmont: number | null;
    type: number;
    isFinished: boolean;
    receivedName: string | null;
    notes: string | null;
    banks: Banks | null;
}