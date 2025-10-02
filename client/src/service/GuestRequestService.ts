import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {GuestRequestModel} from "entities/GuestRequestModel";

export const guestRequestAPI = createApi({
    reducerPath: 'guestRequestAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/guest-requests`,
    }),
    tagTypes: ['guestRequest'],
    endpoints: (build) => ({
        getAll: build.mutation<GuestRequestModel[], void>({
            query: () => ({
                url: ``,
                method: 'GET',
            }),
            invalidatesTags: ['guestRequest']
        }),
        get: build.mutation<GuestRequestModel, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['guestRequest']
        }),
        update: build.mutation<GuestRequestModel, GuestRequestModel>({
            query: (body) => ({
                url: `/${body.id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['guestRequest']
        }),
        create: build.mutation<GuestRequestModel, GuestRequestModel>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body
            }),
            invalidatesTags: ['guestRequest']
        }),
    })
});
