import dotenv from "dotenv"
dotenv.config()

export default {
	NODE_ENV: process.env.NODE_ENV,
	TAG: process.env.TAG,
	PORT: process.env.PORT,
	LOG_IN_FILE: process.env.LOG_IN_FILE,
	LOG_LEVEL: process.env.LOG_LEVEL,
	APPLICATIONINSIGHTS_CONNECTION_STRING:
		process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || null,
	URL: process.env.URL,
	APP_KEY: process.env.APP_KEY,
	CC_REPORT_REFRESH_TIME: process.env.CC_REPORT_REFRESH_TIME,
	CC_ORDERS_LAST_TIME: process.env.CC_ORDERS_LAST_TIME,
	MAIL_HOST: process.env.MAIL_HOST,
	MAIL_PORT: process.env.MAIL_PORT,
	MAIL_USER: process.env.MAIL_USER,
	MAIL_PASS: process.env.MAIL_PASS,
	MAIL_FROM: process.env.MAIL_FROM,
	MAIL_TO: process.env.MAIL_TO,
	MAIL_HTML: process.env.MAIL_HTML,
	MAIL_TEXT: process.env.MAIL_TEXT,
	MAIL_SUBJECT: process.env.MAIL_SUBJECT,
}
