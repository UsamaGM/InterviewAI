export function formatTime(time) {
  const splitTime = time.split(":");
  splitTime[0] = Number(splitTime[0]);
  let notation = "AM";

  if (splitTime[0] > 12) {
    splitTime[0] = splitTime[0] % 12 || 12;
    notation = "PM";
  }

  return `${String(splitTime[0]).padEnd(2, "0")}:${splitTime[1]} ${notation}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}
