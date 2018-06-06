import Ruler from './Ruler';
import StateBlock from './StateBlock';

export default class ParserBlock {
  constructor(rules) {
    this.options = {};

    this.ruler = new Ruler();
    for (let i = 0; i < rules.length; i++) {
      this.ruler.push(rules[i][0], rules[i][1], {alt: (rules[i][2] || []).slice()});
    }
  }

  tokenize(state, startLine, endLine) {
    const rules = this.ruler.getRules('');
    const len = rules.length;
    let line = startLine;
    let hasEmptyLines = false;
    let ok, i;

    while (line < endLine) {
      state.line = line = state.skipEmptyLines(line);
      if (line >= endLine) {
        break;
      }

      // Termination condition for nested calls.
      // Nested calls currently used for blockquotes & lists
      if (state.tShift[line] < state.blkIndent) {
        break;
      }

      // Try all possible rules.
      // On success, rule should:
      //
      // - update `state.line`
      // - update `state.tokens`
      // - return true

      for (i = 0; i < len; i++) {
        ok = rules[i](state, line, endLine, false);
        if (ok) {
          break;
        }
      }

      // set state.tight iff we had an empty line before current tag
      // i.e. latest empty line should not count
      state.tight = !hasEmptyLines;

      // paragraph might "eat" one newline after it in nested lists
      if (state.isEmpty(state.line - 1)) {
        hasEmptyLines = true;
      }

      line = state.line;

      if (line < endLine && state.isEmpty(line)) {
        hasEmptyLines = true;
        line++;

        // two empty lines should stop the parser in list mode
        if (line < endLine && state.parentType === 'list' && state.isEmpty(line)) { break; }
        state.line = line;
      }
    }
  }

  parse(str, options, env, outTokens) {
    if (!str) return;

    str = replaceTabs(normalizeSpaceAndNewLine(str));

    const state = new StateBlock(str, this, options, env, outTokens);

    this.tokenize(state, state.line, state.lineMax);
  }
}

const NEWLINES_RE = /\r[\n\u0085]|[\u2424\u2028\u0085]/g;
const SPACES_RE = /\u00a0/g;

function normalizeSpaceAndNewLine(str) {
  return str.replace(SPACES_RE, ' ').replace(NEWLINES_RE, '\n');
}

const TABS_SCAN_RE = /[\n\t]/g;
const NEWLINE_CHAR = 0x0A;

function replaceTabs(str) {
  if (str.indexOf('\t') < 0) return str;

  let lineStart = 0;
  let lastTabPos = 0;

  return str.replace(TABS_SCAN_RE, (match, offset) => {
    if (str.charCodeAt(offset) === NEWLINE_CHAR) {
      lineStart = offset + 1;
      lastTabPos = 0;

      return match;
    }
    const result = '    '.slice((offset - lineStart - lastTabPos) % 4);

    lastTabPos = offset - lineStart + 1;

    return result;
  });
}
