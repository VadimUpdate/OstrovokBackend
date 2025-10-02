import {authAPI} from "service/AuthService";
import React, {useEffect, useState} from "react";
import {Menu, MenuProps, NotificationArgsProps} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {useLocation, useNavigate} from "react-router-dom";
import {LogoutOutlined} from "@ant-design/icons";
import {setCurrentUser} from "store/slice/UserSlice";
import {UserModel} from "entities/UserModel";

type MenuItem = Required<MenuProps>['items'][number];


type NotificationPlacement = NotificationArgsProps['placement'];
export const Navbar = () => {

    // Store
    const user = useSelector((state: RootStateType) => state.currentUser.user);
    const dispatch = useDispatch();
    // -----

    // States
    let location = useLocation();
    let navigate = useNavigate();
    const api = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh'));
    const [currentMenuItem, setCurrentMenuItem] = useState('users');
    // -----

    // Notifications
    const showErrorNotification = (placement: NotificationPlacement, msg: string) => {
        api?.error({
            message: `Ошибка`,
            description: msg,
            placement,
        });
    };
    const showSuccessNotification = (placement: NotificationPlacement, msg: string) => {
        api?.success({
            message: `ОК`,
            description: msg,
            placement,
        });
    };
    const showInfoNotification = (placement: NotificationPlacement, msg: string) => {
        api?.info({
            message: `Внимание`,
            description: msg,
            placement,
        });
    };
    // -----

    // Web requests
    const [verifyTokenRequest, {
        data: verifyTokenData,
        isError: verifyTokenIsError,
    }] = authAPI.useVerifyMutation();
    const [refreshTokenRequest, {
        data: refreshTokenData,
        isSuccess: refreshTokenIsSuccess,
        isError: refreshTokenIsError,
    }] = authAPI.useRefreshMutation();
    // -----

    // Effects
    useEffect(() => {
        if (window.location.pathname.indexOf('login') == -1) {
            if (accessToken && refreshToken) {
                verifyTokenRequest({token: accessToken});
            } else {
                //localStorage.clear();
                //navigate('/login');
            }
        }
    }, []);
    useEffect(() => {
        if (verifyTokenIsError && refreshToken) {
            refreshTokenRequest({'refresh': refreshToken})
        }
    }, [verifyTokenIsError]);
    useEffect(() => {
        if (refreshTokenIsSuccess && refreshTokenData) {
            let accessToken = refreshTokenData.access;
            if (accessToken) {
                localStorage.setItem('access', accessToken);
                showInfoNotification('topRight', 'Токен обновлен')
            }
        }
    }, [refreshTokenIsSuccess]);
    useEffect(() => {
        if (refreshTokenIsError) {
            localStorage.clear();
            navigate('/login');
        }
    }, [refreshTokenIsError]);
    useEffect(() => {
        if (verifyTokenData){
            let user: UserModel = {
                email: "", id: null, password: "123", role: verifyTokenData.role, username: verifyTokenData.username

            }
            dispatch(setCurrentUser(user));
        }
    }, [verifyTokenData]);
    // -----

    // Handlers
    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key == 'users') navigate('/users');
        if (e.key == 'profiles') navigate('/profiles');
        if (e.key == 'hotels') navigate('/hotels');
        if (e.key == 'hotelInspectionRequests') navigate('/hotelInspectionRequests');
        if (e.key == 'guestRequests') navigate('/guestRequests');
        if (e.key == 'inspectionReports') navigate('/inspectionReports');
        if (e.key == 'analytic') navigate('/analytic');
        if (e.key == 'logout') {
            localStorage.clear();
            navigate('/login');
        }
        setCurrentMenuItem(e.key);
    };
    // -----

    // Useful utils
    const items: MenuItem[] = user?.role == 'ROLE_ADMIN' ?
        [
        {
            label: 'Пользователи',
            key: 'users',
        },
        {
            label: 'Профили',
            key: 'profiles',
        },
        {
            label: 'Отели',
            key: 'hotels',
        },
        {
            label: 'Инспекции отелей',
            key: 'hotelInspectionRequests',
        },
        {
            label: 'Заявки тайных гостей',
            key: 'guestRequests',
        },
        {
            label: 'Отчеты',
            key: 'inspectionReports',
        },
        {
            label: 'Аналитика',
            key: 'analytic',
        },
        {
            label: 'Выйти',
            key: 'logout',
            icon: <LogoutOutlined />,
        },
    ]
        :
        [
            {
                label: 'Отели',
                key: 'hotels',
            },
            {
                label: 'Доступные к инспекции отели',
                key: 'hotelInspectionRequests',
            },
            {
                label: 'Ваши заявки на инспекцию',
                key: 'guestRequests',
            },
            {
                label: 'Ваши отчеты',
                key: 'inspectionReports',
            },
            {
                label: 'Выйти',
                key: 'logout',
                icon: <LogoutOutlined />,
            },
        ];
    // -----

    if (window.location.pathname.indexOf('login') == -1 && window.location.pathname.indexOf('registration') == -1) return (
        <Menu onClick={onClick} selectedKeys={[currentMenuItem]} mode="horizontal" items={items} style={{marginBottom: 20}}/>
    );
    return (<></>)
}