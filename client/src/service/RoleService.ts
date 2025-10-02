import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {RoleModel} from "entities/RoleModel";

export const roleAPI = createApi({
    reducerPath: 'roleAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/role`,
    }),
    tagTypes: ['role'],
    endpoints: (build) => ({
        getAll: build.mutation<RoleModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['role']
        }),
        get: build.mutation<RoleModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['role']
        }),
        update: build.mutation<RoleModel, RoleModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['role']
        }),
        create: build.mutation<RoleModel, RoleModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['role']
        }),
    })
});
