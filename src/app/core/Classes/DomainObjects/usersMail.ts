import { Auditable } from "./auditable";
import { Users } from "./users";

export class UserMails extends Auditable {
    mailId: number;
    userId: number;
    senderUserId: number;
    mailText: string | null;
    mailSubject: string | null;
    date: string | null;
    hijriDate: string | null;
    allUsers: boolean;
    branchId: number;
    isRead: boolean;
    sendUsers: Users | null;
    users: Users | null;
}
