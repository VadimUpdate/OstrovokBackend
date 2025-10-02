import {HotelInspectionRequestModel} from "entities/HotelInspectionRequestModel";
import {UserModel} from "entities/UserModel";
import {ProfileModel} from "entities/ProfileModel";

export type GuestRequestModel = {
    id: number | null;
    hotelInspectionRequest: HotelInspectionRequestModel;
    guest: ProfileModel,
    dateStart: string;
    dateFinish: string;

    hotelInspectionId?: number;
    guestId?: number;
    hotelInspection?: HotelInspectionRequestModel,
}
