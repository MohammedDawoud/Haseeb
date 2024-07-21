import { Auditable } from "./auditable";

export class SocialMediaLinks extends Auditable {
    linksId: number;
    faceBookLink: string | null;
    twitterLink: string | null;
    googlePlusLink: string | null;
    instagramLink: string | null;
    linkedInLink: string | null;
    snapchatLink: string | null;
}