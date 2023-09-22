export default function calculateEndDate(startDate: Date, installments: any) {
  const endDate = new Date(startDate);
  if (installments !== undefined && installments > 0) {
    endDate.setMonth(startDate.getMonth() + installments);
  }
  return endDate;
}
