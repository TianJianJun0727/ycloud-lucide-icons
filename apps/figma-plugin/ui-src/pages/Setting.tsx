import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { PasswordInput } from '../components/PasswordInput';
import { TextInput } from '../components/TextInput';
import { useAppDispatch, useAppState } from '../contexts/AppContext';
import styles from './Setting.module.css';

const Setting = () => {
  const dispatch = useAppDispatch();
  const { githubRepositoryUrl, githubApiKey } = useAppState();
  const [repoUrlDraft, setRepoUrlDraft] = useState(githubRepositoryUrl);
  const [apiKeyDraft, setApiKeyDraft] = useState(githubApiKey);
  const [savedMessage, setSavedMessage] = useState('');
  const isRepoValid = repoUrlDraft.match(/https:\/\/github.com\/.*/) !== null;
  const isReady =
    githubRepositoryUrl.match(/https:\/\/github.com\/.*/) !== null && githubApiKey !== '';

  useEffect(() => {
    setRepoUrlDraft(githubRepositoryUrl);
  }, [githubRepositoryUrl]);

  useEffect(() => {
    setApiKeyDraft(githubApiKey);
  }, [githubApiKey]);

  const saveSettings = () => {
    dispatch({
      name: 'SET_GITHUB_URL',
      payload: {
        url: repoUrlDraft,
      },
    });
    dispatch({
      name: 'SET_GITHUB_API_KEY',
      payload: {
        apiKey: apiKeyDraft,
      },
    });
    setSavedMessage('连接设置已保存。');
  };

  const clearCredential = () => {
    setApiKeyDraft('');
    dispatch({
      name: 'SET_GITHUB_API_KEY',
      payload: {
        apiKey: '',
      },
    });
    setSavedMessage('访问凭证已清除。');
  };

  return (
    <div className={styles.container}>
      <section className={styles.card}>
        <div className={styles.statusHeader}>
          <div>
            <h2 className={styles.title}>连接设置</h2>
            <p className={styles.description}>
              保存目标图标库和访问凭证后，即可同步分类并提交图标。
            </p>
          </div>
          <span className={[styles.badge, isReady ? styles.badgeReady : ''].join(' ')}>
            {isReady ? '已配置' : '待配置'}
          </span>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.form}>
          <TextInput
            label="目标图标库"
            placeholder="https://github.com/TianJianJun0727/ycloud-icons"
            value={repoUrlDraft}
            helperText="用于同步分类和提交图标。"
            errorMessage="请输入有效的图标库地址。"
            isError={!isRepoValid}
            handleChange={(value) => {
              setRepoUrlDraft(value);
              setSavedMessage('');
            }}
          />

          {isRepoValid && (
            <a
              className={styles.repoLink}
              target="_blank"
              href={repoUrlDraft}
              rel="noreferrer"
            >
              {repoUrlDraft}
            </a>
          )}

          <PasswordInput
            value={apiKeyDraft}
            label="访问凭证"
            helperText="凭证仅保存在本机 Figma 客户端。建议使用细粒度访问令牌。"
            placeholder="github_pat_..."
            isInvalid={apiKeyDraft === ''}
            handleChange={(value) => {
              setApiKeyDraft(value);
              setSavedMessage('');
            }}
          />

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={saveSettings}
              disabled={!isRepoValid || apiKeyDraft === ''}
            >
              保存设置
            </button>
            {isReady && (
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={clearCredential}
              >
                清除凭证
              </button>
            )}
            {!isReady && (
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.secondaryButton}>创建访问凭证</span>
              </a>
            )}
          </div>

          {savedMessage && <p className={styles.description}>{savedMessage}</p>}
        </div>
      </section>
    </div>
  );
};

export default Setting;
