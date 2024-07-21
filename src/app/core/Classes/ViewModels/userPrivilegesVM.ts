import { Users } from "../DomainObjects/users";

export class UserPrivilegesVM {
    userPrivId: number;
    privilegeId: number | null;
    userId: number | null;
    select: boolean | null;
    insert: boolean | null;
    update: boolean | null;
    delete: boolean | null;
    users: Users;
    fullname: string | null;
    fullName: string | null;
}
