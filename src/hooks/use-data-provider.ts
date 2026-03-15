import { useEffect, useState } from 'preact/hooks';
import type { DataProvider, DataProviderState } from '../data/provider';

/**
 * Manages the lifecycle of loading data from a DataProvider.
 * Automatically triggers load on mount (or when url changes).
 */
export function useDataProvider(
  provider: DataProvider,
  url: string,
): DataProviderState {
  const [state, setState] = useState<DataProviderState>({ status: 'idle' });

  useEffect(() => {
    let cancelled = false;

    setState({ status: 'loading' });

    provider.load(url).then((result) => {
      if (cancelled) return;

      if (result.status === 'success') {
        setState({ status: 'ready', store: result.store });
      } else {
        setState({ status: 'error', error: result.error });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [provider, url]);

  return state;
}
