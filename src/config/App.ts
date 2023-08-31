import "reflect-metadata"
import "../shared"

import express from "express"
import GeralReportController from "../useCases/geral/GeralReportController"

class App {
  public express: express.Application

  constructor() {
    this.express = express()
    this.middleware()
    this.routes()
  }

  private middleware() {
    this.express.use(express.json())
  }

  private routes() {
    GeralReportController.load()
    this.express.get("/test", (req, res) => {
      try {
        res.json({
          message: "Server is alive",
        })
      } catch (err) {
        return res.status(500).json({
          messsage: err.message,
        })
      }
    })
    this.express.get("/generate", async (request, response) => {
      try {
        await GeralReportController.manual()
        response.json({
          message: "Report generated and sended succesfully!",
        })
      } catch (err) {
        return response.status(500).json({
          messsage: err.message,
        })
      }
    })
  }
}

export default new App().express
