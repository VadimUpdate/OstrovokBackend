import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {DatePicker, Flex, Input, InputNumber, Modal, Select} from 'antd';
import {NotificationPlacement} from "antd/es/notification/interface";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {HotelModel} from "entities/HotelModel";
import {HotelInspectionRequestModel} from "entities/HotelInspectionRequestModel";
import {hotelInspectionRequestAPI} from "service/HotelInspectionRequestService";
import {hotelAPI} from "service/HotelService";
import {HOTEL_INSPECTION_STATUSES} from "shared/config/constants";

type ModalProps = {
    selectedRequest: HotelInspectionRequestModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const HotelInspectionRequestModal = (props: ModalProps) => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    // -----

    // States
    const [hotelId, setHotelId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
    const [status, setStatus] = useState("");
    const [creator, setCreator] = useState("");
    const [description, setDescription] = useState("");
    const [sessionCount, setSessionCount] = useState(0);
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
    }] = hotelInspectionRequestAPI.useCreateMutation();
    const [update, {
        data: updated,
        isLoading: isUpdateLoading
    }] = hotelInspectionRequestAPI.useUpdateMutation();
    const [getHotels, {
        data: hotels,
        isError: isHotelsError,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getHotels();
    }, []);
    useEffect(() => {
        if (currentUser) setCreator(currentUser.username);
    }, [currentUser])
    useEffect(() => {
        if (props.selectedRequest) {
            setHotelId(props.selectedRequest.hotel.id);
            setDescription(props.selectedRequest.description);
            setStartDate(props.selectedRequest.startDate);
            setStatus(props.selectedRequest.status);
            setSessionCount(props.selectedRequest.sessionCount);
            setCreator(props.selectedRequest.creator);
        }
    }, [props.selectedRequest]);
    useEffect(() => {
        if (created || updated) {
            props.setVisible(false);
            props.refresh();
        }
    }, [created, updated]);
    useEffect(() => {
        if (isHotelsError)
            showErrorNotification("topRight", "Ошибка получения городов");
    }, [isHotelsError]);
    // -----

    // Handlers
    const confirmHandler = () => {
        if (currentUser?.role == "ROLE_USER"){
            showErrorNotification("topRight", "Недостаточно полномочий");
            return;
        }
        if (hotelId && startDate){
            const date = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss');
            const hotel:HotelModel|undefined = hotels?.find((h:HotelModel) => h.id == hotelId);
            if (hotel) {
                let request: HotelInspectionRequestModel = {
                    creator,
                    description,
                    hotel,
                    sessionCount,
                    startDate: date,
                    status: ""
                };
                if (props.selectedRequest) update({...request, id: props.selectedRequest.id});
                else create(request);
            }
        }
    }
    // -----

    return (
        <Modal title={props.selectedRequest ? "Редактирование потребности в инспекциии" : "Создание потребности в инспекции"}
               open={props.visible}
               loading={(isCreateLoading || isUpdateLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedRequest ? "Сохранить" : "Создать"}
               width={'550px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Отель</div>
                    <Select
                        loading={isHotelsLoading}
                        value={hotelId}
                        placeholder={"Выберите отель"}
                        style={{width: '100%'}}
                        onChange={(e) => setHotelId(e)}
                        options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Дата начала</div>
                    <DatePicker value={startDate ? dayjs(startDate, 'YYYY-MM-DDTHH:mm:ss') : dayjs()} onChange={date => setStartDate(date.format('YYYY-MM-DDTHH:mm:ss'))}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Статус</div>
                    <Select
                        value={status}
                        placeholder={"Выберите отель"}
                        style={{width: '100%'}}
                        onChange={(e) => setStatus(e)}
                        options={[{value: HOTEL_INSPECTION_STATUSES.OPEN, label:"Открыта"},
                            {value: HOTEL_INSPECTION_STATUSES.CLOSE, label:"Закрыта"}]}
                    />                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Создатель</div>
                    <Input value={creator} onChange={(e) => setCreator(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Описание</div>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Колличество участников</div>
                    <InputNumber value={sessionCount} onChange={(val) => setSessionCount(val ?? 0)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
