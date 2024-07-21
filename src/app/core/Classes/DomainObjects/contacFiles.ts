import { Auditable } from "./auditable";
import { OutInBox } from "./outInBox";
import { Users } from "./users";

export class ContacFiles extends Auditable {
    fileId: number;
    fileName: string | null;
    fileUrl: string | null;
    fileSize: number;
    extension: string | null;
    outInBoxId: number | null;
    notes: string | null;
    isCertified: boolean;
    userId: number | null;
    uploadDate: string | null;
    deleteUrl: string | null;
    thumbnailUrl: string | null;
    deleteType: string | null;
    branchId: number | null;
    outInBox: OutInBox | null;
    users: Users | null;
}
