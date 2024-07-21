import { Auditable } from "./auditable";
import { WorkOrders } from "./workOrders";
import { ProjectType } from "./projectType";
import { ProjectSubTypes } from "./projectSubTypes";
import { ProjectPhasesTasks } from "./projectPhasesTasks";

export class ProjectRequirements extends Auditable {
    requirementId: number;
    projectTypeId: number | null;
    projectSubTypeId: number | null;
    nameAr: string | null;
    nameEn: string | null;
    branchId: number | null;
    userId: number | null;
    cost: number | null;
    attachmentUrl: string | null;
    phasesTaskID: number | null;
    orderId: number | null;
    notifactionId: number | null;
    pageInsert: number | null;
    workOrders: WorkOrders | null;
    projecttype: ProjectType | null;
    projectsubtype: ProjectSubTypes | null;
    projectPhasesTasks: ProjectPhasesTasks | null;
}
