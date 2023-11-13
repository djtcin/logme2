import { PaletteMode } from "@mui/material";

export interface MyStorage {
    theme: PaletteMode;
    logs: Log[];
    logIdInPlay?: string;
    logIdInEdition?: string;
    lastLogIdInPlay?: string;
    errorEdit?: string;
    settings: {
        defaultMinHour: number;
        defaultMaxHour: number;
        calendarHeight: number;
        minLogHeight: number;
        minutesForMerge: 5;
    };
}
