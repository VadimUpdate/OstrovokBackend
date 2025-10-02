import {InspectionReportModel} from "entities/InspectionReportModel";

export type ReportMediaModel = {
    id:number;
    report: InspectionReportModel;
    formatFile: string;
    fileType: string;
}
