import logger from "../config/Logger"
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

		logger.info(
			`NECESSARY EXECUTIONS: ${executions - 1} - NECESSARY OFFSET: ${
				(executions - 1) * limit
			}`
		)

		for (let i = 0; i < executions; i++) {
			logger.info(`EXECUTION: ${i} - OFFSET: ${offset}`)

			const { items } = await this.queueGenerateReportRepository.getOrders({
				offset,
			})

			items.forEach((order) => {
				order.commerceItems.forEach((product) => {
					product.priceInfo.orderDiscountInfos.forEach((item) => {
						if (item.couponCodes.length > 0) {
							const includes = item.couponCodes.filter((couponCode) =>
								couponCode.startsWith("CB")
							)
							if (includes.length != 0) {
								const filtro = report.filter(
									(reportObject) => reportObject.order_occ === order.id
								)

								if (filtro.length == 0) {
									console.log({
										order: order.id,
										document: order.client_document,
									})
									let payload: IReportDTO = {
										Pedido_OCC: order.id,
										Pedido_SAP: order.Pedido_SAP,
										Cupom: item.couponCodes[0],
										CPF_CNPJ: order.client_document,
										Valor_descontado: order.priceInfo.discountAmount,
										Valor_com_frete: order.priceInfo.total,
										Subtotal_com_frete:
											order.priceInfo.rawSubtotal + order.priceInfo.shipping,
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
		logger.info("GENERATE REPORT - START")
		await this.queueGenerateReportRepository.generateReport(report)
		logger.info("GENERATE REPORT - SUCCESS")

		logger.info("SEND EMAIL - START")
		await this.queueGenerateReportRepository.sendEmail()
		logger.info("SEND EMAIL - SUCCESS")
	}
}
