# report-scheduler

Service responsible for generating a report in xlsx from a certain time and sending it by email.

Requirements:

1. The report must contain orders from 03/01/2023 until the date when the report generation is no longer required.
2. The report must be forwarded every Monday, Wednesday and Friday to denis.thenorio@leomadeiras.com.br and rafael.grigorio@leomadeiras.com.br.
3. The report must contain the information: Order number in OCC, Order number in SAP, Coupon ID and Customer document.
4. For report submission for Mondays, consider the period from 03/01/2023 to Sunday 23:59:59 .
5. If you want to send the report on Wednesdays, consider the period 03/01/2023 through Tuesday 23:59:59.
6. When reporting on Fridays, consider the period from 03/01/2023 through Thursday 23:59:59 .
7. The report must contain orders that have any status.
