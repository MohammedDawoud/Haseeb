import { Auditable } from "../DomainObjects/auditable";
import { Accounts } from "../DomainObjects/accounts";

export class GuaranteesVM extends Auditable {
    guaranteeId: number;
    number: string | null;
    bankName: string | null;
    value: number | null;
    projectName: string | null;
    type: number | null;
    percentage: number | null;
    customerName: string | null;
    guarantorAccId: number | null;
    projectId: number | null;
    customerId: number | null;
    period: number | null;
    typeName: string | null;
    statusName: string | null;
    startDate: string | null;
    endDate: string | null;
    isReturned: boolean;
    returnReason: string | null;
    invoiceId: number | null;
    accounts: Accounts | null;
}
