import dotenv from "dotenv"
dotenv.config()

export default {
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: process.env.PORT || 3000,
	LOG_IN_FILE: process.env.LOG_IN_FILE || "development, test, production",
	LOG_LEVEL: process.env.LOG_LEVEL || "info",
	APPLICATIONINSIGHTS_CONNECTION_STRING:
		process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || null,
	URL:
		process.env.URL || "https://p1595626c1dev-store.occa.ocs.oraclecloud.com",
	APP_KEY:
		process.env.APP_KEY ||
		"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ZDhiNjU3Ny1kM2Y4LTRhYWQtYmM4MS1hYmUzNWRmOTU3MTIiLCJpc3MiOiJhcHBsaWNhdGlvbkF1dGgiLCJleHAiOjE3MDA4Mzg0MDIsImlhdCI6MTY2OTMwMjQwMn0=.INcbn3yMtgTojdHRY4G268LR5J9E/F+Tt4EHXAz75zQ=",
	SAP_URL: process.env.SAP_URL,
	CC_REPORT_REFRESH_TIME: process.env.CC_REPORT_REFRESH_TIME || "*/10 * * * *",
	CC_ORDERS_LAST_TIME: process.env.CC_ORDERS_LAST_TIME || "86400000",
	MAIL_HOST: process.env.MAIL_HOST || "sandbox.smtp.mailtrap.io",
	MAIL_PORT: process.env.MAIL_PORT || 2525,
	MAIL_USER: process.env.MAIL_USER || "b481538ec0ca7a",
	MAIL_PASS: process.env.MAIL_PASS || "a815d2ded0f480",
	MAIL_FROM: process.env.MAIL_FROM || "test_from@email.com",
	MAIL_TO: process.env.MAIL_TO || "test_to@email.com",
	MAIL_HTML: process.env.MAIL_HTML || "<p>Test mail html",
	MAIL_TEXT: process.env.MAIL_TEXT || "Test mail text",
	MAIL_SUBJECT: process.env.MAIL_SUBJECT || "Test Mail Subject",
}
