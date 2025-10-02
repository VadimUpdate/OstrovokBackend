import {Flex, NotificationArgsProps} from "antd";
import React from "react";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {useNavigate} from "react-router-dom";
import {TasksAndExecutorsWidget} from "pages/AnalyticPage/ui/TasksAndExecutorsWidget";
import {FunnelWidget} from "pages/AnalyticPage/ui/FunnelWidget";
import {HotelRatingWidget} from "pages/AnalyticPage/ui/HotelRatingWidget";

type NotificationPlacement = NotificationArgsProps['placement'];

const AnalyticPage = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----
    
    // States
    const navigate = useNavigate();
    // -----

    // Notifications
    const showErrorNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.error({
            message: `Ошибка`,
            description: msg,
            placement,
        });
    };
    const showSuccessNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.success({
            message: `ОК`,
            description: msg,
            placement,
        });
    };
    const showInfoNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.info({
            message: `Внимание`,
            description: msg,
            placement,
        });
    };
    // -----

    // Web requests

    // -----
    
    // Handlers

    // -----

    // Effects

    // -----

    return(
        <Flex justify={'space-evenly'} gap={'large'} style={{height: window.innerHeight}}>
            <TasksAndExecutorsWidget />
            <FunnelWidget />
            <HotelRatingWidget />
        </Flex>
    )
}

export default AnalyticPage;