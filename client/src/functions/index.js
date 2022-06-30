export const getDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  const config = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    HH: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
  };
  for (const key in config) {
    format = format.replace(key, config[key]);
  }
  return format;
};