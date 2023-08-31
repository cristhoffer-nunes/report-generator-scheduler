import { ReportRepository } from "../../infra/axios/ReportRepository"
import logger from "../../config/Logger"
import { IReportDTO } from "../../dtos/IReportDTO"
import { inject, injectable } from "tsyringe"

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

    console.log(
      `NECESSARY EXECUTIONS: ${executions - 1} - NECESSARY OFFSET: ${
        (executions - 1) * limit
      }`,
    )

    for (let i = 0; i < executions; i++) {
      console.log(`EXECUTION: ${i} - OFFSET: ${offset}`)

      const { items } = await this.reportRepository.getGeralOrders(offset)
      items.forEach((order) => {
        order.commerceItems.forEach((product) => {
          product.priceInfo.orderDiscountInfos.forEach((item) => {
            if (item.couponCodes.length > 0) {
              const filtro = report.filter(
                (reportObject) => reportObject.Pedido_OCC === order.id,
              )

              console.log(filtro)

              if (filtro.length == 0) {
                console.log({
                  order: order.id,
                  document: order.client_document,
                })
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
    console.log("GENERATE REPORT - START")
    await this.reportRepository.generateReport(report)
    console.log("GENERATE REPORT - SUCCESS")

    console.log("SEND EMAIL - START")
    await this.reportRepository.sendEmail()
    console.log("SEND EMAIL - SUCCESS")

    console.log("DELETING FILES - START")
    this.reportRepository.deleteFiles()
  }
}
