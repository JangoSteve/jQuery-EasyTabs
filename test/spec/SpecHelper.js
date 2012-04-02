beforeEach(function() {
  this.addMatchers({
    toBeEasyTabs: function() {
      var container = this.actual;
      return container.data('easytabs') != undefined;
    },

    toHaveTabs: function() {
      var container = this.actual,
          tabs = container.data('easytabs').tabs,
          tabSelectors = arguments,
          hasTabs = true;

      $.each(tabSelectors, function(index, selector) {
        if ( !tabs.filter(function() {
              return $(selector, this).length;
            }).length ) {
          hasTabs = false;
        }
      });

      return hasTabs;
    },

    toHavePanels: function() {
      var container = this.actual,
          panels = container.data('easytabs').panels,
          panelSelectors = arguments,
          hasPanels = true;

      $.each(panelSelectors, function(index, selector) {
        if ( !panels.filter(selector).length ) {
          hasPanels = false;
        }
      });

      return hasPanels;
    }
  });
});
