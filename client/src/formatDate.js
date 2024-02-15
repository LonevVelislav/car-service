export function formatDate(date) {
  const input = new Date(date);
  const year = input.getFullYear();
  const month = input.getMonth() + 1;
  const day = input.getDate();

  const formatted = `${day.toString().padStart(2, "0")}-${month
    .toString()
    .padStart(2, "0")}-${year}`;

  return formatted;
}
