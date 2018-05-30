export default class StateCore {
  constructor(instance, str, env) {
    this.src = str;
    this.env = env;
    this.options = instance.options;
    this.tokens = [];
    this.inlineMode = false;

    // this.inline = instance.inline;
    // this.block = instance.block;
    // this.renderer = instance.renderer;
    // this.typographer = instance.typographer;
  }
}
