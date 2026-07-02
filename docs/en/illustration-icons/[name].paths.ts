import illustrationData from '../../illustration-icons/illustration.data';
import type { IllustrationEntity } from '../../.vitepress/theme/types';

export default {
  async paths() {
    const { illustrations } = (await illustrationData.load()) as {
      illustrations: IllustrationEntity[];
    };
    return illustrations.map((illustration) => ({
      params: illustration,
    }));
  },
};
