import { TransactionsVM } from "./transactionsVM";

export class CostCentersVM {
    costCenterId: number;
    code: string | null;
    costCenterName: string | null;
    nameAr: string | null;
    nameEn: string | null;
    parentId: number | null;
    level: number | null;
    branchId: number | null;
    projId: number | null;
    customerId: number | null;
    parentCostCenterCode: any;
    parentCostCenterName: any;
    totalCredit: number | null;
    totalDepit: number | null;
    totalCreditBalance: number | null;
    totalDepitBalance: number | null;
    totalBalance: number | null;
    childCosrCenters: CostCentersVM[];
    transactions: TransactionsVM[];
    costCenterAccsTransactions: TransactionsVM[];
}
