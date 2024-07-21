import { Auditable } from "./auditable";
import { Transactions } from "./transactions";

export class CostCenters extends Auditable {
    costCenterId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    parentId: number | null;
    level: number | null;
    branchId: number | null;
    projId: number | null;
    customerId: number | null;
    parentCostCenter: CostCenters | null;
    transactions: Transactions[] | null;
    childsCostCenter: CostCenters[] | null;
}
