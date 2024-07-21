import { Auditable } from "./auditable";
import { Users } from "./users";

export class ChattingLog extends Auditable {
    logId: number;
    userId: number | null;
    body: string | null;
    receivedUserId: number | null;
    status: string | null;
    date: string | null;
    hijriDate: string | null;
    senderUser: Users | null;
    receiveUsers: Users | null;
}
