import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";

export type GetTokenResponseType = {
    token?: string,
    role?: string,
    //detail?: string
}

export type VerifyTokenResponseType = {
    detail?: string,
    code?: string,
    role: string,
    username: string
}

export type RefreshTokenResponseType = {
    detail?: string,
    access?: string
}

export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/auth`,
    }),
    tagTypes: ['auth'],
    endpoints: (build) => ({
        create: build.mutation<GetTokenResponseType, {username: string, password: string}>({
            query: (body) => ({
                url: `/login`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['auth']
        }),
        verify: build.mutation<VerifyTokenResponseType, {token: string}>({
            query: (body) => ({
                url: `/token/verify/`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['auth']
        }),
        refresh: build.mutation<RefreshTokenResponseType, {refresh: string}>({
            query: (body) => ({
                url: `/token/refresh/`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['auth']
        }),
    })
});
