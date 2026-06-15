const API_BASE = 'https://www.alphavantage.co/query';
const DEFAULT_API_KEY = 'WB1XJII7C05SZLNQ';

function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      config[key] = cells[1].textContent.trim();
    }
  });
  return config;
}

function formatMoney(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatNumber(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return num.toLocaleString('en-US');
}

function formatChange(change, percent) {
  const num = Number(change);
  if (Number.isNaN(num)) return '—';
  const pct = (percent || '').replace('%', '');
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)} (${sign}${Number(pct).toFixed(2)}%)`;
}

function formatTimestamp(tradingDay) {
  if (!tradingDay) return '';
  const date = new Date(`${tradingDay}T00:00:00`);
  if (Number.isNaN(date.getTime())) return tradingDay;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function buildDataList(rows) {
  const dl = document.createElement('dl');
  rows.forEach(([label, value]) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'share-price-row';
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    wrapper.append(dt, dd);
    dl.append(wrapper);
  });
  return dl;
}

async function fetchJson(params) {
  const url = `${API_BASE}?${new URLSearchParams(params).toString()}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

// Alpha Vantage's free tier returns a "Note"/"Information" message instead of
// data when the per-minute call limit is hit, in which case 52WeekHigh/Low are
// absent. Cache the slow-changing OVERVIEW response so a throttled call falls
// back to the last good values instead of rendering "—".
async function fetchOverview(symbol, apikey) {
  const cacheKey = `share-price-overview-${symbol}`;
  let cached;
  try {
    cached = JSON.parse(sessionStorage.getItem(cacheKey));
  } catch {
    cached = null;
  }

  try {
    const data = await fetchJson({ function: 'OVERVIEW', symbol, apikey });
    if (data['52WeekHigh'] || data['52WeekLow']) {
      const fresh = { '52WeekHigh': data['52WeekHigh'], '52WeekLow': data['52WeekLow'] };
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(fresh));
      } catch {
        // sessionStorage unavailable (private mode/quota) — non-fatal
      }
      return fresh;
    }
  } catch {
    // fall through to cached value
  }

  return cached || {};
}

export default async function decorate(block) {
  const config = readConfig(block);
  const symbol = (config.symbol || 'CTVA').toUpperCase();
  const apikey = config.apikey || DEFAULT_API_KEY;
  const label = config.label || 'FPO Share Information';

  block.textContent = '';

  const heading = document.createElement('h3');
  heading.className = 'share-price-label';
  heading.textContent = label;
  block.append(heading);

  const loading = document.createElement('p');
  loading.className = 'share-price-loading';
  loading.textContent = 'Loading share price…';
  block.append(loading);

  try {
    const [quoteData, overviewData] = await Promise.all([
      fetchJson({ function: 'GLOBAL_QUOTE', symbol, apikey }),
      fetchOverview(symbol, apikey),
    ]);

    const quote = quoteData['Global Quote'] || {};
    if (!quote['05. price']) {
      loading.textContent = 'Share price data is currently unavailable.';
      return;
    }

    loading.remove();

    const priceEl = document.createElement('div');
    priceEl.className = 'share-price-value';
    priceEl.textContent = formatMoney(quote['05. price']);
    block.append(priceEl);

    const timestamp = formatTimestamp(quote['07. latest trading day']);
    if (timestamp) {
      const tsEl = document.createElement('p');
      tsEl.className = 'share-price-timestamp';
      tsEl.textContent = timestamp;
      block.append(tsEl);
    }

    const grid = document.createElement('div');
    grid.className = 'share-price-grid';

    grid.append(buildDataList([
      ['Change', formatChange(quote['09. change'], quote['10. change percent'])],
      ['Volume', formatNumber(quote['06. volume'])],
      ["Today's Open", formatMoney(quote['02. open'])],
      ['Previous Close', formatMoney(quote['08. previous close'])],
    ]));

    grid.append(buildDataList([
      ["Today's High", formatMoney(quote['03. high'])],
      ["Today's Low", formatMoney(quote['04. low'])],
      ['52 Week High', formatMoney(overviewData['52WeekHigh'])],
      ['52 Week Low', formatMoney(overviewData['52WeekLow'])],
    ]));

    block.append(grid);
  } catch (err) {
    loading.textContent = `Unable to load share price: ${err.message}`;
  }
}
