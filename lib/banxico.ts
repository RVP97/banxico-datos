import { formatDateForAPI, parseBanxicoDate } from "./constants";

const BASE_URL = "https://www.banxico.org.mx/SieAPIRest/service/v1";

// ---------------------------------------------------------------------------
// Rate-limit tracking (per-process, resets on restart)
// ---------------------------------------------------------------------------

interface RateBucket {
  windowMs: number;
  maxRequests: number;
  timestamps: number[];
}

const RATE_BUCKETS: Record<string, RateBucket> = {
  timely: { windowMs: 60_000, maxRequests: 70, timestamps: [] },
  historic: { windowMs: 5 * 60_000, maxRequests: 180, timestamps: [] },
};

function pruneOld(bucket: RateBucket) {
  const cutoff = Date.now() - bucket.windowMs;
  while (bucket.timestamps.length > 0 && bucket.timestamps[0] < cutoff) {
    bucket.timestamps.shift();
  }
}

async function waitForSlot(bucket: RateBucket) {
  pruneOld(bucket);
  if (bucket.timestamps.length >= bucket.maxRequests) {
    const oldest = bucket.timestamps[0];
    const waitMs = oldest + bucket.windowMs - Date.now() + 500;
    if (waitMs > 0) {
      console.log(
        `[banxico] Rate-limited, waiting ${Math.round(waitMs / 1000)}s`,
      );
      await sleep(waitMs);
      pruneOld(bucket);
    }
  }
  bucket.timestamps.push(Date.now());
}

// ---------------------------------------------------------------------------
// Token rotation (supports comma-separated BMX_TOKEN for round-robin)
// ---------------------------------------------------------------------------

let tokenIndex = 0;

function getTokens(): string[] {
  const tokens: string[] = [];

  const primary = process.env.BMX_TOKEN;
  if (primary && primary !== "your_banxico_token_here") {
    for (const t of primary.split(",")) {
      const trimmed = t.trim();
      if (trimmed) tokens.push(trimmed);
    }
  }

  for (let i = 2; i <= 6; i++) {
    const extra = process.env[`BMX_TOKEN_${i}`]?.trim();
    if (extra) tokens.push(extra);
  }

  if (tokens.length === 0) {
    throw new Error(
      "BMX_TOKEN is not configured. Generate one at https://www.banxico.org.mx/SieAPIRest/service/v1/token",
    );
  }

  return tokens;
}

function nextToken(): string {
  const tokens = getTokens();
  const token = tokens[tokenIndex % tokens.length];
  tokenIndex++;
  return token;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BanxicoDato {
  fecha: string;
  dato: string;
}

interface BanxicoSerie {
  idSerie: string;
  titulo: string;
  datos: BanxicoDato[];
}

interface BanxicoResponse {
  bmx: {
    series: BanxicoSerie[];
  };
}

export interface ParsedDataPoint {
  date: Date;
  value: number;
}

export interface ParsedSeries {
  id: string;
  title: string;
  data: ParsedDataPoint[];
}

// ---------------------------------------------------------------------------
// HTTP client with 429 retry
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 5_000;

async function fetchFromAPI(
  url: string,
  bucket: RateBucket,
): Promise<BanxicoResponse | null> {
  await waitForSlot(bucket);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, {
      headers: {
        "Bmx-Token": nextToken(),
        Accept: "application/json",
        "Accept-Encoding": "gzip",
      },
      cache: "no-store",
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After");
      const waitMs = retryAfter
        ? Number.parseInt(retryAfter, 10) * 1000
        : BASE_RETRY_DELAY_MS * 2 ** attempt;

      if (attempt < MAX_RETRIES) {
        console.warn(
          `[banxico] 429 rate-limited, retry ${attempt + 1}/${MAX_RETRIES} in ${Math.round(waitMs / 1000)}s`,
        );
        await sleep(waitMs);
        continue;
      }
      throw new Error(
        `Banxico API rate limit exceeded after ${MAX_RETRIES} retries`,
      );
    }

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Banxico API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  throw new Error("Banxico API: unreachable");
}

function parseSeries(raw: BanxicoSerie): ParsedSeries {
  const data: ParsedDataPoint[] = [];
  for (const d of raw.datos) {
    if (d.dato === "N/E" || d.dato === "N/A") continue;
    const value = Number.parseFloat(d.dato.replace(/,/g, ""));
    if (Number.isNaN(value)) continue;
    data.push({ date: parseBanxicoDate(d.fecha), value });
  }
  return { id: raw.idSerie, title: raw.titulo, data };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Minimum gap between consecutive API calls (ms) */
const INTER_REQUEST_DELAY_MS = 800;

export async function fetchSeriesFromAPI(
  ids: string[],
  startDate?: Date,
  endDate?: Date,
): Promise<ParsedSeries[]> {
  const idStr = ids.join(",");
  let url = `${BASE_URL}/series/${idStr}/datos`;

  if (startDate && endDate) {
    url += `/${formatDateForAPI(startDate)}/${formatDateForAPI(endDate)}`;
  }

  const response = await fetchFromAPI(url, RATE_BUCKETS.historic);
  await sleep(INTER_REQUEST_DELAY_MS);
  if (!response) {
    console.warn(`[banxico] 404 for series: ${idStr} — skipping`);
    return [];
  }
  return response.bmx.series.map(parseSeries);
}

export async function fetchLatestFromAPI(
  ids: string[],
): Promise<ParsedSeries[]> {
  const idStr = ids.join(",");
  const url = `${BASE_URL}/series/${idStr}/datos/oportuno`;
  const response = await fetchFromAPI(url, RATE_BUCKETS.timely);
  await sleep(INTER_REQUEST_DELAY_MS);
  if (!response) {
    console.warn(`[banxico] 404 for series: ${idStr} — skipping`);
    return [];
  }
  return response.bmx.series.map(parseSeries);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
