import { Auditable } from "./auditable";

export class FiscalYears extends Auditable {
    fiscalId: number;
    yearId: number | null;
    yearName: string | null;
    branchId: number | null;
    userId: number | null;
    isActive: boolean | null;
}