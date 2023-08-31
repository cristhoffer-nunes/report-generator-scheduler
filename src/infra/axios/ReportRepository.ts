import axios from "axios"
import xlsx from "xlsx"
import nodemailer from "nodemailer"
import EnvVariable from "../../config/EnvVariable"
import fs from "fs"
import path from "path"
import { Orders } from "../entities/Orders"
import { IReportDTO} from "../../dtos"
import { OCCToken } from "../entities/Token"
import { DateInformations } from "../../utils/DateInformations"
import { IReportRepository } from "../../repositories/IReportRepository"


export class ReportRepository implements IReportRepository {
  protected occToken = {
    access_token: "",
    expires_in: 0,
    time: {
      getTime: () => 0,
    },
  }

  protected url: string
  protected appKey: string
  protected date: string

  constructor() {
    this.url = EnvVariable.URL
    this.appKey = EnvVariable.APP_KEY
    this.date = DateInformations()
  }

  async getCurrentToken(): Promise<string> {
    if (
      !this.occToken.access_token ||
      Math.abs(new Date().getTime() - this.occToken.time.getTime()) >
        this.occToken.expires_in * 300
    ) {
      const token = await this.getToken()

      this.occToken.access_token = token.access_token
      this.occToken.expires_in = token.expires_in
      this.occToken.time = new Date()
    }

    return this.occToken.access_token
  }

  async getToken(): Promise<OCCToken> {
    const { status, data } = await axios.post(
      `${this.url}/ccapp/v1/login`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.appKey}`,
        },
      },
    )

    if (status === 200) {
      return data
    }
  }
  async getGeralOrders(offset: number = 0): Promise<Orders> {
    const { data } = await axios.get(
      `${this.url}/ccapp/v1/orders?queryFormat=SCIM&fields=submittedDate,id,commerceItems.priceInfo.orderDiscountInfos,Pedido_SAP,client_document,priceInfo&q=submittedDate gt "2023-01-01T03:00:00.000Z" and submittedDate lt "${this.date}T03:00:00.000Z"&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${await this.getCurrentToken()}`,
        },
      },
    )

    return data
  }
  async generateReport(reportDTO: IReportDTO[]): Promise<void> {
    const worksheet = xlsx.utils.json_to_sheet(reportDTO)
    const workbook = xlsx.utils.book_new()

    xlsx.utils.book_append_sheet(workbook, worksheet, `${this.date}`)

    xlsx.write(workbook, { bookType: "xlsx", type: "buffer" })
    xlsx.write(workbook, { bookType: "xlsx", type: "binary" })

    xlsx.writeFile(
      workbook,
      `files/relatorio-geral-de-cupons-${this.date}.xlsx`,
    )
  }
  async sendEmail(): Promise<void> {
    const transport = nodemailer.createTransport({
      host: EnvVariable.MAIL_HOST,
      port: Number(EnvVariable.MAIL_PORT),
      auth: {
        user: EnvVariable.MAIL_USER,
        pass: EnvVariable.MAIL_PASS,
      },
    })

    await transport.sendMail({
      from: EnvVariable.MAIL_FROM,
      to: EnvVariable.MAIL_TO,
      subject: `Suporte | Leo Madeiras | Relatório geral de cupons - ${this.date}`,
      html: `<p> Bom dia prezados, </p> Segue em anexo relatório geral de cupons para ser encaminhado através do chamado 13133362. </p> <p> Atenciosamente, </p>`,
      text: `Bom dia prezados, Segue em anexo relatório geral de cupons para ser encaminhado através do chamado 13133362. Atenciosamente,`,
      attachments: [
        {
          filename: `relatorio-geral-de-cupons-${this.date}.xlsx`,
          path:
            process.cwd() +
            `/files/relatorio-geral-de-cupons-${this.date}.xlsx`,
          cid: `uniq-relatorio-geral-de-cupons-${this.date}.xlsx`,
        },
      ],
    })
  }

  deleteFiles(): void {
    fs.readdir("files", (err, files) => {
      if (err) {
        console.error("Erro ao ler a pasta:", err)
        return
      }

      // Itera sobre cada arquivo na pasta
      files.forEach((file) => {
        const filePath = path.join("files", file)

        // Remove o arquivo
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Erro ao deletar o arquivo ${file}:`, err)
          } else {
            console.log(`Arquivo ${file} foi deletado com sucesso.`)
          }
        })
      })
    })
  }
}
