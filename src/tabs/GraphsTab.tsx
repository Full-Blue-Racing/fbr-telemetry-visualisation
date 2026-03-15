import { useState } from 'preact/hooks';
import { Pane, SplitPane } from 'react-split-pane';
import { GpsTab } from './GpsTab';

export const GraphsTab = () => {
  const [showBottom, setShowBottom] = useState(false);

  return (
    <SplitPane direction="horizontal">
      <Pane minSize={100} defaultSize="30%">
        <div className="pane gray">
          <h3>Left Pane</h3>
          <p>Placeholder</p>
        </div>
      </Pane>
      <Pane minSize={200}>
        {showBottom ? (
          <SplitPane direction="vertical">
            <Pane minSize={100}>
              <div className="pane">
                <h3>Right Pane</h3>
                <p>Placeholder</p>
                <button className="btn" onClick={() => setShowBottom(false)}>
                  Hide GPS Panel
                </button>
              </div>
            </Pane>
            <Pane minSize={80} defaultSize={200}>
              <GpsTab />
            </Pane>
          </SplitPane>
        ) : (
          <div className="pane">
            <h3>Right Pane</h3>
            <p>Placeholder</p>
            <button className="btn" onClick={() => setShowBottom(true)}>
              Show GPS Panel
            </button>
          </div>
        )}
      </Pane>
    </SplitPane>
  );
};
