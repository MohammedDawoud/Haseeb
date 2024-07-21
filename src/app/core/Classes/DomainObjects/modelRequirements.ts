import { Auditable } from "./auditable";
import { Requirements } from "./requirements";

export class ModelRequirements extends Auditable {
    modelReqId: number;
    requirementId: number | null;
    modelId: number | null;
    branchId: number | null;
    requirements: Requirements | null;
}
