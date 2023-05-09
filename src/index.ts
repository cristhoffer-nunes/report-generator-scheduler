import express from "express"
import {
	setup,
	start,
	DistributedTracingModes,
	defaultClient,
} from "applicationInsights"
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
}

app.listen(EnvVariables.PORT, () => {
	logger.info(`START APLICATION - PORT: ${EnvVariables.PORT}`)
	QueueGenerateReportController.load()
})
