import { Auditable } from "./auditable";
import { Contracts } from "./contracts";

export class ContractDetails extends Auditable {
    contractDetailId: number;
    contractId: number | null;
    serialId: number | null;
    clause: string | null;
    contracts: Contracts | null;
}
