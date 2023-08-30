import fs from "fs"
import winston from "winston"
import EnvVariable from "./EnvVariable"

const { printf, combine, label, timestamp } = winston.format

const myFormat = printf(
  (info: any) => `${info.timestamp} && ${info.level} && ${info.message}`,
)
const format = combine(label({ label: "" }), timestamp(), myFormat)
const logDir = "logs"
const transports: winston.transport[] = []

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

// transports - Console
transports.push(
  new winston.transports.Console({
    level: EnvVariable.LOG_LEVEL,
    handleExceptions: true,
  }),
)

// just log into container if is LOG_IN_FILE environment
if (EnvVariable.NODE_ENV && EnvVariable.LOG_IN_FILE) {
  // split ',' to get array of environment
  const arrayLogInFile = EnvVariable.LOG_IN_FILE.toString().trim().split(",")

  if (arrayLogInFile.indexOf(EnvVariable.NODE_ENV.trim()) > -1) {
    // transports - File
    transports.push(
      new winston.transports.File({
        filename: `${logDir}/application.log`,
        level: "verbose",
        maxsize: 100000,
        maxFiles: 10,
        handleExceptions: true,
      }),
    )
  }
}

const logger = winston.createLogger({
  format,
  transports,
})

export default logger
