import { Auditable } from "./auditable";
import { Pro_SuperContractor } from "./pro_SuperContractor";
import { City } from "./city";
import { Customer } from "./customer";
import { ProjectType } from "./projectType";
import { ProjectSubTypes } from "./projectSubTypes";
import { Users } from "./users";
import { TransactionTypes } from "./transactionTypes";
import { RegionTypes } from "./regionTypes";
import { ProjectPieces } from "./projectPieces";
import { Contracts } from "./contracts";
import { OffersPrices } from "./offersPrices";
import { Pro_Municipal } from "./pro_Municipal";
import { Pro_SubMunicipality } from "./pro_SubMunicipality";
import { WorkOrders } from "./workOrders";
import { Invoices } from "./invoices";
import { CostCenters } from "./costCenters";
import { ProjectFiles } from "./projectFiles";
import { ProjectPhasesTasks } from "./projectPhasesTasks";
import { ProjectWorkers } from "./projectWorkers";
import { ProUserPrivileges } from "./proUserPrivileges";
import { DraftDetails } from "./draftDetails";
import { Instruments } from "./instruments";
import { ProjectRequirementsGoals } from "./projectRequirementsGoals";
import { ImportantProject } from "./importantProject";
import { pro_projectsReasons } from "./pro_projectsReasons";

