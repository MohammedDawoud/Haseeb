import { Auditable } from "./auditable";
import { Department } from "./department";

export class OutInImagesTo extends Auditable {
    imageToId: number;
    outInboxId: number | null;
    departmentId: number | null;
    branchId: number | null;
    department: Department | null;
}
