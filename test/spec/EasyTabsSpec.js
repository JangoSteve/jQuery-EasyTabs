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

    it('is easytabs container', function () {
      expect(fixture).toBeEasyTabs();
    });

    it('has tabs', function() {
      expect(fixture).toHaveTabs('[href="#tabs1-html"]');
      expect(fixture).toHaveTabs('[href="#tabs1-html"]');
      expect(fixture).toHaveTabs('[href="#tabs1-js"]');
      expect(fixture).toHaveTabs('[href="#tabs1-css"]');
    });

    it('has panels', function() {
      expect(fixture).toHavePanels('#tabs1-html');
      expect(fixture).toHavePanels('#tabs1-js');
      expect(fixture).toHavePanels('#tabs1-css');
    });

    xit('makes first tab the default', function() {
    });

    xit('makes all but default panel hidden', function() {
    });

    xit('makes default tab active', function() {
    });

    xit('updates url hash', function() {
    });

    xit('selects tab when url hash is updated', function() {
    });

    xit('makes tab from url hash active instead of default tab', function() {
    });

    xit('selects default tab when hash updated to blank (i.e. back button hit to initial page load state', function() {
    });

  });

  describe('disconnected tabs and panels', function() {
    xit('loads tabs', function() {
    });

    xit('loads disconnected panels', function() {
    });
  });

  describe('using non-div panels', function() {
    xit('loads form sections into panels', function() {
    });
  });

  describe('animating tab change', function() {

    describe('transitions', function() {
    });

  });

  describe('events', function() {
    xit('fires easytabs:before event', function() {
    });

    xit('fires easytabs:midTransition event', function() {
    });

    xit('fires easytabs:after event', function() {
    });

    xit('cancels easytabs:before event', function() {
    });
  });

  describe('uiTabs', function() {
    xit('gives tabs proper classes', function() {
    });

    xit('gives panels proper classes', function() {
    });
  });

  describe('cycling tabs', function() {
  });

  describe('public methods', function() {
  });

  describe('collapsible', function() {
  });

  describe('ajax tabs', function() {

    describe('events', function() {
      xit('fires easytabs:ajax:beforeSend event', function() {
      });

      xit('fires easytabs:ajax:complete event', function() {
      });

      xit('cancels easytabs:ajax:beforeSend event', function() {
      });
    });

    describe('caching panels', function() {
    });

  });

});
