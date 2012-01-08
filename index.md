---
layout: default
title: jQuery EasyTabs Plugin
links:
  - title: Download from JSPkg.com
    href: http://jspkg.com/packages/easytabs
  - title: View Source or Fork on Github
    href: https://github.com/JangoSteve/jQuery-EasyTabs
  - title: View Live Demos
    href: https://jspkg.com/packages/easytabs/demos
  - title: View Changelog
    href: https://github.com/JangoSteve/jQuery-EasyTabs/wiki/CHANGELOG
  - title: Report bug or request feature
    href: https://github.com/JangoSteve/jQuery-EasyTabs/issues
---

# JQuery EasyTabs Plugin

> Tabs with(out) style.

The jQuery EasyTabs plugin handles all of the functionality of tabs and none of the styling.

So, why use this instead of jQuery UI tabs?

As great as jQuery UI tabs are, UI tabs become a liability when it comes time to shed the out-of-box UI styling for something more custom.

After struggling to create custom-designed tabs, messing with numerous CSS classes, overriding all the default styling, and feeling constrained by the required markup, we finally decided to create our own lightweight, flexible jQuery tab plugin. Unlike jQuery UI tabs, which style and arrange your tabs and panels for you, this plugin handles only the functionality of the tabs. By leaving the styling and layout up to you, it is much easier to style and arrange your tabs the way you want.

Why you should use EasyTabs:

* Provides smooth transitions between panels when tab is selected
* Allows complete customization of appearance, layout, and style via CSS
* Supports back-button and forward-button in browsers
* Tabs are bookmarkable and SEO-friendly
* Loads AJAX content, or anything not already on the page
* Tabs can automatically cycle at a specified interval
* Adds NO global JS variables
* Can have multiple EasyTabs instances on one page
* Written in jQuery plugin format, chain-able with other jQuery commands
* Completely valid HTML markup
* Lightweight: the minified version is only 5KB
* Open-source and dual licensed under the MIT and GPL licenses
* Styles your tabs in any way (either through javascript or CSS)

Contents

Installation
Stylization
AJAX Tabs
Configuration options
Public methods
Event hooks
Demos

## Installation

### The HTML

The HTML markup for your tabs and content can be arranged however you want. At the minimum, you need a container, a collection (unordered list by default) of links for your tabs, and matching divs for your tabbed content.

{% highlight html %}
<div id="tab-container">
  <ul>
    <li><a href="#tab-1-div">Tab 1</a></li>
    <li><a href="#that-other-tab">The Second Tab</a></li>
    <li><a href="#lastly">Tab C</a></li>
  </ul>
  <div id="tab-1-div">
    <h2>Heading 1</h2>
    <p>This is the content of the first tab.</p>
  </div>
    <div id="that-other-tab">
    <h2>Heading 2</h2>
    <p>Stuff from the second tab.</p>
  </div>
  <div id="lastly">
    <h2>Heading 3</h2>
    <p>More stuff from the last tab.</p>
  </div>
</div>
{% endhighlight %}

### The Javascript

To enable back- and forward-button support for the users' browsers, be sure to include either the jQuery HashChange plugin (recommended) or the Address plugin before including the EasyTabs plugin. There is no other configuration required, it will just work!

{% highlight html %}
<script src="/javascripts/jquery.js" type="text/javascript"></script> 
<script src="/javascripts/jquery.hashchange.js" type="text/javascript"></script> 
<script src="/javascripts/jquery.easytabs.js" type="text/javascript"></script>  

<script type="text/javascript"> 
  $(document).ready(function(){ 
    $('#tab-container').easytabs(); 
  });
</script>
{% endhighlight %}

I varied the tab ids and names just to show you how flexible this is. There is no magic going on with this plugin; it's not trying to guess the order of your tabs or which tab matches which panel. Just make the href of the tab link match the id of the panel <div>.

## Required Markup

The only rules you need to follow are these:

a container `<div>`
the container contains a collection (a `<ul>` by default) of links `<a>`
the container also contains panel divs (for the tabbed content), each div has a unique id that matches the href property of a link in the tab collection
Other than that, go nuts. The order of the elements does NOT matter. Your tabs could be before or after the panels. You can put non-tabbed content between the elements. You could even put the tabs inside one of the panels! It doesn't matter.


## Styling Tabs and Content

To style your tabs, you simply use your own CSS and stylesheet. Here's some very basic styling to get you started:

{% highlight css %}
#tab-container ul { margin: 0; padding: 0; }
#tab-container ul li { display: inline-block; background: #ccc; border: solid 1px; border-bottom: none; }
#tab-container ul li a { display: block; padding: 5px; outline: none; }
#tab-container ul li a:hover { text-decoration: underline; }
#tab-container ul li.active { background: #fff; padding-top: 6px; position: relative; top: 1px; }
#tab-container ul li a.active { font-weight: bold; }
#tab-container .panel-container { border: solid 1px; padding: 0 10px; }
{% endhighlight %}

EasyTabs will simply add the .active class to the currently selected tab and panel. Also, any element inside of the currently-selected tab also gets the .active class. So, for example, if your tabs look like this:

{% highlight html %}
<ul>
  <li>
    <a href="#tab-1">Tab 1</a>
  </li><li>
  </li><li>
    <a href="#tab-2">Tab 2</a>
  </li>
</ul>
{% endhighlight %}

… and then you click on the first tab link, your markup will now look like this:

{% highlight html %}
<ul>
  <li class="active">
    <a href="#tab-1" class="active">Tab 1</a>
  </li><li>
  </li><li>
    <a href="#tab-2">Tab 2</a>
  </li>
</ul>
{% endhighlight %}

## AJAX Tabs

