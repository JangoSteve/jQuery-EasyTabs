# [JQuery EasyTabs Plugin](http://www.alfajango.com/blog/jquery-easytabs-plugin/)

*Tabs with(out) style.*

EasyTabs creates tabs with all the functionality, no unwanted changes
to your markup, and no hidden styling.

Unlike jQuery UI tabs, which style and arrange your tabs and panels for you, this plugin handles only the functionality of the tabs. By leaving the styling and layout up to you, it is much easier to style and arrange your tabs the way you want.

## What EasyTabs Does:

* Creates tabs from an unordered list, which link to divs on the page
* Allows complete customization of appearance, layout, and style via CSS
* Supports forward- and back-button in browsers
* Tabs are bookmarkable and SEO-friendly
* Tabs can be cycled at a specified interval

## What EasyTabs Does NOT Do:

* Style your tabs in any way (though sensible CSS defaults can be found
  in the demos)

## Show Your Support

<table style="width: 100%;">
<tr>
<td>
Show your support for jQuery EasyTabs, by helping us raise money for the Karmanos Cancer
Institute.
</td>
<td style="text-align: left; width: 35%;">
<a href='http://pledgie.com/campaigns/15528'><img alt='Click here to lend your support to: Karmanos Cancer Institute by Alfa Jango and make a donation at www.pledgie.com !' src='http://pledgie.com/campaigns/15528.png?skin_name=chrome' border='0' /></a>
</td>
</tr>
</table>

## Documentation

* Installation
* Stylization
* Configuration Options
* Demos

## Installation

### The HTML

Unlike JQuery UI tabs, the HTML markup for your tabs and content can be arranged however you want. At the minimum, you need a container, an unordered list of links for your tabs, and matching divs for your tabbed content.

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

### The Javascript

To enable back- and forward-button support for the users' browsers, be sure to include either the [jQuery HashChange plugin](http://benalman.com/projects/jquery-hashchange-plugin/) (recommended) or the [Address plugin](http://www.asual.com/jquery/address/docs/) before including the EasyTabs plugin. There is no other configuration required, it will just work!

    <script src="/javascripts/jquery.js" type="text/javascript"></script> 
    <script src="/javascripts/jquery.hashchange.js" type="text/javascript"></script> 
    <script src="/javascripts/jquery.easytabs.js" type="text/javascript"></script>  
    
    <script type="text/javascript"> 
      $(document).ready(function(){ $('#tab-container').easytabs(); });
    </script> 

I varied the tab ids and names just to show you how flexible this is. There is no magic going on with this plugin; it's not trying to guess the order of your tabs or what tab is associated with which `<div>`. Just make the id of the content `<div>` match the href of the tab link.

### Required Markup

The only rules you need to follow are these:

* containing `<div>` with a unique id
* the container `<div>` contains an unordered list `<ul>` of links `<a>`

(UPDATE: As of version 1.1, this is no longer the case. You can now include your tabs anywhere within the container. It can be a `<ul>`, `<ol>`, `<div>`, or anything you want. The default is still a top-level `<ul>`, so to change it you just specify your selector with the new "tabs" option.)

* the container div also contains content divs (for the tabbed content), each div has a unique id that matches the href property of a link in the unordered list

Other than that, go nuts. The order of the elements does NOT matter. Your `<ul>` could be before or after the content divs (or even between them). You can put non-tabbed content between the elements. It doesn't matter. The most common structure (for inspiration's sake) is something like this:

    div#tab-container ul > ( li > a[href="tab-1"], li > a[href="second-tab"] )
    div#tab-container div#tab-1
    div#tab-container div#second-tab

    +---------------------------------------------------------------------------+
    |                              div#tab-container                            |
    |  +---------------------------------------------------------------------+  |
    |  |                                  ul                                 |  |
    |  |  +-----------------------------+    +----------------------------+  |  |
    |  |  |             li              |    |             li             |  |  |
    |  |  |  +-----------------------+  |    |  +----------------------+  |  |  |
    |  |  |  |    a[href="tab-1"]    |  |    |  | a[href="second-tab"] |  |  |  |
    |  |  |  +-----------------------+  |    |  +----------------------+  |  |  |
    |  |  +-----------------------------+    +----------------------------+  |  |
    |  +---------------------------------------------------------------------+  |
    |                                                                           |
    |  +---------------------------------------------------------------------+  |
    |  |                               div#tab-1                             |  |
    |  +---------------------------------------------------------------------+  |
    |                                                                           |
    |  +---------------------------------------------------------------------+  |
    |  |                             div#second-tab                          |  |
    |  +---------------------------------------------------------------------+  |
    |                                                                           |
    +---------------------------------------------------------------------------+

-------------------------------------------------------------------------------------------

For stylization, configuration options, and live demos, see the [EasyTabs homepage](http://www.alfajango.com/blog/jquery-easytabs-plugin/).

-------------------------------------------------------------------------------------------

## Links

* [Full Documentation and Demos](http://www.alfajango.com/blog/jquery-easytabs-plugin/)
* [Updates and new features for v1.1.2](http://www.alfajango.com/blog/jquery-easytabs-plugin-now-more-flexible-and-usable)
* [Updates and new features for v2.0](http://www.alfajango.com/blog/jquery-easytabs-plugin-v2)
* [Updates and new features for v2.1.2](http://www.alfajango.com/blog/jquery-easytabs-plugin-v2-1-2/)
* [Download jQuery EasyTabs](http://plugins.jquery.com/project/easytabs)
* [Fork and view source code](http://github.com/JangoSteve/jQuery-EasyTabs)

## Info

* Author: [Steve Schwartz](https://github.com/JangoSteve)
* Company: [Alfa Jango, LLC](http://www.alfajango.com)
* License: Dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php) and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.
