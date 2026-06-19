import changelogSidebarItems from '../../../data/changelogSidebar';

export default {
  async load() {
    const latestRelease = changelogSidebarItems[0];
    const latestVersion = latestRelease?.text.split(' · ')[0] ?? 'v0.0.0';
    const changelogHref = latestRelease?.link ?? '/changelog';

    return {
      version: latestVersion,
      changelogHref,
      installationHref: '/guide/installation',
    };
  },
};
