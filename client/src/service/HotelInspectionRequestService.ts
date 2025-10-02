import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {HotelInspectionRequestModel} from "entities/HotelInspectionRequestModel";

export const hotelInspectionRequestAPI = createApi({
    reducerPath: 'hotelInspectionRequestAPI',
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
        baseUrl: `${host}/api/hotel-inspections`,
    }),
    tagTypes: ['hotelInspectionRequest'],
    endpoints: (build) => ({
        getAll: build.mutation<HotelInspectionRequestModel[], void>({
            query: () => ({
                url: ``,
                method: 'GET',
            }),
            invalidatesTags: ['hotelInspectionRequest']
        }),
        get: build.mutation<HotelInspectionRequestModel, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['hotelInspectionRequest']
        }),
        update: build.mutation<HotelInspectionRequestModel, HotelInspectionRequestModel>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body
            }),
            invalidatesTags: ['hotelInspectionRequest']
        }),
        create: build.mutation<HotelInspectionRequestModel, HotelInspectionRequestModel>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body
            }),
            invalidatesTags: ['hotelInspectionRequest']
        }),
    })
});
