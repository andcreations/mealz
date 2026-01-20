import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenAI } from 'openai'
import { ResponseInputContent } from 'openai/resources/responses/responses';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import { InternalError, requireStrEnv } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import { MetricsService } from '@mealz/backend-metrics';

import {
  AIProvider,
  CreateCompletionInput,
  CreateCompletionOutput,
  CreateResponseInput,
  CreateResponseInputItem,
  CreateResponseOutput,
} from '../types';

@Injectable()
export class OpenAIProvider implements AIProvider, OnModuleInit {
  private static readonly METRIC_INPUT_TOKENS = 'ai_openai_input_tokens';
  private static readonly METRIC_OUTPUT_TOKENS = 'ai_openai_output_tokens';

  private readonly defaultModelName = 'gpt-4o-mini';
  private client: OpenAI;

  public constructor(
    private readonly logger: Logger,
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.registerMetric({
      name: OpenAIProvider.METRIC_INPUT_TOKENS,
      type: 'counter',
      description: 'Number of input tokens used by OpenAI',
      labels: ['model_name'],
    });
    this.metricsService.registerMetric({
      name: OpenAIProvider.METRIC_OUTPUT_TOKENS,
      type: 'counter',
      description: 'Number of output tokens used by OpenAI',
      labels: ['model_name'],
    });
  }

  public async onModuleInit(): Promise<void> {
    this.client = new OpenAI({
      apiKey: requireStrEnv('MEALZ_OPENAI_API_KEY'),
    });
    this.logger.info('OpenAI provider initialized', BOOTSTRAP_CONTEXT);
  }

  public async createCompletion(
    input: CreateCompletionInput,
  ): Promise<CreateCompletionOutput> {
    const modelName = input.modelName ?? this.defaultModelName;
    const response = await this.client.completions.create({
      model: modelName,
      prompt: input.prompt,
      max_tokens: input.maxTokens,
      temperature: input.temperature,
    })

    // metrics
    this.metricsService.incMetric(
      OpenAIProvider.METRIC_INPUT_TOKENS,
      { model_name: modelName },
      response.usage?.prompt_tokens ?? 0,
    );
    this.metricsService.incMetric(
      OpenAIProvider.METRIC_OUTPUT_TOKENS,
      { model_name: modelName },
      response.usage?.completion_tokens ?? 0,
    );

    return {
      text: response.choices[0].text
    }
  }

  public async createResponse(
    input: CreateResponseInput,
  ): Promise<CreateResponseOutput> {
    const modelName = input.modelName ?? this.defaultModelName;

    const mapInputItem = (
      item: CreateResponseInputItem,
    ): ResponseInputContent => {
      if (item.type === 'text') {
        return {
          type: 'input_text',
          text: item.text,
        }
      }
      if (item.type === 'image') {
        return {
          type: 'input_image',
          image_url: item.imageUrl,
          detail: 'high',
        }
      }
      throw new InternalError(`Invalid AI provider input item type`);
    }

    const { jsonSchemaName, jsonSchema } = input;
    if (
      (!jsonSchemaName && !!jsonSchema) ||
      (!!jsonSchemaName && !jsonSchema))
    {
      throw new InternalError(
        `JSON schema name and schema must be provided together`
      );
    }

    const response = await this.client.responses.create({
      model: input.modelName ?? this.defaultModelName,
      temperature: input.temperature,
      instructions: input.instructions,
      input: [
        {
          role: 'user',
          content: input.input.map(mapInputItem),
        },
      ],
      text: {
        ...((jsonSchemaName && jsonSchema)
          ? {
            format: {
              type: 'json_schema',
              name: jsonSchemaName,
              schema: jsonSchema,
            }
          }
          : {}
        ),
      },
    });

    // metrics
    this.metricsService.incMetric(
      OpenAIProvider.METRIC_INPUT_TOKENS,
      { model_name: modelName },
      response.usage?.input_tokens ?? 0,
    );
    this.metricsService.incMetric(
      OpenAIProvider.METRIC_OUTPUT_TOKENS,
      { model_name: modelName },
      response.usage?.output_tokens ?? 0,
    );

    return {
      text: response.output_text,
    }
  }
}