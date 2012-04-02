beforeEach(function() {
  this.addMatchers({
    toBeEasyTabs: function() {
      var container = this.actual;
      return container.data('easytabs') != undefined;
    }
  });
});
