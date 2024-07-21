import { Auditable } from "./auditable";
import { EmpContract } from "./empContract";

export class EmpContractDetail extends Auditable {
    contractDetailId: number;
    contractId: number | null;
    serialId: number | null;
    clause: string | null;
    empContracts: EmpContract | null;
}