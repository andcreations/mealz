export abstract class AIProvider {
  public abstract createCompletion(
    input: CreateCompletionInput,
  ): Promise<CreateCompletionOutput>;
}

export interface CreateCompletionInput {
  prompt: string;
  modelName?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface CreateCompletionOutput {
  text: string;
}