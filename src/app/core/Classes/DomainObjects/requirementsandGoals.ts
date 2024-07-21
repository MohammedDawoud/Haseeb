import { Auditable } from "./auditable";
import { ProjectType } from "./projectType";
import { Project } from "./project";
import { Employees } from "./employees";
import { Department } from "./department";

export class RequirementsandGoals extends Auditable {
    requirementId: number;
    requirmentName: string | null;
    employeeId: number | null;
    departmentId: number | null;
    projectTypeId: number | null;
    projectId: number | null;
    lineNumber: number | null;
    timeNo: string | null;
    timeType: string | null;
    projectType: ProjectType | null;
    project: Project | null;
    employees: Employees | null;
    department: Department | null;
}
