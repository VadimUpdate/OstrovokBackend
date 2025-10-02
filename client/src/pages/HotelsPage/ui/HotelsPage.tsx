import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {NotificationPlacement} from "antd/es/notification/interface";
import {HotelModel} from "entities/HotelModel";
import {hotelAPI} from "service/HotelService";
import {HotelModal} from "pages/HotelsPage/ui/HotelModal";

const HotelPage: React.FC = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // States
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [selected, setSelected] = useState<HotelModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: data,
        isLoading: isDataLoading,
        isError: isDataError,
    }] = hotelAPI.useGetAllMutation();
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
    const columns: TableProps<HotelModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            filters: data?.reduce((acc: { text: string, value: string }[], hotel: HotelModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === hotel.name) === undefined)
                    return acc.concat({text: hotel.name, value: hotel.name});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: HotelModel) => {
                return record.name.indexOf(value) === 0
            },
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            filters: data?.reduce((acc: { text: string, value: string }[], hotel: HotelModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === hotel.name) === undefined)
                    return acc.concat({text: hotel.name, value: hotel.name});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: HotelModel) => {
                return record.name.indexOf(value) === 0
            },
        },
        {
            title: 'Город',
            dataIndex: 'city',
            key: 'city',
            render: (_, record) => (<div>{record.city?.name}</div>),
        },
        {
            title: 'Адресс',
            dataIndex: 'address',
            key: 'address',
            filters: data?.reduce((acc: { text: string, value: string }[], hotel: HotelModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === hotel.address) === undefined)
                    return acc.concat({text: hotel.address, value: hotel.address});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: HotelModel) => {
                return record.address.indexOf(value) === 0
            },
        },
        {
            title: 'Официальный рейтинг',
            dataIndex: 'officialRating',
            key: 'officialRating',
            filters: data?.reduce((acc: { text: string, value: string }[], hotel: HotelModel) => {
                if (hotel.officialRating != null) {
                    if (acc.find((g: {
                        text: string,
                        value: string
                    }) => g.text === hotel.officialRating?.toString()) === undefined)
                        return acc.concat({
                            text: hotel.officialRating.toString(),
                            value: hotel.officialRating.toString()
                        });
                }
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: HotelModel) => {
                return record.officialRating?.toString().indexOf(value) === 0
            },
        },
    ]
    // -----

    return (
        <Flex vertical={true} gap={'small'} style={{margin: "0 5px 0 5px"}}>
            {isVisibleModal &&
                <HotelModal selectedHotel={selected} visible={isVisibleModal}
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

export default HotelPage;