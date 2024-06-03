export class DateUtils {
  static formatReadableDate(isoDate: string): string {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    };

    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  }
}
