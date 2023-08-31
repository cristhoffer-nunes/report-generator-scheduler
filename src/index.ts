import app from "./config/App"

import {
  setup,
  start,
  defaultClient,
  DistributedTracingModes,
} from "applicationinsights"

import logger from "./config/Logger"
import EnvVariables from "./config/EnvVariable"

console.info(`NODE_ENV: ${EnvVariables.NODE_ENV}`)
console.info(`ENV_VARIABLES: ${JSON.stringify(EnvVariables)}`)

if (EnvVariables.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  console.warn("APPINSIGHTS START")
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
  ] = `${EnvVariables.TAG}-UTILS-REPORT-SCHEDULER`
} else {
  console.info("APPINSIGHTS STOPPED - NO APPINSIGHTS_IKEY")
}

app.listen(EnvVariables.PORT, () => {
  console.info(`START APLICATION - PORT: ${EnvVariables.PORT}`)
})
