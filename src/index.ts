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

const app = express()
app.use(express.json())

app.get("/test", (re, res) => {
	try {
		res.json({
			message: "Server is alive",
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
})

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
	] = `${EnvVariables.NODE_ENV}-UTILS-SCHEDULE-REPORT`
} else {
	logger.warn("APPINSIGHTS STOPPED - NO APPINSIGHTS_IKEY")
}

app.listen(EnvVariables.PORT, () => {
	logger.info(`START APLICATION - PORT: ${EnvVariables.PORT}`)
	QueueGenerateReportController.load()
})
