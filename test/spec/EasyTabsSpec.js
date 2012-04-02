describe('easytabs', function() {

  describe('normal tabs', function() {

    var fixture;

    beforeEach(function () {
      loadFixtures('tabs.html');
      fixture = $('#tab-container');
      fixture.easytabs();
    });

    afterEach(function () {
      $("#tab-container").remove();
    });

    it('should be easytabs container', function () {
      expect(fixture).toBeEasyTabs();
    });

    it('should have tabs', function() {
      expect(fixture).toHaveTabs('[href="#tabs1-html"]');
      expect(fixture).toHaveTabs('[href="#tabs1-html"]');
      expect(fixture).toHaveTabs('[href="#tabs1-js"]');
      expect(fixture).toHaveTabs('[href="#tabs1-css"]');
    });

    it('should have panels', function() {
      expect(fixture).toHavePanels('#tabs1-html');
      expect(fixture).toHavePanels('#tabs1-js');
      expect(fixture).toHavePanels('#tabs1-css');
    });

  });

});
