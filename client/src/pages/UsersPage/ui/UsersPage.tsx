import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {UserModel} from "entities/UserModel";
import {userAPI} from "service/UserService";
import {UserModal} from "pages/UsersPage/ui/UserModal";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {NotificationPlacement} from "antd/es/notification/interface";

const UsersPage: React.FC = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // States
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [selected, setSelected] = useState<UserModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: data,
        isLoading: isDataLoading,
        isError: isDataError
    }] = userAPI.useGetAllMutation();
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
    const columns: TableProps<UserModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Наименование',
            dataIndex: 'username',
            key: 'username',
            filters: data?.reduce((acc: { text: string, value: string }[], user: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === user.username) === undefined)
                    return acc.concat({text: user.username, value: user.username});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: UserModel) => {
                return record.username.indexOf(value) === 0
            },
        },
        {
            title: 'Почта',
            dataIndex: 'email',
            key: 'email',
            filters: data?.reduce((acc: { text: string, value: string }[], user: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === user.email) === undefined)
                    return acc.concat({text: user.email, value: user.email});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: UserModel) => {
                return record.email.indexOf(value) === 0
            },
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Создана',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
    ];
    // -----

    return (
        <Flex vertical={true} gap={'small'} style={{margin: "0 5px 0 5px"}}>
            {isVisibleModal &&
                <UserModal selectedUser={selected} visible={isVisibleModal}
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

export default UsersPage;