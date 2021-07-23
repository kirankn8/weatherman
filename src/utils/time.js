export const msToHrs = (timeinMs) => {
  return timeinMs / 3600000;
};

export const HrstoMs = (timeinHrs) => {
  return timeinHrs * 3600000;
};

export const timeDiffT2MinusT1 = (time1, time2) => {
  const t1 = new Date(time1).getTime();
  const t2 = new Date(time2).getTime();
  return t2 - t1;
};
