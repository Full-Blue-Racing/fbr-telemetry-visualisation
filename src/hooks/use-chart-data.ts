import { useMemo } from 'preact/hooks';
import type { ChartData } from 'chart.js';
import type { TelemetryStore } from '../data/types';
import type { SeriesSelector } from '../charts/adapter';
import { buildLineChartData } from '../charts/adapter';

/**
 * Memoized transformation from TelemetryStore + selectors to ChartData.
 * Only recomputes when store or selectors change.
 */
export function useChartData(
  store: TelemetryStore | undefined,
  selectors: readonly SeriesSelector[],
): ChartData<'line'> | undefined {
  return useMemo(() => {
    if (!store) return undefined;
    return buildLineChartData(store, selectors);
  }, [store, selectors]);
}
