import { Auditable } from './auditable';

export class GuideDepartmentDetails extends Auditable {
  depDetailsId: number;
  depId: number;
  type: number;
  header: string | null;
  link: string | null;
  text: string | null;
  nameAR: string | null;
  nameEn: string | null;
}
