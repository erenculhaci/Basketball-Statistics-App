const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

export const calculateEventTime = (time) => {
  const result = { p: 4, m: 0, s: pad(0) }; // Default values

  if (time == null) {
    return result;
  }

  const seconds = Math.floor(time % 60);
  result.s = pad(seconds);

  if (time > 1800) {
    result.p = 1;
    result.m = Math.floor((time - 1800) / 60);
  } else if (time > 1200) {
    result.p = 2;
    result.m = Math.floor((time - 1200) / 60);
  } else if (time > 600) {
    result.p = 3;
    result.m = Math.floor((time - 600) / 60);
  } else {
    result.m = Math.floor(time / 60);
  }

  return result;
};