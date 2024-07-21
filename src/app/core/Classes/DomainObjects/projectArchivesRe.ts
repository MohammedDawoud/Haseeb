import { Auditable } from "./auditable";
import { Project } from "./project";
import { ProjectPhasesTasks } from "./projectPhasesTasks";

export class ProjectArchivesRe extends Auditable {
    proArchReID: number;
    projectId: number | null;
    reDate: string | null;
    re_TypeID: number | null;
    re_TypeName: string | null;
    re_PhasesTaskId: number | null;
    project: Project | null;
    phases: ProjectPhasesTasks | null;
}
