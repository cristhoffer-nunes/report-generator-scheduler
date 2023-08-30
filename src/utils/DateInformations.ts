export function DateInformations() {
  const date = new Date()
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()

  const newDate = `${year}-${month}-${day}`

  return newDate
}
