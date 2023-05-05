import express from "express"
import QueueGenerateReportController from "./useCases/QueueGenerateReportController"

const app = express()

app.use(express.json())

app.get("/test", (re, res) => {
	try {
		res.json({
			message: "Server is alive"
		})
	}catch(err){
		res.status(500).json({
			message: err.message
		})
	}
})

app.listen(3000, () => {
	console.log("Start application on port 3000")
	QueueGenerateReportController.load()
})
