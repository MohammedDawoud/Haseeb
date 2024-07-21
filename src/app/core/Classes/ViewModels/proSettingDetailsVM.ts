import { SettingsVM } from "./settingsVM";

export class ProSettingDetailsVM {
    proSettingId: number;
    proSettingNo: string | null;
    proSettingNote: string | null;
    projectTypeId: number | null;
    projectSubtypeId: number | null;
    projectTypeName: string | null;
    projectSubTypeName: string | null;
    userName: string | null;
    addDate: string | null;
    expectedTime: string | null;
    settingslst: SettingsVM[];
}
