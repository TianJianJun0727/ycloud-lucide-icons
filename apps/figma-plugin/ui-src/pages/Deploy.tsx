import { Base64 } from 'js-base64';
import { h } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { FRAME_NAME } from '../../common/constants';
import {
  getIconNameIssues,
  getIconNameWarnings,
  getSvgIssues,
  sanitizeSvg,
  toKebabCase,
} from '../../common/iconRules';
import type { YCloudIconData } from '../../common/types';
import { useAppDispatch, useAppState } from '../contexts/AppContext';
import styles from './Deploy.module.css';

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const joinList = (value: string[]) => value.join(', ');

type Category = {
  key: string;
  title: string;
  englishTitle: string;
};

type GitHubContentItem = {
  name: string;
  path: string;
  type: string;
};

type GitHubContentFile = {
  content: string;
  encoding: string;
};

type GitHubTree = {
  tree: Array<{
    path: string;
    type: string;
  }>;
};

const GITHUB_API_VERSION = '2022-11-28';

const getPreviewTooltip = (
  name: string,
  data: YCloudIconData,
  isExistingIcon: boolean,
  issues: string[],
) => {
  const title = data.ycloud?.nameEn || name;
  const issueTips = issues.map((issue) => {
    if (issue.includes('英文名')) return '英文图标名不符合规范';
    if (issue.includes('24 x 24')) return 'SVG 需要使用 24 x 24 画板，viewBox 需要是 0 0 24 24';
    if (issue.includes('style 属性')) return 'SVG 不能包含 style 属性';
    if (issue.includes('写死颜色')) return 'SVG 不能包含写死颜色';
    return '需要检查';
  });
  return [title, isExistingIcon ? '已存在图标' : '', ...issueTips].filter(Boolean).join('\n');
};

const getCategoryLabel = (category: Category | undefined, fallback: string) => {
  if (!category) return fallback;
  if (!category.englishTitle || category.englishTitle === category.title) return category.title;
  return `${category.title} / ${category.englishTitle}`;
};

function decodeBase64Json<T>(content: string): T {
  return JSON.parse(Base64.decode(content.replace(/\s/g, ''))) as T;
}

