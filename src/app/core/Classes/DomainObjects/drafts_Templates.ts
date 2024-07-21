import { Auditable } from "./auditable";
import { ProjectType } from "./projectType";

export class Drafts_Templates extends Auditable {
    draftTempleteId: number;
    projectTypeId: number | null;
    name: string | null;
    draftUrl: string | null;
    projectType: ProjectType | null;
}
