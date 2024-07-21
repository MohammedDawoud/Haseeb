import { Auditable } from "./auditable";
import { ProjectType } from "./projectType";
import { DraftDetails } from "./draftDetails";

export class Draft extends Auditable {
    draftId: number;
    projectTypeId: number | null;
    name: string | null;
    draftUrl: string | null;
    projectType: ProjectType | null;
    draftDetails: DraftDetails[] | null;
}
