import { Auditable } from "./auditable";
import { Draft } from "./draft";
import { Project } from "./project";

export class DraftDetails extends Auditable {
    draftDetailId: number;
    draftId: number;
    projectId: number | null;
    draft: Draft | null;
    project: Project | null;
}
