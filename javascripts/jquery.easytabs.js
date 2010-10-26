/*
 * jQuery EasyTabs plugin 2.0
 *
 * Copyright (c) 2010 Steve Schwartz (JangoSteve)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: Thu Oct 26 12:47:00 2010 -0500
 */
(function($) {
  
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
    cycle: false
  }
  
  $.fn.easytabs.methods = {
    init: function(options){
      var $container = this,
          opts = $.extend({}, $.fn.easytabs.defaults, options),
          $tabs = $container.find(opts.tabs),
          $panels = $(),
          $defaultTab,
          $defaultTabLink;

      $tabs.each(function(){
        targetId = $(this).children("a").attr("href").substr(1);
        $matchingPanel = $container.find("div[id=" + targetId + "]");
        if ( $matchingPanel.size() > 0 ) {
          $panels = $panels.add($matchingPanel.hide());
        } else {
          $tabs = $tabs.not($(this)); // excludes tabs from set that don't have a target div
        }
      });
      $('a.anchor').remove().prependTo('body');
      
      $container.data("easytabs", {
        opts: opts,
        skipUpdateToHash: false,
        tabs: $tabs,
        panels: $panels
      });
      
      $.fn.easytabs.methods.setDefaultTab.apply($container);
      
      $tabs.children("a").bind("click.easytabs", function(e) {
        $container.data("easytabs").opts.cycle = false;
        $container.data("easytabs").skipUpdateToHash = false;
        $clicked = $(this);
        $.fn.easytabs.methods.selectTab.apply($clicked, [$container]);
        e.preventDefault();
      });
    },
    loadFromData: function(){
      return data = this.data("easytabs");
    },
    setDefaultTab: function(){
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          $tabs = data.tabs,
          $panels = data.panels,
          hash = window.location.hash.match(/^[^\?]*/)[0],
          $selectedTab = $tabs.find("a[href='" + hash + "']").parent(),
          $defaultTab,
          $defaultTabLink;
      
      if( $selectedTab.size() == 1 ){
        $defaultTab = $selectedTab;
        $container.data("easytabs").opts.cycle = false;
      } else {
        $defaultTab = $tabs.parent().find(opts.defaultTab);
        if ( $defaultTab.size() == 0 ) { $.error("The specified default tab ('" + opts.defaultTab + "') could not be found in the tab set."); }
      }
      $defaultTabLink = $defaultTab.children("a").first();
      $container.data("easytabs").defaultTab = $defaultTab;
      $container.data("easytabs").defaultTabLink = $defaultTabLink;
      
      $panels.filter("#" + $defaultTabLink.attr("href").substr(1)).show().addClass(opts.panelActiveClass);
      $defaultTab.addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass);
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
          $targetPanel = $panels.filter( $clicked.attr("href") ),
          $defaultTabLink = data.defaultTabLink,
          transitions = ( opts.animate ) ? {
            show: "fadeIn",
            hide: "fadeOut",
            speed: opts.animationSpeed
          } :
          {
            show: "show",
            hide: "hide",
            speed: 0
          };
      
      if( ! $clicked.hasClass(opts.tabActiveClass) || ! $targetPanel.hasClass(opts.panelActiveClass) ){
        $panels.stop(true,true);
        $container.trigger("easytabs:before");
        
        // Change the active tab *first* to provide immediate feedback when the user clicks
        $tabs.filter("." + opts.tabActiveClass).removeClass(opts.tabActiveClass).children().removeClass(opts.tabActiveClass);
        $clicked.parent().addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass);
        
        $panels.filter("." + opts.panelActiveClass).removeClass(opts.panelActiveClass);
        $targetPanel.addClass(opts.panelActiveClass);
        
        $panels.filter(":visible")
          [transitions.hide](transitions.speed, function(){
            // At this point, the previous panel is hidden, and the new one will be selected
            $container.trigger("easytabs:midTransition");
            if ( opts.updateHash && ! skipUpdateToHash ) {
              //window.location = url.toString().replace((url.pathname + hash), (url.pathname + $clicked.attr("href")));
              // Not sure why this behaves so differently, but it's more straight forward and seems to have less side-effects
              window.location.hash = $clicked.attr("href");
            } else {
              $container.data("easytabs").skipUpdateToHash = false;
            }
            $targetPanel
              [transitions.show](transitions.speed, function(){
                // Save the new tabs and panels to the container data (with new active tab/panel)
                $container.data("easytabs").tabs = $tabs;
                $container.data("easytabs").panels = $panels;
                $container.trigger("easytabs:after"); 
                // callback only gets called if selectTab actually does something, since it's inside the if block
                if(typeof callback == 'function'){
                  callback();
                }
            });
        });
      }
    },
    selectTabFromHashChange: function(){
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          $tabs = data.tabs,
          $defaultTab = data.defaultTab,
          $defaultTabLink = data.defaultTabLink,
          hash = window.location.hash.match(/^[^\?]*/)[0],
          $tab = $tabs.find("a[href='" + hash + "']");
      if ( opts.updateHash ) {
        if( $tab.size() > 0 ){
          $.fn.easytabs.methods.selectTab.apply( $tab, [$container] );
        } else if ( hash == '' && ! $defaultTab.hasClass(opts.tabActiveClass) && ! opts.cycle ) {
          $container.data("easytabs").skipUpdateToHash = true;
          $.fn.easytabs.methods.selectTab.apply( $defaultTabLink, [$container] );
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
            $.error('Tab \'' + tabSelector + '\' does not exist in tab set');
          }
        }
      } else {
        $tab = $tab.children("a").first();                                          // Select the child tab link, since the first option finds the tab container (like <li>)
      }
      $.fn.easytabs.methods.selectTab.apply($tab, [$container]);
    }
  }
})(jQuery);