export default class StateInline {
  constructor(src, parserInline, options, env, outTokens) {
    this.src = src;
    this.env = env;
    this.options = options;
    this.parser = parserInline;
    this.tokens = outTokens;
    this.pos = 0;
    this.posMax = this.src.length;
    this.level = 0;
    this.pending = '';
    this.pendingLevel = 0;


    // Stores { start: end } pairs. Useful for backtrack
    // optimization of pairs parse (emphasis, strikes).
    this.cache = [];

    // Link parser state vars

    // Set true when seek link label - we should disable
    // "paired" rules (emphasis, strikes) to not skip
    // tailing `]`
    this.isInLabel = false;


    // Increment for each nesting link. Used to prevent
    // nesting in definitions
    this.linkLevel = 0;

    // Temporary storage for link url
    this.linkContent = '';

    // Track unpaired `[` for link labels
    // (backtrack optimization)
    this.labelUnmatchedScopes = 0;
  }

  pushPending() {
    this.tokens.push({
      type: 'text',
      content: this.pending,
      level: this.pendingLevel
    });
    this.pending = '';
  }

  push(token) {
    if (this.pending) {
      this.pushPending();
    }

    this.tokens.push(token);
    this.pendingLevel = this.level;
  }

  cacheSet(key, val) {
    for (var i = this.cache.length; i <= key; i++) {
      this.cache.push(0);
    }

    this.cache[key] = val;
  }

  cacheGet(key) {
    return key < this.cache.length ? this.cache[key] : 0;
  }
}
