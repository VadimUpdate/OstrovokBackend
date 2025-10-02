import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {DatePicker, Flex, Input, InputNumber, Modal, Select} from 'antd';
import {NotificationPlacement} from "antd/es/notification/interface";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {cityAPI} from "service/CityService";
import {CityModel} from "entities/CityModel";
import {HotelModel} from "entities/HotelModel";
import {hotelAPI} from "service/HotelService";

type ModalProps = {
    selectedHotel: HotelModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const HotelModal = (props: ModalProps) => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [action, setAction] = useState("");
    const [address, setAddress] = useState("");
    const [cityId, setCityId] = useState<number | null>(null);
    const [officialRating, setOfficialRating] = useState(0);
    const [needsInspection, setNeedsInspection] = useState(false);
    const [inspectionReason, setInspectionReason] = useState("");
    const [lastInspection, setLastInspection] = useState<number | null>(null);
    const [secretGreetAvgTail, setSecretGreetAvgTail] = useState(0);
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
    }] = hotelAPI.useCreateMutation();
    const [update, {
        data: updated,
        isLoading: isUpdateLoading
    }] = hotelAPI.useUpdateMutation();
    const [getCities, {
        data: cities,
        isError: isCitiesError,
        isLoading: isCitiesLoading
    }] = cityAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getCities();
    }, []);
    useEffect(() => {
        if (props.selectedHotel) {
            setName(props.selectedHotel.name);
            setDescription(props.selectedHotel.description);
            setAction(props.selectedHotel.action);
            setAddress(props.selectedHotel.address);
            setCityId(props.selectedHotel.city?.id);
            setOfficialRating(props.selectedHotel.officialRating ?? 0);
            setNeedsInspection(props.selectedHotel.neesInspection);
            setLastInspection(props.selectedHotel.lastInspection);
            setSecretGreetAvgTail(props.selectedHotel.secretGreetAvgTail);
        }
    }, [props.selectedHotel]);
    useEffect(() => {
        if (created || updated) {
            props.setVisible(false);
            props.refresh();
        }
    }, [created, updated]);
    useEffect(() => {
        if (isCitiesError)
            showErrorNotification("topRight", "Ошибка получения городов");
    }, [isCitiesError]);
    // -----

    // Handlers
    const confirmHandler = () => {
        let city:CityModel|undefined = cities?.find((c:CityModel) => c.id == cityId);
        if (city) {
            let hotel: HotelModel = {
                id: null,
                action,
                address,
                city,
                description,
                inspectionReason,
                lastInspection,
                name,
                neesInspection: needsInspection,
                officialRating,
                secretGreetAvgTail,
                cityId: city.id
            };
        if (props.selectedHotel) update({...hotel, id: props.selectedHotel.id});
        else create(hotel);
        }

    }
    // -----

    return (
        <Modal title={props.selectedHotel ? "Редактирование отеля" : "Создание отеля"}
               open={props.visible}
               loading={(isCreateLoading || isUpdateLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedHotel ? "Сохранить" : "Создать"}
               width={'550px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Название</div>
                    <Input value={name} onChange={(e) => setName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Описание</div>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Дейстие?(уточнить что это)</div>
                    <Input value={action} onChange={(e) => setAction(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Адрес</div>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)}/>
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
                    <div style={{width: 180}}>Официальный рейтинг</div>
                    <InputNumber value={officialRating} onChange={(val) => setOfficialRating(val ?? 0)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Последняя инспекция</div>
                    <DatePicker value={lastInspection ? dayjs.unix(lastInspection) : dayjs()} onChange={date => setLastInspection(date.unix)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>secretGreetAvgTail</div>
                    <InputNumber value={secretGreetAvgTail} onChange={(val) => setSecretGreetAvgTail(val ?? 0)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
