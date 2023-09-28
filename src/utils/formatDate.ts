export default function formatDate(date: any): Date {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"
  return new Date(formattedDate);
}
