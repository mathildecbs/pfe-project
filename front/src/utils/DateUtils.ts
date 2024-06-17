import { format, parse, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

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

  static formatToEuropeanDate(isoDate: string): string {
    const date = parseISO(isoDate);
    return format(date, "dd/MM/yyyy", { locale: fr });
  }

  static formatToISODate(europeanDate: string): string {
    const date = parse(europeanDate, "dd/MM/yyyy", new Date());
    return format(date, "yyyy-MM-dd");
  }
}
