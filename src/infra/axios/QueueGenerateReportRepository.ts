import axios from "axios"
import xlsx from "xlsx"
import nodemailer from "nodemailer"
import EnvVariable from "../../config/EnvVariable"
import { Orders } from "infra/entities/Orders"
import { IGetOrdersDTO } from "../../dtos/iGetOrdersDTO"
import { IReportDTO } from "../../dtos/IReportDTO"
import { IQueueGenerateReportRepository } from "repositories/IQueueGenerateReportRepository"
import { OCCToken } from "infra/entities/Token"

export class QueueGenerateReportRepository
	implements IQueueGenerateReportRepository
{
	protected occToken = {
		access_token: "",
		expires_in: 0,
		time: {
			getTime: () => 0,
		},
	}

	protected url: string
	protected appKey: string

	constructor(url: string, appKey: string) {
		this.url = url
		this.appKey = appKey
	}

	async getCurrentToken(): Promise<string> {
		if (
			!this.occToken.access_token ||
			Math.abs(new Date().getTime() - this.occToken.time.getTime()) >
				this.occToken.expires_in * 300
		) {
			const token = await this.getToken()

			this.occToken.access_token = token.access_token
			this.occToken.expires_in = token.expires_in
			this.occToken.time = new Date()
		}

		return this.occToken.access_token
	}

	async getToken(): Promise<OCCToken> {
		const { status, data } = await axios.post(
			`${this.url}/ccapp/v1/login`,
			"grant_type=client_credentials",
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Bearer ${this.appKey}`,
				},
			}
		)

		if (status === 200) {
			return data
		}
	}
	async getOrders({ offset = 0 }: IGetOrdersDTO): Promise<Orders> {
		const lastDate = new Date(Date.now() - <any>EnvVariable.CC_ORDERS_LAST_TIME)

		const { data } = await axios.get(
			`${
				this.url
			}/ccapp/v1/orders?queryFormat=SCIM&fields=submittedDate,id,commerceItems.priceInfo.orderDiscountInfos,Pedido_SAP,clientDocument&q=submittedDate gt "2023-03-01T03:00:00.000Z" and submittedDate lt "${lastDate.toJSON()}"&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${await this.getCurrentToken()}`,
				},
			}
		)

		return data
	}
	async generateReport(reportDTO: IReportDTO[]): Promise<void> {
		const date = new Date()
		const day = date.getDate().toString().padStart(2, "0")
		const month = (date.getMonth() + 1).toString().padStart(2, "0")
		const year = date.getFullYear()
		const worksheet = xlsx.utils.json_to_sheet(reportDTO)
		const workbook = xlsx.utils.book_new()

		xlsx.utils.book_append_sheet(workbook, worksheet, `${day}_${month}_${year}`)

		xlsx.write(workbook, { bookType: "xlsx", type: "buffer" })
		xlsx.write(workbook, { bookType: "xlsx", type: "binary" })

		xlsx.writeFile(workbook, "Leo80CouponReport.xlsx")
	}
	async sendEmail(): Promise<void> {
		const transport = nodemailer.createTransport({
			host: EnvVariable.MAIL_HOST,
			port: <number>EnvVariable.MAIL_PORT,
			auth: {
				user: EnvVariable.MAIL_USER,
				pass: EnvVariable.MAIL_PASS,
			},
		})

		transport.sendMail({
			from: EnvVariable.MAIL_FROM,
			to: EnvVariable.MAIL_TO,
			subject: EnvVariable.MAIL_SUBJECT,
			html: EnvVariable.MAIL_HTML,
			text: EnvVariable.MAIL_TEXT,
			attachments: [
				{
					filename: "Leo80CouponReport.xlsx",
					path: process.cwd() + "/Leo80CouponReport.xlsx",
					cid: "uniq-Leo80CouponReport.xlsx",
				},
			],
		})
	}
}
