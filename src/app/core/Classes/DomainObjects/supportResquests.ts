import { Auditable } from "./auditable";

export class SupportResquests extends Auditable {
    requestId: number;
    type: number;
    address: string | null;
    topic: string | null;
    date: string | null;
    userId: number;
    organizationId: number;
    attachmentUrl: string | null;
    branchId: number;
    department: string | null;
    priority: string | null;
}