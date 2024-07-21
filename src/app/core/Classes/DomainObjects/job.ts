import { Auditable } from "./auditable";

export class Job extends Auditable {
    jobId: number;
    jobCode: string | null;
    jobNameAr: string | null;
    jobNameEn: string | null;
    notes: string | null;
}