import { Auditable } from "./auditable";

export class ProjectPieces extends Auditable {
    pieceId: number;
    pieceNo: string | null;
    notes: string | null;
    projectId: number;
}