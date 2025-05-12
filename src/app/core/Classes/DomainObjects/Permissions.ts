import { Auditable } from "./auditable";
import { Employees } from "./employees";
import { PermissionType } from "./PermissionType";
import { Users } from "./users";

export class Permissions extends Auditable {
    PermissionId: number;
    EmpId: number | null;
    TypeId: number | null;
    Date: string | null;
    Reason: string | null;
   
    Status: number | null;
    userId: number | null;
    branchId: number;
    acceptedDate: string | null;
    PermissionHours: number | null;
    decisionType: number | null;
    acceptedUser: number | null;
    permissionType: PermissionType | null;
    
    employee: Employees | null;
    userAcccept: Users | null;
    fileUrl: string | null;
    fileName: string | null;
}