Sometimes we want to load content into a tab from another page via AJAX. In order to do that, we'll change the markup of the tabs a little bit. The difference in markup is to keep things semantically meaningful and gracefully degradable (see explanation).

For AJAX tabs, the URL for the content goes in the href attribute, and we move the target panel's id to the data-target attribute:

{% highlight html %}
<a href="/some/ajax/path.html" data-target="#panel-1" class="tabs">I'm a tab</a>
<div id="panel-1">Panel content</div>
{% endhighlight %}

We can also load a page fragment via ajax by adding a CSS selector after the AJAX URL:

{% highlight html %}
<a href="/some/ajax/path.html #some-element" data-target="#panel-1" class="tabs">I'm a tab</a>
{% endhighlight %}

Also see the cache configuration option, and the easytabs:ajax:beforeSend and easytabs:ajax:complete event hooks below.

## Configuration Options

You can configure EasyTabs by passing in a hash of options when you instantiate it on a container. The following is a list of all the available options, including accepted and default values.

Available Options

Option	Description	Values (default)
animate	Makes content panels fade out and in when a new tab is clicked.	true, false 
(true)
animationSpeed	Controls the speed of the fading effect if animate: true.	"slow", "normal", "fast", integer in milliseconds 
("normal")
cache
v2.3	Caches the content retrieved for ajax tabs after the first request, such that subsequent tab clicks only hide/show the content.	true, false 
(true)
collapsedByDefault
v2.1	Makes tabs collapsed by default (when the page is loaded) if collapsible: true. Note that if defaultTab is specified, then collapsedByDefault defaults to false.	true, false 
(true)
collapsedClass
v2.1	Adds specified class to tab when panel is collapsed. Only works for collapsible: true.	any class name string 
("collapsed")
collapsible
v2.1	Makes panels collapse and un-collapse if active tab is clicked repeatedly.	true, false 
(false)
cycle
v1.1.2	Turns on automatic cycling through tabs, with the specified cycling interval in milliseconds.	false, integer in milliseconds 
(false)
defaultTab	Selects the <li> tab to activate when page first loads.	any single jquery selector 
e.g. "li:first-child" or "li#tab-2" 
("li:first-child")
panelActiveClass	Adds specified class to the currently-selected content <div>	any class name string 
e.g. "active" or "selected" 
("active")
tabActiveClass	Adds specified class to the currently-selected tab <li> (and it's descendants).	any class name string e.g. "active" or "selected" 
("active")
tabs
v1.1.2	The container element for your tabs, relative to the container element that easyTabs was applied to.	any jquery selector referencing your collection of tabs 
e.g. `"ul#tabs > li"` or `"div#tab-container > span"` 
("> ul > li", which selects the top-level `<ul>` within the container element)
transitionIn
v2.2	The jQuery effect used to show the target panel when a tab is selected.	'fadeIn', 'slideDown' 
('fadeIn')
transitionOut
v2.2	The jQuery effect used to hide the visible panel when a tab is selected.	'fadeOut', 'slideUp' 
('fadeOut')
transitionCollapse
v2.2	The jQuery effect used to collapse the panel if collapsible: true.	'fadeOut', 'slideUp', 'hide' 
(slideUp)
transitionUncollapse
v2.2	The jQuery effect used to un-collapse the panel if collapsible: true.	'fadeIn', 'slideDown', 'show' 
(slideDown)
updateHash
v1.1.2	Tells easyTabs whether or not to update the browser window's URL hash, useful for SEO and bookmarking.	true, false 
(true)
uiTabs
v2.1	Automatically uses class names and defaults of jQuery UI tabs, making it easy to switch from jQuery-UI tabs without needing to change any HTML or CSS styles.	true, false 
(false)
Here's an example that uses all of the configuration options:

{% highlight js %}
$("#tab-container").easytabs({
  animate: true,
  animationSpeed: 5000,
  defaultTab: "li#tab-2",
  panelActiveClass: "active-content-div",
  tabActiveClass: "selected-tab",
  tabs: "> div > span",
  updateHash: false,
  cycle: 5000
});
{% endhighlight %}

## Public methods

EasyTabs currently has one public method, called select, which allows you to select a tab via JavaScript.

{% highlight js %}
$('#tab-container').easytabs('select', '#tab-2');
{% endhighlight %}

The parameter passed to select (`'#tab-2'` in the example above), can be either a jQuery selector to select the tab (e.g. one of the `<li>` elements), the tab link (e.g. one of the `<a>` elements), or it can be the id of one of the panels.

## Event Hooks

jQuery EasyTabs fires off three events to which you can bind your own functionality.

{% highlight js %}
easytabs:before        // fires before a tab is selected
easytabs:midTransition // fires after the previous panel has been hidden, but before the next is shown
easytabs:after         // fires after a tab has been selected (and after the panel is completely finished transitioning in)
{% endhighlight %}

For ajax tabs, there are two additional event hooks that fire:

{% highlight js %}
easytabs:ajax:beforeSend // fires before ajax request is made
easytabs:ajax:complete   // fires when ajax request is complete (before the content is loaded)
{% endhighlight %}

You can bind custom handlers to any of these events. You can even cancel the tab change by returning false in an easytabs:before binding:

{% highlight js %}
$('#tab-container').bind('easytabs:before', function(){
  return confirm("Are you sure you want to switch tabs?");
});
{% endhighlight %}

All callbacks also pass parameters to the handler function, as described in this post.

The ajax event hooks have their own set of data passed as well, see this post for more detail and examples.

The easytabs:midTransition is also when the URL gets updated when the configuration option updateHash is true (which it is by default). The URL must be updated precisely after the previous panel has disappeared from the page, but before the next panel appears to avoid making the browser window jump to the panel when the URL is updated.

## Live demos

 Many tab containers on one page (with various configurations)

 Disconnected tabs and tabbed content demo

