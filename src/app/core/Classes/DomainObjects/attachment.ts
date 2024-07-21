import { Auditable } from "./auditable";

export class Attachment extends Auditable {
    attachmentId: number;
    attachmentName: string | null;
    date: string | null;
    hijriDate: string | null;
    attachmentUrl: string | null;
    notes: string | null;
    employeeId: number | null;
}