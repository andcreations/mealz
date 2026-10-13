import { ChunkedUserNotificationType } from '../types';
import { htmlToNotificationChunks } from './html-to-notification-chunks';

describe('htmlToNotificationChunks', () => {
  test('Plain text without tags', () => {
    const { chunks } = htmlToNotificationChunks('Hello world');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Normal, text: 'Hello world' },
    ]);
  });

  test('Empty string', () => {
    const { chunks } = htmlToNotificationChunks('');
    expect(chunks).toEqual([]);
  });

  test('Bold tag only', () => {
    const { chunks } = htmlToNotificationChunks('<b>bold</b>');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Bold, text: 'bold' },
    ]);
  });

  test('Code tag only', () => {
    const { chunks } = htmlToNotificationChunks('<code>snippet</code>');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Code, text: 'snippet' },
    ]);
  });

  test('Text before bold tag', () => {
    const { chunks } = htmlToNotificationChunks('Hello <b>world</b>');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Normal, text: 'Hello ' },
      { type: ChunkedUserNotificationType.Bold, text: 'world' },
    ]);
  });

  test('Text after bold tag', () => {
    const { chunks } = htmlToNotificationChunks('<b>Hello</b> world');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Bold, text: 'Hello' },
      { type: ChunkedUserNotificationType.Normal, text: ' world' },
    ]);
  });

  test('Text surrounding bold tag', () => {
    const { chunks } = htmlToNotificationChunks('Say <b>hello</b> please');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Normal, text: 'Say ' },
      { type: ChunkedUserNotificationType.Bold, text: 'hello' },
      { type: ChunkedUserNotificationType.Normal, text: ' please' },
    ]);
  });

  test('Mixed bold and code tags', () => {
    const { chunks } = htmlToNotificationChunks(
      'Use <b>bold</b> and <code>foo()</code> here',
    );
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Normal, text: 'Use ' },
      { type: ChunkedUserNotificationType.Bold, text: 'bold' },
      { type: ChunkedUserNotificationType.Normal, text: ' and ' },
      { type: ChunkedUserNotificationType.Code, text: 'foo()' },
      { type: ChunkedUserNotificationType.Normal, text: ' here' },
    ]);
  });

  test('Multiple bold tags', () => {
    const { chunks } = htmlToNotificationChunks(
      '<b>one</b> and <b>two</b>',
    );
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Bold, text: 'one' },
      { type: ChunkedUserNotificationType.Normal, text: ' and ' },
      { type: ChunkedUserNotificationType.Bold, text: 'two' },
    ]);
  });

  test('Adjacent tags without text between them', () => {
    const { chunks } = htmlToNotificationChunks(
      '<b>bold</b><code>code</code>',
    );
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Bold, text: 'bold' },
      { type: ChunkedUserNotificationType.Code, text: 'code' },
    ]);
  });

  test('Tag content with whitespace', () => {
    const { chunks } = htmlToNotificationChunks('<b> spaced </b>');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Bold, text: ' spaced ' },
    ]);
  });

  test('Tag content with newline', () => {
    const { chunks } = htmlToNotificationChunks('<b>line1\nline2</b>');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Bold, text: 'line1\nline2' },
    ]);
  });

  test('Consecutive calls reset regex state', () => {
    htmlToNotificationChunks('<b>first</b>');
    const { chunks } = htmlToNotificationChunks('<b>second</b>');
    expect(chunks).toEqual([
      { type: ChunkedUserNotificationType.Bold, text: 'second' },
    ]);
  });

  test('Throws on invalid tag', () => {
    expect(() => htmlToNotificationChunks('<i>italic</i>')).toThrow(
      'Invalid tag "i"',
    );
  });

  test('Throws on invalid tag mixed with valid tags', () => {
    expect(() =>
      htmlToNotificationChunks('<b>bold</b> <em>emphasis</em>'),
    ).toThrow('Invalid tag "em"');
  });

  test('Returns working builder methods', () => {
    const result = htmlToNotificationChunks('Hello ');
    result.bold('world');
    result.newLine();
    result.code('done');

    expect(result.chunks).toEqual([
      { type: ChunkedUserNotificationType.Normal, text: 'Hello ' },
      { type: ChunkedUserNotificationType.Bold, text: 'world' },
      { type: ChunkedUserNotificationType.Normal, text: '\n' },
      { type: ChunkedUserNotificationType.Code, text: 'done' },
    ]);
  });
});
