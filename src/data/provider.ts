import type { TelemetryStore } from './types';

// ---- Load result ----

export type DataProviderResult =
  | { readonly status: 'success'; readonly store: TelemetryStore }
  | { readonly status: 'error'; readonly error: string };

// ---- The universal interface ----

export interface DataProvider {
  /** Human-readable name for UI display, e.g. "FlatBuffer Binary" */
  readonly name: string;

  /**
   * Load telemetry data from the given URL.
   * Returns the fully loaded TelemetryStore or an error.
   */
  load(url: string): Promise<DataProviderResult>;
}

// ---- State for the hook layer ----

export type DataProviderState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly store: TelemetryStore }
  | { readonly status: 'error'; readonly error: string };
