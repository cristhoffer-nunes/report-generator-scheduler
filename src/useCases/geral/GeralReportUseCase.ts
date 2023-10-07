import { ReportRepository } from "../../infra/axios/ReportRepository"
import logger from "../../config/Logger"
import { IReportDTO } from "../../dtos/IReportDTO"
import { inject, injectable } from "tsyringe"
import { DateInformations } from "../../utils/DateInformations"

@injectable()
export class GeralReportUseCase {
  constructor(
    @inject("ReportRepository")
    private reportRepository: ReportRepository,
  ) {}

  async execute() {
    let offset: number = 0
    let executions: number
    const report: any[] = []

    const { totalResults, limit } =
      await this.reportRepository.getGeralOrders(offset)

    if (totalResults <= 250) {
      executions = 1
    } else {
      executions = Math.ceil(totalResults / limit)
    }

    logger.info(
      `GeralReportUseCase.execute() - Executions: ${
        executions - 1
      } - Offsets: ${(executions - 1) * limit} - Date: ${DateInformations()}`,
    )

    for (let i = 0; i < executions; i++) {
      logger.verbose(
        `GeralReportUseCase.execute() - Execution: ${i} - Offset: ${offset}`,
      )

      const { items } = await this.reportRepository.getGeralOrders(offset)
      items.forEach((order) => {
        order.commerceItems.forEach((product) => {
          product.priceInfo.orderDiscountInfos.forEach((item) => {
            if (item.couponCodes.length > 0) {
              const filtro = report.filter(
                (reportObject) => reportObject.Pedido_OCC === order.id,
              )

              if (filtro.length == 0) {
                let payload: IReportDTO = {
                  Data_Pedido: order.submittedDate,
                  Pedido_OCC: order.id,
                  Pedido_SAP: order.Pedido_SAP,
                  Cupom: item.couponCodes[0],
                  CPF_CNPJ: order.client_document,
                  Valor_descontado: order.priceInfo.discountAmount,
                  Valor_frete: order.priceInfo.shipping,
                  Subtotal_bruto: order.priceInfo.rawSubtotal,
                  Subtotal_com_frete:
                    order.priceInfo.rawSubtotal + order.priceInfo.shipping,
                  Valor_Bruto: order.priceInfo.amount,
                  Valor_com_frete: order.priceInfo.total,
                }

                report.push(payload)
              }
            }
          })
        })
      })

      offset = offset + 250
    }
    logger.info("GeralReportUseCase.execute() - Generating report - Start")
    await this.reportRepository.generateReport(report)
    logger.info("GeralReportUseCase.execute() - Generating report - Success")

    logger.info("GeralReportUseCase.execute() - Send email - Start")
    await this.reportRepository.sendEmail()
    logger.info("GeralReportUseCase.execute() - Send email - Success")

    logger.info("GeralReportUseCase.execute() - Delete files - Start")
    this.reportRepository.deleteFiles()
    logger.info("GeralReportUseCase.execute() - Delete files - Start")
  }
  async executeManual(date) {
    let offset: number = 0
    let executions: number
    const report: any[] = []

    const { totalResults, limit } =
      await this.reportRepository.getGeralOrdersByDate(offset, date)

    if (totalResults <= 250) {
      executions = 1
    } else {
      executions = Math.ceil(totalResults / limit)
    }

    logger.info(
      `GeralReportUseCase.executeManual() - Executions: ${
        executions - 1
      } - Offsets: ${(executions - 1) * limit} - Date: ${DateInformations()}`,
    )

    for (let i = 0; i < executions; i++) {
      logger.verbose(
        `GeralReportUseCase.executeManual() - Execution: ${i} - Offset: ${offset}`,
      )

      const { items } = await this.reportRepository.getGeralOrdersByDate(
        offset,
        date,
      )
      items.forEach((order) => {
        order.commerceItems.forEach((product) => {
          product.priceInfo.orderDiscountInfos.forEach((item) => {
            if (item.couponCodes.length > 0) {
              const filtro = report.filter(
                (reportObject) => reportObject.Pedido_OCC === order.id,
              )

              if (filtro.length == 0) {
                let payload: IReportDTO = {
                  Data_Pedido: order.submittedDate,
                  Pedido_OCC: order.id,
                  Pedido_SAP: order.Pedido_SAP,
                  Cupom: item.couponCodes[0],
                  CPF_CNPJ: order.client_document,
                  Valor_descontado: order.priceInfo.discountAmount,
                  Valor_frete: order.priceInfo.shipping,
                  Subtotal_bruto: order.priceInfo.rawSubtotal,
                  Subtotal_com_frete:
                    order.priceInfo.rawSubtotal + order.priceInfo.shipping,
                  Valor_Bruto: order.priceInfo.amount,
                  Valor_com_frete: order.priceInfo.total,
                }

                report.push(payload)
              }
            }
          })
        })
      })

      offset = offset + 250
    }
    logger.info(
      "GeralReportUseCase.executeManual() - Generating report - Start",
    )
    await this.reportRepository.generateReport(report)
    logger.info(
      "GeralReportUseCase.executeManual() - Generating report - Success",
    )

    logger.info("GeralReportUseCase.executeManual() - Send email - Start")
    await this.reportRepository.sendEmail()
    logger.info("GeralReportUseCase.executeManual() - Send email - Success")

    logger.info("GeralReportUseCase.executeManual() - Delete files - Start")
    this.reportRepository.deleteFiles()
    logger.info("GeralReportUseCase.executeManual() - Delete files - Start")
  }
}
