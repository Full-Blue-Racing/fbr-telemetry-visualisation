import { useMemo, useState } from 'preact/hooks';
import { Pane, SplitPane } from 'react-split-pane';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FlatBufferDataProvider } from '../data/flatbuffer';
import { useDataProvider } from '../hooks/use-data-provider';
import {
  WHEEL_SPEED_ALL,
  DAMPER_POSITION_ALL,
  ACCELERATION,
  GPS_SPEED,
} from '../charts/presets';
import type { ChartTabConfig } from '../charts/ChartTabs';
import { ChartPanels } from '../charts/ChartTabs';
import { GpsTab } from './GpsTab';

// Register Chart.js components (once at module level)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const DATA_URL = '/data/telemetry.bin';

const CHART_TABS: ChartTabConfig[] = [
  { id: 'wheelSpeed', label: 'Wheel Speed', preset: WHEEL_SPEED_ALL, title: 'Wheel Speed - All Wheels' },
  { id: 'damper', label: 'Damper Position', preset: DAMPER_POSITION_ALL, title: 'Damper Position - All' },
  { id: 'accel', label: 'Acceleration', preset: ACCELERATION, title: 'Acceleration (X, Y, Z)' },
  { id: 'gpsSpeed', label: 'GPS Speed', preset: GPS_SPEED, title: 'GPS Speed' },
];

export const GraphsTab = () => {
  const [showBottom, setShowBottom] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const provider = useMemo(() => new FlatBufferDataProvider(), []);
  const state = useDataProvider(provider, DATA_URL);
  const store = state.status === 'ready' ? state.store : undefined;

  const chartContent = store && (
    <ChartPanels tabs={CHART_TABS} store={store} activeTab={activeTab} />
  );

  return (
    <SplitPane direction="horizontal">
      <Pane minSize={100} defaultSize="20%">
        <div className="pane gray">
          <h3>Data</h3>
          {state.status === 'idle' && <p>Idle</p>}
          {state.status === 'loading' && <p>Loading telemetry...</p>}
          {state.status === 'error' && <p>Error: {state.error}</p>}
          {state.status === 'ready' && (
            <div>
              <p>Source: {state.store.metadata.sourceName}</p>
              <p>Frames: {state.store.metadata.frameCount}</p>
              <p>Duration: {state.store.metadata.durationSeconds.toFixed(1)}s</p>
              <p>Channels: {state.store.metadata.availableChannels.join(', ')}</p>
            </div>
          )}
          <h3>Charts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              type="button"
              className={`btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            {CHART_TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={`btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <h3>Panels</h3>
          <button
            type="button"
            className="btn"
            onClick={() => setShowBottom(!showBottom)}
          >
            {showBottom ? 'Hide' : 'Show'} GPS Panel
          </button>
        </div>
      </Pane>
      <Pane minSize={200}>
        {showBottom ? (
          <SplitPane direction="vertical">
            <Pane minSize={100}>
              <div className="pane" style={{ overflow: 'auto' }}>
                {chartContent}
              </div>
            </Pane>
            <Pane minSize={80} defaultSize={200}>
              <GpsTab />
            </Pane>
          </SplitPane>
        ) : (
          <div className="pane" style={{ overflow: 'auto' }}>
            {chartContent}
          </div>
        )}
      </Pane>
    </SplitPane>
  );
};
