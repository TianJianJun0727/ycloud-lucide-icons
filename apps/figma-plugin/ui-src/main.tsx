import '@create-figma-plugin/ui/lib/css/base.css';
import './styles/global.css';
import { render } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { AppProvider } from './contexts/AppContext';
import App from './pages/App';

function Plugin() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

export default render(Plugin);
