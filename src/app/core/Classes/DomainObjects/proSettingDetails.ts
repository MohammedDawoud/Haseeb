import { Auditable } from "./auditable";
import { Users } from "./users";
import { ProjectType } from "./projectType";
import { ProjectSubTypes } from "./projectSubTypes";


export class ProSettingDetails extends Auditable {
    proSettingId: number;
    proSettingNo: string | null;
    proSettingNote: string | null;
    projectTypeId: number | null;
    projectSubtypeId: number | null;
    users: Users | null;
    projectType: ProjectType | null;
    projectSubTypes: ProjectSubTypes | null;
}
