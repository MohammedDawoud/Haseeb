import { Auditable } from "./auditable";

export class ReasonLeave extends Auditable {
    reasonId: number;
    reasonTxt: string | null;
    desecionTxt: string | null;
}