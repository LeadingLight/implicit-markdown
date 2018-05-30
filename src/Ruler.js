export default class Ruler {
  constructor() {
    this.rules = [];
    this.cache = null;
  }

  push(ruleName, fn, options) {
    const opt = options || {};

    this.rules.push({
      name: ruleName,
      enabled: true,
      fn,
      alt: opt.alt || []
    });

    this.cache = null;
  }

  getRules(chainName) {
    if (this.cache === null) {
      this.compile();
    }

    return this.cache[chainName] || [];
  }

  compile() {
    const chains = [''];

    // collect unique names
    this.rules.forEach((rule) => {
      if (!rule.enabled) {
        return;
      }

      rule.alt.forEach((altName) => {
        if (chains.indexOf(altName) < 0) {
          chains.push(altName);
        }
      });
    });

    this.cache = {};

    chains.forEach((chain) => {
      this.cache[chain] = [];
      this.rules.forEach((rule) => {
        if (!rule.enabled) {
          return;
        }

        if (chain && rule.alt.indexOf(chain) < 0) {
          return;
        }
        this.cache[chain].push(rule.fn);
      });
    });
  }
}