const Deploy = () => {
  const dispatch = useAppDispatch();
  const {
    isDeploying,
    githubData,
    iconPreview,
    githubApiKey,
    githubRepositoryUrl,
    pngOption,
    ycloudMetadata,
    deployResult,
  } = useAppState();
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingIconNames, setExistingIconNames] = useState<string[]>([]);
  const [categoryQuery, setCategoryQuery] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryMessage, setCategoryMessage] = useState('');
  const [selectedIconNames, setSelectedIconNames] = useState<string[]>([]);
  const [allowExistingIconUpdate, setAllowExistingIconUpdate] = useState(false);
  const [isRawOpen, setIsRawOpen] = useState(false);
  const hasAutoLoadedCategories = useRef(false);
  const previousIconNamesRef = useRef<Set<string>>(new Set());
  const icons = Object.entries(iconPreview);
  const existingIconSet = useMemo(() => new Set(existingIconNames), [existingIconNames]);
  const selectedIconSet = useMemo(() => new Set(selectedIconNames), [selectedIconNames]);
  const selectedIcons = useMemo(
    () => icons.filter(([name]) => selectedIconSet.has(name)),
    [icons, selectedIconSet],
  );
  const iconQualityByName = useMemo(() => {
    return new Map(
      icons.map(([name, data]) => {
        const cleanedSvg = sanitizeSvg(data.svg);
        const issues = [...getIconNameIssues(name), ...getSvgIssues(cleanedSvg)];
        const warnings = [
          ...getIconNameWarnings(name),
          ...(data.svg.trim() !== cleanedSvg.trim() ? ['SVG 会在提交时自动清洗。'] : []),
        ];
        return [name, { issues, warnings }];
      }),
    );
  }, [icons]);
  const getIconQuality = (name: string) =>
    iconQualityByName.get(name) ?? { issues: [], warnings: [] };
  const deployableSelectedIcons = useMemo(
    () =>
      selectedIcons.filter(([name]) => {
        const quality = getIconQuality(name);
        const isExistingIcon = existingIconSet.has(toKebabCase(name));
        return quality.issues.length === 0 && (allowExistingIconUpdate || !isExistingIcon);
      }),
    [allowExistingIconUpdate, existingIconSet, iconQualityByName, selectedIcons],
  );
  const skippedExistingIconCount = selectedIcons.length - deployableSelectedIcons.length;
  const blockedIconCount = icons.filter(([name]) => getIconQuality(name).issues.length > 0).length;
  const selectedIconPreview = useMemo(
    () =>
      Object.fromEntries(
        deployableSelectedIcons.map(([name, data]) => [
          name,
          {
            ...data,
            svg: sanitizeSvg(data.svg),
          },
        ]),
      ),
    [deployableSelectedIcons],
  );

  useEffect(() => {
    const nextIconNames = icons.map(([name]) => name);
    const nextIconNameSet = new Set(nextIconNames);
    const previousIconNameSet = previousIconNamesRef.current;
    setSelectedIconNames((current) => {
      const currentSet = new Set(current);
      const isSelectable = (name: string) => {
        const normalizedName = toKebabCase(name);
        const quality = getIconQuality(name);
        return (
          quality.issues.length === 0 &&
          (allowExistingIconUpdate || !existingIconSet.has(normalizedName))
        );
      };
      const retained = current.filter((name) => nextIconNameSet.has(name) && isSelectable(name));
      const added = nextIconNames.filter(
        (name) => !currentSet.has(name) && !previousIconNameSet.has(name) && isSelectable(name),
      );
      return [...retained, ...added];
    });
    previousIconNamesRef.current = nextIconNameSet;
  }, [allowExistingIconUpdate, existingIconSet, iconPreview, iconQualityByName]);

  const updateMetadata = (patch: Partial<typeof ycloudMetadata>) => {
    dispatch({
      name: 'SET_YCLOUD_METADATA',
      payload: {
        ycloud: {
          ...ycloudMetadata,
          ...patch,
        },
      },
    });
  };

  const deploy = () => {
    dispatch({
      name: 'DEPLOY_ICON',
      payload: {
        icons: selectedIconPreview,
        githubData,
        options: {
          png: pngOption,
          fileName: 'icons',
          ycloud: ycloudMetadata,
        },
      },
    });
  };

  const toggleCategory = (categoryKey: string) => {
    const nextCategories = ycloudMetadata.categories.includes(categoryKey)
      ? ycloudMetadata.categories.filter((key) => key !== categoryKey)
      : [...ycloudMetadata.categories, categoryKey];
    updateMetadata({
      categories: Array.from(new Set(nextCategories)),
    });
  };

  const loadCategories = async () => {
    if (!githubData.owner || !githubData.name || !githubApiKey) {
      setCategoryMessage('请先在设置页保存连接设置。');
      return;
    }
    setIsLoadingCategories(true);
    setCategoryMessage('');
    try {
      const headers = {
        Authorization: `Bearer ${githubApiKey}`,
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
        Accept: 'application/vnd.github+json',
      };
      const apiUrl = `https://api.github.com/repos/${githubData.owner}/${githubData.name}`;
      const [listResponse, treeResponse] = await Promise.all([
        fetch(`${apiUrl}/contents/categories?ref=main`, {
          headers,
        }),
        fetch(`${apiUrl}/git/trees/main?recursive=1`, {
          headers,
        }),
      ]);
      if (!listResponse.ok) {
        throw new Error(`${listResponse.status} ${listResponse.statusText}`);
      }
      if (!treeResponse.ok) {
        throw new Error(`${treeResponse.status} ${treeResponse.statusText}`);
      }
      const items = (await listResponse.json()) as GitHubContentItem[];
      const tree = (await treeResponse.json()) as GitHubTree;
      const jsonFiles = items.filter((item) => item.type === 'file' && item.name.endsWith('.json'));
      const nextExistingIconNames = tree.tree
        .filter((item) => item.type === 'blob' && /^icons\/[^/]+\.svg$/.test(item.path))
        .map((item) => item.path.replace(/^icons\//, '').replace(/\.svg$/, ''));
      const nextCategories = await Promise.all(
        jsonFiles.map(async (item) => {
          const response = await fetch(`${apiUrl}/contents/${item.path}?ref=main`, {
            headers,
          });
          if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          const file = (await response.json()) as GitHubContentFile;
          const category = decodeBase64Json<{
            title: string;
            i18n?: {
              en?: {
                title?: string;
              };
            };
          }>(file.content);
          return {
            key: item.name.replace(/\.json$/, ''),
            title: category.title,
            englishTitle: category.i18n?.en?.title ?? item.name.replace(/\.json$/, ''),
          };
        }),
      );
      setCategories(
        nextCategories.sort((left, right) => left.title.localeCompare(right.title, 'zh-Hans-CN')),
      );
      setExistingIconNames(nextExistingIconNames);
      setCategoryMessage(
        `已同步 ${nextCategories.length} 个已有分类、${nextExistingIconNames.length} 个已有图标。`,
      );
    } catch (error) {
      setCategoryMessage(
        error instanceof Error ? `同步数据失败：${error.message}` : '同步数据失败。',
      );
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (
      hasAutoLoadedCategories.current ||
      isLoadingCategories ||
      categories.length > 0 ||
      !githubData.owner ||
      !githubData.name ||
      !githubApiKey
    ) {
      return;
    }
    hasAutoLoadedCategories.current = true;
    void loadCategories();
  }, [categories.length, githubApiKey, githubData.name, githubData.owner, isLoadingCategories]);

  const allCategoryOptions = useMemo(
    () =>
      categories.filter(
        (category, index, array) => array.findIndex((item) => item.key === category.key) === index,
      ),
    [categories],
  );
  const categoryByKey = useMemo(
    () => new Map(allCategoryOptions.map((category) => [category.key, category])),
    [allCategoryOptions],
  );
  const filteredCategories = allCategoryOptions.filter((category) => {
    const query = categoryQuery.trim().toLowerCase();
    if (!query) return true;
    return [category.key, category.title, category.englishTitle]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
  const missingRequirements = [
    githubRepositoryUrl === '' ? '目标仓库' : '',
    githubApiKey === '' ? '访问凭证' : '',
    icons.length === 0 ? '图标源' : '',
    deployableSelectedIcons.length === 0 ? '本次提交图标' : '',
    ycloudMetadata.categories.length === 0 ? '分类' : '',
  ].filter(Boolean);
  const canDeploy =
    githubApiKey !== '' &&
    githubRepositoryUrl !== '' &&
    deployableSelectedIcons.length > 0 &&
    ycloudMetadata.categories.length > 0 &&
    !isDeploying;

  return (
    <div className={styles.container}>
      <section className={styles.card}>
        <div className={styles.row}>
          <div>
            <h2 className={styles.title}>提交图标</h2>
            <p className={styles.muted}>
              读取当前选中的图标或区块；未选择时读取 <strong>{FRAME_NAME}</strong>。
            </p>
          </div>
          <span className={[styles.badge, icons.length > 0 ? styles.badgeReady : ''].join(' ')}>
            {icons.length} 个图标
          </span>
        </div>
        <div className={styles.repoLine}>
          <span className={styles.label}>目标图标库</span>
          {githubData.owner && githubData.name ? (
            <a
              className={styles.link}
              target="_blank"
              href={`https://github.com/${githubData.owner}/${githubData.name}`}
              rel="noreferrer"
            >
              {githubData.owner}/{githubData.name}
            </a>
          ) : (
            <span className={styles.muted}>请先完成连接设置</span>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.row}>
          <div>
            <h2 className={styles.title}>分类</h2>
            <p className={styles.muted}>选择目标图标库中已有分类。</p>
          </div>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={isLoadingCategories}
            onClick={loadCategories}
          >
            {isLoadingCategories ? '刷新中' : '刷新分类'}
          </button>
        </div>
        {categoryMessage && (
          <p
            className={[
              styles.message,
              categoryMessage.includes('失败') ? styles.messageError : '',
            ].join(' ')}
          >
            {categoryMessage}
          </p>
        )}
        <div className={styles.fieldGroup}>
          <input
            className={styles.input}
            placeholder="搜索分类名称或标识"
            value={categoryQuery}
            onInput={(event) => {
              setCategoryQuery(event.currentTarget.value);
            }}
          />
        </div>
        <div className={styles.selectedTags}>
          {ycloudMetadata.categories.length > 0 ? (
            ycloudMetadata.categories.map((categoryKey) => {
              const category = categoryByKey.get(categoryKey);
              return (
                <span
                  key={categoryKey}
                  className={styles.tag}
                >
                  {getCategoryLabel(category, categoryKey)}
                  <button
                    className={styles.tagButton}
                    type="button"
                    aria-label={`移除分类 ${getCategoryLabel(category, categoryKey)}`}
                    onClick={() => {
                      toggleCategory(categoryKey);
                    }}
                  >
                    ×
                  </button>
                </span>
              );
            })
          ) : (
            <span className={styles.muted}>尚未选择分类</span>
          )}
        </div>
        <div className={styles.categoryList}>
          {filteredCategories.map((category) => (
            <div
              key={category.key}
              className={styles.categoryItem}
            >
              <label className={styles.checkboxLabel}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={ycloudMetadata.categories.includes(category.key)}
                  onChange={() => {
                    toggleCategory(category.key);
                  }}
                />
                <span className={styles.checkboxBox} />
                <span className={styles.categoryText}>
                  <span className={styles.categoryTitle}>{category.title}</span>
                  <span className={styles.categoryMeta}>
                    {category.englishTitle || category.title}
                  </span>
                </span>
              </label>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.title}>暂无分类</p>
              <p className={styles.muted}>请先刷新目标图标库分类，或调整搜索关键词。</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.title}>图标元数据</h2>
        <div className={styles.fieldGroup}>
          <span className={styles.label}>中文标签，逗号分隔</span>
          <input
            className={styles.input}
            placeholder="箭头, 方向"
            value={joinList(ycloudMetadata.tagsZh)}
            onInput={(event) => {
              updateMetadata({ tagsZh: splitList(event.currentTarget.value) });
            }}
          />
          <p className={styles.muted}>用于搜索和筛选，后续流程会自动补齐英文内容。</p>
        </div>
        <div className={styles.fieldGroup}>
          <span className={styles.label}>中文使用场景，逗号分隔</span>
          <input
            className={styles.input}
            placeholder="工具栏, 导航"
            value={joinList(ycloudMetadata.useCasesZh)}
            onInput={(event) => {
              updateMetadata({ useCasesZh: splitList(event.currentTarget.value) });
            }}
          />
          <p className={styles.muted}>用于描述图标适合出现的位置或业务场景。</p>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.row}>
          <h2 className={styles.title}>预览</h2>
          <p className={styles.muted}>
            将提交 {deployableSelectedIcons.length} / {icons.length} 个
          </p>
        </div>
        {existingIconNames.length > 0 && (
          <div className={styles.row}>
            <p className={styles.muted}>已自动跳过同名图标，避免重复提交。</p>
            <label className={styles.checkboxLabel}>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={allowExistingIconUpdate}
                onChange={(event) => {
                  setAllowExistingIconUpdate(event.currentTarget.checked);
                }}
              />
              <span className={styles.checkboxBox} />
              覆盖已存在图标
            </label>
          </div>
        )}
        {skippedExistingIconCount > 0 && !allowExistingIconUpdate && (
          <p className={styles.message}>本次已跳过 {skippedExistingIconCount} 个已存在图标。</p>
        )}
        {blockedIconCount > 0 && (
          <p className={[styles.message, styles.messageError].join(' ')}>
            有 {blockedIconCount} 个图标命名不符合提交规则，已暂时禁用。
          </p>
        )}
        {icons.length > 0 && (
          <div className={styles.previewActions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => {
                setSelectedIconNames(
                  icons
                    .filter(([name]) => {
                      const quality = getIconQuality(name);
                      return (
                        quality.issues.length === 0 &&
                        (allowExistingIconUpdate || !existingIconSet.has(toKebabCase(name)))
                      );
                    })
                    .map(([name]) => name),
                );
              }}
            >
              选择可提交图标
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => {
                setSelectedIconNames([]);
              }}
            >
              清空
            </button>
          </div>
        )}
        <div className={styles.preview}>
          {icons.map(([name, data]) => {
            const { svg } = data;
            const isExistingIcon = existingIconSet.has(toKebabCase(name));
            const isDisabledExistingIcon = isExistingIcon && !allowExistingIconUpdate;
            const quality = getIconQuality(name);
            const isBlockedIcon = quality.issues.length > 0;
            const tooltip = getPreviewTooltip(name, data, isExistingIcon, quality.issues);
            return (
              <label
                className={styles.previewItem}
                key={name}
                title={tooltip}
              >
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={selectedIconSet.has(name)}
                  disabled={isDisabledExistingIcon || isBlockedIcon}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setSelectedIconNames((current) => {
                      if (checked) {
                        return Array.from(new Set([...current, name]));
                      }
                      return current.filter((item) => item !== name);
                    });
                  }}
                />
                <span className={styles.checkboxBox} />
                <span
                  className={styles.previewIcon}
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </label>
            );
          })}
          {icons.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.title}>还没有可提交的图标</p>
              <p className={styles.muted}>
                请在画布中准备名为 {FRAME_NAME} 的画框或区块，并放入图标组件。
              </p>
            </div>
          )}
        </div>
        <button
          className={styles.disclosureButton}
          type="button"
          onClick={() => {
            setIsRawOpen((next) => !next);
          }}
        >
          查看原始数据
          <span>{isRawOpen ? '收起' : '展开'}</span>
        </button>
        {isRawOpen && (
          <textarea
            className={styles.rawData}
            rows={8}
            readOnly
            value={JSON.stringify(selectedIconPreview, null, 2)}
          />
        )}
      </section>

      {deployResult && (
        <section
          className={[
            styles.status,
            deployResult.status === 'error' ? styles.statusError : '',
          ].join(' ')}
        >
          <strong>{deployResult.status === 'success' ? '提交成功' : '提交失败'}</strong>
          <p>{deployResult.message}</p>
          {deployResult.url && (
            <a
              className={styles.link}
              href={deployResult.url}
              target="_blank"
              rel="noreferrer"
            >
              打开审核单
            </a>
          )}
        </section>
      )}

      <section className={styles.footer}>
        {missingRequirements.length > 0 ? (
          <p className={styles.footerHint}>待补充：{missingRequirements.join('、')}</p>
        ) : deployResult ? (
          deployResult.url ? (
            <a
              className={[styles.footerHint, styles.link].join(' ')}
              href={deployResult.url}
              target="_blank"
              rel="noreferrer"
            >
              {deployResult.message}
            </a>
          ) : (
            <p className={styles.footerHint}>{deployResult.message}</p>
          )
        ) : (
          <p className={styles.footerHint}>将提交 SVG、图标信息和必要的分类信息。</p>
        )}
        <button
          className={styles.primaryButton}
          type="button"
          disabled={!canDeploy}
          onClick={deploy}
        >
          {isDeploying ? '提交中' : '提交图标'}
        </button>
      </section>
    </div>
  );
};

export default Deploy;
