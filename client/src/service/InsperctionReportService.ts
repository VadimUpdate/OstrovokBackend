import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {InspectionReportModel} from "entities/InspectionReportModel";

export const inspectionReportAPI = createApi({
    reducerPath: 'inspectionReportAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/inspection-reports`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['inspectionReport'],
    endpoints: (build) => ({
        getAll: build.mutation<InspectionReportModel[], void>({
            query: () => ({
                url: ``,
                method: 'GET',
            }),
            invalidatesTags: ['inspectionReport']
        }),
        get: build.mutation<InspectionReportModel, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['inspectionReport']
        }),
        update: build.mutation<InspectionReportModel, InspectionReportModel>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body
            }),
            invalidatesTags: ['inspectionReport']
        }),
        create: build.mutation<InspectionReportModel, InspectionReportModel>({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body
            }),
            invalidatesTags: ['inspectionReport']
        }),
    })
});
