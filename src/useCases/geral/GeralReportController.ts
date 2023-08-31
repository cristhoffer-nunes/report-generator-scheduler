import EnvVariable from "../../config/EnvVariable"

import schedule from "node-schedule"
import { GeralReportUseCase } from "./GeralReportUseCase"
import { getDayOfTheWeek } from "../../utils/GetDayOfTheWeek"
import logger from "../../config/Logger"
import { AxiosError } from "axios"
import { container } from "tsyringe"

export default class GeralReportController {
  public static load() {
    const geralReportUseCase = container.resolve(GeralReportUseCase)

    schedule.scheduleJob(EnvVariable.CC_REPORT_REFRESH_TIME, async () => {
      try {
        const dayOfWeek = new Date().getDay()
        const nameOfWeek = getDayOfTheWeek(new Date().getDay())

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          console.info(`SCHEDULE START - ${nameOfWeek}`)
          await geralReportUseCase.execute()
        } else {
          console.info(`REPORT IS NOT GENERATED ON ${nameOfWeek.toUpperCase()}`)
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const { status, statusText } = err.response

          console.error(
            `SCHEDULE REPORT FAIL - ERR: ${JSON.stringify({
              statusCode: status,
              message: statusText,
            })}`,
          )
        } else {
          console.error(
            `SCHEDULE REPORT FAIL - ERR: ${JSON.stringify(err.message)}`,
          )
        }
      }
    })
  }

  public static async manual() {
    const geralReportUseCase = container.resolve(GeralReportUseCase)

    try {
      const nameOfWeek = getDayOfTheWeek(new Date().getDay())

      console.info(`SCHEDULE START - ${nameOfWeek}`)
      await geralReportUseCase.execute()
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const { status, statusText } = err.response

        console.error(
          `SCHEDULE REPORT FAIL - ERR: ${JSON.stringify({
            statusCode: status,
            message: statusText,
          })}`,
        )
      } else {
        console.error(
          `SCHEDULE REPORT FAIL - ERR: ${JSON.stringify(err.message)}`,
        )
      }
    }
  }
}
