import { Request, Response } from "express"
import schedule from "node-schedule"
import { AxiosError } from "axios"
import { container } from "tsyringe"

import EnvVariable from "../../config/EnvVariable"
import { GeralReportUseCase } from "./GeralReportUseCase"
import { getDayOfTheWeek } from "../../utils/GetDayOfTheWeek"
import logger from "../../config/Logger"

export default class GeralReportController {
  public static load() {
    const geralReportUseCase = container.resolve(GeralReportUseCase)

    schedule.scheduleJob(EnvVariable.CC_REPORT_REFRESH_TIME, async () => {
      try {
        const dayOfWeek = new Date().getDay()
        const nameOfWeek = getDayOfTheWeek(new Date().getDay())

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          logger.info(
            `GeralReportController.load() - Schedule starting... - ${nameOfWeek}`,
          )
          await geralReportUseCase.execute()
        } else {
          logger.info(
            `GeralReportController.load() - Report is not generated on ${nameOfWeek.toUpperCase()}`,
          )
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const { status, statusText } = err.response

          logger.error(
            `GeralReportController.load() - Err: ${JSON.stringify({
              statusCode: status,
              message: statusText,
            })}`,
          )
        } else {
          logger.error(
            `GeralReportController.load - Err: ${JSON.stringify(err.message)}`,
          )
        }
      }
    })
  }

  public static manual(request: Request, response: Response) {
    try {
      const { date } = request.body
      const geralReportUseCase = container.resolve(GeralReportUseCase)
      logger.info(
        `GeralReportController.manual() - Manual request receveid and starting...`,
      )
      geralReportUseCase.executeManual(date)

      return response.json({ message: "Request received and processing..." })
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const { status, statusText } = err.response

        logger.error(
          `GeralReportController.manual() - Err: ${JSON.stringify({
            statusCode: status,
            message: statusText,
          })}`,
        )
      } else {
        logger.error(
          `GeralReportController.manual() - Err: ${JSON.stringify(
            err.message,
          )}`,
        )
      }
    }
  }
}
