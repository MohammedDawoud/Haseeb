import { Auditable } from "./auditable";

export class News extends Auditable {
    newsId: number;
    newsTitleAr: string | null;
    newsBodyAr: string | null;
    newsTitleEn: string | null;
    newsBodyEn: string | null;
    newsImg: string | null;
}