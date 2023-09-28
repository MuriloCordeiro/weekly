const FormatDateBrazilian = (date: string): Date => {
  const [year, month, day] = date.split("-");
  const formattedDate = new Date(`${year}-${month}-${day}`);
  return formattedDate;
};

export default FormatDateBrazilian;
