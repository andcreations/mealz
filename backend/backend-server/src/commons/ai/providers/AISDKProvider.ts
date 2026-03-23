import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  generateText,
  jsonSchema as wrapJsonSchema,
  Output,
  LanguageModel,
  TextPart,
  ImagePart,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import { InternalError, requireStrEnv } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import { MetricsService } from '@mealz/backend-metrics';

import { AI_FOR_SERVICE_OPTIONS } from '../consts';
import {
  AIProvider,
  CreateCompletionInput,
  CreateCompletionOutput,
  CreateResponseInput,
  CreateResponseInputItem,
  CreateResponseOutput,
  AIModuleForServiceOptions,
} from '../types';

@Injectable()
export class AISDKProvider implements AIProvider, OnModuleInit {
  private static readonly METRIC_INPUT_TOKENS = 'ai_sdk_input_tokens';
  private static readonly METRIC_OUTPUT_TOKENS = 'ai_sdk_output_tokens';

  private openai: ReturnType<typeof createOpenAI>;

  public constructor(
    private readonly logger: Logger,
    @Inject(AI_FOR_SERVICE_OPTIONS)
    private readonly options: AIModuleForServiceOptions,
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.registerMetric({
      name: AISDKProvider.METRIC_INPUT_TOKENS,
      type: 'counter',
      description: 'Number of input tokens used by AI SDK',
      labels: ['model_name', 'domain', 'service'],
    });
    this.metricsService.registerMetric({
      name: AISDKProvider.METRIC_OUTPUT_TOKENS,
      type: 'counter',
      description: 'Number of output tokens used by AI SDK',
      labels: ['model_name', 'domain', 'service'],
    });
  }

  public async onModuleInit(): Promise<void> {
    this.openai = createOpenAI({
      apiKey: requireStrEnv('MEALZ_OPENAI_API_KEY'),
    });
    this.logger.info('AI SDK provider initialized', BOOTSTRAP_CONTEXT);
  }

  private getModelName(modelName?: string): string {
    return modelName ?? this.options.defaultModelName;
  }

  private getModel(modelName?: string): LanguageModel {
    return this.openai(modelName);
  }

  private trackTokenUsage(
    modelName: string,
    usage: {
      inputTokens: number | undefined;
      outputTokens: number | undefined;
    },
  ): void {
    this.metricsService.incMetric(
      AISDKProvider.METRIC_INPUT_TOKENS,
      {
        model_name: modelName,
        domain: this.options.domain,
        service: this.options.service,
      },
      usage.inputTokens ?? 0,
    );
    this.metricsService.incMetric(
      AISDKProvider.METRIC_OUTPUT_TOKENS,
      {
        model_name: modelName,
        domain: this.options.domain,
        service: this.options.service,
      },
      usage.outputTokens ?? 0,
    );
  }

  private mapInputItem(
    item: CreateResponseInputItem,
  ): TextPart | ImagePart {
    if (item.type === 'text') {
      return { type: 'text', text: item.text };
    }
    if (item.type === 'image') {
      return { type: 'image', image: new URL(item.imageUrl) };
    }
    throw new InternalError('Invalid AI provider input item type');
  }

  public async createCompletion(
    input: CreateCompletionInput,
  ): Promise<CreateCompletionOutput> {
    const modelName = this.getModelName(input.modelName);
    const result = await generateText({
      model: this.getModel(modelName),
      prompt: input.prompt,
      maxOutputTokens: input.maxTokens,
      temperature: input.temperature,
    });

    this.trackTokenUsage(modelName, result.usage);

    return { text: result.text };
  }

  public async createResponse(
    input: CreateResponseInput,
  ): Promise<CreateResponseOutput> {
    const modelName = this.getModelName(input.modelName);

    const { jsonSchemaName, jsonSchema } = input;
    if (
      (!jsonSchemaName && !!jsonSchema) ||
      (!!jsonSchemaName && !jsonSchema)
    ) {
      throw new InternalError(
        'JSON schema name and schema must be provided together',
      );
    }

    const content = input.input.map(
      (item) => this.mapInputItem(item),
    );

    if (jsonSchemaName && jsonSchema) {
      const result = await generateText({
        model: this.getModel(modelName),
        temperature: input.temperature,
        system: input.instructions,
        messages: [{ role: 'user', content }],
        output: Output.object({
          schema: wrapJsonSchema(jsonSchema),
          name: jsonSchemaName,
        }),
      });

      this.trackTokenUsage(modelName, result.usage);
      return { text: JSON.stringify(result.output) };
    }

    const result = await generateText({
      model: this.getModel(modelName),
      temperature: input.temperature,
      system: input.instructions,
      messages: [{ role: 'user', content }],
    });

    this.trackTokenUsage(modelName, result.usage);
    return { text: result.text };
  }
}
