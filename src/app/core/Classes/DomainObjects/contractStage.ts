import { Auditable } from "./auditable";
import { Contracts } from "./contracts";

export class ContractStage extends Auditable {
    contractStageId: number;
    stage: string | null;
    stageDescreption: string | null;
    stagestartdate: string | null;
    stageenddate: string | null;
    contractId: number | null;
    contracts: Contracts | null;
}
