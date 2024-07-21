import { Auditable } from "./auditable";
import { Users } from "./users";
import { FileType } from "./fileType";

export class Model extends Auditable {
    modelId: number;
    modelName: string | null;
    date: string | null;
    hijriDate: string | null;
    notes: string | null;
    userId: number | null;
    fileUrl: string | null;
    typeId: number | null;
    extension: string | null;
    branchId: number;
    users: Users | null;
    fileType: FileType | null;
    modelRequirementsIds: number[] | null;
}
