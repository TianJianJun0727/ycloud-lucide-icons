import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useAppState } from '../contexts/AppContext';
import styles from './App.module.css';
import Deploy from './Deploy';
import Setting from './Setting';

const App = () => {
  const { githubApiKey, githubRepositoryUrl } = useAppState();
  const [tab, setTab] = useState('deploy');
  const isSettingsReady =
    /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(githubRepositoryUrl) &&
    githubApiKey.trim() !== '';
  const previousReadyRef = useRef(isSettingsReady);

  useEffect(() => {
    const wasReady = previousReadyRef.current;
    previousReadyRef.current = isSettingsReady;
    if (!isSettingsReady) {
      setTab('settings');
      return;
    }
    if (!wasReady) {
      setTab('deploy');
    }
  }, [isSettingsReady]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={[styles.tab, tab === 'deploy' ? styles.tabActive : ''].join(' ')}
          type="button"
          onClick={() => {
            setTab('deploy');
          }}
        >
          提交
        </button>
        <button
          className={[styles.tab, tab === 'settings' ? styles.tabActive : ''].join(' ')}
          type="button"
          onClick={() => {
            setTab('settings');
          }}
        >
          设置
        </button>
      </div>
      <main className={styles.panel}>{tab === 'deploy' ? <Deploy /> : <Setting />}</main>
    </div>
  );
};

export default App;
