import { escapeHtml } from "../utils/dom";

export function renderError(message: string): string {
  return `<div class="error glass">${escapeHtml(message)}</div>`;
}
