import { Auditable } from "../DomainObjects/auditable";

export class ProjectArchivesSeeVM extends Auditable {
    proArchSeeID: number;
    proArchReID: number | null;
    userId: number | null;
    status: boolean | null;
    see_TypeID: number | null;
}