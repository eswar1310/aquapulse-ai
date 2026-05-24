/**
 * Centralized API configuration for AquaPulse frontend
 * Direct communication with FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const DEFAULT_TIMEOUT_MS = 10000;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Reusable fetch helper with timeout and error handling
 */
export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(id);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (_e) {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        `API Error: ${response.status} ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // For empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout: ${endpoint} took longer than ${timeout}ms`);
    }
    throw error;
  }
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface MarketPulseResponse {
  pulse: {
    market_bias?: string;
    confidence: number;
    price_pressure?: string;
  };
  timestamp?: string;
}

export interface WeatherSignalResponse {
  signal?: {
    severity?: string;
    impact?: string;
    signal_type?: string;
    recommendations?: string[];
  };
  weather_data?: {
    main?: { temp?: number; humidity?: number };
    wind?: { speed?: number };
  };
  timestamp?: string;
}

export interface NewsItem {
  title: string;
  url?: string;
  source?: string;
  published_at?: string;
  signal?: {
    impact?: string;
    confidence?: number;
  };
}

export type NewsSignalResponse = NewsItem[];

export interface IntelligenceTelemetry {
  market: MarketPulseResponse | null;
  weather: WeatherSignalResponse | null;
  news: NewsSignalResponse;
}

// ─── Centralized API Client ──────────────────────────────────────────────────

export const apiClient = {
  intelligence: {
    getMarketPulse: () => fetchApi<MarketPulseResponse>('/market-pulse/latest'),
    getWeatherSignals: () => fetchApi<WeatherSignalResponse>('/weather-signals/latest'),
    getNewsSignals: () => fetchApi<NewsSignalResponse>('/news-signals/latest'),
  },
  // Add more domains as needed
};

/**
 * Helper to get a fully qualified API URL (useful for FormData or special fetch calls)
 */
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
