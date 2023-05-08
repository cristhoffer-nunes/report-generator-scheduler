import EnvVariable from "../config/EnvVariable"

import schedule from "node-schedule"
import { QueueGenerateReportUseCase } from "./QueueGenerateReportUseCase"
import { QueueGenerateReportRepository } from "../infra/axios/QueueGenerateReportRepository"
import { getDayOfTheWeek } from "../utils/GetDayOfTheWeek"
import logger from "../config/Logger"
import { AxiosError } from "axios"

export default class QueueGenerateReportController {
	public static load() {
		const queueGenerateReportRepository = new QueueGenerateReportRepository(
			EnvVariable.URL,
			EnvVariable.APP_KEY
		)

		const queueGenerateReportUseCase = new QueueGenerateReportUseCase(
			queueGenerateReportRepository
		)

		let scheduleReportLoop = 3

		schedule.scheduleJob(EnvVariable.CC_REPORT_REFRESH_TIME, async () => {
			try {
				const day = getDayOfTheWeek(new Date().getDay())

				switch (day) {
					case "Domingo":
						logger.info("REPORT IS NOT GERENATED ON SUNDAYS")
						break
					case "Segunda-feira":
						logger.info(`SCHEDULE REPORT START - CURRENT DAY: ${day}`)
						await queueGenerateReportUseCase.execute()
						break
					case "Terça-feira":
						logger.info("REPORT IS NOT GERENATED ON TUESDAYS")
						break
					case "Quarta-feira":
						logger.info(`SCHEDULE REPORT START - CURRENT DAY: ${day}`)
						await queueGenerateReportUseCase.execute()
						break
					case "Quinta-feira":
						logger.info("REPORT IS NOT GERENATED ON THURSDAYS")
						break
					case "Sexta-feira":
						logger.info(`SCHEDULE REPORT START - CURRENT DAY: ${day}`)
						await queueGenerateReportUseCase.execute()
						break
					case "Sabado":
						logger.info("REPORT IS NOT GERENATED ON SATURDAYS")
						break
				}
			} catch (err) {
				if (err instanceof AxiosError && err.response) {
					const { status, statusText } = err.response

					logger.error(
						`SCHEDULE REPORT FAIL - ERR: ${JSON.stringify({
							statusCode: status,
							message: statusText,
						})}`
					)
					scheduleReportLoop += 1
				} else {
					logger.error(
						`SCHEDULE REPORT FAIL - ERR: ${JSON.stringify(err.message)}`
					)
					scheduleReportLoop += 1
				}

				if (scheduleReportLoop > 3) {
					logger.info("SCHEDULE REPORT PROCESS EXIT")
					process.exit(-1)
				}
			}
		})
	}
}
