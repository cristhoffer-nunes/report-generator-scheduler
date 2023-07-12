# Report scheduler

Service that works as a scheduler to generate a report in xlsx file and send it by e-mail.

Requirements:

1. The report must contain orders from 06/01/2023 until the date when the report generation is no longer required;
2. The report must be forwarded every Monday, Wednesday and Friday to the costumer;
3. The report must contain the information: Order number in OCC, Order number in SAP, Coupon ID and Customer document.
4. For report submission for Mondays, consider the period from 06/01/2023 to Sunday 23:59:59 .
   4.1. If you want to send the report on Wednesdays, consider the period 06/01/2023 through Tuesday 23:59:59.
   4.2 When reporting on Fridays, consider the period from 03/01/2023 through Thursday 23:59:59 .
5. The report must contain orders that have any status.
