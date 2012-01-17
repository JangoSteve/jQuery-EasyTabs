/*
 * jQuery EasyTabs plugin 2.3.3
 *
 * Copyright (c) 2010-2011 Steve Schwartz (JangoSteve)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: Thu Sep 15 09:50:00 2011 -0500
 */
( function($) {

  // Triggers an event on an element and returns the event result
	function fire(obj, name, data) {
		var event = $.Event(name);
		obj.trigger(event, data);
		return event.result !== false;
	}
  
  $.fn.easyTabs = function(){ $.error("easyTabs() is no longer used. Now use easytabs() -- no capitalization."); }
  
  $.fn.easytabs = function(options) {
    
    var args = arguments;

    return this.each(function() {
      var $container = $(this),
          data = $container.data("easytabs");
      
      // Initialization was called with $(el).easytabs( { options } ); 
      if ( ! data ) {
        $.fn.easytabs.methods.init.apply($container,[options]);
        $.fn.easytabs.methods.initHashChange.apply($container);
        $.fn.easytabs.methods.initCycle.apply($container);
      }
      
      // User called public method
      if ( $.fn.easytabs.publicMethods[options] ){
        return $.fn.easytabs.publicMethods[ options ].apply( $container, Array.prototype.slice.call( args, 1 ));
      }
    });
  }
  
  $.fn.easytabs.defaults = {
    animate: true, 
    panelActiveClass: "active", 
    tabActiveClass: "active", 
    defaultTab: "li:first-child", 
    animationSpeed: "normal", 
    tabs: "> ul > li", 
    updateHash: true, 
    cycle: false,
    collapsible: false,
    collapsedClass: "collapsed",
    collapsedByDefault: true,
    uiTabs: false,
    transitionIn: 'fadeIn',
    transitionOut: 'fadeOut',
    transitionCollapse: 'slideUp',
    transitionUncollapse: 'slideDown',
    containerClass: "",
    tabsClass: "",
    tabClass: "",
    panelClass: "",
    cache: true
  }
  
  $.fn.easytabs.methods = {
    init: function(options){
      var $container = this,
          opts,
          $tabs,
          $panels = $(),
          $defaultTab,
          $defaultTabLink,
          animationSpeeds = {
            fast: 200,
            normal: 400,
            slow: 600
          };

      if ( options && options['uiTabs'] ) {
        $.extend(options, {
          tabActiveClass: 'ui-tabs-selected',
          containerClass: 'ui-tabs ui-widget ui-widget-content ui-corner-all',
          tabsClass: 'ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all',
          tabClass: 'ui-state-default ui-corner-top',
          panelClass: 'ui-tabs-panel ui-widget-content ui-corner-bottom'
        });
      }

      // If collapsible is true and defaultTab specified, assume user wants defaultTab showing (not collapsed)
      if ( options && options.collapsible && options.defaultTab ) $.fn.easytabs.defaults.collapsedByDefault = false;
      opts = $.extend({}, $.fn.easytabs.defaults, options);
      // Convert 'normal', 'fast', and 'slow' animation speed settings to their respective speed in milliseconds
      if( typeof(opts.animationSpeed) == 'string' ) opts.animationSpeed = animationSpeeds[opts.animationSpeed];
      $tabs = $container.find(opts.tabs);

      $tabs.each(function(){
        var $tab = $(this), $a = $tab.children('a'), targetId = $tab.children('a').data('target');

        // If the tab has a `data-target` attribute, and is thus an ajax tab
        if ( targetId !== undefined && targetId !== null ) {
          $tab.data('easytabs', { ajax: $a.attr('href') });
        } else {
          targetId = $a.attr('href');
        }

        targetId = targetId.match(/#([^\?]+)/)[0].substr(1);
        $matchingPanel = $container.find("#" + targetId);
        if ( $matchingPanel.size() > 0 ) {
          // Store panel height before hiding
          $matchingPanel.data('easytabs', {position: $matchingPanel.css('position'), visibility: $matchingPanel.css('visibility')});
          $panels = $panels.add($matchingPanel.hide());
          $tab.data('easytabs', $.extend($tab.data('easytabs'), {panel: $matchingPanel}));
        } else {
          $tabs = $tabs.not($tab); // excludes tabs from set that don't have a target div
        }
      });

      $container.addClass(opts['containerClass']);
      $tabs.parent().addClass(opts['tabsClass']);
      $tabs.addClass(opts['tabClass']);
      $panels.addClass(opts['panelClass']);

      $('a.anchor').remove().prependTo('body');
      
      $container.data("easytabs", {
        opts: opts,
        skipUpdateToHash: false,
        tabs: $tabs,
        panels: $panels
      }).attr('data-easytabs', true);
      
      $.fn.easytabs.methods.setDefaultTab.apply($container);
      
      $tabs.children("a").bind("click.easytabs", function(e) {
        e.preventDefault();
        $container.data("easytabs").opts.cycle = false;
        $container.data("easytabs").skipUpdateToHash = false;
        $clicked = $(this);
        $.fn.easytabs.methods.selectTab.apply($clicked, [$container]);
      });
    },
    loadFromData: function(){
      return this.data("easytabs");
    },
    setDefaultTab: function(){
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          $tabs = data.tabs,
          $panels = data.panels,
          hash = window.location.hash.match(/^[^\?]*/)[0],
          $selectedTab = $.fn.easytabs.methods.matchTab($tabs, hash).parent(),
          $defaultTab,
          $defaultTabLink,
          $defaultPanel,
          $defaultAjaxUrl,
          $panel;
      
      // If hash directly matches one of the tabs, active on page-load
      if( $selectedTab.size() == 1 ){
        $defaultTab = $selectedTab;
        $container.data("easytabs").opts.cycle = false;
      } else {
        $panel = $.fn.easytabs.methods.matchInPanel($panels, hash);
        // If one of the panels contains the element matching the hash,
        // make it active on page-load
        if ( $panel.length ) {
          hash = '#' + $panel.attr('id');
          $defaultTab = $.fn.easytabs.methods.matchTab($tabs, hash).parent();
        // Otherwise, make the default tab the one that's active on page-load
        } else {
          $defaultTab = $tabs.parent().find(opts.defaultTab);
          if ( $defaultTab.size() == 0 ) { $.error("The specified default tab ('" + opts.defaultTab + "') could not be found in the tab set."); }
        }
      }
      $defaultTabLink = $defaultTab.children("a").first();
      $container.data("easytabs").defaultTab = $defaultTab;
      $container.data("easytabs").defaultTabLink = $defaultTabLink;
      
      if( opts.collapsible && $selectedTab.size() == 0 && opts.collapsedByDefault ){
        $defaultTab.addClass(opts.collapsedClass).children().addClass(opts.collapsedClass);
      } else {
        $defaultPanel = $( $defaultTab.data('easytabs').panel );
        $defaultAjaxUrl = $defaultTab.data('easytabs').ajax;

        if ( $defaultAjaxUrl && (!opts.cache || !$defaultTab.data('easytabs').cached) ) {
          $container.trigger('easytabs:ajax:beforeSend', [$defaultTabLink, $defaultPanel]);
          $defaultPanel.load($defaultAjaxUrl, function(response, status, xhr){
            $defaultTab.data('easytabs').cached = true;
            $container.trigger('easytabs:ajax:complete', [$defaultTabLink, $defaultPanel, response, status, xhr]);
          });
        }

        $defaultTab.data('easytabs').panel.show().addClass(opts.panelActiveClass);
        $defaultTab.addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass);
      }
    },
    getHeightForHidden: function(){
      if( this.data('easytabs') && this.data('easytabs').lastHeight ) return this.data('easytabs').lastHeight;
      var display = this.css('display'), // this is the only property easytabs changes, so we need to grab its value on each tab change
          height = this
            // Workaround, because firefox returns wrong height if element itself has absolute positioning
            .wrap($('<div>', {position: 'absolute', 'visibility': 'hidden', 'overflow': 'hidden'}))
            .css({'position':'relative','visibility':'hidden','display':'block'})
            .outerHeight();
      this.unwrap();
      // Return element to previous state
      this.css({
        position: this.data('easytabs').position,
        visibility: this.data('easytabs').visibility,
        display: display
      });
      // Cache height
      $.extend(this.data('easytabs'), {lastHeight: height});
      return height;
    },
    setAndReturnHeight: function() {
      // Since the height of the visible panel may have been manipulated due to interaction,
      // we want to re-cache the visible height on each tab change
      var height = this.outerHeight(),
          cache = {lastHeight: height};
      if( this.data('easytabs') ) {
        $.extend(this.data('easytabs'), cache);
      } else {
        this.data('easytabs', cache);
      }
      return height;
    },
    selectTab: function($container,callback){
      var $clicked = this,
          url = window.location,
          hash = url.hash.match(/^[^\?]*/)[0],
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          skipUpdateToHash = data.skipUpdateToHash,
          $tabs = data.tabs,
          $panels = data.panels,
          $targetPanel = $clicked.parent().data('easytabs').panel,
          ajaxUrl = $clicked.parent().data('easytabs').ajax,
          $defaultTabLink = data.defaultTabLink,
          transitions = ( opts.animate ) ? {
            show: opts.transitionIn,
            hide: opts.transitionOut,
            speed: opts.animationSpeed,
            collapse: opts.transitionCollapse,
            uncollapse: opts.transitionUncollapse,
            halfSpeed: opts.animationSpeed / 2
          } :
          {
            show: "show",
            hide: "hide",
            speed: 0,
            collapse: "hide",
            uncollapse: "show",
            halfSpeed: 0
          };
      
      // Tab is collapsible and active => needs to be collapsed
      if( opts.collapsible && ! skipUpdateToHash && ($clicked.hasClass(opts.tabActiveClass) || $clicked.hasClass(opts.collapsedClass)) ) {
        $panels.stop(true,true);
        if( fire($container,"easytabs:before", [$clicked, $targetPanel, data]) ){
          $tabs.filter("." + opts.tabActiveClass).removeClass(opts.tabActiveClass).children().removeClass(opts.tabActiveClass);
          if( $clicked.hasClass(opts.collapsedClass) ){
            if( ajaxUrl && (!opts.cache || !$clicked.parent().data('easytabs').cached) ) {
              $container.trigger('easytabs:ajax:beforeSend', [$clicked, $targetPanel]);
              $targetPanel.load(ajaxUrl, function(response, status, xhr){
                $clicked.parent().data('easytabs').cached = true;
                $container.trigger('easytabs:ajax:complete', [$clicked, $targetPanel, response, status, xhr]);
              });
            }
            $clicked.parent()
              .removeClass(opts.collapsedClass)
              .addClass(opts.tabActiveClass)
              .children()
                .removeClass(opts.collapsedClass)
                .addClass(opts.tabActiveClass);
            $targetPanel
              .addClass(opts.panelActiveClass)
              [transitions.uncollapse](transitions.speed, function(){
                $container.trigger('easytabs:midTransition', [$clicked, $targetPanel, data]);
                if(typeof callback == 'function') callback();
              });
          } else {
            $clicked.parent().addClass(opts.collapsedClass).children().addClass(opts.collapsedClass);
            $targetPanel
              .removeClass(opts.panelActiveClass)
              [transitions.collapse](transitions.speed, function(){
                $container.trigger("easytabs:midTransition", [$clicked, $targetPanel, data]);
                if(typeof callback == 'function') callback();
              });
          }
        }
      // Tab is not active and panel is not active => select tab
      } else if( ! $clicked.hasClass(opts.tabActiveClass) || ! $targetPanel.hasClass(opts.panelActiveClass) ){
        $panels.stop(true,true);
        if( fire($container,"easytabs:before", [$clicked, $targetPanel, data]) ){
          var $visiblePanel = $panels.filter(":visible"),
              $panelContainer = $targetPanel.parent(),
              targetHeight,
              visibleHeight,
              heightDifference,
              showPanel;

          if (opts.animate) {
            targetHeight = $.fn.easytabs.methods.getHeightForHidden.apply($targetPanel);
            visibleHeight = $visiblePanel.length ? $.fn.easytabs.methods.setAndReturnHeight.apply($visiblePanel) : 0;
            heightDifference = targetHeight - visibleHeight;
          }

          showPanel = function(){
            // At this point, the previous panel is hidden, and the new one will be selected
            $container.trigger("easytabs:midTransition", [$clicked, $targetPanel, data]);

            // Gracefully animate between panels of differing heights, start height change animation *after* panel change if panel needs to contract,
            // so that there is no chance of making the visible panel overflowing the height of the target panel
            if (opts.animate && opts.transitionIn == 'fadeIn') {
              if (heightDifference < 0)
                $panelContainer.animate({
                  height: $panelContainer.height() + heightDifference
                }, transitions.halfSpeed ).css({ 'min-height': '' });
            }

            if ( opts.updateHash && ! skipUpdateToHash ) {
              //window.location = url.toString().replace((url.pathname + hash), (url.pathname + $clicked.attr("href")));
              // Not sure why this behaves so differently, but it's more straight forward and seems to have less side-effects
              window.location.hash = '#' + $targetPanel.attr('id');
            } else {
              $container.data("easytabs").skipUpdateToHash = false;
            }
            $targetPanel
              [transitions.show](transitions.speed, function(){
                // Save the new tabs and panels to the container data (with new active tab/panel)
                $container.data("easytabs").tabs = $tabs;
                $container.data("easytabs").panels = $panels;

                $panelContainer.css({height: '', 'min-height': ''}); // After the transition, unset the height
                $container.trigger("easytabs:after", [$clicked, $targetPanel, data]); 
                // callback only gets called if selectTab actually does something, since it's inside the if block
                if(typeof callback == 'function'){
                  callback();
                }
            });
          };

          if ( ajaxUrl && (!opts.cache || !$clicked.parent().data('easytabs').cached) ) {
            $container.trigger('easytabs:ajax:beforeSend', [$clicked, $targetPanel]);
            $targetPanel.load(ajaxUrl, function(response, status, xhr){
              $clicked.parent().data('easytabs').cached = true;
              $container.trigger('easytabs:ajax:complete', [$clicked, $targetPanel, response, status, xhr]);
            });
          }
          // Gracefully animate between panels of differing heights, start height change animation *before* panel change if panel needs to expand,
          // so that there is no chance of making the target panel overflowing the height of the visible panel
          if( opts.animate && opts.transitionOut == 'fadeOut' ) {
            if( heightDifference > 0 ) {
              $panelContainer.animate({
                height: ( $panelContainer.height() + heightDifference )
              }, transitions.halfSpeed );
            } else {
              // Prevent height jumping before height transition is triggered at midTransition
              $panelContainer.css({ 'min-height': $panelContainer.height() });
            }
          }

          // Change the active tab *first* to provide immediate feedback when the user clicks
          $tabs.filter("." + opts.tabActiveClass).removeClass(opts.tabActiveClass).children().removeClass(opts.tabActiveClass);
          $tabs.filter("." + opts.collapsedClass).removeClass(opts.collapsedClass).children().removeClass(opts.collapsedClass);
          $clicked.parent().addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass);
          
          $panels.filter("." + opts.panelActiveClass).removeClass(opts.panelActiveClass);
          $targetPanel.addClass(opts.panelActiveClass);

          if( $visiblePanel.size() > 0 ) {
            $visiblePanel
              [transitions.hide](transitions.speed, showPanel);
          } else {
            $targetPanel
              [transitions.uncollapse](transitions.speed, showPanel);
          }
        }
      }
    },
    matchTab: function($tabs, hash) {
      return $tabs.find("[href='" + hash + "'],[data-target='" + hash + "']").first();
    },
    matchInPanel: function($panels, hash) {
      return ( hash ? $panels.filter(':has(' + hash + ')').first() : [] );
    },
    selectTabFromHashChange: function() {
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          $tabs = data.tabs,
          $panels = data.panels,
          $defaultTab = data.defaultTab,
          $defaultTabLink = data.defaultTabLink,
          hash = window.location.hash.match(/^[^\?]*/)[0],
          $tab = $.fn.easytabs.methods.matchTab($tabs, hash),
          $panel;
      if ( opts.updateHash ) {
        // If hash directly matches tab
        if( $tab.length ){
          $container.data("easytabs").skipUpdateToHash = true;
          $.fn.easytabs.methods.selectTab.apply( $tab, [$container] );
        } else {
          $panel = $.fn.easytabs.methods.matchInPanel($panels, hash);
          // If panel contains element matching hash
          if ( $panel.length ) {
            hash = '#' + $panel.attr('id');
            $tab = $.fn.easytabs.methods.matchTab($tabs, hash);
            $container.data('easytabs').skipUpdateToHash = true;
            $.fn.easytabs.methods.selectTab.apply( $tab, [$container] );
          // If default tab is not active...
          } else if ( ! $defaultTab.hasClass(opts.tabActiveClass) && ! opts.cycle ) {
            // ...and hash is blank or matches a parent of the tab container
            if ( hash == '' || $container.closest(hash).length ) {
              $container.data("easytabs").skipUpdateToHash = true;
              $.fn.easytabs.methods.selectTab.apply( $defaultTabLink, [$container] );
            }
          }
        }
      }
    },
    cycleTabs: function(tabNumber){
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          $tabs = data.tabs;
      if(opts.cycle){
        tabNumber = tabNumber % $tabs.size();
        $tab = $($tabs[tabNumber]).children("a").first();
        $container.data("easytabs").skipUpdateToHash = true;
        $.fn.easytabs.methods.selectTab.apply($tab, [$container, function(){
          setTimeout(function(){ $.fn.easytabs.methods.cycleTabs.apply($container,[tabNumber + 1]);}, opts.cycle);
        }]);
      }
    },
    initHashChange: function(){
      var $container = this;
      // enabling back-button with jquery.hashchange plugin
      // http://benalman.com/projects/jquery-hashchange-plugin/
      if(typeof $(window).hashchange == 'function'){
        $(window).hashchange( function(){
          $.fn.easytabs.methods.selectTabFromHashChange.apply($container);
        });
      }else if($.address && typeof $.address.change == 'function'){ // back-button with jquery.address plugin http://www.asual.com/jquery/address/docs/
        $.address.change( function(){
          $.fn.easytabs.methods.selectTabFromHashChange.apply($container);
        });
      }
    },
    initCycle: function(){
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          $tabs = data.tabs,
          $defaultTab = data.defaultTab,
          tabNumber;
      if (opts.cycle) {
        tabNumber = $tabs.index($defaultTab);
        setTimeout( function(){ $.fn.easytabs.methods.cycleTabs.apply($container, [tabNumber + 1]); }, opts.cycle);
      }
    }
  }
  
  $.fn.easytabs.publicMethods = {
    select: function(tabSelector){
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          $tabs = data.tabs,
          $tab;
      if ( ($tab = $tabs.filter(tabSelector)).size() == 0 ) {                       // Find tab container that matches selector (like 'li#tab-one' which contains tab link)
        if ( ($tab = $tabs.find("a[href='" + tabSelector + "']")).size() == 0 ) {   // Find direct tab link that matches href (like 'a[href="#panel-1"]')
          if ( ($tab = $tabs.find("a" + tabSelector)).size() == 0 ) {               // Find direct tab link that matches selector (like 'a#tab-1')
            if ( ($tab = $tabs.find("[data-target='" + tabSelector + "']")).size() == 0 ) { // Find direct tab link that matches data-target (lik 'a[data-target="#panel-1"]')
              $.error('Tab \'' + tabSelector + '\' does not exist in tab set');
            }
          }
        }
      } else {
        $tab = $tab.children("a").first();                                          // Select the child tab link, since the first option finds the tab container (like <li>)
      }
      $.fn.easytabs.methods.selectTab.apply($tab, [$container]);
    }
  }
})(jQuery);
