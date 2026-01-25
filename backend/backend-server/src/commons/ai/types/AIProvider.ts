export abstract class AIProvider {
  public abstract createCompletion(
    input: CreateCompletionInput,
  ): Promise<CreateCompletionOutput>;

  public abstract createResponse(
    input: CreateResponseInput,
  ): Promise<CreateResponseOutput>;
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

export interface CreateResponseInputText {
  type: 'text';
  text: string;
}

export interface CreateResponseInputImage {
  type: 'image';
  imageUrl: string;
}

export type CreateResponseInputItem =
  | CreateResponseInputText 
  | CreateResponseInputImage;

export interface CreateResponseInput {
  modelName?: string;
  temperature?: number;
  instructions?: string;
  input: CreateResponseInputItem[];
  jsonSchemaName?: string;
  jsonSchema?: { [key: string]: unknown };
}

export interface CreateResponseOutput {
  text: string;
}