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

export function yearDifferenceCheck(date) {
  const currentYear = new Date();
  const yearDiff = currentYear.getFullYear() - date.getFullYear();

  return (
    yearDiff > 1 ||
    (yearDiff === 1 &&
      currentYear.getMonth() >= date.getMonth() &&
      currentYear.getDate() >= date.getDate())
  );
}
