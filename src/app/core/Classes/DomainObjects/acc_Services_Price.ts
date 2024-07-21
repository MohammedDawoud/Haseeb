import { Auditable } from "./auditable";
import { Acc_Packages } from "./acc_Packages";
import { Accounts } from "./accounts";
import { ProjectType } from "./projectType";
import { ProjectSubTypes } from "./projectSubTypes";
import { OfferService } from "./offerService";
import { ContractServices } from "./contractServices";

export class Acc_Services_Price extends Auditable {
    servicesId: number;
    servicesName: string | null;
    amount: number | null;
    accountName: string | null;
    accountId: number | null;
    projectId: number | null;
    projectSubTypeID: number | null;
    parentId: number | null;
    costCenterId: number | null;
    packageId: number | null;
    serviceName_EN: string | null;
    serviceType: number | null;
    package: Acc_Packages | null;
    accountParentId: Accounts | null;
    projectParentId: ProjectType | null;
    projectSubTypes: ProjectSubTypes | null;
    parent: Acc_Services_Price | null;
    offerService: OfferService[] | null;
    contractServices: ContractServices[] | null;
}
