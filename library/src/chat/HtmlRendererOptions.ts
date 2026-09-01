import { MessageRendererOptions } from './MessageRendererOptions';

const subs = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '&': '&amp;'
} as const;

export function htmlEscape(text: string) {
  const index = text.search(/[<>"'&]/);
  if (index === -1) return text;

  let result = text.substring(0, index);

  // current implementation
  let end = index;
  let start = 0;
  while (end >= 0) {
    result += subs[text[end]];
    start = end + 1;
    end = text.substring(start).search(/[<>"'&]/);
    result += text.substring(start, end >= 0 ? end : undefined);
  }
  return result;
}

export class HtmlRendererOptions implements MessageRendererOptions<string> {
  renderText(text: string): string {
    return htmlEscape(text);
  }

  renderMissing(handler: string): string {
    return `{${handler}:???}`;
  }
}
