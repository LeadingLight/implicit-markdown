
const renderRules = {
  paragraph_open: (tokens, idx) => (tokens[idx].tight ? '' : '<p>'),
  paragraph_close: (tokens, idx) => {
    const addBreak = !(tokens[idx].tight && idx && tokens[idx - 1].type === 'inline' && !tokens[idx - 1].content);

    return (tokens[idx].tight ? '' : '</p>') + (addBreak ? getBreak(tokens, idx) : '');
  },
  text: (tokens, idx) => tokens[idx].content,
  heading_open: (tokens, idx /* , options, env */) => `<h${tokens[idx].hLevel}>`,
  heading_close: (tokens, idx /* , options, env */) => `</h${tokens[idx].hLevel}>\n`
};


function nextToken(tokens, idx) {
  if (++idx >= tokens.length - 2) {
    return idx;
  }
  if (tokens[idx].type === 'paragraph_open' && tokens[idx].tight
    && (tokens[idx + 1].type === 'inline' && tokens[idx + 1].content.length === 0)
    && (tokens[idx + 2].type === 'paragraph_close' && tokens[idx + 2].tight)) {
    return nextToken(tokens, idx + 2);
  }

  return idx;
}

function getBreak(tokens, idx) {
  idx = nextToken(tokens, idx);
  if (idx < tokens.length && tokens[idx].type === 'list_item_close') {
    return '';
  }

  return '\n';
}

export default class Renderer {
  constructor() {
    this.rules = renderRules;
  }

  renderInline(tokens, options, env) {
    const _rules = this.rules;
    let len = tokens.length, i = 0;
    let result = '';

    while (len--) {
      result = result + _rules[tokens[i].type](tokens, i++, options, env, this);
    }

    return result;
  }

  render(tokens, options, env) {
    const _rules = this.rules;
    let len = tokens.length, i = -1;
    let result = '';

    while (++i < len) {
      if (tokens[i].type === 'inline') {
        result = result + this.renderInline(tokens[i].children, options, env);
      } else {
        result = result + _rules[tokens[i].type](tokens, i, options, env, this);
      }
    }

    return result;
  }
}
