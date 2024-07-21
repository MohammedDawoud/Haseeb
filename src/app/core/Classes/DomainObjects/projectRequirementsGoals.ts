import { Auditable } from "./auditable";
import { Project } from "./project";
import { RequirementsandGoals } from "./requirementsandGoals";

export class ProjectRequirementsGoals extends Auditable {
    requirementGoalId: number;
    projectId: number | null;
    requirementId: number | null;
    project: Project | null;
    requirementsandGoals: RequirementsandGoals | null;
}
