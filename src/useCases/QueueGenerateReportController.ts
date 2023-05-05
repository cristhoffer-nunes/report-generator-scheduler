import EnvVariable from "../config/EnvVariable"

import schedule from "node-schedule"
import { QueueGenerateReportUseCase } from "./QueueGenerateReportUseCase"
import { QueueGenerateReportRepository } from "../infra/axios/QueueGenerateReportRepository"
import { getDayOfTheWeek } from "../utils/GetDayOfTheWeek"

export default class QueueGenerateReportController {
	public static load() {
		// let isRun: boolean = true

		// schedule.scheduleJob(EnvVariable.WATCH_DOG_TIME, () => {
		// 	if (!isRun) {
		// 		isRun = false
		// 		console.error("Process timeout")
		// 		process.exit(-1)
		// 	}
		// })

		const queueGenerateReportRepository = new QueueGenerateReportRepository(
			EnvVariable.URL,
			EnvVariable.APP_KEY
		)

		const queueGenerateReportUseCase = new QueueGenerateReportUseCase(
			queueGenerateReportRepository
		)

		schedule.scheduleJob(EnvVariable.CC_REPORT_REFRESH_TIME, async () => {
			const day = getDayOfTheWeek(new Date().getDay())

			switch (day) {
				case "Domingo":
					console.log("Report is not generated on Sundays")
					break
				case "Segunda-feira":
					console.log(`Start - Current day ${day}`)
					await queueGenerateReportUseCase.execute()
					break
				case "Terça-feira":
					console.log("Report is not generated on Tuesdays")
					break
				case "Quarta-feira":
					console.log(`Start - Current day ${day}`)
					await queueGenerateReportUseCase.execute()
					break
				case "Quinta-feira":
					console.log("Report is not generated on Thursdays")
					break
				case "Sexta-feira":
					console.log(`Start - Current day ${day}`)
					await queueGenerateReportUseCase.execute()
					break
				case "Sabado":
					console.log("Report is not generated on Saturdays")
					break
			}
		})
	}
}
