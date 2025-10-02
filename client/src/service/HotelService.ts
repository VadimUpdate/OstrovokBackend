import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {HotelModel} from "entities/HotelModel";

export const hotelAPI = createApi({
    reducerPath: 'hotelAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/hotels`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['hotel'],
    endpoints: (build) => ({
        getAll: build.mutation<HotelModel[], void>({
            query: () => ({
                url: ``,
                method: 'GET',
            }),
            invalidatesTags: ['hotel']
        }),
        get: build.mutation<HotelModel, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['hotel']
        }),
        update: build.mutation<HotelModel, HotelModel>({
            query: (body) => ({
                url: `/${body.id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['hotel']
        }),
        create: build.mutation<HotelModel, HotelModel>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body
            }),
            invalidatesTags: ['hotel']
        }),
    })
});
