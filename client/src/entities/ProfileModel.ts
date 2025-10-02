import {UserModel} from "entities/UserModel";
import {CityModel} from "entities/CityModel";

export type ProfileModel = {
    id: number | null;
    user: UserModel;
    firstName: string;
    lastName: string;
    patronymic: string;
    phone: string;
    city: CityModel;
    interests: string;
    tgId: string;
    status: string;
    rating: number;

    userId?: number
    cityId?: number
}
