import { Auditable } from "./auditable";
import { ProjectArchivesRe } from "./projectArchivesRe";

export class ProjectArchivesSee extends Auditable {
    proArchSeeID: number;
    proArchReID: number | null;
    userId: number | null;
    status: boolean;
    see_TypeID: number | null;
    projectArchivesRe: ProjectArchivesRe | null;
}