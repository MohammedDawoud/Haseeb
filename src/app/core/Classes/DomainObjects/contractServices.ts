import { Auditable } from "./auditable";
import { Contracts } from "./contracts";
import { Acc_Services_Price } from "./acc_Services_Price";

export class ContractServices extends Auditable {
    contractServicesId: number;
    contractId: number | null;
    serviceId: number | null;
    serviceQty: number | null;
    serviceoffertxt: string | null;
    branchId: number | null;
    taxType: number | null;
    serviceamountval: number | null;
    contracts: Contracts | null;
    serviceprice: Acc_Services_Price | null;
}
