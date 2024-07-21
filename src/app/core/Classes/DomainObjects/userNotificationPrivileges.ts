import { Auditable } from "./auditable";
import { Users } from "./users";

export class UserNotificationPrivileges extends Auditable {
    userPrivId: number;
    privilegeId: number | null;
    userId: number | null;
    select: boolean | null;
    insert: boolean | null;
    update: boolean | null;
    delete: boolean | null;
    users: Users | null;
}
