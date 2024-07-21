import { Auditable } from "./auditable";

export class UsersLocations extends Auditable {
    locationId: number;
    userId: number | null;
    ip: string | null;
    iPType: string | null;
    continentCode: string | null;
    continentName: string | null;
    countryCode: string | null;
    countryName: string | null;
    regionCode: string | null;
    regionName: string | null;
    city: string | null;
    zipCode: string | null;
    timeZone: string | null;
    latitude: string | null;
    longitude: string | null;
}