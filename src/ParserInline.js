import Ruler from './Ruler';
import StateInline from './StateInline';

export default class ParserInline {
  constructor(rules) {
    this.options = {};

    this.ruler = new Ruler();
    for (var i = 0; i < rules.length; i++) {
      this.ruler.push(rules[i][0], rules[i][1]);
    }

    // Can be overridden with a custom validator
    // this.validateLink = validateLink;
  }

  skipToken(state) {
    var rules = this.ruler.getRules('');
    var len = rules.length;
    var pos = state.pos;
    var i, cached_pos;

    if ((cached_pos = state.cacheGet(pos)) > 0) {
      state.pos = cached_pos;
      return;
    }

    for (i = 0; i < len; i++) {
      if (rules[i](state, true)) {
        state.cacheSet(pos, state.pos);
        return;
      }
    }

    state.pos++;
    state.cacheSet(pos, state.pos);
  }

  tokenize(state) {
    var rules = this.ruler.getRules('');
    var len = rules.length;
    var end = state.posMax;
    var ok, i;

    while (state.pos < end) {

      // Try all possible rules.
      // On success, the rule should:
      //
      // - update `state.pos`
      // - update `state.tokens`
      // - return true
      for (i = 0; i < len; i++) {
        ok = rules[i](state, false);

        if (ok) {
          break;
        }
      }

      if (ok) {
        if (state.pos >= end) { break; }
        continue;
      }

      state.pending += state.src[state.pos++];
    }

    if (state.pending) {
      state.pushPending();
    }
  }

  parse(str, options, env, outTokens) {
    var state = new StateInline(str, this, options, env, outTokens);
    this.tokenize(state);
  }
}
