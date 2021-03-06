let path;
if (process.env.NODE_ENV === "production") {
  path = "https://stoxy.vercel.app";
} else {
  path = "http://localhost:3000";
}

export const technicalIndicator = async (
  symbol,
  interval,
  time_period,
  output_size,
  indicator
) => {
  const res = await fetch(
    `${path}/api/indicator?indicator=${indicator}&symbol=${symbol}&interval=${interval}&period=${time_period}&outputsize=${output_size}`
  );
  const result = await res.json();

  return result;
};

export const timeSeries = async (symbol, outputsize) => {
  const res = await fetch(
    `${path}/api/stock?stock=${symbol}&outputsize=${outputsize}`
  );
  const data = await res.json();

  return data;
};

export const overview = async (symbol) => {
  const res = await fetch(`${path}/api/overview?symbol=${symbol}`);
  const data = await res.json();

  return data;
};

export const advicer = (dema9, dema21, macd, timeseries) => {
  let sum_vol = 0;
  const volumes = timeseries.values
    .map((value) => Number(value.volume))
    .slice(0, 30);
  volumes.forEach((val) => (sum_vol = sum_vol + val));
  const avg_vol = sum_vol / 30;

  if (
    dema9[0].dema > dema21[0].dema &&
    dema9[1].dema < dema21[1].dema &&
    macd[0].macd > macd[0].macd_signal &&
    volumes[0] > avg_vol
  ) {
    return "BUY";
  } else if (
    dema9[0].dema < dema21[0].dema &&
    dema9[1].dema > dema21[1].dema &&
    macd[0].macd < macd[0].macd_signal &&
    volumes[0] > avg_vol
  ) {
    return "SELL";
  } else {
    return "HOLD";
  }
};
