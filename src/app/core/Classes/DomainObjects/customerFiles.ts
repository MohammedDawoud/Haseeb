import { Auditable } from "./auditable";
import { FileType } from "./fileType";
import { Users } from "./users";

export class CustomerFiles extends Auditable {
    fileId: number;
    fileName: string | null;
    description: string | null;
    extenstion: string | null;
    originalFileName: string | null;
    uploadDate: string | null;
    customerId: number | null;
    userId: number | null;
    fileUrl: string | null;
    typeId: number | null;
    fileType: FileType | null;
    users: Users | null;
}
