import { visit } from 'unist-util-visit';

const ALERTS = {
  NOTE: { label: 'Note', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 4h2v2H7V4zm0 4h2v5H7V8z"/></svg>' },
  TIP: { label: 'Tip', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a5 5 0 00-3 9v2a1 1 0 001 1h4a1 1 0 001-1v-2a5 5 0 00-3-9zM6 14h4v1H6v-1z"/></svg>' },
  IMPORTANT: { label: 'Important', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 4h2v6H7V4zm0 7h2v2H7v-2z"/></svg>' },
  WARNING: { label: 'Warning', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l7.5 13H.5L8 1zm-1 5v4h2V6H7zm0 5v2h2v-2H7z"/></svg>' },
  CAUTION: { label: 'Caution', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.7.5h6.6l4.2 4.2v6.6l-4.2 4.2H4.7L.5 11.3V4.7L4.7.5zM7 4v5h2V4H7zm0 7v2h2v-2H7z"/></svg>' },
};

/**
 * Renders GitHub's blockquote alert syntax ("> [!NOTE]" etc.) as a labeled,
 * colored callout box instead of a plain blockquote with the marker left
 * in as literal text.
 */
export function remarkGithubAlerts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const firstPara = node.children[0];
      if (!firstPara || firstPara.type !== 'paragraph') return;
      const firstText = firstPara.children[0];
      if (!firstText || firstText.type !== 'text') return;

      const match = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i.exec(firstText.value);
      if (!match) return;

      const type = match[1].toUpperCase();
      const alert = ALERTS[type];
      firstText.value = firstText.value.slice(match[0].length);

      node.data = { hName: 'div', hProperties: { className: `markdown-alert markdown-alert-${type.toLowerCase()}` } };
      node.children.unshift({
        type: 'html',
        value: `<p class="markdown-alert-title">${alert.icon}${alert.label}</p>`,
      });
    });
  };
}
