import dotenv from "dotenv"
dotenv.config()

export default {
	PORT: process.env.TZ || 3000,
	URL:
		process.env.URL || "https://p1595626c1dev-store.occa.ocs.oraclecloud.com",
	APP_KEY:
		process.env.APP_KEY ||
		"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ZDhiNjU3Ny1kM2Y4LTRhYWQtYmM4MS1hYmUzNWRmOTU3MTIiLCJpc3MiOiJhcHBsaWNhdGlvbkF1dGgiLCJleHAiOjE3MDA4Mzg0MDIsImlhdCI6MTY2OTMwMjQwMn0=.INcbn3yMtgTojdHRY4G268LR5J9E/F+Tt4EHXAz75zQ=",
	SAP_URL: process.env.SAP_URL,
	WATCH_DOG_TIME: process.env.WATCH_DOG_TIME || "*/10 * * * *",
	CC_REPORT_REFRESH_TIME: process.env.CC_REPORT_REFRESH_TIME || "*/5 * * * *",
	CC_ORDERS_LAST_TIME: process.env.CC_ORDERS_LAST_TIME || "86400000",
}
