import { Auditable } from "../DomainObjects/auditable";

export class GroupPrivilegesVM extends Auditable {
    groupPrivId: number;
    groupId: number | null;
    privilegeId: number | null;
    branchId: number | null;
}