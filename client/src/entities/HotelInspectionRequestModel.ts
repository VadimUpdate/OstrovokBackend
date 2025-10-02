import {HotelModel} from "entities/HotelModel";

export type HotelInspectionRequestModel = {
    id?: number;
    hotel: HotelModel;
    startDate: string;
    status: string;
    creator: string;
    description: string;
    sessionCount: number;
}
