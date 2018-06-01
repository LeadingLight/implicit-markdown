import StateCore from './StateCore';
import ParserCore from './ParserCore';
import ParserBlock from './ParserBlock';
import ParserInline from './ParserInline';
import Renderer from './Renderer';

const rulesCore = [
  ['block', require('./rules/block')],
  ['inline', require('./rules/inline')]
];
const rulesBlock = [
  ['heading', require('./rules/heading'), ['paragraph', 'blockquote']],
  ['paragraph', require('./rules/paragraph')]
];

const rulesInline = [
];


export default class ImplicitMarkdown {
  constructor(options) {
    this.core = new ParserCore(rulesCore);
    this.block = new ParserBlock(rulesBlock);
    this.inline = new ParserInline(rulesInline);
    this.renderer = new Renderer();

    this.options = {...options};
  }

  parse(str, env) {
    const state = new StateCore(this, str, env);

    this.core.process(state);

    return state.tokens;
  }

  render(str, env) {
    env = env || {};

    return this.renderer.render(this.parse(str, env), this.options, env);
  }
}
