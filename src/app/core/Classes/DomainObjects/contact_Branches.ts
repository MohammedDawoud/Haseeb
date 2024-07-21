import { Auditable } from "./auditable";

export class Contact_Branches extends Auditable {
    contactId: number;
    branchName: string | null;
    branchAddress: string | null;
    branchPhone: string | null;
    branchCS: string | null;
    branchEmail: string | null;
}