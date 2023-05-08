import express from "express"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"
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

app.listen(EnvVariables.PORT, () => {
	console.log(`START APLICATION - PORT: ${EnvVariables.PORT}`)
	QueueGenerateReportController.load()
})
