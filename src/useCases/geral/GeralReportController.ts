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

				if(dayOfWeek >= 1 && dayOfWeek <= 5){
					logger.info(`SCHEDULE START - ${nameOfWeek}`)
					await geralReportUseCase.execute()
				} else {
					logger.info(`REPORT IS NOT GENERATED ON ${nameOfWeek.toUpperCase()}`)
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
				} else {
					logger.error(
						`SCHEDULE REPORT FAIL - ERR: ${JSON.stringify(err.message)}`
					)					
				}			
			}
		})
	}
}
