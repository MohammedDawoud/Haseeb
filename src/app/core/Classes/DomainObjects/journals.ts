import { Auditable } from "./auditable";
import { Invoices } from "./invoices";

export class Journals extends Auditable {
    journalId: number;
    journalNo: number;
    voucherId: number;
    voucherType: number;
    branchId: number;
    yearMalia: number;
    userId: number;
    invoice: Invoices | null;
}
