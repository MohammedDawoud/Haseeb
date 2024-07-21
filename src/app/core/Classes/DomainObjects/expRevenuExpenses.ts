import { Auditable } from "./auditable";
import { Accounts } from "./accounts";
import { CostCenters } from "./costCenters";

export class ExpRevenuExpenses extends Auditable {
    expecteId: number;
    accountId: number;
    toAccountId: number;
    costCenterId: number;
    amount: number;
    notes: string | null;
    type: number;
    isDone: boolean;
    collectionDate: string | null;
    userId: number | null;
    branchId: number | null;
    accounts: Accounts | null;
    toAccounts: Accounts | null;
    costCenters: CostCenters | null;
}
