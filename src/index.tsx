import { render } from 'preact';
import 'react-split-pane/styles.css';
import './index.css';
import App from './App';

const root = document.getElementById('root');
if (root) {
  render(<App />, root);
}
