import { Auditable } from "./auditable";
import { Users } from "./users";
import { Branch } from "./branch";

export class Sys_SystemActions extends Auditable {
    sysID: number;
    functionName: string | null;
    serviceName: string | null;
    actionType: number | null;
    messageName: string | null;
    moduleName: string | null;
    pageName: string | null;
    actionDate: string | null;
    userId: number | null;
    branchId: number | null;
    note: string | null;
    success: number | null;
    users: Users | null;
    branches: Branch | null;
}
