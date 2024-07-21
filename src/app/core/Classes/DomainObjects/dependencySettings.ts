import { Auditable } from "./auditable";

export class DependencySettings extends Auditable {
    dependencyId: number;
    predecessorId: number | null;
    successorId: number | null;
    type: number | null;
    projSubTypeId: number | null;
    branchId: number | null;
}