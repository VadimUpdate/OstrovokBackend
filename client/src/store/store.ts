import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authAPI} from "service/AuthService";
import userSlice, {CurrentUserModelStateType} from "./slice/UserSlice";
import {userAPI} from "service/UserService";
import {roleAPI} from "service/RoleService";
import {profileAPI} from "service/ProfileService";
import {cityAPI} from "service/CityService";
import {hotelAPI} from "service/HotelService";
import {hotelInspectionRequestAPI} from "service/HotelInspectionRequestService";
import {guestRequestAPI} from "service/GuestRequestService";
import {inspectionReportAPI} from "service/InsperctionReportService";

export type RootStateType = {
    currentUser: CurrentUserModelStateType
};

const rootReducer = combineReducers({
    currentUser: userSlice,
    [authAPI.reducerPath]: authAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [roleAPI.reducerPath]: roleAPI.reducer,
    [profileAPI.reducerPath]: profileAPI.reducer,
    [cityAPI.reducerPath]: cityAPI.reducer,
    [hotelAPI.reducerPath]: hotelAPI.reducer,
    [hotelInspectionRequestAPI.reducerPath]: hotelInspectionRequestAPI.reducer,
    [guestRequestAPI.reducerPath]: guestRequestAPI.reducer,
    [inspectionReportAPI.reducerPath]: inspectionReportAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(authAPI.middleware)
                .concat(userAPI.middleware)
                .concat(roleAPI.middleware)
                .concat(profileAPI.middleware)
                .concat(cityAPI.middleware)
                .concat(hotelAPI.middleware)
                .concat(hotelInspectionRequestAPI.middleware)
                .concat(guestRequestAPI.middleware)
                .concat(inspectionReportAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
