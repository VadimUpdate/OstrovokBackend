import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {ProfileModel} from "entities/ProfileModel";

export const profileAPI = createApi({
    reducerPath: 'profileAPI',
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
        baseUrl: `${host}/api/profiles`,
    }),
    tagTypes: ['profile'],
    endpoints: (build) => ({
        getAll: build.mutation<ProfileModel[], void>({
            query: () => ({
                url: ``,
                method: 'GET',
            }),
            invalidatesTags: ['profile']
        }),
        get: build.mutation<ProfileModel, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['profile']
        }),
        update: build.mutation<ProfileModel, ProfileModel>({
            query: (body) => ({
                url: `/${body.id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['profile']
        }),
        create: build.mutation<ProfileModel, ProfileModel>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body
            }),
            invalidatesTags: ['profile']
        }),
    })
});
