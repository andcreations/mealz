import * as React from 'react';
import * as HtmlToReact from 'html-to-react';

const parser = HtmlToReact.Parser();

export function htmlToReact(html: string): React.ReactNode {
  return parser.parse(html);
}