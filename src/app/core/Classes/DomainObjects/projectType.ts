import { Auditable } from "./auditable";
import { RequirementsandGoals } from "./requirementsandGoals";

export class ProjectType extends Auditable {
    typeId: number;
    nameAr: string | null;
    nameEn: string | null;
    typeum: number | null;
    typeCode: number | null;
    requirementsandGoals: RequirementsandGoals[] | null;
}
