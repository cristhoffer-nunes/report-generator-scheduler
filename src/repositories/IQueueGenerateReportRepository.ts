import { IGetOrdersDTO } from "../dtos/IGetOrdersDTO"
import { IReportDTO } from "../dtos/IReportDTO"
import { Orders } from "../infra/entities/Orders"
import { OCCToken } from "../infra/entities/Token"

export interface IQueueGenerateReportRepository {
	getCurrentToken(): Promise<string>
	getToken(): Promise<OCCToken>
	getOrders({ offset }: IGetOrdersDTO): Promise<Orders>
	generateReport(reportDTO: IReportDTO[]): Promise<void>
	sendEmail(): Promise<void>
}
