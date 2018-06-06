import ImplicitMarkdown from './index';
import HtmlRenderer from './HtmlRenderer';

const JSON_INDENT = 2;

describe('ImplicitMarkdown', () => {
  it('should parse simple string to a json object renderable by implicit-ui', () => {
    const md = new ImplicitMarkdown(new HtmlRenderer());
    const mdTextWithLink = 'this is a text with a [link](#this-is-an-anchor) in it';

    expect(md.parse(mdTextWithLink)).toMatchSnapshot();
  });

  it('test paragraph render', () => {
    const md = new ImplicitMarkdown(new HtmlRenderer());
    const mdTextWithLink = 'this is a text with a [link](#this-is-an-anchor) in it';

    expect(md.render(mdTextWithLink)).toMatchSnapshot();
  });

  it('testing headers parse', () => {
    const md = new ImplicitMarkdown(new HtmlRenderer());
    const mdTextWithLink = '# this is a title';

    expect(md.parse(mdTextWithLink)).toMatchSnapshot();
  });

  it('testing headers render', () => {
    const md = new ImplicitMarkdown(new HtmlRenderer());
    const mdTextWithLink = '# this is a title';

    expect(md.render(mdTextWithLink)).toMatchSnapshot();
  });

  it('empty', () => {
    const md = new ImplicitMarkdown(new HtmlRenderer());

    expect(md.render('')).toMatchSnapshot();
  });
});

