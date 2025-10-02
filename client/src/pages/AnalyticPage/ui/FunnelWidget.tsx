import React, {useEffect, useState} from 'react';
import {Funnel} from '@ant-design/plots';
import {Card, Skeleton} from "antd";
import {inspectionReportAPI} from "service/InsperctionReportService";
import {InspectionReportModel} from "entities/InspectionReportModel";
import {REPORT_STATUSES} from "shared/config/constants";

type FunnelWidgetType = {
    stage: string;
    data: number;
}

export const FunnelWidget = () => {

    // States
    const [funnelData, setFunnelData] = useState<FunnelWidgetType[]>([]);
    const [config, setConfig] = useState<any>(null);
    // -----

    // Web request
    const [getAll, {
        data: data,
        isLoading: isDataLoading,
        isError: isDataError,
    }] = inspectionReportAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (data){
            setFunnelData(data.reduce((acc:FunnelWidgetType[], report:InspectionReportModel) => {
                let widget:FunnelWidgetType|undefined = acc.find((widget:FunnelWidgetType) => widget.stage == report.status);
                if (widget){
                    widget.data += 1;
                    return acc.concat([widget]);
                } else {
                    return acc.concat([{
                        stage: report.status,
                        data: 1
                    }])
                }
            }, []));
        }
    }, [data]);
    useEffect(() => {
        if (funnelData){
            setConfig({
                data: funnelData.map((f:FunnelWidgetType) => {
                    {
                        if (f.stage == REPORT_STATUSES.ON_MISSION) return {...f, stage: "На миссии"}
                        if (f.stage == REPORT_STATUSES.REPORT_SENT) return {...f, stage: "Отчет отправлен"}
                        if (f.stage == REPORT_STATUSES.CONFIRMED) return {...f, stage: "Принято"}
                        if (f.stage == REPORT_STATUSES.CANCELED) return {...f, stage: "Отклонено"}
                        return {...f, stage: "Принято"}
                    }                }),
                xField: 'stage',
                yField: 'data',
            });
        }
    }, [funnelData]);
    // -----
    console.log(config)
    return <Card style={{width: 500}}>
        <h2>Процесс обработки отчетов</h2>
        <h4>Тайный гость на миссии - Отправлен отчет - Обработан</h4>
        {!config ?
            <Skeleton />
        :
            <Funnel {...config} />
        }
    </Card>

};

