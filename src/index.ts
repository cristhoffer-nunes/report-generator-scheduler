import app from "./config/App"

import {
  setup,
  start,
  defaultClient,
  DistributedTracingModes,
} from "applicationinsights"

import logger from "./config/Logger"
import EnvVariables from "./config/EnvVariable"

logger.info(`NODE_ENV: ${EnvVariables.NODE_ENV}`)
logger.info(`ENV_VARIABLES: ${JSON.stringify(EnvVariables)}`)

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
  ] = `${EnvVariables.TAG}-SUPPORT_SERVICES-REPORT-SCHEDULER`
} else {
  logger.warn("APPINSIGHTS STOPPED - NO APPINSIGHTS_IKEY")
}

app.listen(EnvVariables.PORT, () => {
 logger.info(`START APLICATION - PORT: ${EnvVariables.PORT}`)
})
