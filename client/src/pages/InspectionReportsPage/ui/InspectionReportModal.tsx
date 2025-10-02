import React, {useEffect, useState} from 'react';
import {Divider, Flex, Input, InputNumber, Modal, Rate, Select, Upload, UploadFile, Button, message, Image} from 'antd';
import {UploadOutlined, EyeOutlined} from '@ant-design/icons';
import {NotificationPlacement} from "antd/es/notification/interface";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {guestRequestAPI} from "service/GuestRequestService";
import {GuestRequestModel} from "entities/GuestRequestModel";
import {inspectionReportAPI} from "service/InsperctionReportService";
import {InspectionReportModel} from "entities/InspectionReportModel";
import {REPORT_STATUSES} from "shared/config/constants";

const { TextArea } = Input;

// Добавляем тип для медиа-файла
interface ReportMedia {
    id: string;
    fileData: string; // Это base64 строка с изображением
    fileName?: string;
    mimeType?: string;
}

type ModalProps = {
    inspectionReport: InspectionReportModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
};

export const InspectionReportModal = (props: ModalProps) => {
    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    // -----

    // States
    const [guestRequestId, setGuestRequestId] = useState<number | null>(null);
    const [serviceRating, setServiceRating] = useState(0);
    const [serviceComment, setServiceComment] = useState("");
    const [roomConditionRating, setRoomConditionRating] = useState(0);
    const [roomConditionComment, setRoomConditionComment] = useState("");
    const [moneyRating, setMoneyRating] = useState(0);
    const [improvementComment, setImprovementComment] = useState("");
    const [overallRating, setOverallRating] = useState(0);
    const [cleannessRating, setCleannessRating] = useState(0);
    const [cleannessComment, setCleannessComment] = useState("");
    const [finalVerdict, setFinalVerdict] = useState("");
    const [status, setStatus] = useState("");
    const [pointsFromAdmin, setPointsFromAdmin] = useState<number|null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [existingMedia, setExistingMedia] = useState<ReportMedia[]>([]);
    const [isLoadingMedia, setIsLoadingMedia] = useState(false);
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
    }] = inspectionReportAPI.useCreateMutation();
    const [update, {
        data: updated,
        isLoading: isUpdateLoading
    }] = inspectionReportAPI.useUpdateMutation();
    const [getGuestRequests, {
        data: guestRequests,
        isError: isGetGuestRequestsError,
        isLoading: isGetGuestRequestsLoading
    }] = guestRequestAPI.useGetAllMutation();
    // -----

    // Функция для загрузки прикрепленных медиа-файлов
    const fetchReportMedia = async (reportId: string) => {
        if (!reportId) return;

        setIsLoadingMedia(true);
        try {
            const response = await fetch(`http://localhost:8080/api/report-media?reportId=${reportId}`);
            if (response.ok) {
                const mediaData: ReportMedia[] = await response.json();
                setExistingMedia(mediaData);
            } else if (response.status !== 404) {
                showErrorNotification("topRight", "Ошибка загрузки прикрепленных файлов");
            }
        } catch (error) {
            console.error('Error fetching report media:', error);
            showErrorNotification("topRight", "Ошибка загрузки прикрепленных файлов");
        } finally {
            setIsLoadingMedia(false);
        }
    };

    // File upload handlers
    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    const uploadFilesSequentially = async (reportId: string) => {
        if (fileList.length === 0) return;

        setIsUploading(true);

        for (const file of fileList) {
            if (file.originFileObj) {
                try {
                    const formData = new FormData();
                    formData.append("file", file.originFileObj, file.name);

                    const response = await fetch(`http://localhost:8080/api/report-media?reportId=${reportId}`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error(`Upload failed for ${file.name}`);
                    }

                    const result = await response.text();
                    console.log(`File ${file.name} uploaded successfully:`, result);

                } catch (error) {
                    console.error(`Error uploading ${file.name}:`, error);
                    showErrorNotification("topRight", `Ошибка загрузки файла ${file.name}`);
                    continue;
                }
            }
        }

        setIsUploading(false);
        message.success("Все файлы загружены");
        setFileList([]);
    };

    // Effects
    useEffect(() => {
        getGuestRequests();
    }, []);

    useEffect(() => {
        if (props.inspectionReport) {
            setGuestRequestId(props.inspectionReport.guestRequest.id);
            setCleannessRating(props.inspectionReport.cleanRating);
            setServiceRating(props.inspectionReport.serviceRating);
            setRoomConditionRating(props.inspectionReport.roomConditionRating);
            setMoneyRating(props.inspectionReport.moneyRating);
            setOverallRating(props.inspectionReport.overallRating);
            setCleannessComment(props.inspectionReport.cleanlessComment);
            setRoomConditionComment(props.inspectionReport.roomConditionComment);
            setServiceComment(props.inspectionReport.serviceComment);
            setRoomConditionRating(props.inspectionReport.roomConditionRating);
            setImprovementComment(props.inspectionReport.improvementComment);
            setFinalVerdict(props.inspectionReport.finalVerdict);
            setStatus(props.inspectionReport.status);
            setPointsFromAdmin(props.inspectionReport.pointsFromAdmin);

            // Загружаем прикрепленные файлы если отчет уже существует
            if (props.inspectionReport.id) {
                fetchReportMedia(props.inspectionReport.id.toString());
            }
        } else {
            // Сбрасываем состояние при создании нового отчета
            setExistingMedia([]);
        }
    }, [props.inspectionReport]);

    useEffect(() => {
        if (created || updated) {
            const reportId = created?.id || updated?.id;
            if (reportId) {
                // Загружаем файлы после создания/обновления отчета
                uploadFilesSequentially(reportId.toString()).then(() => {
                    props.setVisible(false);
                    props.refresh();
                });
            } else {
                props.setVisible(false);
                props.refresh();
            }
        }
    }, [created, updated]);

    useEffect(() => {
        if (isGetGuestRequestsError)
            showErrorNotification("topRight", "Ошибка получения заявок");
    }, [isGetGuestRequestsError]);
    // -----

    // Handlers
    const confirmHandler = () => {
        if (guestRequestId){
            const guestRequest:GuestRequestModel|undefined = guestRequests?.find((g:GuestRequestModel) => g.id == guestRequestId);
            if (guestRequest) {
                let report: InspectionReportModel = {
                    cleanlessComment: cleannessComment,
                    cleanRating: cleannessRating,
                    finalVerdict,
                    guestRequest,
                    id: null,
                    improvementComment,
                    moneyRating,
                    overallRating,
                    pointsFromAdmin,
                    roomConditionComment,
                    roomConditionRating,
                    serviceComment,
                    serviceRating,
                    status
                };
                if (props.inspectionReport) update({...report, id: props.inspectionReport.id});
                else create(report);
            }
        }
    }

    const customRequest = ({ file, onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    // Функция для отображения существующих изображений
    const renderExistingMedia = () => {
        if (existingMedia.length === 0) return null;

        return (
            <Flex align={"center"} style={{ marginBottom: 16 }}>
                <div style={{width: 330}}>Прикрепленные файлы:</div>
                <Flex wrap="wrap" gap="small">
                    {existingMedia.map((media) => (
                        <div key={media.id} style={{ position: 'relative' }}>
                            <Image
                                width={80}
                                height={80}
                                src={`data:image/jpeg;base64,${media.fileData}`}
                                placeholder={
                                    <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                                        Loading...
                                    </div>
                                }
                                preview={{
                                    mask: <><EyeOutlined /> Просмотр</>,
                                }}
                                style={{
                                    objectFit: 'cover',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: 6
                                }}
                            />
                        </div>
                    ))}
                </Flex>
            </Flex>
        );
    };
    // -----

    return (
        <Modal
            title={props.inspectionReport ? "Редактирование отчета" : "Создание отчета"}
            open={props.visible}
            loading={isCreateLoading || isUpdateLoading || isUploading || isLoadingMedia}
            onOk={confirmHandler}
            onCancel={() => props.setVisible(false)}
            okText={props.inspectionReport ? "Сохранить" : "Создать"}
            width={'700px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 330}}>Заявка тайного гостя</div>
                    <Select
                        loading={isGetGuestRequestsLoading}
                        value={guestRequestId}
                        placeholder={"Выберите заявку тайного гостя"}
                        style={{width: '100%'}}
                        onChange={(e) => setGuestRequestId(e)}
                        options={currentUser?.role == "ROLE_USER" ?
                            guestRequests?.filter((gr: GuestRequestModel) => gr.guest.user.username == currentUser.username).map((gr: GuestRequestModel) => ({value: gr.id, label: `${gr.guest.lastName} ${gr.guest.firstName} ${gr.guest.patronymic ?? ""} - ${gr.hotelInspection?.hotel.name}`}))
                            :
                            guestRequests?.map((gr: GuestRequestModel) => ({value: gr.id, label: `${gr.guest.lastName} ${gr.guest.firstName} ${gr.guest.patronymic ?? ""} ${gr.hotelInspection?.hotel.name}`}))
                        }
                    />
                </Flex>
                <Divider />
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оцените чистоту в отеле</div>
                    <Rate allowHalf value={cleannessRating} onChange={(rating) => setCleannessRating(rating)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оставьте более подробный отзыв о чистоте в отеле</div>
                    <TextArea value={cleannessComment} onChange={(e) => setCleannessComment(e.target.value)} rows={4} placeholder="Расскажи максимально подробно, мы с удовольствием прочитаем!" maxLength={6} />
                </Flex>
                <Divider />
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оцените уровень сервиса в отеле</div>
                    <Rate allowHalf value={serviceRating} onChange={(rating) => setServiceRating(rating)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оставьте более подробный отзыв о сервисе в отеле</div>
                    <TextArea value={serviceComment} onChange={(e) => setServiceComment(e.target.value)} rows={4} placeholder="Расскажи максимально подробно, мы с удовольствием прочитаем!" maxLength={6} />
                </Flex>
                <Divider />
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оцените качество номер</div>
                    <Rate allowHalf value={roomConditionRating} onChange={(rating) => setRoomConditionRating(rating)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оставьте более подробный отзыв о качестве номеров</div>
                    <TextArea value={roomConditionComment} onChange={(e) => setRoomConditionComment(e.target.value)} rows={4} placeholder="Расскажи максимально подробно, мы с удовольствием прочитаем!" maxLength={6} />
                </Flex>
                <Divider />
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оцените соотношение цена/качество</div>
                    <Rate allowHalf value={moneyRating} onChange={(rating) => setMoneyRating(rating)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оставьте improvementComment</div>
                    <TextArea value={improvementComment} onChange={(e) => setImprovementComment(e.target.value)} rows={4} placeholder="Расскажи максимально подробно, мы с удовольствием прочитаем!" maxLength={6} />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 330}}>Оставьте общий отзыв об отеле</div>
                    <TextArea value={finalVerdict} onChange={(e) => setFinalVerdict(e.target.value)} rows={4} placeholder="Расскажи максимально подробно, мы с удовольствием прочитаем!" maxLength={6} />
                </Flex>

                {/* Новый блок для отображения существующих файлов */}
                {props.inspectionReport && renderExistingMedia()}

                {/* Блок для загрузки новых файлов */}
                <Divider />
                <Flex align={"center"}>
                    <div style={{width: 330}}>Добавить файлы</div>
                    <Upload
                        customRequest={customRequest}
                        fileList={fileList}
                        onChange={handleFileChange}
                        multiple
                        listType="picture"
                        beforeUpload={() => false}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
                    </Upload>
                </Flex>

                <Divider />
                <Flex align={"center"}>
                    <div style={{width: 330}}>Статус</div>
                    <Select
                        loading={isGetGuestRequestsLoading}
                        value={status}
                        placeholder={"Выберите статус"}
                        style={{width: '100%'}}
                        onChange={(e) => setStatus(e)}
                        options={[
                            {value: REPORT_STATUSES.REPORT_SENT, label:"Отчет отправлен"},
                            {value: REPORT_STATUSES.CONFIRMED, label:"Обработано"},
                        ]}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 330}}>Количество баллов за отзыв</div>
                    <InputNumber value={pointsFromAdmin} onChange={(val) => setPointsFromAdmin(val ?? 0)} />
                </Flex>
            </Flex>
        </Modal>
    );
};