import { IReportDTO } from "../dtos/IReportDTO"
import { QueueGenerateReportRepository } from "../infra/axios/QueueGenerateReportRepository"

export class QueueGenerateReportUseCase {
	constructor(
		private queueGenerateReportRepository: QueueGenerateReportRepository
	) {}

	async execute() {
		let offset: number = 0
		let executions: number
		const report: any[] = []

		const { totalResults, limit } =
			await this.queueGenerateReportRepository.getOrders({
				offset: 0,
			})

		if (totalResults <= 250) {
			executions = 1
		} else {
			executions = Math.ceil(totalResults / limit)
		}

		for (let i = 0; i < executions; i++) {
			console.log({
				executions: i,
				offset: offset,
			})

			const { items } = await this.queueGenerateReportRepository.getOrders({
				offset,
			})

			items.forEach((order) => {
				order.commerceItems.forEach((product) => {
					product.priceInfo.orderDiscountInfos.forEach((item) => {
						if (item.couponCodes.length > 0) {
							const includes = item.couponCodes[0].includes("LEO80")
							if (includes) {
								const filtro = report.filter(
									(reportObject) => reportObject.order_occ === order.id
								)

								if (filtro.length == 0) {
									let payload: IReportDTO = {
										order_occ: order.id,
										order_sap: order.Pedido_SAP,
										coupon: item.couponCodes[0],
										client_document: order.client_document,
									}

									report.push(payload)
								}
							}
						}
					})
				})
			})

			offset = offset + 250
		}

		await this.queueGenerateReportRepository.generateReport(report)
		await this.queueGenerateReportRepository.sendEmail()
	}
}