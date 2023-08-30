import { container } from "tsyringe"

import { IReportRepository } from "../repositories/IReportRepository"
import { ReportRepository } from "../infra/axios/ReportRepository"

container.registerSingleton<IReportRepository>(
  "ReportRepository",
  ReportRepository,
)
