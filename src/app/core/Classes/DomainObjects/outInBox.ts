import { Auditable } from "./auditable";
import { Project } from "./project";
import { OutInBoxType } from "./outInBoxType";
import { OutInBoxSerial } from "./outInBoxSerial";
import { ArchiveFiles } from "./archiveFiles";
import { Department } from "./department";
import { ContacFiles } from "./contacFiles";

export class OutInBox extends Auditable {
    outInBoxId: number;
    number: string | null;
    date: string | null;
    hijriDate: string | null;
    typeId: number | null;
    sideFromId: number | null;
    sideToId: number | null;
    innerId: number | null;
    topic: string | null;
    archiveFileId: number | null;
    relatedToId: number | null;
    type: number | null;
    outInType: number | null;
    numberType: number | null;
    attachmentUrl: string | null;
    projectId: number | null;
    branchId: number | null;
    priority: number | null;
    project: Project | null;
    outInBoxType: OutInBoxType | null;
    outInBoxSerial: OutInBoxSerial | null;
    innerToOutIn: OutInBox | null;
    relatedToOutIn: OutInBox | null;
    archiveFiles: ArchiveFiles | null;
    fromDepartment: Department | null;
    toDepartment: Department | null;
    contacFiles: ContacFiles[] | null;
    outInImagesIds: number[] | null;
}
