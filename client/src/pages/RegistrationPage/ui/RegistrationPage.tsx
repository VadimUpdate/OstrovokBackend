import {Button, Flex, Input, NotificationArgsProps, Select, Space} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {useNavigate} from "react-router-dom";
import {userAPI} from "service/UserService";
import {UserModel} from "entities/UserModel";
import {profileAPI} from "service/ProfileService";
import {ProfileModel} from "entities/ProfileModel";
import {CityModel} from "entities/CityModel";
import {cityAPI} from "service/CityService";

type NotificationPlacement = NotificationArgsProps['placement'];

const RegistrationPage = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    const dispatch = useDispatch();
    // -----
    
    // States
    const [firstname, setFirstname] = useState<string | null>(null);
    const [lastname, setLastname] = useState<string | null>(null);
    const [patronymic, setPatronymic] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [tgId, setTgId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [cityId, setCityId] = useState<number | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
    const navigate = useNavigate();
    // -----

    // Notifications
    const showErrorNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.error({
            message: `Ошибка`,
            description: msg,
            placement,
        });
    };
    const showSuccessNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.success({
            message: `ОК`,
            description: msg,
            placement,
        });
    };
    const showInfoNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.info({
            message: `Внимание`,
            description: msg,
            placement,
        });
    };
    // -----

    // Web requests
    const [createUser, {
        data: createdUser,
        isLoading: isCreateUserLoading,
        isError: isCreateUserError
    }] = userAPI.useCreateMutation();
    const [createProfile, {
        data: createdProfile,
        isLoading: isCreateProfileLoading,
        isError: isErrorCreateProfile,
    }] = profileAPI.useCreateMutation();
    const [getCities, {
        data: cities,
        isError: isCitiesError,
        isLoading: isCitiesLoading
    }] = cityAPI.useGetAllMutation();
    // -----
    
    // Handlers
    const loginHandler = () => {
        navigate('/login');
    }
    const registrationHandler = () => {
        if (!username || !password || !email) {
            showInfoNotification('topRight', "Некоторые поля остались пустыми");
            return;
        }
        let user:UserModel = {
            email,
            id: null,
            password,
            role: "ROLE_USER",
            username
        }
        createUser(user);
    }
    // -----

    // Effects
    useEffect(() => {
        getCities();
    }, []);
    useEffect(() => {
        if (isCreateUserError) {
            showErrorNotification("topRight", "Ошибка при регистрации")
        }
    }, [isCreateUserError]);
    useEffect(() => {
        if (createdUser && cities) {
            let city = cities.find((c:CityModel) => c.id == cityId);
            if (city) {
                let profile: ProfileModel = {
                    city,
                    firstName: "",
                    id: null,
                    interests: "",
                    lastName: "",
                    patronymic: "",
                    phone: "",
                    rating: 0,
                    status: "",
                    tgId: "",
                    user: createdUser,
                    userId: createdUser.id ?? 1,
                    cityId: city.id
                }
                createProfile(profile);
            }
        }
    }, [createdUser]);
    useEffect(() => {
        if (createdProfile) {
            showSuccessNotification('topRight', "Аккаунт успешно создан, пожалуйста, авторизуйтесь")
            setTimeout(() => loginHandler(), 1000)
        }
    }, [createdProfile])
    // -----

    return(
        <Flex justify={'center'} align={'center'} style={{height: window.innerHeight}}>
            <Space direction={'vertical'} align={'center'}>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Имя</div>
                    <Input style={{width: 200}} value={firstname ?? ""} onChange={(e) => setFirstname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Фамилия</div>
                    <Input style={{width: 200}} value={lastname ?? ""} onChange={(e) => setLastname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Отчество</div>
                    <Input style={{width: 200}} value={patronymic ?? ""} onChange={(e) => setPatronymic(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Почта</div>
                    <Input style={{width: 200}} value={email ?? ""} onChange={(e) => setEmail(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>ТГ ИД</div>
                    <Input style={{width: 200}} value={tgId ?? ""} onChange={(e) => setTgId(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Логин</div>
                    <Input style={{width: 200}} value={username ?? ""} onChange={(e) => setUsername(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Город</div>
                    <Select
                        loading={isCitiesLoading}
                        value={cityId}
                        placeholder={"Выберите город"}
                        style={{width: 200}}
                        onChange={(e) => setCityId(e)}
                        options={cities?.map((city: CityModel) => ({value: city.id, label: city.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Пароль</div>
                    <Input.Password style={{width: 200}} value={password ?? ""} onChange={(e) => setPassword(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Подтверждение пароля</div>
                    <Input.Password style={{width: 200}} value={confirmPassword ?? ""} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </Flex>
                <Button disabled={isCreateUserLoading || isCreateProfileLoading} onClick={registrationHandler} type={'primary'} style={{width: 200}}>Зарегистрироваться</Button>
                <Button onClick={loginHandler} type={'link'} style={{width: 200}}>Войти</Button>
            </Space>
        </Flex>
    )
}

export default RegistrationPage;