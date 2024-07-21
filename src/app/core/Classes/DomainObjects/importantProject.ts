import { Auditable } from "./auditable";
import { Project } from "./project";

export class ImportantProject extends Auditable {
    importantProId: number;
    projectId: number | null;
    userId: number | null;
    flag: number | null;
    branchId: number | null;
    isImportant: number | null;
    project: Project | null;
}
