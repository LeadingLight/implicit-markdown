import ImplicitMarkdown from './index';

const JSON_INDENT = 2;

describe('ImplicitMarkdown', () => {
  it('should parse simple a json object renderable by implicit-ui', () => {
    const md = new ImplicitMarkdown();
    const mdTextWithLink = 'this is a text with a [link](#this-is-an-anchor) in it';

    expect(md.parse(mdTextWithLink)).toMatchSnapshot();
  });
});

