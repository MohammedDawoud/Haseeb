import { Auditable } from "./auditable";

export class InstrumentSources extends Auditable {
    sourceId: number;
    nameAr: string | null;
    nameEn: string | null;
}