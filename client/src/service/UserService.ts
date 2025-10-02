import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {UserModel} from "entities/UserModel";

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
        baseUrl: `${host}/api/users`,
    }),
    tagTypes: ['user'],
    endpoints: (build) => ({
        getAll: build.mutation<UserModel[], void>({
            query: () => ({
                url: ``,
                method: 'GET',
            }),
            invalidatesTags: ['user']
        }),
        get: build.mutation<UserModel, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['user']
        }),
        update: build.mutation<UserModel, UserModel>({
            query: (body) => ({
                url: `/${body.id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['user']
        }),
        create: build.mutation<UserModel, UserModel>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body
            }),
            invalidatesTags: ['user']
        }),
    })
});
