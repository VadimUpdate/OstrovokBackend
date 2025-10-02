import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {DatePicker, Flex, Modal, Select} from 'antd';
import {NotificationPlacement} from "antd/es/notification/interface";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {HotelInspectionRequestModel} from "entities/HotelInspectionRequestModel";
import {hotelInspectionRequestAPI} from "service/HotelInspectionRequestService";
import {guestRequestAPI} from "service/GuestRequestService";
import {GuestRequestModel} from "entities/GuestRequestModel";
import {profileAPI} from "service/ProfileService";
import {ProfileModel} from "entities/ProfileModel";

type ModalProps = {
    selectedRequest: GuestRequestModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const GuestRequestModal = (props: ModalProps) => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    // -----

    // States
    const [hotelInspectionRequestId, setHotelInspectionRequestId] = useState<number | undefined>(undefined);
    const [guestId, setGuestId] = useState<number | null>(null);
    const [dateStart, setDateStart] = useState(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
    const [dateFinish, setDateFinish] = useState(dayjs().add(5, 'day').format('YYYY-MM-DDTHH:mm:ss'));
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
    }] = guestRequestAPI.useCreateMutation();
    const [update, {
        data: updated,
        isLoading: isUpdateLoading
    }] = guestRequestAPI.useUpdateMutation();
    const [getHotelInspectionRequest, {
        data: hotelInspectionRequests,
        isError: isHotelInspectionRequestsError,
        isLoading: isHotelInspectionRequestsLoading
    }] = hotelInspectionRequestAPI.useGetAllMutation();
    const [getProfilesRequest, {
        data: profiles,
        isLoading: isProfilesLoading
    }] = profileAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getProfilesRequest();
        getHotelInspectionRequest();
    }, []);
    useEffect(() => {
        if (props.selectedRequest) {
            setHotelInspectionRequestId(props.selectedRequest.hotelInspection?.id);
            setGuestId(props.selectedRequest.guest.id);
            setDateStart(props.selectedRequest.dateStart);
            setDateFinish(props.selectedRequest.dateFinish);
        }
    }, [props.selectedRequest]);
    useEffect(() => {
        if (created || updated) {
            props.setVisible(false);
            props.refresh();
        }
    }, [created, updated]);
    useEffect(() => {
        if (isHotelInspectionRequestsError)
            showErrorNotification("topRight", "Ошибка получения городов");
    }, [isHotelInspectionRequestsError]);
    useEffect(() => {
        if (profiles) {
            if (currentUser){
                if (currentUser.role == "ROLE_USER") {
                    let id = profiles.find((p:ProfileModel) => p.user.username == currentUser?.username)?.id;
                    if (id) setGuestId(id)
                }
            }
        }
    }, [profiles])
    // -----

    // Handlers
    const confirmHandler = () => {
        if (hotelInspectionRequestId && guestId && dateStart && dateFinish){
            const hotelInspectionRequest:HotelInspectionRequestModel|undefined = hotelInspectionRequests?.find((hr:HotelInspectionRequestModel) => hr.id == hotelInspectionRequestId);
            const guest:ProfileModel|undefined = profiles?.find((g:ProfileModel) => g.id == guestId);
            const dateStartStr = dayjs(dateStart).format('YYYY-MM-DDTHH:mm:ss');
            const dateFinishStr = dayjs(dateFinish).format('YYYY-MM-DDTHH:mm:ss');
            if (hotelInspectionRequest && guest) {
                let request: GuestRequestModel = {
                    id: null,
                    guest,
                    hotelInspectionRequest,
                    dateStart: dateStartStr,
                    dateFinish: dateFinishStr,
                    hotelInspectionId: hotelInspectionRequest.id ?? 0,
                    guestId: guest.id ?? 0,
                };
                if (props.selectedRequest) update({...request, id: props.selectedRequest.id});
                else create(request);
            }
        }
    }
    // -----

    return (
        <Modal title={props.selectedRequest ? "Редактирование заявки тайного гостя" : "Создание заявки тайного гостя"}
               open={props.visible}
               loading={(isCreateLoading || isUpdateLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedRequest ? "Сохранить" : "Создать"}
               width={'650px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 230}}>Инспектируемый отель</div>
                    <Select
                        loading={isHotelInspectionRequestsLoading}
                        value={hotelInspectionRequestId}
                        placeholder={"Выберите отель"}
                        style={{width: '100%'}}
                        onChange={(e) => setHotelInspectionRequestId(e)}
                        options={hotelInspectionRequests?.map((hr: HotelInspectionRequestModel) => ({value: hr.id, label: hr.hotel.name}))}
                    />
                </Flex>
                <Flex align={"center"} >
                    <div style={{width: 230}}>Секретный гость</div>
                    <Select
                        loading={isProfilesLoading}
                        value={guestId}
                        placeholder={"Выберите пользователя"}
                        style={{width: '100%'}}
                        onChange={(e) => setGuestId(e)}
                        options={
                        currentUser?.role == "ROLE_USER" ?
                        profiles?.filter((g: ProfileModel) => g.user.username == currentUser.username).map((g: ProfileModel) => ({value: g.id, label: `${g.lastName} ${g.firstName} ${g.patronymic}`}))
                            :
                        profiles?.map((g: ProfileModel) => ({value: g.id, label: `${g.lastName} ${g.firstName} ${g.patronymic}`}))
                    }
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 230}}>Дата заезда</div>
                    <DatePicker value={dateStart ? dayjs(dateStart, 'YYYY-MM-DDTHH:mm:ss') : dayjs()} onChange={date => setDateStart(date.format('YYYY-MM-DDTHH:mm:ss'))}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 230}}>Дата выезда</div>
                    <DatePicker value={dateFinish ? dayjs(dateFinish, 'YYYY-MM-DDTHH:mm:ss') : dayjs()} onChange={date => setDateFinish(date.format('YYYY-MM-DDTHH:mm:ss'))}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
