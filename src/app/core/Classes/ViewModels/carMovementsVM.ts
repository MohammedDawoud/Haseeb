import { Auditable } from "../DomainObjects/auditable";

export class CarMovementsVM extends Auditable {
    movementId: number;
    itemId: number | null;
    type: number | null;
    empId: number | null;
    branchId: number | null;
    date: string | null;
    endDate: string | null;
    hijriDate: string | null;
    empAmount: number | null;
    ownerAmount: number | null;
    notes: string | null;
    employeeName: string;
    typeName: string | null;
    itemName: string | null;
    isSearch: boolean | null;
    accountId: number | null;
}
