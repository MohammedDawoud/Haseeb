import { Auditable } from "./auditable";
import { Item } from "./item";
import { Employees } from "./employees";
import { Invoices } from "./invoices";

export class Custody extends Auditable {
    custodyId: number;
    employeeId: number | null;
    itemId: number | null;
    date: string | null;
    hijriDate: string | null;
    quantity: number | null;
    type: number | null;
    branchId: number | null;
    status: boolean | null;
    custodyValue: number | null;
    convertStatus: boolean | null;
    invoiceId: number | null;
    item: Item | null;
    employee: Employees | null;
    invoices: Invoices | null;
}
