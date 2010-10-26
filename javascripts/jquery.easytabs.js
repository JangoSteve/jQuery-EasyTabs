/*
 * jQuery EasyTabs plugin 2.0
 *
 * Copyright (c) 2010 Steve Schwartz (JangoSteve)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: Thu Aug 24 01:02:00 2010 -0500
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
        
        // enabling back-button with jquery.hashchange plugin
        // http://benalman.com/projects/jquery-hashchange-plugin/
        if(typeof $(window).hashchange == 'function'){
          $(window).hashchange( function(){
            $.fn.easytabs.methods.selectTabFromHashChange.apply($container);
          });
        }else if($.address && typeof $.address.change == 'function'){ // back-button with jquery.address plugin http://www.asual.com/jquery/address/docs/
          $.address.change( function(){
            methods.selectTabFromHashChange.apply($container);
          });
        }
        
        if ($container.data("easytabs").opts.cycle) {
          tabNumber = $tabs.index($defaultTab);
          setTimeout( function(){ $.fn.easytabs.methods.cycleTabs.apply($container, [tabNumber + 1]); }, opts.cycle);
        }
        
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
          $panels = $();

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
        skipHashUpdateOnce: false,
        tabs: $tabs,
        panels: $panels
      });
      
      $.fn.easytabs.methods.setDefaultTab.apply($container);
          
      $($panels.filter("#" + $defaultTabLink.attr("href").substr(1))).show().addClass(opts.panelActiveClass);

      $defaultTab.addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass);

      $tabs.children("a").bind("click.easytabs", function(e) {
        $container.data("easytabs").opts.cycle = false;
        $clicked = $(this);
        if($clicked.hasClass(opts.tabActiveClass)){ return false; }
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
          $selectedTab = $tabs.find("a[href='" + window.location.hash + "']").parent();
      if($selectedTab.size() == 1){
        $defaultTab = $selectedTab;
        $container.data("easytabs").opts.cycle = false;
      }else{
        $defaultTab = $tabs.parent().find(opts.defaultTab);
      }
      $defaultTabLink = $defaultTab.children("a").first();
      $container.data("easytabs").defaultTab = $defaultTab;
      $container.data("easytabs").defaultTabLink = $defaultTabLink;
    },
    selectTab: function($container,callback){
      var $clicked = this,
          targetId = $clicked.attr("href"),
          url = window.location,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          skipHashUpdateOnce = opts.skipHashUpdateOnce,
          $tabs = data.tabs,
          $panels = data.panels,
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
        
      if( ! $clicked.hasClass(opts.tabActiveClass) ){
        $container.trigger("easytabs:before");
        
        // Change the active tab *first* to provide immediate feedback when the user clicks
        $tabs.filter("." + opts.tabActiveClass).removeClass(opts.tabActiveClass).children().removeClass(opts.tabActiveClass);
        $clicked.parent().addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass);
        
        $panels.filter("." + opts.panelActiveClass).removeClass(opts.panelActiveClass)[transitions.hide](transitions.speed, function(){
          // At this point, the previous panel is hidden, and the new one will be selected
          $container.trigger("easytabs:midTransition");
          if ( opts.updateHash && ! skipHashUpdateOnce ) {
            window.location = url.toString().replace((url.pathname + url.hash), (url.pathname + $clicked.attr("href")));
          }
          $panels.filter(targetId)[transitions.show](transitions.speed, function(){
            $(this).addClass(opts.panelActiveClass);
            $container.trigger("easytabs:after"); 
          });
        });
        
        // Save the new tabs and panels to the container data (with new active tab/panel)
        $container.data("easytabs").tabs = $tabs;
        $container.data("easytabs").panels = $panels;
        // callback only gets called if selectTab actually does something, since it's inside the if block
        if(typeof callback == 'function'){
          callback();
        }
      }
    },
    selectTabFromHashChange: function(){
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          opts = data.opts,
          skipHashUpdateOnce = data.skipHashUpdateOnce,
          $tabs = data.tabs,
          $defaultTab = data.defaultTab,
          $defaultTabLink = data.defaultTabLink;
      if ( ! skipHashUpdateOnce ){
        var hash = window.location.hash,
            $tab = $tabs.find("a[href='" + hash + "']");
        if( $tab.size() > 0 ){
          $.fn.easytabs.methods.selectTab.apply( $tab, [$container] );
        } else if ( hash == '' && ! $defaultTab.hasClass(opts.activeTabClass) ) {
          $.fn.easytabs.methods.selectTab.apply( $defaultTabLink, [$container] );
        }
      }else{
        $container.data("easytabs").skipHashUpdateOnce = false;
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
        $.fn.easytabs.methods.selectTab.apply($tab, [$container, function(){
          setTimeout(function(){ $.fn.easytabs.methods.cycleTabs.apply($container,[tabNumber + 1]);}, opts.cycle);
        }]);
      }
    }
  }
  
  $.fn.easytabs.publicMethods = {
    select: function(tabSelector){
      var $container = this,
          data = $.fn.easytabs.methods.loadFromData.apply($container),
          $tabs = data.tabs;
      var $tab = $tabs.filter(tabSelector);
      if ( $tab.size() == 0 ) {
        $.error('Tab \'' + tabSelector + '\' does not exist in tab set');
      }
      $.fn.easytabs.methods.selectTab.apply($tab.children("a").first(), [$container]);
    }
  }
})(jQuery);