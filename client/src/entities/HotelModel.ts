import {CityModel} from "entities/CityModel";

export type HotelModel = {
    id: number | null;
    name: string;
    description: string;
    action: string;
    address: string;
    city: CityModel;
    officialRating: number | null;
    neesInspection: boolean;
    inspectionReason: string;
    lastInspection: number | null;
    secretGreetAvgTail: number; // Бл что это)

    cityId?: number
}
