import { Auditable } from "./auditable";
import { Project } from "./project";
import { Employees } from "./employees";

export class FollowProj extends Auditable {
    followProjId: number;
    projectId: number | null;
    empId: number | null;
    timeNo: string | null;
    timeType: string | null;
    empRate: string | null;
    amount: number | null;
    expectedCost: number | null;
    confirmRate: boolean | null;
    project: Project | null;
    employees: Employees | null;
}
