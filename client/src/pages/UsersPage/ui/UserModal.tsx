import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal, Select} from 'antd';
import {UserModel} from "entities/UserModel";
import {userAPI} from "service/UserService";
import {NotificationPlacement} from "antd/es/notification/interface";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {ROLES} from "shared/config/constants";

type ModalProps = {
    selectedUser: UserModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const UserModal = (props: ModalProps) => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // States
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [role, setRole] = useState<string>(ROLES.ROLE_USER);
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

    // Web requests
    const [create, {
        data: created,
        isLoading: isCreateLoading
    }] = userAPI.useCreateMutation();
    const [update, {
        data: updated,
        isLoading: isUpdateLoading
    }] = userAPI.useUpdateMutation();
    // -----

    // Effects
    useEffect(() => {
        if (props.selectedUser) {
            setUsername(props.selectedUser.username);
            setEmail(props.selectedUser.email);
            setRole(props.selectedUser.role == ROLES.ROLE_ADMIN ? ROLES.ROLE_ADMIN : ROLES.ROLE_USER);
        }
    }, [props.selectedUser]);
    useEffect(() => {
        if (created || updated) {
            props.setVisible(false);
            props.refresh();
        }
    }, [created, updated]);
    // -----

    // Handlers
    const confirmHandler = () => {
        if (username){
            let user: UserModel = {
                id: null,
                username,
                email,
                password: password ? password : "password",
                role
            };
            if (props.selectedUser) update({...user, id: props.selectedUser.id});
            else create(user);
        }
    }
    // -----

    return (
        <Modal title={props.selectedUser ? "Редактирование пользователя" : "Создание пользователя"}
               open={props.visible}
               loading={(isCreateLoading || isUpdateLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedUser ? "Сохранить" : "Создать"}
               width={'550px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Логин</div>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Почта</div>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Flex>
                {!props.selectedUser &&
                    <>
                        <Flex align={"center"}>
                            <div style={{width: 180}}>Пароль</div>
                            <Input type={"password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </Flex>
                        <Flex align={"center"}>
                            <div style={{width: 180}}>Подтверждение</div>
                            <Input type={"password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </Flex>
                    </>
                }
                <Flex align={"center"}>
                    <div style={{width: 180}}>Роль</div>
                    <Select
                        value={role}
                        placeholder={"Выберите роль"}
                        style={{width: '100%'}}
                        onChange={(e) => setRole(e)}
                        options={[{value: ROLES.ROLE_USER, label: ROLES.ROLE_USER}, {value: ROLES.ROLE_ADMIN, label: ROLES.ROLE_ADMIN}]}
                    />
                </Flex>
            </Flex>
        </Modal>
    );
};
