import { HTTPParams, HTTPResponse, Service } from '@andcreations/common';
import {
  HTTPWebClientService,
  HTTPQueryOptions,
} from '@andcreations/web-common';

import { logErrorEvent } from '../../event-log';
import { eventType } from '../event-log';

@Service()
export class BackendService {
  constructor(private readonly http: HTTPWebClientService) {}

  public async get<T>(
    urlPath: string,
    queryParams?: HTTPParams,
    options?: HTTPQueryOptions,
  ): Promise<HTTPResponse<T>> {
    try {
      return await this.http.get<T>(urlPath, queryParams, options);
    } catch (error) {
      logErrorEvent(
        eventType('failed-to-get'),
        { urlPath, queryParams, options },
        error,
      );
      throw error;
    }
  }

  public async post<B, T = void>(
    urlPath: string,
    body: B,
    options?: HTTPQueryOptions,
  ): Promise<HTTPResponse<T>> {
    try {
      return await this.http.post<B, T>(urlPath, body, options);
    } catch (error) {
      logErrorEvent(
        eventType('failed-to-post'),
        { 
          urlPath,
          body: this.sanitizeBody(body),
          options,
        },
        error,
      );
      throw error;
    }
  }
  
  public async put<B, T = void>(
    urlPath: string,
    body: B,
    options?: HTTPQueryOptions,
  ): Promise<HTTPResponse<T>> {
    try {
      return await this.http.put<B, T>(urlPath, body, options);
    } catch (error) {
      logErrorEvent(
        eventType('failed-to-put'),
        {
          urlPath,
          body: this.sanitizeBody(body),
          options,
        },
        error,
      );
      throw error;
    }
  }
  
  public async patch<B, T = void>(
    urlPath: string,
    body: B,
    options?: HTTPQueryOptions,
  ): Promise<HTTPResponse<T>> {
    try {
      return await this.http.patch<B, T>(urlPath, body, options);
    } catch (error) {
      logErrorEvent(
        eventType('failed-to-patch'),
        {
          urlPath,
          body: this.sanitizeBody(body),
          options,
        },
        error,
      );
      throw error;
    }
  }
  
  public async delete<T = void>(
    urlPath: string,
    queryParams?: HTTPParams,
    options?: HTTPQueryOptions,
  ): Promise<HTTPResponse<T>> {
    try {
      return await this.http.delete<T>(urlPath, queryParams, options);
    } catch (error) {
      logErrorEvent(
        eventType('failed-to-delete'),
        { urlPath, queryParams, options },
        error,
      );
      throw error;
    }
  }

  private sanitizeBody(body: any): any {
    const KEYS_TO_SANITIZE = ['password'];

    if (body === null || body === undefined) {
      return body;
    }

    if (Array.isArray(body)) {
      return body.map((item) => this.sanitizeBody(item));
    }

    if (typeof body === 'object') {
      const sanitizedBody: Record<string, any> = {};
      Object.entries(body).forEach(([key, value]) => {
        sanitizedBody[key] = KEYS_TO_SANITIZE.includes(key)
          ? '***'
          : this.sanitizeBody(value);
      });
      return sanitizedBody;
    }

    return body;
  }
}