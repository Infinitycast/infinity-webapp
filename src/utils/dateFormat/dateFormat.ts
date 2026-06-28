import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function dateFormat(date: Date, region?: string) {
  const formatDate = dayjs(date).format("DD MMM YYYY");

  return formatDate;
}
