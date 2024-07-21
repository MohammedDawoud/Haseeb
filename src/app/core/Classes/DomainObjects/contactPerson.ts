import { Auditable } from "./auditable";
import { Project } from "./project";

export class ContactPerson extends Auditable {
    personId: number;
    personCode: string | null;
    personName: string | null;
    mobile: string | null;
    email: string | null;
    imageUrl: string | null;
    projectId: number;
    project: Project | null;
}
