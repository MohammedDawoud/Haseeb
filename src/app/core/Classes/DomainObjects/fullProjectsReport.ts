import { Auditable } from "./auditable";
import { Project } from "./project";
import { ProjectPhasesTasks } from "./projectPhasesTasks";

export class FullProjectsReport extends Auditable {
    reportId: number;
    type: number | null;
    projectId: number | null;
    phaseTaskId: number | null;
    revenue: number | null;
    expenses: number | null;
    projectpercentage: number | null;
    taskpercentage: number | null;
    date: string | null;
    time: number | null;
    project: Project | null;
    projectPhasesTasks: ProjectPhasesTasks | null;
}
