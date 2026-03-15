/**
 * Transforms TelemetryStore data into Chart.js-compatible datasets.
 * Pure functions — no side effects, no Chart.js registration.
 */

import type { ChartData } from 'chart.js';
import type { TelemetryFrame, TelemetryStore } from '../data/types';

/**
 * Describes one line on a chart.
 * Each selector extracts a single numeric value from a frame.
 */
export interface SeriesSelector {
  readonly label: string;
  readonly color: string;
  readonly extract: (frame: TelemetryFrame) => number | undefined;
}

/**
 * Build a Chart.js line chart data object from a telemetry store.
 *
 * X-axis: time in seconds relative to the first frame (from clockNanos).
 * Each selector becomes one dataset (line) on the chart.
 * Frames where extract returns undefined produce null (Chart.js gap).
 */
export function buildLineChartData(
  store: TelemetryStore,
  selectors: readonly SeriesSelector[],
): ChartData<'line'> {
  const { frames } = store;

  if (frames.length === 0) {
    return { labels: [], datasets: [] };
  }

  const firstClock = frames[0].clockNanos;

  // X-axis: seconds relative to first frame
  const labels = frames.map(
    (f) => Number(((f.clockNanos - firstClock) / 1_000_000_000).toFixed(3)),
  );

  const datasets = selectors.map((sel) => ({
    label: sel.label,
    data: frames.map((f) => sel.extract(f) ?? null),
    borderColor: sel.color,
    backgroundColor: sel.color,
    pointRadius: 0,
    borderWidth: 1.5,
    tension: 0,
  }));

  return { labels, datasets };
}
