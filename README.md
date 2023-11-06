
# Report generator scheduler

The service is responsible for generating a daily report containing all orders with coupons from January 1, 2023 to the present date.


## Features

- Cron job for automatic generation and sending of reports by e-mail.
- Route for triggering the automatic generation and sending of reports by e-mail.


## API Documentation

#### Retorna todos os itens

```http
  POST /manual
```

| Parâmetro   | Tipo       | Descrição                           | Format |
| :---------- | :--------- | :---------------------------------- | :---------- |
| `date` | `string` | **Required**. End date for the report. | `YYYY-MM-DD` |


