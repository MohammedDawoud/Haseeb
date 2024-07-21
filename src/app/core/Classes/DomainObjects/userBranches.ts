import { Auditable } from "./auditable";
import { Branch } from "./branch";

export class UserBranches extends Auditable {
    userBranchId: number;
    userId: number;
    branchId: number;
    branches: Branch | null;
}
