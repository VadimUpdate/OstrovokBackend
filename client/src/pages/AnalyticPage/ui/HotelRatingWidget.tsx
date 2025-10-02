import React, {useEffect, useState} from 'react';
import {Bar} from '@ant-design/plots';
import {Card, Flex, Select, Skeleton} from "antd";
import {inspectionReportAPI} from "service/InsperctionReportService";
import {InspectionReportModel} from "entities/InspectionReportModel";
import {HotelModel} from "entities/HotelModel";
import {hotelAPI} from "service/HotelService";

type FunnelWidgetType = {
    params: string;
    rating: number;
}

export const HotelRatingWidget = () => {

    // States cleanRating serviceRating roomConditionRating moneyRating
    const [widgetData, setWidgetData] = useState<FunnelWidgetType[]>([]);
    const [config, setConfig] = useState<any>(null);
    const [hotelId, setHotelId] = useState<number | null>(null);
    const [selectedHotelData, setSelectedHotelData] = useState<InspectionReportModel[] | null>(null);
    // -----

    // Web request
    const [getAll, {
        data: data,
        isLoading: isDataLoading,
        isError: isDataError,
    }] = inspectionReportAPI.useGetAllMutation();
    const [getHotels, {
        data: hotels,
        isError: isHotelsError,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getHotels();
        getAll();
    }, []);
    useEffect(() => {
        if (data && hotelId) {
            setSelectedHotelData(data.filter((r:InspectionReportModel) => r.guestRequest.hotelInspection?.hotel.id));
        }
    }, [data, hotelId]);
    useEffect(() => {
        if (selectedHotelData){
            let cleanRating = selectedHotelData.reduce((acc: number, report:InspectionReportModel) => {
                return acc += report.cleanRating
            }, 0);
            let serviceRating = selectedHotelData.reduce((acc: number, report:InspectionReportModel) => {
                return acc += report.serviceRating
            }, 0);
            let roomConditionRating = selectedHotelData.reduce((acc: number, report:InspectionReportModel) => {
                return acc += report.roomConditionRating
            }, 0);
            let moneyRating = selectedHotelData.reduce((acc: number, report:InspectionReportModel) => {
                return acc += report.moneyRating
            }, 0);
            setWidgetData([
                {params: "Чистота", rating: Math.round((cleanRating/selectedHotelData.length) * 10) / 10},
                {params: "Сервис", rating: Math.round((serviceRating/selectedHotelData.length) * 10) / 10},
                {params: "Состояние", rating: Math.round((roomConditionRating/selectedHotelData.length) * 10) / 10},
                {params: "Цена/качество", rating: Math.round((moneyRating/selectedHotelData.length) * 10) / 10}
            ]);
        }
    }, [selectedHotelData]);

    useEffect(() => {
        if (widgetData){
            setConfig({
                data: widgetData,
                yField: 'params',
                xField: 'rating',
                seriesField: 'params',
                legend: {
                    position: 'top-left',
                }})
        }
    }, [widgetData]);
    // -----
    console.log(config)
    return <Card style={{width: 500}}>
        <h2>Анализ качества отелей</h2>
        <h4>Сравнение средних баллов по чистоте, сервису, состоянию номеров и денежному вопросу</h4>
        <Flex align={"center"}>
            <div style={{width: 180}}>Отель</div>
            <Select
                loading={isHotelsLoading}
                value={hotelId}
                placeholder={"Выберите отель"}
                style={{width: '100%'}}
                onChange={(e) => setHotelId(e)}
                options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
            />
        </Flex>
        {(!config || widgetData.length == 0) ?
            <Skeleton />
            :
            <Bar {...config} />
        }
    </Card>

};
