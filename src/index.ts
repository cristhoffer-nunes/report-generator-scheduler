import express from "express"
import {
	setup,
	start,
	defaultClient,
	DistributedTracingModes,
} from "applicationinsights"
import QueueGenerateReportController from "./useCases/QueueGenerateReportController"
import logger from "./config/Logger"
import EnvVariables from "./config/EnvVariable"

logger.info(`NODE_ENV: ${EnvVariables.NODE_ENV}`)
logger.info(`ENV_VARIABLES: ${JSON.stringify(EnvVariables)}`)

const app = express()

app.use(express.json())

if (EnvVariables.APPLICATIONINSIGHTS_CONNECTION_STRING) {
	logger.warn("APPINSIGHTS START")
	setup(EnvVariables.APPLICATIONINSIGHTS_CONNECTION_STRING)
		.setAutoCollectRequests(true)
		.setAutoCollectPerformance(true, true)
		.setAutoCollectExceptions(true)
		.setAutoCollectDependencies(true)
		.setAutoCollectConsole(true, true)
		.setAutoDependencyCorrelation(true)
		.setUseDiskRetryCaching(true)
		.setSendLiveMetrics(false)
		.setDistributedTracingMode(DistributedTracingModes.AI)

	start()

	defaultClient.context.tags[
		defaultClient.context.keys.cloudRole
	] = `${EnvVariables.TAG}-UTILS-SCHEDULE-REPORT`
} else {
	logger.warn("APPINSIGHTS STOPPED - NO APPINSIGHTS_IKEY")
}

app.get("/test", (request, response) => {
	try {
		logger.info("SERVER IS ALIVE")
		response.json({
			message: "SERVER IS ALIVE",
		})
	} catch (err) {
		response.status(500).json({
			message: err.message,
		})
	}
})

app.listen(EnvVariables.PORT, () => {
	logger.info(`START APLICATION - PORT: ${EnvVariables.PORT}`)
	QueueGenerateReportController.load()
})
