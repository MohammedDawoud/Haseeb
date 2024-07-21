import { Auditable } from "./auditable";
import { Users } from "./users";
import { Project } from "./project";

export class ProUserPrivileges extends Auditable {
    userPrivId: number;
    privilegeId: number | null;
    projectID: number | null;
    projectno: string | null;
    userId: number | null;
    select: boolean | null;
    insert: boolean | null;
    update: boolean | null;
    delete: boolean | null;
    customerID: number | null;
    users: Users | null;
    projects: Project | null;
}
