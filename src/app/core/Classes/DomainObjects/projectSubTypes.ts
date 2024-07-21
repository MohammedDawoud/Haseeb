import { Auditable } from "./auditable";
import { ProjectType } from "./projectType";

export class ProjectSubTypes extends Auditable {
    subTypeId: number;
    projectTypeId: number;
    nameAr: string | null;
    nameEn: string | null;
    branchId: number| null;
    timePeriod: string | null;
    projectType: ProjectType | null;
}
