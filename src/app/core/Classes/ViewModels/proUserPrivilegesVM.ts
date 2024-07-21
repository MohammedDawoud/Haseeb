import { Users } from "../DomainObjects/users";
import { Project } from "../DomainObjects/project";

export class ProUserPrivilegesVM {
    userPrivId: number;
    privilegeId: number | null;
    projectID: number | null;
    projectno: string | null;
    userId: number | null;
    fullName: string | null;
    select: boolean | null;
    insert: boolean | null;
    update: boolean | null;
    delete: boolean | null;
    customerID: number | null;
    mangerId: number | null;
    users: Users;
    project: Project;
}
