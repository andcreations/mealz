import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenAI } from 'openai'
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import { requireStrEnv } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';

import {
  AIProvider,
  CreateCompletionInput,
  CreateCompletionOutput,
} from '../types';

@Injectable()
export class OpenAIProvider implements AIProvider, OnModuleInit {
  private readonly defaultModelName = 'gpt-4o-mini';
  private client: OpenAI;

  public constructor(
    private readonly logger: Logger,
  ) {}

  public async onModuleInit(): Promise<void> {
    this.client = new OpenAI({
      apiKey: requireStrEnv('MEALZ_OPENAI_API_KEY'),
    });
    this.logger.info('OpenAI provider initialized', BOOTSTRAP_CONTEXT);
  }

  public async createCompletion(
    input: CreateCompletionInput,
  ): Promise<CreateCompletionOutput> {
    const response = await this.client.completions.create({
      model: input.modelName ?? this.defaultModelName,
      prompt: input.prompt,
      max_tokens: input.maxTokens
    })
    return {
      text: response.choices[0].text
    }
  }
}