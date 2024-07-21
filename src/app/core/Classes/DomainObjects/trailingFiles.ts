import { Auditable } from "./auditable";

export class TrailingFiles extends Auditable {
    fileId: number;
    fileName: string | null;
    fileUrl: string | null;
    typeId: number | null;
    projectId: number | null;
    trailingId: number | null;
    notes: string | null;
    branchId: number | null;
}