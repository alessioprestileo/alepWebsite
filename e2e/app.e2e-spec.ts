import { AlepWebsitePage } from './app.po';

describe('alep-website App', function() {
  let page: AlepWebsitePage;

  beforeEach(() => {
    page = new AlepWebsitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
