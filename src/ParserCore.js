import Ruler from './Ruler';

export default class ParserCore {
  constructor(rules) {
    this.options = {};

    this.ruler = new Ruler();
  }

  process(state) {
    const rules = this.ruler.getRules('');

    for (let i = 0; i < rules.length; i++) {
      rules[i](state);
    }

    return [];
  }
}
