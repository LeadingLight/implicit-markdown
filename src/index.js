import StateCore from './StateCore';
import ParserCore from './ParserCore';

export default class ImplicitMarkdown {
  constructor(options) {
    this.core = new ParserCore([]);

    /* this.inline   = new ParserInline();
    this.block    = new ParserBlock();
    this.renderer = new Renderer();
    this.ruler    = new Ruler(); */

    this.options = {...options};
  }

  parse(str, env) {
    const state = new StateCore(this, str, env);

    this.core.process(state);

    return state.tokens;
  }
}
