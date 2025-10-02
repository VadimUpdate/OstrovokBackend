import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {NotificationPlacement} from "antd/es/notification/interface";
import dayjs from "dayjs";
import {GuestRequestModel} from "entities/GuestRequestModel";
import {guestRequestAPI} from "service/GuestRequestService";
import {GuestRequestModal} from "pages/GuestRequestsPage/ui/GuestRequestModal";

const GuestRequestsPage: React.FC = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    // -----

    // States
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [selected, setSelected] = useState<GuestRequestModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: data,
        isLoading: isDataLoading,
        isError: isDataError,
    }] = guestRequestAPI.useGetAllMutation();
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
    const columns: TableProps<GuestRequestModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Инспектируемый отель',
            dataIndex: 'hotelInspectionRequest',
            key: 'hotelInspectionRequest',
            render: (_, record) => (<div>{record.hotelInspection?.hotel?.name}</div>),
        },
        {
            title: 'Секретный гость',
            dataIndex: 'guest',
            key: 'guest',
            render: (_, record) => (<div>{record.guest.user.username}</div>),
        },
        {
            title: 'Дата заезда',
            dataIndex: 'dateStart',
            key: 'dateStart',
            render: (_, record) => (<div>{record.dateStart ? dayjs(record.dateStart, 'YYYY-MM-DDTHH:mm:ss').format("DD.MM.YYYY") : ""}</div>),
        },
        {
            title: 'Дата выезда',
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            render: (_, record) => (<div>{record.dateFinish ? dayjs(record.dateFinish, 'YYYY-MM-DDTHH:mm:ss').format("DD.MM.YYYY") : ""}</div>),
        },
    ]
    // -----

    return (
        <Flex vertical={true} gap={'small'} style={{margin: "0 5px 0 5px"}}>
            {isVisibleModal &&
                <GuestRequestModal selectedRequest={selected} visible={isVisibleModal}
                                   setVisible={setIsVisibleModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleModal(true)}
                    style={{width: 100}}>Добавить</Button>
            <Table
                bordered
                style={{width: '100vw'}}
                columns={columns}
                dataSource={currentUser?.role == "ROLE_USER" ?
                    data?.filter((request:GuestRequestModel) => request.guest.user.username == currentUser?.username)
                    :
                    data
                }
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

export default GuestRequestsPage;