export function formatDate(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hoursStr} : ${minutesStr} : ${secondsStr}`;
}

export function formatSec(seconds) {
  const year = 1970;
  const monthIndex = 0; // January
  const day = 1;
  const hours = 0;
  const minutes = 0;
  const secDate = new Date(year, monthIndex, day, hours, minutes, seconds);
  return formatDate(secDate);
}
