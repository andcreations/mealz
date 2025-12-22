export type PromptParams = Record<string, string>;

export interface PromptSection {
  text: string;
}

export class PromptBuilder {
  public static build(
    prompt: string | PromptSection[],
    params: PromptParams = {},
  ): string {
    if (typeof prompt === 'string') {
      return this.buildSection({ text: prompt }, params);
    }
    let result = '';
    for (const section of prompt) {
      result += this.buildSection(section, params);
    }

    return result;
  }

  private static buildSection(
    section: PromptSection,
    params: PromptParams,
  ): string {
    let result = section.text;
    for (const [ key, value ] of Object.entries(params)) {
      result = result.replace(`{{${key}}}`, value);
    }
    return result;
  }
}
