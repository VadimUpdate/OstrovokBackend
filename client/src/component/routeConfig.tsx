import {RouteProps} from "react-router-dom";
import React from "react";
import UsersPage from "pages/UsersPage/ui/UsersPage";
import {AnalyticPage} from "pages/AnalyticPage";
import ProfilesPage from "pages/ProfilesPage/ui/ProfilesPage";
import HotelsPage from "pages/HotelsPage/ui/HotelsPage";
import HotelInspectionRequestsPage from "pages/HotelInsperctionRequestsPage/ui/HotelInspectionRequestsPage";
import GuestRequestsPage from "pages/GuestRequestsPage/ui/GuestRequestsPage";
import InspectionReportsPage from "pages/InspectionReportsPage/ui/InspectionReportsPage";
import {LoginPage} from "pages/LoginPage";
import {RegistrationPage} from "pages/RegistrationPage";

export enum AppRoutes {
    USERS = 'USERS',
    PROFILES = 'PROFILES',
    HOTELS = 'HOTELS',
    HOTEL_INSPECTION_REQUESTS = 'HOTEL_INSPECTION_REQUESTS',
    GUEST_REQUESTS = 'GUEST_REQUESTS',
    INSPECTION_REPORTS = 'INSPECTION_REPORTS',
    ANALYTIC = 'ANALYTIC',
    LOGIN = 'LOGIN',
    REGISTRATION = 'REGISTRATION',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.USERS]: '/users',
    [AppRoutes.PROFILES]: '/profiles',
    [AppRoutes.HOTELS]: '/hotels',
    [AppRoutes.HOTEL_INSPECTION_REQUESTS]: '/hotelInspectionRequests',
    [AppRoutes.GUEST_REQUESTS]: '/guestRequests',
    [AppRoutes.INSPECTION_REPORTS]: '/inspectionReports',
    [AppRoutes.ANALYTIC]: '/analytic',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.REGISTRATION]: '/registration',
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.USERS]: {
        path: RoutePath.USERS,
        element: <UsersPage/>
    },
    [AppRoutes.PROFILES]: {
        path: RoutePath.PROFILES,
        element: <ProfilesPage/>
    },
    [AppRoutes.HOTELS]: {
        path: RoutePath.HOTELS,
        element: <HotelsPage/>
    },
    [AppRoutes.HOTEL_INSPECTION_REQUESTS]: {
        path: RoutePath.HOTEL_INSPECTION_REQUESTS,
        element: <HotelInspectionRequestsPage/>
    },
    [AppRoutes.GUEST_REQUESTS]: {
        path: RoutePath.GUEST_REQUESTS,
        element: <GuestRequestsPage/>
    },
    [AppRoutes.INSPECTION_REPORTS]: {
        path: RoutePath.INSPECTION_REPORTS,
        element: <InspectionReportsPage/>
    },
    [AppRoutes.ANALYTIC]: {
        path: RoutePath.ANALYTIC,
        element: <AnalyticPage/>
    },
    [AppRoutes.LOGIN]: {
        path: RoutePath.LOGIN,
        element: <LoginPage/>
    },
    [AppRoutes.REGISTRATION]: {
        path: RoutePath.REGISTRATION,
        element: <RegistrationPage/>
    },
}