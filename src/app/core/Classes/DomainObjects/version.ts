import { Auditable } from "./auditable";

export class Versions extends Auditable {
    versionId: number;
    versionCode: string | null;
    date: string | null;
    hijriDate: string | null;
}