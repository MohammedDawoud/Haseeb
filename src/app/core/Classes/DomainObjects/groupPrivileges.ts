import { Auditable } from "./auditable";

export class GroupPrivileges extends Auditable {
    groupPrivId: number;
    groupId: number | null;
    privilegeId: number | null;
    branchId: number | null;
}
