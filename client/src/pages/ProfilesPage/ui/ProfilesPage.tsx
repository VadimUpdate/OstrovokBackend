import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {ProfileModel} from "entities/ProfileModel";
import {profileAPI} from "service/ProfileService";
import {ProfileModal} from "pages/ProfilesPage/ui/ProfileModal";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {NotificationPlacement} from "antd/es/notification/interface";

const ProfilePage: React.FC = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // States
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [selected, setSelected] = useState<ProfileModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: data,
        isLoading: isDataLoading,
        isError: isDataError,
    }] = profileAPI.useGetAllMutation();
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
    const columns: TableProps<ProfileModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => (<div>{record.user?.username}</div>),
        },
        {
            title: 'Имя',
            dataIndex: 'firstName',
            key: 'firstName',
            filters: data?.reduce((acc: { text: string, value: string }[], user: ProfileModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === user.firstName) === undefined)
                    return acc.concat({text: user.firstName, value: user.firstName});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ProfileModel) => {
                return record.firstName.indexOf(value) === 0
            },
        },
        {
            title: 'Фамлия',
            dataIndex: 'lastName',
            key: 'lastName',
            filters: data?.reduce((acc: { text: string, value: string }[], user: ProfileModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === user.lastName) === undefined)
                    return acc.concat({text: user.lastName, value: user.lastName});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ProfileModel) => {
                return record.lastName.indexOf(value) === 0
            },
        },
        {
            title: 'Отчество',
            dataIndex: 'patronymic',
            key: 'patronymic',
            filters: data?.reduce((acc: { text: string, value: string }[], user: ProfileModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === user.patronymic) === undefined)
                    return acc.concat({text: user.patronymic, value: user.patronymic});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ProfileModel) => {
                return record.patronymic.indexOf(value) === 0
            },
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
            filters: data?.reduce((acc: { text: string, value: string }[], user: ProfileModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === user.phone) === undefined)
                    return acc.concat({text: user.phone, value: user.phone});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ProfileModel) => {
                return record.phone.indexOf(value) === 0
            },
        },
        {
            title: 'Город',
            dataIndex: 'city',
            key: 'city',
            render: (_, record) => (<div>{record.city?.name}</div>),
        },
        {
            title: 'Интересы',
            dataIndex: 'interests',
            key: 'interests',
        },
        {
            title: 'TG id',
            dataIndex: 'tgId',
            key: 'tgId',
            filters: data?.reduce((acc: { text: string, value: string }[], user: ProfileModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === user.tgId) === undefined)
                    return acc.concat({text: user.tgId, value: user.tgId});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ProfileModel) => {
                return record.tgId.indexOf(value) === 0
            },
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            filters: data?.reduce((acc: { text: string, value: string }[], user: ProfileModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === user.status) === undefined)
                    return acc.concat({text: user.status, value: user.status});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ProfileModel) => {
                return record.status.indexOf(value) === 0
            },
        },
        {
            title: 'Рейтинг',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            sortDirections: ['descend', 'ascend'],
        },
    ]
    // -----

    return (
        <Flex vertical={true} gap={'small'} style={{margin: "0 5px 0 5px"}}>
            {isVisibleModal &&
                <ProfileModal selectedProfile={selected} visible={isVisibleModal}
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

export default ProfilePage;