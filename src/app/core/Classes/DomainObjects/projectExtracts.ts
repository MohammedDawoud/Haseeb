import { Auditable } from "./auditable";

export class ProjectExtracts extends Auditable {
    extractId: number;
    extractNo: string | null;
    type: string | null;
    value: number | null;
    dateFrom: string | null;
    dateTo: string | null;
    status: number | null;
    projectId: number | null;
    valueText: string | null;
    isDoneBefore: boolean;
    isDoneAfter: boolean;
    attachmentUrl: string | null;
    signatureUrl: string | null;
}