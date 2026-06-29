import createBusinessCodeExamples from '../../.vitepress/lib/codeExamples/createBusinessCodeExamples';

export default {
  async load() {
    const codeExamples = await createBusinessCodeExamples();

    return {
      codeExamples,
    };
  },
};
