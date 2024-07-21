import { Auditable } from "./auditable";
import { Employees } from "./employees";
import { Item } from "./item";
import { CarMovementsType } from "./carMovementsType";

export class CarMovements extends Auditable {
    movementId: number;
    itemId: number | null;
    type: number | null;
    empId: number | null;
    branchId: number | null;
    date: string | null;
    hijriDate: string | null;
    empAmount: number | null;
    ownerAmount: number | null;
    notes: string | null;
    accountId: number | null;
    employees: Employees | null;
    item: Item | null;
    types: CarMovementsType | null;
}
