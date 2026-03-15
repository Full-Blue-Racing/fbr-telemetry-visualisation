import { Line } from 'react-chartjs-2';
import type { TelemetryStore } from '../data/types';
import type { SeriesSelector } from './adapter';
import { useChartData } from '../hooks/use-chart-data';

export interface ChartTabConfig {
  readonly id: string;
  readonly label: string;
  readonly preset: readonly SeriesSelector[];
  readonly title: string;
}

function ChartPanel({
  store,
  preset,
  title,
}: {
  store: TelemetryStore;
  preset: readonly SeriesSelector[];
  title: string;
}) {
  const data = useChartData(store, preset);
  if (!data) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: { title: { display: true, text: title } },
        }}
      />
    </div>
  );
}

export function ChartPanels({
  tabs,
  store,
  activeTab,
}: {
  tabs: readonly ChartTabConfig[];
  store: TelemetryStore;
  activeTab: string;
}) {
  return (
    <div>
      {activeTab === 'all'
        ? tabs.map((tab) => (
            <ChartPanel
              key={tab.id}
              store={store}
              preset={tab.preset}
              title={tab.title}
            />
          ))
        : tabs
            .filter((tab) => tab.id === activeTab)
            .map((tab) => (
              <ChartPanel
                key={tab.id}
                store={store}
                preset={tab.preset}
                title={tab.title}
              />
            ))}
    </div>
  );
}
