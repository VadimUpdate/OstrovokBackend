import React, {useEffect, useRef, useState} from 'react';
import {Gauge} from '@ant-design/plots';
import {Card, Skeleton} from "antd";
import {hotelInspectionRequestAPI} from "service/HotelInspectionRequestService";
import {guestRequestAPI} from "service/GuestRequestService";
import {HotelInspectionRequestModel} from "entities/HotelInspectionRequestModel";

export const TasksAndExecutorsWidget = () => {

    // States
    const [value, setValue] = useState(0); // from 0 to 1
    // -----

    // Web request
    const [getAllHotelInspections, {
        data: hotelInspections,
        isLoading: isHotelInspectionsLoading,
    }] = hotelInspectionRequestAPI.useGetAllMutation();
    const [getAllGuestRequests, {
        data: guestRequests,
        isLoading: isGuestRequestsLoading,
    }] = guestRequestAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllHotelInspections();
        getAllGuestRequests();
    }, []);
    useEffect(() => {
        if (hotelInspections && guestRequests) {
            let all = hotelInspections.reduce((acc, inspection: HotelInspectionRequestModel) => {
                return acc += inspection.sessionCount;
            }, 0);
            setValue(guestRequests.length / all);
        }
    }, [guestRequests, hotelInspections]);
    // -----

    // Chart config
    const ticks = [0, 1 / 3, 2 / 3, 1];
    const color = ['#F4664A', '#FAAD14', '#30BF78'];
    const graphRef = useRef(null);
    const config = {
        percent: value,
        range: {
            ticks: [0, 100],
            color: ['l(0) 0:#F4664A 0.5:#FAAD14 1:#30BF78'],
        },
        indicator: {
            pointer: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
            pin: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
        },
        statistic: {
            title: {
                formatter: (props:any) => {
                    if (props.percent < ticks[1]) {
                        return 'Ой-ой...';
                    }

                    if (props.percent < ticks[2]) {
                        return 'Неплохо';
                    }

                    return 'Отлично!';
                },
                style: (props:any) => {
                    return {
                        fontSize: '36px',
                        lineHeight: 1,
                        color: props.percent < ticks[1] ? color[0] : props.percent < ticks[2] ? color[1] : color[2],
                    };
                },
            },
            content: {
                offsetY: 36,
                style: {
                    fontSize: '24px',
                    color: '#4B535E',
                },
                formatter: () => 'Уровень выполняемости',
            },
        },
        onReady: (plot:any) => {
            graphRef.current = plot;
        },
    };
    // -----

    return <Card style={{width: 500}}>
        <h2>Выполнение плана инспекции отелей</h2>
        <h4>Соотношение созданных мест для инспекции и назначенных на них тайных гостей</h4>
        {isHotelInspectionsLoading ?
            <Skeleton />
        :
            <Gauge {...config} />
        }
    </Card>

};

