import { Auditable } from "./auditable";

export class TasksDependency extends Auditable {
    dependencyId: number;
    predecessorId: number | null;
    successorId: number | null;
    projSubTypeId: number | null;
    type: number | null;
    projectId: number | null;
    branchId: number | null;
}