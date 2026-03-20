import { BackendService } from './BackendService';

const createBackendService = (): BackendService => {
  return new BackendService({} as any);
};

describe('BackendService.sanitizeBody', () => {
  let backendService: BackendService;

  beforeEach(() => {
    backendService = createBackendService();
  });

  const sanitizeBody = (body: any): any => {
    return (backendService as any).sanitizeBody(body);
  };

  test('should return null and undefined as-is', () => {
    expect(sanitizeBody(null)).toBeNull();
    expect(sanitizeBody(undefined)).toBeUndefined();
  });

  test('should return primitive values as-is', () => {
    expect(sanitizeBody('abc')).toBe('abc');
    expect(sanitizeBody(123)).toBe(123);
    expect(sanitizeBody(true)).toBe(true);
  });

  test('should sanitize top-level password', () => {
    const body = {
      username: 'john',
      password: 'secret',
    };

    expect(sanitizeBody(body)).toEqual({
      username: 'john',
      password: '***',
    });
  });

  test('should sanitize password recursively in objects and arrays', () => {
    const body = {
      password: 'root-secret',
      profile: {
        password: 'profile-secret',
        nested: {
          token: '123',
          password: 'nested-secret',
        },
      },
      sessions: [
        { id: 1, password: 'session-1' },
        {
          id: 2,
          data: {
            password: 'session-2',
          },
        },
      ],
    };

    expect(sanitizeBody(body)).toEqual({
      password: '***',
      profile: {
        password: '***',
        nested: {
          token: '123',
          password: '***',
        },
      },
      sessions: [
        { id: 1, password: '***' },
        {
          id: 2,
          data: {
            password: '***',
          },
        },
      ],
    });
  });

  test('should not sanitize keys other than password', () => {
    const body = {
      passWord: 'mixed-case',
      PASSWORD: 'upper-case',
      secret: 'value',
    };

    expect(sanitizeBody(body)).toEqual(body);
  });

  test('should not mutate the original body object', () => {
    const body = {
      password: 'secret',
      nested: {
        password: 'nested-secret',
      },
      items: [
        { password: 'item-secret' },
      ],
    };

    const copyBeforeSanitize = JSON.parse(JSON.stringify(body));
    const sanitized = sanitizeBody(body);

    expect(body).toEqual(copyBeforeSanitize);
    expect(sanitized).not.toBe(body);
    expect(sanitized.nested).not.toBe(body.nested);
    expect(sanitized.items).not.toBe(body.items);
  });
});
