import { IReportDTO } from "../dtos"
import { Orders } from "../infra/entities/Orders"
import { OCCToken } from "../infra/entities/Token"

export interface IReportRepository {
  getCurrentToken(): Promise<string>
  getToken(): Promise<OCCToken>
  getGeralOrders(offset: number): Promise<Orders>
  generateReport(reportDTO: IReportDTO[]): Promise<void>
  sendEmail(): Promise<void>
  deleteFiles(): void
}
