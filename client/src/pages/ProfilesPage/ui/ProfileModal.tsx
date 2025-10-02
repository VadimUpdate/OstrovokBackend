import React, {useEffect, useState} from 'react';
import {Flex, Input, InputNumber, Modal, Select} from 'antd';
import {UserModel} from "entities/UserModel";
import {userAPI} from "service/UserService";
import {NotificationPlacement} from "antd/es/notification/interface";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {ProfileModel} from "entities/ProfileModel";
import {profileAPI} from "service/ProfileService";
import {cityAPI} from "service/CityService";
import {CityModel} from "entities/CityModel";
import {PROFILE_STATUSES, REPORT_STATUSES} from "shared/config/constants";

type ModalProps = {
    selectedProfile: ProfileModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const ProfileModal = (props: ModalProps) => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // States
    const [userId, setUserId] = useState<number | null>(null);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [patronymic, setPatronymic] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [cityId, setCityId] = useState<number | null>(null);
    const [travelInterests, setTravelInterests] = useState<string>("");
    const [tgId, setTgId] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
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
    }] = profileAPI.useCreateMutation();
    const [update, {
        data: updated,
        isLoading: isUpdateLoading
    }] = profileAPI.useUpdateMutation();
    const [getUsers, {
        data: users,
        isError: isUsersError,
        isLoading: isUsersLoading
    }] = userAPI.useGetAllMutation();
    const [getCities, {
        data: cities,
        isError: isCitiesError,
        isLoading: isCitiesLoading
    }] = cityAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getUsers();
        getCities();
    }, []);
    useEffect(() => {
        if (props.selectedProfile) {
            setUserId(props.selectedProfile.user.id);
            setCityId(props.selectedProfile.city.id);
            setTravelInterests(props.selectedProfile.interests);
            setFirstName(props.selectedProfile.firstName);
            setLastName(props.selectedProfile.lastName);
            setPatronymic(props.selectedProfile.patronymic);
            setPhone(props.selectedProfile.phone);
            setTravelInterests(props.selectedProfile.interests);
            setTgId(props.selectedProfile.tgId);
            setStatus(props.selectedProfile.status);
            setRating(props.selectedProfile.rating);
        }
    }, [props.selectedProfile]);
    useEffect(() => {
        if (created || updated) {
            props.setVisible(false);
            props.refresh();
        }
    }, [created, updated]);
    useEffect(() => {
        if (isUsersError)
            showErrorNotification("topRight", "Ошибка получения ролей");
    }, [isUsersError]);
    useEffect(() => {
        if (isCitiesError)
            showErrorNotification("topRight", "Ошибка получения городов");
    }, [isCitiesError]);
    // -----

    // Handlers
    const confirmHandler = () => {
        if (firstName && lastName && patronymic && phone && status && tgId && travelInterests && userId){
            let city:CityModel|undefined = cities?.find((c:CityModel) => c.id == cityId);
            let user:UserModel|undefined = users?.find((u:UserModel) => u.id == userId);
            if (user && city) {
                let profile: ProfileModel = {
                    city,
                    firstName,
                    id: null,
                    lastName,
                    patronymic,
                    phone,
                    rating,
                    status,
                    tgId,
                    interests: travelInterests,
                    user,
                    userId: user.id ?? 0,
                    cityId: city.id ?? 0
                };
                if (props.selectedProfile) update({...profile, id: props.selectedProfile.id});
                else create(profile);
            }
        }
    }
    // -----

    return (
        <Modal title={props.selectedProfile ? "Редактирование профиля" : "Создание профиля"}
               open={props.visible}
               loading={(isCreateLoading || isUpdateLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedProfile ? "Сохранить" : "Создать"}
               width={'550px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Имя</div>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Фамилия</div>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Отчество</div>
                    <Input value={patronymic} onChange={(e) => setPatronymic(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Телефон</div>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Пользователь</div>
                    <Select
                        loading={isUsersLoading}
                        value={userId}
                        placeholder={"Выберите пользователя"}
                        style={{width: '100%'}}
                        onChange={(e) => setUserId(e)}
                        options={users?.map((user: UserModel) => ({value: user.id, label: user.username}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Город</div>
                    <Select
                        loading={isCitiesLoading}
                        value={cityId}
                        placeholder={"Выберите город"}
                        style={{width: '100%'}}
                        onChange={(e) => setCityId(e)}
                        options={cities?.map((city: CityModel) => ({value: city.id, label: city.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Интересы</div>
                    <Input value={travelInterests} onChange={(e) => setTravelInterests(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>TG id</div>
                    <Input value={tgId} onChange={(e) => setTgId(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Статус</div>
                    <Select
                        value={status}
                        placeholder={"Выберите статус"}
                        style={{width: '100%'}}
                        onChange={(e) => setStatus(e)}
                        options={[{value: PROFILE_STATUSES.VERIFY, label:"На проверке"},
                            {value: PROFILE_STATUSES.CONFIRMED, label:"Подтвержден"},
                            {value: PROFILE_STATUSES.CANCELED, label:"Отклонен"},
                        ]}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Рейтинг</div>
                    <InputNumber min={0} value={rating} onChange={(val) => setRating(val ?? 0)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
