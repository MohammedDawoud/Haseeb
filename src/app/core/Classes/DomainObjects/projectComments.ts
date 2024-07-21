import { Auditable } from "./auditable";
import { Users } from "./users";

export class ProjectComments extends Auditable {
    commentId: number;
    comment: string | null;
    date: string | null;
    projectId: number;
    userId: number | null;
    users: Users | null;
}
