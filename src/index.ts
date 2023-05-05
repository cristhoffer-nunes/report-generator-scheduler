import express from "express"
import QueueGenerateReportController from "./useCases/QueueGenerateReportController"

const app = express()

app.use(express.json())

app.listen(3000, () => {
	console.log("Start application on port 3000")
	QueueGenerateReportController.load()
})
