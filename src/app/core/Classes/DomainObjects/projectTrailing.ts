import { Auditable } from "./auditable";
import { Project } from "./project";
import { Department } from "./department";
import { TrailingFiles } from "./trailingFiles";

export class ProjectTrailing extends Auditable {
    trailingId: number;
    projectId: number | null;
    departmentId: number | null;
    date: string | null;
    hijriDate: string | null;
    active: boolean;
    status: number | null;
    typeId: number | null;
    userId: number | null;
    receiveDate: string | null;
    receiveHijriDate: string | null;
    receiveUserId: number | null;
    notes: string | null;
    taskId: number | null;
    branchId: number | null;
    project: Project | null;
    department: Department | null;
    trailingFiles: TrailingFiles[] | null;
}
