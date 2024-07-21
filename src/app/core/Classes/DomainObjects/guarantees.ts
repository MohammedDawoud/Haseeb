import { Auditable } from "./auditable";
import { Accounts } from "./accounts";

export class Guarantees extends Auditable {
    guaranteeId: number;
    number: string | null;
    bankName: string | null;
    value: number;
    projectName: string | null;
    type: number;
    percentage: number;
    customerName: string | null;
    guarantorAccId: number;
    projectId: number | null;
    customerId: number | null;
    period: number;
    startDate: string | null;
    endDate: string | null;
    isReturned: boolean;
    returnReason: string | null;
    invoiceId: number | null;
    branchId: number;
    accounts: Accounts | null;
    startDateStr: string | null;
}