export class Project extends Auditable {
    projectId: number;
    customerId: number | null;
    parentProjectId: number | null;
    mangerId: number | null;
    transactionTypeId: number | null;
    projectDate: string | null;
    projectHijriDate: string | null;
    projectExpireDate: string | null;
    projectExpireHijriDate: string | null;
    siteName: string | null;
    projectTypeId: number | null;
    subProjectTypeId: number | null;
    activeMainPhaseId: number | null;
    activeSubPhaseId: number | null;
    orderType: string | null;
    sketchName: string | null;
    sketchNo: string | null;
    pieceNo: number | null;
    adwAR: number | null;
    status: number | null;
    orderNo: string | null;
    outBoxNo: string | null;
    outBoxDate: string | null;
    outBoxHijriDate: string | null;
    reason1: string | null;
    notes1: string | null;
    subject: string | null;
    xPoint: string | null;
    yPoint: string | null;
    technical: string | null;
    prosedor: string | null;
    reasonRevers: string | null;
    engNotes: string | null;
    reverseDate: string | null;
    reverseHijriDate: string | null;
    orderStatus: number | null;
    userId: number | null;
    receipt: number | null;
    payStatus: boolean | null;
    regionName: string | null;
    districtName: string | null;
    siteType: string | null;
    contractId: number | null;
    contractDate: string | null;
    contractHijriDate: string | null;
    contractSource: string | null;
    siteNo: string | null;
    payanNo: string | null;
    jehaId: number | null;
    zaraaSak: string | null;
    zaraaNatural: string | null;
    bordersSak: string | null;
    bordersNatural: string | null;
    ertedad: string | null;
    brooz: string | null;
    areaSak: string | null;
    areaNatural: string | null;
    areaArrange: string | null;
    buildingType: number | null;
    buildingPercent: string | null;
    spaceName: string | null;
    office: string | null;
    usage: string | null;
    docpath: string | null;
    regionTypeId: number | null;
    elevators: string | null;
    typ1: string | null;
    brozat: string | null;
    entries: string | null;
    basement: string | null;
    groundFloor: string | null;
    firstFloor: string | null;
    motkrr: string | null;
    firstExtension: string | null;
    extensionName: string | null;
    generalLocation: string | null;
    licenseNo: string | null;
    licensedate: string | null;
    licenseHijridate: string | null;
    desiningOffice: string | null;
    estsharyformoslhat: number | null;
    consultantfinishing: number | null;
    period: string | null;
    punshmentamount: number | null;
    firstPay: number | null;
    licenseContent: string | null;
    otherStatus: number | null;
    areaSpace: string | null;
    contractorName: string | null;
    contractorMobile: string | null;
    supervisionSatartDate: string | null;
    supervisionSatartHijriDate: string | null;
    supervisionEndDate: string | null;
    supervisionEndHijriDate: string | null;
    supervisionNo: string | null;
    supervisionNotes: string | null;
    qaboqwaedmostlm: string | null;
    qaboreqabmostlm: string | null;
    qabosaqfmostlm: string | null;
    molhqalwisaqffash: string | null;
    molhqalwisaqfdate: string | null;
    molhqalwisaqfHijridate: string | null;
    molhqalwisaqfmostlm: string | null;
    molhqardisaqffash: string | null;
    molhqardisaqfdate: string | null;
    molhqardisaqfHijridate: string | null;
    molhqardisaqfmostlm: string | null;
    finalOrder: number | null;
    spaceBuild: string | null;
    floorEstablishing: string | null;
    roof: string | null;
    electric: string | null;
    takeef: string | null;
    projectNo: string | null;
    limitDate: string | null;
    limitHijriDate: string | null;
    limitDays: number | null;
    noteDate: string | null;
    noteHijriDate: string | null;
    responseEng: string | null;
    reseveStatus: number | null;
    kaeedno: string | null;
    technicalDemands: string | null;
    todoaction: string | null;
    responsible: string | null;
    externalEmpId: number | null;
    finishDate: string | null;
    finishHijriDate: string | null;
    contractPeriod: number | null;
    spaceNotes: string | null;
    contractNotes: string | null;
    spaceId: number | null;
    cityId: number | null;
    projectDescription: string | null;
    paied: number | null;
    discount: number | null;
    fees: number | null;
    projectTypeName: string | null;
    projectRegionName: string | null;
    catego: string | null;
    contractPeriodType: string | null;
    contractPeriodMinites: number | null;
    projectName: string | null;
    projectValue: number | null;
    projectContractTawk: string | null;
    projectRecieveLoaction: string | null;
    projectObserveName: string | null;
    projectObserveMobile: string | null;
    projectObserveMail: string | null;
    projectTaslemFirst: string | null;
    fDamanID: number | null;
    lDamanID: number | null;
    nesbaEngaz: number | null;
    takeem: string | null;
    projectContractTawkCh: boolean | null;
    projectRecieveLoactionCh: boolean | null;
    projectTaslemFirstCh: boolean | null;
    contractCh: boolean | null;
    periodProject: number | null;
    agentDate: string | null;
    agentHijriDate: string | null;
    streetName: string | null;
    mainText: string | null;
    branchText: string | null;
    taskText: string | null;
    branchId: number;
    noOfDays: number | null;
    reasonID: number | null;
    reasonText: string | null;
    dateOfFinish: string | null;
    firstProjectDate: string | null;
    firstProjectExpireDate: string | null;
    projectNoType: number | null;
    stopProjectType: number | null;
    co_opOfficeName: string | null;
    co_opOfficeEmail: string | null;
    co_opOfficePhone: string | null;
    contractorSelectId: number | null;
    costCenterId: number | null;
    municipalId: number | null;
    subMunicipalityId: number | null;
    proBuildingDisc: string | null;
    percentComplete: number | null;
    isNotSent: boolean;
    offersPricesId: number | null;
    departmentId: number | null;
    motionProject: number | null;
    motionProjectDate: string | null;
    motionProjectNote: string | null;
    cons_components: string | null;
    plustimecount: number | null;
    skipCount: number | null;
    stopProjectDate: string | null;
    reasonsId: number | null;
    contractor: Pro_SuperContractor | null;
    city: City | null;
    customer: Customer | null;
    projecttype: ProjectType | null;
    projectsubtype: ProjectSubTypes | null;
    users: Users | null;
    addUsers: Users | null;
    updateUsers: Users | null;
    transactionTypes: TransactionTypes | null;
    regionTypes: RegionTypes | null;
    projectPieces: ProjectPieces | null;
    contracts: Contracts | null;
    offersPrices: OffersPrices | null;
    municipal: Pro_Municipal | null;
    subMunicipality: Pro_SubMunicipality | null;
    projectsReasons: pro_projectsReasons | null;
    projectPhasesTasks: ProjectPhasesTasks[] | null;
    workOrders: WorkOrders[] | null;
    invoices: Invoices[] | null;
    costcenter: CostCenters | null;
    projectFiles: ProjectFiles[] | null;
    activeMainPhase: ProjectPhasesTasks | null;
    activeSubPhase: ProjectPhasesTasks | null;
    projectWorkers: ProjectWorkers[] | null;
    proUserPrivileges: ProUserPrivileges[] | null;
    draftDetails: DraftDetails[] | null;
    instrumentsList: Instruments[] | null;
    projectRequirementsGoals: ProjectRequirementsGoals[] | null;
    importantProjects: ImportantProject[] | null;
}
