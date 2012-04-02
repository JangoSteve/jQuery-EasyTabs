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

  });

});
