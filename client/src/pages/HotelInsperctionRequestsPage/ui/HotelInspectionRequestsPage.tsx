import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {NotificationPlacement} from "antd/es/notification/interface";
import {HotelInspectionRequestModel} from "entities/HotelInspectionRequestModel";
import {hotelInspectionRequestAPI} from "service/HotelInspectionRequestService";
import {HotelInspectionRequestModal} from "pages/HotelInsperctionRequestsPage/ui/HotelInspectionRequestModal";
import dayjs from "dayjs";

const HotelInspectionRequestsPage: React.FC = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // States
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [selected, setSelected] = useState<HotelInspectionRequestModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: data,
        isLoading: isDataLoading,
        isError: isDataError,
    }] = hotelInspectionRequestAPI.useGetAllMutation();
    // -----

    // Notifications
    const showErrorNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.error({
            message: `Ошибка`,
            description: msg,
            placement,
        });
    };
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleModal) setSelected(null);
    }, [isVisibleModal]);
    useEffect(() => {
        if (isDataError) showErrorNotification('topRight', 'Ошибка загрузки данных');
    }, [isDataError]);
    // -----

    // Useful utils
    const columns: TableProps<HotelInspectionRequestModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Отель',
            dataIndex: 'hotel',
            key: 'hotel',
            render: (_, record) => (<div>{record.hotel?.name}</div>),
        },
        {
            title: 'Дата начала',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (_, record) => (<div>{record.startDate ? dayjs(record.startDate, 'YYYY-MM-DDTHH:mm:ss').format("DD.MM.YYYY") : ""}</div>),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            filters: data?.reduce((acc: { text: string, value: string }[], request: HotelInspectionRequestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === request.status) === undefined)
                    return acc.concat({text: request.status, value: request.status});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: HotelInspectionRequestModel) => {
                return record.status.indexOf(value) === 0
            },
        },
        {
            title: 'Создатель',
            dataIndex: 'creator',
            key: 'creator',
            filters: data?.reduce((acc: { text: string, value: string }[], request: HotelInspectionRequestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === request.creator) === undefined)
                    return acc.concat({text: request.creator, value: request.creator});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: HotelInspectionRequestModel) => {
                return record.creator.indexOf(value) === 0
            },
        },
        {
            title: 'Кол-во участников',
            dataIndex: 'sessionCount',
            key: 'sessionCount',
            filters: data?.reduce((acc: { text: string, value: string }[], request: HotelInspectionRequestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === request.sessionCount.toString()) === undefined)
                    return acc.concat({text: request.sessionCount.toString(), value: request.sessionCount.toString()});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: HotelInspectionRequestModel) => {
                return record.sessionCount.toString().indexOf(value) === 0
            },
        },
    ]
    // -----

    return (
        <Flex vertical={true} gap={'small'} style={{margin: "0 5px 0 5px"}}>
            {isVisibleModal &&
                <HotelInspectionRequestModal selectedRequest={selected} visible={isVisibleModal}
                                   setVisible={setIsVisibleModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleModal(true)}
                    style={{width: 100}}>Добавить</Button>
            <Table
                bordered
                style={{width: '100vw'}}
                columns={columns}
                dataSource={data}
                loading={isDataLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleModal(true);
                            setSelected(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default HotelInspectionRequestsPage;