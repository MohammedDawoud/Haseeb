import { Auditable } from "./auditable";
import { Users } from "./users";

export class TimeOutRequests extends Auditable {
    requestId: number;
    address: string | null;
    duration: number | null;
    reason: string | null;
    attachmentUrl: string | null;
    userId: number | null;
    actionUserId: number | null;
    status: number | null;
    taskId: number | null;
    comment: string | null;
    branchId: number;
    users: Users | null;
}
