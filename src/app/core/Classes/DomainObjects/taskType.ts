import { Auditable } from "./auditable";

export class TaskType extends Auditable {
    taskTypeId: number;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
    branchId: number | null;
}