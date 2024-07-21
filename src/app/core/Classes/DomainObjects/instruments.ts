import { Auditable } from "./auditable";
import { Project } from "./project";
import { InstrumentSources } from "./instrumentSources";

export class Instruments extends Auditable {
    instrumentId: number;
    instrumentNo: string | null;
    date: string | null;
    hijriDate: string | null;
    projectId: number | null;
    sourceId: number | null;
    project: Project | null;
    instrumentSources: InstrumentSources | null;
}
