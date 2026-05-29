/**
 * Helper to calculate the 1st Monday of a given month in a given year.
 * month is 0-indexed (0 = Jan, 1 = Feb, 8 = Sep)
 */
function getFirstMonday(year: number, month: number): Date {
  const date = new Date(year, month, 1);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, 6 = Saturday
  const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  date.setDate(1 + diff);
  date.setHours(0, 0, 0, 0); // Normalize time string
  return date;
}

/**
 * Validates and Calculates Academic Year using Rules:
 * Semester Gasal (Ganjil): Starts on the 1st Monday of September
 * Semester Genap: Starts on the 1st Monday of February
 */
export function getAcademicYear(dateStr: string | Date): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Format Tanggal Tidak Valid";

  const year = date.getFullYear();

  // Find boundaries for the current calendar year
  const firstMondayFeb = getFirstMonday(year, 1); // February (Month 1, 0-indexed)
  const firstMondaySep = getFirstMonday(year, 8); // September (Month 8, 0-indexed)

  if (date < firstMondayFeb) {
    // Before Feb (1st Monday): Still Gasal from the previous calendar year
    return `Gasal TA ${year - 1}/${year}`;
  } else if (date >= firstMondayFeb && date < firstMondaySep) {
    // Between Feb and Sep: Genap of the current academic year spanning back to last year
    return `Genap TA ${year - 1}/${year}`;
  } else {
    // After Sep (1st Monday): Gasal of the new academic year
    return `Gasal TA ${year}/${year + 1}`;
  }
}
