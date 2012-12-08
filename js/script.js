// Simple Set Clipboard System
// Author: Joseph Huckaby
window.ZeroClipboard={version:"1.0.8",clients:{},moviePath:"ZeroClipboard.swf",nextId:1,$:function(a){return typeof a=="string"&&(a=document.getElementById(a)),a.addClass||(a.hide=function(){this.style.display="none"},a.show=function(){this.style.display=""},a.addClass=function(a){this.removeClass(a),this.className+=" "+a},a.removeClass=function(a){var b=this.className.split(/\s+/),c=-1;for(var d=0;d<b.length;d++)b[d]==a&&(c=d,d=b.length);return c>-1&&(b.splice(c,1),this.className=b.join(" ")),this},a.hasClass=function(a){return!!this.className.match(new RegExp("\\s*"+a+"\\s*"))}),a},setMoviePath:function(a){this.moviePath=a},newClient:function(){return new ZeroClipboard.Client},dispatch:function(a,b,c){var d=this.clients[a];d&&d.receiveEvent(b,c)},register:function(a,b){this.clients[a]=b},getDOMObjectPosition:function(a,b){var c={left:0,top:0,width:a.width?a.width:a.offsetWidth,height:a.height?a.height:a.offsetHeight};while(a&&a!=b)c.left+=a.offsetLeft,c.left+=a.style.borderLeftWidth?parseInt(a.style.borderLeftWidth):0,c.top+=a.offsetTop,c.top+=a.style.borderTopWidth?parseInt(a.style.borderTopWidth):0,a=a.offsetParent;return c},Client:function(a){this.handlers={},this.id=ZeroClipboard.nextId++,this.movieId="ZeroClipboardMovie_"+this.id,ZeroClipboard.register(this.id,this),a&&this.glue(a)}},ZeroClipboard.Client.prototype={id:0,title:"",ready:!1,movie:null,clipText:"",handCursorEnabled:!0,cssEffects:!0,handlers:null,zIndex:99,glue:function(a,b,c){this.domElement=ZeroClipboard.$(a),this.domElement.style.zIndex&&(this.zIndex=parseInt(this.domElement.style.zIndex,10)+1),this.domElement.getAttribute("title")!=null&&(this.title=this.domElement.getAttribute("title")),typeof b=="string"?b=ZeroClipboard.$(b):typeof b=="undefined"&&(b=document.getElementsByTagName("body")[0]);var d=ZeroClipboard.getDOMObjectPosition(this.domElement,b);this.div=document.createElement("div");var e=this.div.style;e.position="absolute",e.left=""+d.left+"px",e.top=""+d.top+"px",e.width=""+d.width+"px",e.height=""+d.height+"px",e.zIndex=this.zIndex;if(typeof c=="object")for(var f in c)e[f]=c[f];b.appendChild(this.div),this.div.innerHTML=this.getHTML(d.width,d.height)},getHTML:function(a,b){var c="",d="id="+this.id+"&width="+a+"&height="+b,e=this.title?' title="'+this.title+'"':"";if(navigator.userAgent.match(/MSIE/)){var f=location.href.match(/^https/i)?"https://":"http://";c+="<object"+e+' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+f+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+a+'" height="'+b+'" id="'+this.movieId+'"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+d+'"/><param name="wmode" value="transparent"/></object>'}else c+="<embed"+e+' id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+a+'" height="'+b+'" name="'+this.movieId+'" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+d+'" wmode="transparent" />';return c},hide:function(){this.div&&(this.div.style.left="-2000px")},show:function(){this.reposition()},destroy:function(){if(this.domElement&&this.div){this.hide(),this.div.innerHTML="";var a=document.getElementsByTagName("body")[0];try{a.removeChild(this.div)}catch(b){}this.domElement=null,this.div=null}},reposition:function(a){a&&(this.domElement=ZeroClipboard.$(a),this.domElement||this.hide());if(this.domElement&&this.div){var b=ZeroClipboard.getDOMObjectPosition(this.domElement),c=this.div.style;c.left=""+b.left+"px",c.top=""+b.top+"px"}},setText:function(a){this.clipText=a,this.ready&&this.movie.setText(a)},setTitle:function(a){this.title=a},addEventListener:function(a,b){a=a.toString().toLowerCase().replace(/^on/,""),this.handlers[a]||(this.handlers[a]=[]),this.handlers[a].push(b)},setHandCursor:function(a){this.handCursorEnabled=a,this.ready&&this.movie.setHandCursor(a)},setCSSEffects:function(a){this.cssEffects=!!a},receiveEvent:function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");switch(a){case"load":this.movie=document.getElementById(this.movieId);if(!this.movie){var c=this;setTimeout(function(){c.receiveEvent("load",null)},1);return}if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/)){var c=this;setTimeout(function(){c.receiveEvent("load",null)},100),this.ready=!0;return}this.ready=!0,this.movie.setText(this.clipText),this.movie.setHandCursor(this.handCursorEnabled);break;case"mouseover":this.domElement&&this.cssEffects&&(this.domElement.addClass("hover"),this.recoverActive&&this.domElement.addClass("active"));break;case"mouseout":this.domElement&&this.cssEffects&&(this.recoverActive=!1,this.domElement.hasClass("active")&&(this.domElement.removeClass("active"),this.recoverActive=!0),this.domElement.removeClass("hover"));break;case"mousedown":this.domElement&&this.cssEffects&&this.domElement.addClass("active");break;case"mouseup":this.domElement&&this.cssEffects&&(this.domElement.removeClass("active"),this.recoverActive=!1)}if(this.handlers[a])for(var d=0,e=this.handlers[a].length;d<e;d++){var f=this.handlers[a][d];typeof f=="function"?f(this,b):typeof f=="object"&&f.length==2?f[0][f[1]](this,b):typeof f=="string"&&window[f](this,b)}}},typeof module!="undefined"&&(module.exports=ZeroClipboard);

/*! jQuery UI - v1.9.2 - 2012-12-07
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.slider.js
* Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT */

(function(e,t){function i(t,n){var r,i,o,u=t.nodeName.toLowerCase();return"area"===u?(r=t.parentNode,i=r.name,!t.href||!i||r.nodeName.toLowerCase()!=="map"?!1:(o=e("img[usemap=#"+i+"]")[0],!!o&&s(o))):(/input|select|textarea|button|object/.test(u)?!t.disabled:"a"===u?t.href||n:n)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().andSelf().filter(function(){return e.css(this,"visibility")==="hidden"}).length}var n=0,r=/^ui-id-\d+$/;e.ui=e.ui||{};if(e.ui.version)return;e.extend(e.ui,{version:"1.9.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({_focus:e.fn.focus,focus:function(t,n){return typeof t=="number"?this.each(function(){var r=this;setTimeout(function(){e(r).focus(),n&&n.call(r)},t)}):this._focus.apply(this,arguments)},scrollParent:function(){var t;return e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?t=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):t=this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(n){if(n!==t)return this.css("zIndex",n);if(this.length){var r=e(this[0]),i,s;while(r.length&&r[0]!==document){i=r.css("position");if(i==="absolute"||i==="relative"||i==="fixed"){s=parseInt(r.css("zIndex"),10);if(!isNaN(s)&&s!==0)return s}r=r.parent()}}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n)})},removeUniqueId:function(){return this.each(function(){r.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(n){return!!e.data(n,t)}}):function(t,n,r){return!!e.data(t,r[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var n=e.attr(t,"tabindex"),r=isNaN(n);return(r||n>=0)&&i(t,!r)}}),e(function(){var t=document.body,n=t.appendChild(n=document.createElement("div"));n.offsetHeight,e.extend(n.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),e.support.minHeight=n.offsetHeight===100,e.support.selectstart="onselectstart"in n,t.removeChild(n).style.display="none"}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(n,r){function u(t,n,r,s){return e.each(i,function(){n-=parseFloat(e.css(t,"padding"+this))||0,r&&(n-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(n-=parseFloat(e.css(t,"margin"+this))||0)}),n}var i=r==="Width"?["Left","Right"]:["Top","Bottom"],s=r.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+r]=function(n){return n===t?o["inner"+r].call(this):this.each(function(){e(this).css(s,u(this,n)+"px")})},e.fn["outer"+r]=function(t,n){return typeof t!="number"?o["outer"+r].call(this,t):this.each(function(){e(this).css(s,u(this,t,!0,n)+"px")})}}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(n){return arguments.length?t.call(this,e.camelCase(n)):t.call(this)}}(e.fn.removeData)),function(){var t=/msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase())||[];e.ui.ie=t.length?!0:!1,e.ui.ie6=parseFloat(t[1],10)===6}(),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,n,r){var i,s=e.ui[t].prototype;for(i in r)s.plugins[i]=s.plugins[i]||[],s.plugins[i].push([n,r[i]])},call:function(e,t,n){var r,i=e.plugins[t];if(!i||!e.element[0].parentNode||e.element[0].parentNode.nodeType===11)return;for(r=0;r<i.length;r++)e.options[i[r][0]]&&i[r][1].apply(e.element,n)}},contains:e.contains,hasScroll:function(t,n){if(e(t).css("overflow")==="hidden")return!1;var r=n&&n==="left"?"scrollLeft":"scrollTop",i=!1;return t[r]>0?!0:(t[r]=1,i=t[r]>0,t[r]=0,i)},isOverAxis:function(e,t,n){return e>t&&e<t+n},isOver:function(t,n,r,i,s,o){return e.ui.isOverAxis(t,r,s)&&e.ui.isOverAxis(n,i,o)}})})(jQuery);(function(e,t){var n=0,r=Array.prototype.slice,i=e.cleanData;e.cleanData=function(t){for(var n=0,r;(r=t[n])!=null;n++)try{e(r).triggerHandler("remove")}catch(s){}i(t)},e.widget=function(t,n,r){var i,s,o,u,a=t.split(".")[0];t=t.split(".")[1],i=a+"-"+t,r||(r=n,n=e.Widget),e.expr[":"][i.toLowerCase()]=function(t){return!!e.data(t,i)},e[a]=e[a]||{},s=e[a][t],o=e[a][t]=function(e,t){if(!this._createWidget)return new o(e,t);arguments.length&&this._createWidget(e,t)},e.extend(o,s,{version:r.version,_proto:e.extend({},r),_childConstructors:[]}),u=new n,u.options=e.widget.extend({},u.options),e.each(r,function(t,i){e.isFunction(i)&&(r[t]=function(){var e=function(){return n.prototype[t].apply(this,arguments)},r=function(e){return n.prototype[t].apply(this,e)};return function(){var t=this._super,n=this._superApply,s;return this._super=e,this._superApply=r,s=i.apply(this,arguments),this._super=t,this._superApply=n,s}}())}),o.prototype=e.widget.extend(u,{widgetEventPrefix:s?u.widgetEventPrefix:t},r,{constructor:o,namespace:a,widgetName:t,widgetBaseClass:i,widgetFullName:i}),s?(e.each(s._childConstructors,function(t,n){var r=n.prototype;e.widget(r.namespace+"."+r.widgetName,o,n._proto)}),delete s._childConstructors):n._childConstructors.push(o),e.widget.bridge(t,o)},e.widget.extend=function(n){var i=r.call(arguments,1),s=0,o=i.length,u,a;for(;s<o;s++)for(u in i[s])a=i[s][u],i[s].hasOwnProperty(u)&&a!==t&&(e.isPlainObject(a)?n[u]=e.isPlainObject(n[u])?e.widget.extend({},n[u],a):e.widget.extend({},a):n[u]=a);return n},e.widget.bridge=function(n,i){var s=i.prototype.widgetFullName||n;e.fn[n]=function(o){var u=typeof o=="string",a=r.call(arguments,1),f=this;return o=!u&&a.length?e.widget.extend.apply(null,[o].concat(a)):o,u?this.each(function(){var r,i=e.data(this,s);if(!i)return e.error("cannot call methods on "+n+" prior to initialization; "+"attempted to call method '"+o+"'");if(!e.isFunction(i[o])||o.charAt(0)==="_")return e.error("no such method '"+o+"' for "+n+" widget instance");r=i[o].apply(i,a);if(r!==i&&r!==t)return f=r&&r.jquery?f.pushStack(r.get()):r,!1}):this.each(function(){var t=e.data(this,s);t?t.option(o||{})._init():e.data(this,s,new i(o,this))}),f}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,r){r=e(r||this.defaultElement||this)[0],this.element=e(r),this.uuid=n++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),r!==this&&(e.data(r,this.widgetName,this),e.data(r,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===r&&this.destroy()}}),this.document=e(r.style?r.ownerDocument:r.document||r),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(n,r){var i=n,s,o,u;if(arguments.length===0)return e.widget.extend({},this.options);if(typeof n=="string"){i={},s=n.split("."),n=s.shift();if(s.length){o=i[n]=e.widget.extend({},this.options[n]);for(u=0;u<s.length-1;u++)o[s[u]]=o[s[u]]||{},o=o[s[u]];n=s.pop();if(r===t)return o[n]===t?null:o[n];o[n]=r}else{if(r===t)return this.options[n]===t?null:this.options[n];i[n]=r}}return this._setOptions(i),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,e==="disabled"&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(t,n,r){var i,s=this;typeof t!="boolean"&&(r=n,n=t,t=!1),r?(n=i=e(n),this.bindings=this.bindings.add(n)):(r=n,n=this.element,i=this.widget()),e.each(r,function(r,o){function u(){if(!t&&(s.options.disabled===!0||e(this).hasClass("ui-state-disabled")))return;return(typeof o=="string"?s[o]:o).apply(s,arguments)}typeof o!="string"&&(u.guid=o.guid=o.guid||u.guid||e.guid++);var a=r.match(/^(\w+)\s*(.*)$/),f=a[1]+s.eventNamespace,l=a[2];l?i.delegate(l,f,u):n.bind(f,u)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function n(){return(typeof e=="string"?r[e]:e).apply(r,arguments)}var r=this;return setTimeout(n,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,n,r){var i,s,o=this.options[t];r=r||{},n=e.Event(n),n.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),n.target=this.element[0],s=n.originalEvent;if(s)for(i in s)i in n||(n[i]=s[i]);return this.element.trigger(n,r),!(e.isFunction(o)&&o.apply(this.element[0],[n].concat(r))===!1||n.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,n){e.Widget.prototype["_"+t]=function(r,i,s){typeof i=="string"&&(i={effect:i});var o,u=i?i===!0||typeof i=="number"?n:i.effect||n:t;i=i||{},typeof i=="number"&&(i={duration:i}),o=!e.isEmptyObject(i),i.complete=s,i.delay&&r.delay(i.delay),o&&e.effects&&(e.effects.effect[u]||e.uiBackCompat!==!1&&e.effects[u])?r[t](i):u!==t&&r[u]?r[u](i.duration,i.easing,s):r.queue(function(n){e(this)[t](),s&&s.call(r[0]),n()})}}),e.uiBackCompat!==!1&&(e.Widget.prototype._getCreateOptions=function(){return e.metadata&&e.metadata.get(this.element[0])[this.widgetName]})})(jQuery);(function(e,t){var n=!1;e(document).mouseup(function(e){n=!1}),e.widget("ui.mouse",{version:"1.9.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(n){if(!0===e.data(n.target,t.widgetName+".preventClickEvent"))return e.removeData(n.target,t.widgetName+".preventClickEvent"),n.stopImmediatePropagation(),!1}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(t){if(n)return;this._mouseStarted&&this._mouseUp(t),this._mouseDownEvent=t;var r=this,i=t.which===1,s=typeof this.options.cancel=="string"&&t.target.nodeName?e(t.target).closest(this.options.cancel).length:!1;if(!i||s||!this._mouseCapture(t))return!0;this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){r.mouseDelayMet=!0},this.options.delay));if(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)){this._mouseStarted=this._mouseStart(t)!==!1;if(!this._mouseStarted)return t.preventDefault(),!0}return!0===e.data(t.target,this.widgetName+".preventClickEvent")&&e.removeData(t.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return r._mouseMove(e)},this._mouseUpDelegate=function(e){return r._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),t.preventDefault(),n=!0,!0},_mouseMove:function(t){return!e.ui.ie||document.documentMode>=9||!!t.button?this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted):this._mouseUp(t)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(e){return this.mouseDelayMet},_mouseStart:function(e){},_mouseDrag:function(e){},_mouseStop:function(e){},_mouseCapture:function(e){return!0}})})(jQuery);(function(e,t){var n=5;e.widget("ui.slider",e.ui.mouse,{version:"1.9.2",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null},_create:function(){var t,r,i=this.options,s=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),o="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",u=[];this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"+(i.disabled?" ui-slider-disabled ui-disabled":"")),this.range=e([]),i.range&&(i.range===!0&&(i.values||(i.values=[this._valueMin(),this._valueMin()]),i.values.length&&i.values.length!==2&&(i.values=[i.values[0],i.values[0]])),this.range=e("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(i.range==="min"||i.range==="max"?" ui-slider-range-"+i.range:""))),r=i.values&&i.values.length||1;for(t=s.length;t<r;t++)u.push(o);this.handles=s.add(e(u.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.add(this.range).filter("a").click(function(e){e.preventDefault()}).mouseenter(function(){i.disabled||e(this).addClass("ui-state-hover")}).mouseleave(function(){e(this).removeClass("ui-state-hover")}).focus(function(){i.disabled?e(this).blur():(e(".ui-slider .ui-state-focus").removeClass("ui-state-focus"),e(this).addClass("ui-state-focus"))}).blur(function(){e(this).removeClass("ui-state-focus")}),this.handles.each(function(t){e(this).data("ui-slider-handle-index",t)}),this._on(this.handles,{keydown:function(t){var r,i,s,o,u=e(t.target).data("ui-slider-handle-index");switch(t.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:t.preventDefault();if(!this._keySliding){this._keySliding=!0,e(t.target).addClass("ui-state-active"),r=this._start(t,u);if(r===!1)return}}o=this.options.step,this.options.values&&this.options.values.length?i=s=this.values(u):i=s=this.value();switch(t.keyCode){case e.ui.keyCode.HOME:s=this._valueMin();break;case e.ui.keyCode.END:s=this._valueMax();break;case e.ui.keyCode.PAGE_UP:s=this._trimAlignValue(i+(this._valueMax()-this._valueMin())/n);break;case e.ui.keyCode.PAGE_DOWN:s=this._trimAlignValue(i-(this._valueMax()-this._valueMin())/n);break;case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(i===this._valueMax())return;s=this._trimAlignValue(i+o);break;case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(i===this._valueMin())return;s=this._trimAlignValue(i-o)}this._slide(t,u,s)},keyup:function(t){var n=e(t.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(t,n),this._change(t,n),e(t.target).removeClass("ui-state-active"))}}),this._refreshValue(),this._animateOff=!1},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(t){var n,r,i,s,o,u,a,f,l=this,c=this.options;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),n={x:t.pageX,y:t.pageY},r=this._normValueFromMouse(n),i=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var n=Math.abs(r-l.values(t));i>n&&(i=n,s=e(this),o=t)}),c.range===!0&&this.values(1)===c.min&&(o+=1,s=e(this.handles[o])),u=this._start(t,o),u===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,s.addClass("ui-state-active").focus(),a=s.offset(),f=!e(t.target).parents().andSelf().is(".ui-slider-handle"),this._clickOffset=f?{left:0,top:0}:{left:t.pageX-a.left-s.width()/2,top:t.pageY-a.top-s.height()/2-(parseInt(s.css("borderTopWidth"),10)||0)-(parseInt(s.css("borderBottomWidth"),10)||0)+(parseInt(s.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,o,r),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},n=this._normValueFromMouse(t);return this._slide(e,this._handleIndex,n),!1},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(e){var t,n,r,i,s;return this.orientation==="horizontal"?(t=this.elementSize.width,n=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,n=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),r=n/t,r>1&&(r=1),r<0&&(r=0),this.orientation==="vertical"&&(r=1-r),i=this._valueMax()-this._valueMin(),s=this._valueMin()+r*i,this._trimAlignValue(s)},_start:function(e,t){var n={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("start",e,n)},_slide:function(e,t,n){var r,i,s;this.options.values&&this.options.values.length?(r=this.values(t?0:1),this.options.values.length===2&&this.options.range===!0&&(t===0&&n>r||t===1&&n<r)&&(n=r),n!==this.values(t)&&(i=this.values(),i[t]=n,s=this._trigger("slide",e,{handle:this.handles[t],value:n,values:i}),r=this.values(t?0:1),s!==!1&&this.values(t,n,!0))):n!==this.value()&&(s=this._trigger("slide",e,{handle:this.handles[t],value:n}),s!==!1&&this.value(n))},_stop:function(e,t){var n={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("stop",e,n)},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var n={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(n.value=this.values(t),n.values=this.values()),this._trigger("change",e,n)}},value:function(e){if(arguments.length){this.options.value=this._trimAlignValue(e),this._refreshValue(),this._change(null,0);return}return this._value()},values:function(t,n){var r,i,s;if(arguments.length>1){this.options.values[t]=this._trimAlignValue(n),this._refreshValue(),this._change(null,t);return}if(!arguments.length)return this._values();if(!e.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(t):this.value();r=this.options.values,i=arguments[0];for(s=0;s<r.length;s+=1)r[s]=this._trimAlignValue(i[s]),this._change(null,s);this._refreshValue()},_setOption:function(t,n){var r,i=0;e.isArray(this.options.values)&&(i=this.options.values.length),e.Widget.prototype._setOption.apply(this,arguments);switch(t){case"disabled":n?(this.handles.filter(".ui-state-focus").blur(),this.handles.removeClass("ui-state-hover"),this.handles.prop("disabled",!0),this.element.addClass("ui-disabled")):(this.handles.prop("disabled",!1),this.element.removeClass("ui-disabled"));break;case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":this._animateOff=!0,this._refreshValue();for(r=0;r<i;r+=1)this._change(null,r);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1}},_value:function(){var e=this.options.value;return e=this._trimAlignValue(e),e},_values:function(e){var t,n,r;if(arguments.length)return t=this.options.values[e],t=this._trimAlignValue(t),t;n=this.options.values.slice();for(r=0;r<n.length;r+=1)n[r]=this._trimAlignValue(n[r]);return n},_trimAlignValue:function(e){if(e<=this._valueMin())return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,n=(e-this._valueMin())%t,r=e-n;return Math.abs(n)*2>=t&&(r+=n>0?t:-t),parseFloat(r.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var t,n,r,i,s,o=this.options.range,u=this.options,a=this,f=this._animateOff?!1:u.animate,l={};this.options.values&&this.options.values.length?this.handles.each(function(r){n=(a.values(r)-a._valueMin())/(a._valueMax()-a._valueMin())*100,l[a.orientation==="horizontal"?"left":"bottom"]=n+"%",e(this).stop(1,1)[f?"animate":"css"](l,u.animate),a.options.range===!0&&(a.orientation==="horizontal"?(r===0&&a.range.stop(1,1)[f?"animate":"css"]({left:n+"%"},u.animate),r===1&&a.range[f?"animate":"css"]({width:n-t+"%"},{queue:!1,duration:u.animate})):(r===0&&a.range.stop(1,1)[f?"animate":"css"]({bottom:n+"%"},u.animate),r===1&&a.range[f?"animate":"css"]({height:n-t+"%"},{queue:!1,duration:u.animate}))),t=n}):(r=this.value(),i=this._valueMin(),s=this._valueMax(),n=s!==i?(r-i)/(s-i)*100:0,l[this.orientation==="horizontal"?"left":"bottom"]=n+"%",this.handle.stop(1,1)[f?"animate":"css"](l,u.animate),o==="min"&&this.orientation==="horizontal"&&this.range.stop(1,1)[f?"animate":"css"]({width:n+"%"},u.animate),o==="max"&&this.orientation==="horizontal"&&this.range[f?"animate":"css"]({width:100-n+"%"},{queue:!1,duration:u.animate}),o==="min"&&this.orientation==="vertical"&&this.range.stop(1,1)[f?"animate":"css"]({height:n+"%"},u.animate),o==="max"&&this.orientation==="vertical"&&this.range[f?"animate":"css"]({height:100-n+"%"},{queue:!1,duration:u.animate}))}})})(jQuery);

/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);

/* Author:
  nschaden
*/
UserAgent = {};
UserAgent.searchPage = null;
UserAgent.searchResultsPage = null;
UserAgent.stylesPage = null;
UserAgent.moodsPage = null;
UserAgent.topPage = null;
UserAgent.manualHistory = ['#search'];
UserAgent.miniWidth = null;
UserAgent.changePage = function(newpage)
{
  var fadeoutelements = $('div.page,#permafooter').not(newpage);
  $('#clip_content').css('visibility','hidden');
  fadeoutelements.not(':eq(0)').fadeOut(200);
  fadeoutelements.first().fadeOut(200, function() 
  {
    $(newpage).hide().fadeIn(200,function() 
    { 
      if (newpage != '#search_results') $('#permafooter').show(); 
      if (newpage == '#search_results')
      {
        if (!Output.clipboard && $('#clip_content').css('display') != 'none')
        {
          // init zero clipboard
          ZeroClipboard.setMoviePath('http://www.nickschaden.com/echospot/swf/ZeroClipboard.swf');
          Output.clipboard = new ZeroClipboard.Client();
          Output.clipboard.glue('clip_button', 'clip_container');
          Output.clipboard.addEventListener('onMouseDown',function() 
          {
            Output.clipboard.setText(Output.contentSongLinkRows.join('\n'));
          });
          Output.clipboard.addEventListener('onComplete',function() 
          {
            $('.copy_success').addClass('active');
            setTimeout(function() { $('.copy_success').removeClass('active');},4000);
          });
          // Output.clipboard.setText(Output.contentSongLinkRows.join('\n'));
        }
        // else
        //    Output.clipboard.setText(Output.contentSongLinkRows.join('\n'));
      }
    });
  });
  if (newpage != '#search_results' && newpage != '#copydata')
    $('#permaheader').find('.csv_container,.spot_container').removeClass('active');
  if (newpage == '#search')
  {
    $('#permaheader nav a.top').removeClass('active');          
    if ($('#search-byartist')[0].checked)
      $('#permaheader nav a.artist').addClass('active');
    else if ($('#search-byplaylist')[0].checked)
      $('#permaheader nav a.playlist').addClass('active');
    else
      $('#permaheader nav a.song').addClass('active');
  }
  else if (newpage == '#top')
  {
    $('#permaheader nav a').removeClass('active');
    $('#permaheader nav a.top').addClass('active');
  }
  if (Modernizr.history)
  {
    history.pushState({page:newpage},null,'');
    UserAgent.manualHistory.push(newpage);
  }
};
if (Modernizr.history)
{
  // initial push on page load is always the search page
  window.onpopstate = function (event) 
  {
    // see what is available in the event object
    if (UserAgent.manualHistory.length > 1)
    {
      UserAgent.manualHistory.pop();
      var nextpage = UserAgent.manualHistory.pop();
      UserAgent.changePage(nextpage);
    }
  };
}

$(function() {
  UserAgent.miniWidth = ($(window).width() <= 480);
  // for hash tags that don't fall in the proper starting area, change and reload
  var splithref = document.location.href.split('#');
  if (splithref.length > 1 && splithref[1] != 'top' && splithref[1] != 'search')
  {
    document.location.href = splithref[0] + '#search';
  }
  // init core header options
  $('#permaheader').find('nav li a').click(function()
  {
    $this = $(this);
    if ($this.hasClass('active')) return false;
    if ($this.hasClass('playlist_generate'))
    {
      $('#copydata').find('textarea').val(Output.contentSongLinkRows.join('\n'));
      UserAgent.changePage('#copydata');
    }
    else if ($this.hasClass('csv'))
    {
      var data = Output.plainTextContentRows.join('\n');
      $('#save-csv input').val(data);
      $('#save-csv').submit();
    }
    else
    {
      if ($('#help').length)
      {
        if (Modernizr.sessionstorage)
        {
          if ($this.hasClass('playlist'))
            sessionStorage.setItem('startsearchsetting','playlist');
          if ($this.hasClass('artist'))
            sessionStorage.setItem('startsearchsetting','artist');
          if ($this.hasClass('song'))
            sessionStorage.setItem('startsearchsetting','song');
        }
        document.location.href = '/echospot';
      }
      if (!$('#search:visible').length && !$this.hasClass('top'))
        UserAgent.changePage('#search');
      $('#permaheader').find('nav li a').removeClass('active');
      $this.addClass('active');
      if ($this.hasClass('artist'))
        $('#search-byartist').trigger('click');
      if ($this.hasClass('song'))
        $('#search-bysong').trigger('click');
      if ($this.hasClass('playlist'))
        $('#search-byplaylist').trigger('click');
      if ($this.hasClass('help'))
        document.location.href = '/echospot/help.html';
      if ($this.hasClass('top'))
      {
        UserAgent.changePage('#top');
      }
      else
        $('#top:visible').fadeOut(200); 
    }
    return false;
  });
  
  if ($('#help').length) return;
  // init top artists
  EchoCheck.fetchTopTerms(false,function(res)
  {
    Output.setOutputToPage($('#styles'));
    Output.addCheckboxesToPage(res.terms);
    // move results to form
    EventHandler.addsearchCheckboxFunctionality('styles');
    $('#styles .content fieldset').addClass('checkbox_container').insertAfter($('#styles_container'));
    $('#search-styles').on('click',function() { $('#styles_container').next().toggle(200); return false; });      

    EchoCheck.fetchTopTerms(true,function(res)
    {
      Output.setOutputToPage($('#moods'));
      Output.addCheckboxesToPage(res.terms);
      // move results to form
      EventHandler.addsearchCheckboxFunctionality('moods');
      $('#moods .content fieldset').addClass('checkbox_container').insertAfter($('#moods_container'));
      $('#search-moods').on('click',function() { $('#moods_container').next().toggle(200); return false; });
    });
  });

  // init playlist type changing to change primary field label
  $('#search-playlisttype').change(function() {
    var playlisttype = $(this).val();
    var primarylabel = $('#search-primary').siblings('label');
    if (playlisttype == 'artistdescription')
      primarylabel.text('Artist description');
    else if (playlisttype == 'songradio')
      primarylabel.text('Spotify song URI(s)');
    else
      primarylabel.text('Artist name(s)/URI(s)');
  });

  // init sliders
  $('#slider-search-variety').slider(
  {
    value: 1,
    min: 0,
    max: 3,
    step: 1,
    slide: function(e,ui)
    {
      var newvalue = '';
      switch (ui.value)
      {
        case 0:
          newvalue = "Low";
          break;
        case 1:
          newvalue = "Average";
          break;
        case 2:
          newvalue = "High";
          break;
        case 3:
          newvalue = "Very High";
          break;
      }
      $('#search-variety').val(newvalue);
    }
  });

  $('#slider-search-hotness,#slider-search-songhotness').slider(
  {
    range: true,
    values: [0, 3],
    min: 0,
    max: 3,
    step: 1,
    slide: function(e,ui)
    {
      var newvalue = '';
      var min = ui.values[0];
      var max = ui.values[1];
      if (min == 0) newvalue = 'Low -';
      if (min == 1) newvalue = 'Average -';
      if (min == 2) newvalue = 'Hot -';
      if (min == 3) newvalue = 'Super Hot -';
      if (max == 0) newvalue = 'Low';
      if (max == 1) newvalue += ' Average'; 
      if (max == 2) newvalue += ' Hot';
      if (max == 3) newvalue += ' Super Hot';
      if (min == max)
      {
        if (min == 3)
          newvalue = 'Super Hot';
        else
          newvalue = newvalue.match(/\w+/);
      }
      if (min == 0 && max == 3)
        newvalue = 'Low - Super Hot';
      $(this).siblings('input').val(newvalue);
    }
  });

  $('#slider-search-familiarity').slider(
  {
    range: true,
    values: [0, 2],
    min: 0,
    max: 2,
    step: 1,
    slide: function(e,ui)
    {
      var newvalue = '';
      var min = ui.values[0];
      var max = ui.values[1];
      if (min == 0) newvalue = 'Obscure -';
      if (min == 1) newvalue = 'Semi-familiar -';
      if (min == 2) newvalue = 'Well known';
      if (max == 0) newvalue = 'Obscure';
      if (max == 1) newvalue += ' Semi-familiar'; 
      if (max == 2) newvalue += ' Well known';
      if (min == max)
      {
        if (min == 1)
          newvalue = 'Semi-familiar';
        if (min == 2)
          newvalue = 'Well known';
      } 
      if (min == 0 && max == 2)
        newvalue = 'Obscure - Well Known';
      $(this).siblings('input').val(newvalue);
    }
  });

  $('#slider-search-energy').slider(
  {
    range: true,
    values: [0, 2],
    min: 0,
    max: 2,
    step: 1,
    slide: function(e,ui)
    {
      var newvalue = '';
      var min = ui.values[0];
      var max = ui.values[1];
      if (min == 0) newvalue = 'Relaxed -';
      if (min == 1) newvalue = 'Average -';
      if (min == 2) newvalue = 'High';
      if (max == 0) newvalue = 'Relaxed';
      if (max == 1) newvalue += ' Average'; 
      if (max == 2) newvalue += ' High';
      if (min == max)
      {
        if (min == 1)
          newvalue = 'Average';
        if (min == 2)
          newvalue = 'High';
      } 
      if (min == 0 && max == 2)
        newvalue = 'Relaxed - High';
      $(this).siblings('input').val(newvalue);
    }
  });

  $('#slider-search-danceability').slider(
  {
    range: true,
    values: [0, 2],
    min: 0,
    max: 2,
    step: 1,
    slide: function(e,ui)
    {
      var newvalue = '';
      var min = ui.values[0];
      var max = ui.values[1];
      if (min == 0) newvalue = 'Low -';
      if (min == 1) newvalue = 'Average -';
      if (min == 2) newvalue = 'High';
      if (max == 0) newvalue = 'Low';
      if (max == 1) newvalue += ' Average'; 
      if (max == 2) newvalue += ' High';
      if (min == max)
      {
        if (min == 1)
          newvalue = 'Average';
        if (min == 2)
          newvalue = 'High';
      } 
      if (min == 0 && max == 2)
        newvalue = 'Low - High';
      $(this).siblings('input').val(newvalue);
    }
  });


  // init search terms
  $('#search').find('#search-byartist,#search-bysong').on('click',function()
  {
    $('#search').find('.playlistonly').addClass('inactive');
    $('#search').find('.hideonplaylist').removeClass('inactive');
    if ($(this).attr('id') == 'search-bysong')
      $('#search-primary').siblings('label').text('Find artist/track');
    else
      $('#search-primary').siblings('label').text('Find artist');
    if ($(this).attr('id') == 'search-bysong')
      $('#search-hotness').siblings('label').text('Song hotness');
    else
      $('#search-hotness').siblings('label').text('Artist hotness');
    if (Modernizr.sessionstorage)
      sessionStorage.setItem('startsearchsetting',$(this).attr('id').replace('search-by',''));
  });

  $('#search').find('#search-byplaylist').on('click',function()
  {
    $('#search').find('.playlistonly').removeClass('inactive');
    $('#search').find('.hideonplaylist').addClass('inactive');
    $('#search-playlisttype').trigger('change');
    $('#search-hotness').siblings('label').text('Artist hotness');
    if (Modernizr.sessionstorage)
      sessionStorage.setItem('startsearchsetting','playlist');
  });

  $('#search').find('input.reset').on('click',function()
  {
    $('#search-primary,#search-terms').removeClass('error').siblings('.errorlabel').remove();
    $('#search-primary').val('');
    Output.clearCheckboxesPage('styles');
    Output.clearCheckboxesPage('moods');
    $('#search-startyear')[0].selectedIndex = 0;
    $('#search-endyear')[0].selectedIndex = 0;
    $('#search-terms').val('');
    $('#search-variety').val('Average');
    $('#slider-search-variety').slider('value',1);
    $('#search-playlisttype')[0].selectedIndex = 0;
    $('#search-playlisttype').trigger('change');
    $('#search-hotness').val('Low - Super Hot');
    $('#slider-search-hotness').slider('values',[0,3]);
    $('#search-songhotness').val('Low - Super Hot');
    $('#slider-search-songhotness').slider('values',[0,3]);
    $('#search-familiarity').val('Obscure - Well Known');
    $('#slider-search-familiarity').slider('values',[0,2]);
    $('#search-energy').val('Relaxed - High');
    $('#slider-search-energy').slider('values',[0,2]);
    $('#search-danceability').val('Low - High');
    $('#slider-search-danceability').slider('values',[0,2]);
    $('#search-mintempo').val('');
    $('#search-maxtempo').val('');
    $('#search-results')[0].selectedIndex = 1;
    $('#search-sortby')[0].selectedIndex = 0;
    $('#search-sortbyplaylist')[0].selectedIndex = 0;
  });

  if (Modernizr.sessionstorage)
  {
    var advancedsettings = localStorage.getItem('startadvancedsettings');
    if (advancedsettings == 1)
    {
      $('.advanced-options').removeClass('inactive');
      $('#search').find('input.options').val('Less Options');
    }
  }

  $('#search').find('input.options').on('click',function()
  {
    var options = $('.advanced-options');
    if (options.hasClass('inactive'))
      $(this).val('Less Options');
    else
      $(this).val('More Options');

    options.toggleClass('inactive');
    if (Modernizr.sessionstorage)
    {
      if ($('.advanced-options').hasClass('inactive'))
        localStorage.setItem('startadvancedsettings',0);
      else
        localStorage.setItem('startadvancedsettings',1);
    }
  });
  
  $('#search').find('input.submit').on('click',function()
  {
    var searchpage = $('#search');
    var mode = 'artist';
    mode = $.trim($('#permaheader .active').attr('class').replace('active',''));

    var options = {};
    if (mode == 'song')
    {
      options.combined = jQuery.trim($('#search-primary').val());
    }
    else
    {
      options.primary = jQuery.trim($('#search-primary').val());
    }
    // simple error checking
    $('#search-primary,#search-terms').removeClass('error').siblings('.errorlabel').remove();
    if (mode != 'artist')
    {
      var checkitem = '#search-primary';
      if (!$.trim($(checkitem).val()).length)
      {
        $(checkitem).addClass('error').focus().after('<p class="errorlabel">Required field</p>');
        return;
      }
    }
    else
    {
      if (!$.trim($('#search-primary').val()).length && !$.trim($('#search-terms').val()).length)
      {
        $('#search-primary,#search-terms').addClass('error').focus().after('<p class="errorlabel">Required field - artist or term</p>');
        return;
      } 
    }
    Output.setOutputToPage($('#search_results'));
    if (mode == 'playlist')
      $('#clip_content').show();
    else
      $('#clip_content').hide();
    $('#permaheader nav a').removeClass('active');
    $('#search_results').addClass('loading');
    var existingresults;
    existingresults = Output.content.children();
    if (existingresults.length)
    {
      existingresults.remove();
    }
    else
      EventHandler.addArtistMenusFunctionality(Output.content);
    UserAgent.changePage('#search_results');
    
    options.styles = $('#search-styles').text().replace('-','');
    options.moods = $('#search-moods').text().replace('-','');
    options.startyear = $('#search-startyear').val();
    if (options.startyear == 'Start Year')
      options.startyear = null;
    else
      options.startyear = parseInt(options.startyear,10);
    if (options.startyear == 2012)
      options.staryear = 'present'; 
    options.endyear = $('#search-endyear').val();
    if (options.endyear == 'End Year')
      options.endyear = null;
    else
      options.endyear = parseInt(options.endyear,10);
    options.description = jQuery.trim($('#search-terms').val());
    var hotness = $('#search-hotness').val().toLowerCase();
    options.hotnessmin = 0;
    options.hotnessmax = 1;
    if (hotness.indexOf('low') == 0)
    {
      options.hotnessmin = 0;
      options.hotnessmax = 0.4;
    }
    if (hotness.indexOf('average') == 0)
    {
      options.hotnessmin = 0.4;
      options.hotnessmax = 0.5;
    }
    if (hotness.indexOf('hot') == 0)
    {
      options.hotnessmin = 0.5;
      options.hotnessmax = 0.7;
    }
    if (hotness.indexOf('super hot') == 0)
    {
      options.hotnessmin = 0.7;
      options.hotnessmax = 1;
    }
    if (hotness.indexOf('- average') > -1)
      options.hotnessmax = 0.5;
    if (hotness.indexOf('- hot') > -1)
      options.hotnessmax = 0.7;
    if (hotness.indexOf('- super hot') > -1)
      options.hotnessmax = 1;

    var familiarity = $('#search-familiarity').val().toLowerCase();
    options.familiaritymin = 0;
    options.familiaritymax = 1;
    if (familiarity.indexOf('obscure') == 0)
    {
      options.familiaritymin = 0;
      options.familiaritymax = 0.7;
    }
    if (familiarity.indexOf('semi-familiar') == 0)
    {
      options.familiaritymin = 0.7;
      options.familiaritymax = 0.8;
    }
    if (familiarity.indexOf('well known') == 0)
    {
      options.familiaritymin = 0.8;
      options.familiaritymax = 1;
    }
    if (familiarity.indexOf('- semi-familiar') > -1)
      options.familiaritymax = 0.8;
    if (familiarity.indexOf('- well known') > -1)
      options.familiaritymax = 1;

    options.results = $('#search-results').val();
    options.sortby = $('#search-sortby').val();
    if (mode == 'song')
    {
      if (options.sortby == 'hotness')
        options.sortby = 'song_hotttnesss-desc';
      else
        options.sortby = 'artist_familiarity-desc';
    }
    else if (mode == 'artist')
    {
      if (options.sortby == 'hotness')
        options.sortby = 'hotttnesss-desc';
      else
        options.sortby = 'familiarity-desc';  
    }
    else
      delete options.sortby;
    if (mode == 'playlist')
    {
      options.playlisttype = $('#search-playlisttype').val();
      var variety = $('#search-variety').val().toLowerCase();
      options.variety = 0.4;
      options.distribution = 'focused';
      if (variety == 'very high')
      {
        options.variety = 1;
        options.distribution = 'wandering';
      }
      if (variety == 'high')
      {
        options.variety = 0.4;
        options.distribution = 'wandering';
      }
      if (variety == 'average')
      {
        options.variety = 0.4;
      }
      if (variety == 'low')
      {
        options.variety = 0.1;
      }

      options.mintempo = $('#search-mintempo').val();
      options.maxtempo = $('#search-maxtempo').val();

      var songhotness = $('#search-songhotness').val().toLowerCase();
      options.songhotnessmin = 0;
      options.songhotnessmax = 1;
      if (songhotness.indexOf('low') == 0)
      {
        options.songhotnessmin = 0;
        options.songhotnessmax = 0.4;
      }
      if (songhotness.indexOf('average') == 0)
      {
        options.songhotnessmin = 0.4;
        options.songhotnessmax = 0.5;
      }
      if (songhotness.indexOf('hot') == 0)
      {
        options.songhotnessmin = 0.5;
        options.songhotnessmax = 0.7;
      }
      if (songhotness.indexOf('super hot') == 0)
      {
        options.songhotnessmin = 0.7;
        options.songhotnessmax = 1;
      }
      if (songhotness.indexOf('- average') > -1)
        options.songhotnessmax = 0.5;
      if (songhotness.indexOf('- hot') > -1)
        options.songhotnessmax = 0.7;
      if (songhotness.indexOf('- super hot') > -1)
        options.songhotnessmax = 1;

      var energy = $('#search-energy').val().toLowerCase();
      options.energymin = 0;
      options.energymax = 1;
      if (energy.indexOf('relaxed') == 0)
      {
        options.energymin = 0;
        options.energymax = 0.4;
      }
      if (energy.indexOf('average') == 0)
      {
        options.energymin = 0.4;
        options.energymax = 0.6;
      }
      if (energy.indexOf('high') == 0)
      {
        options.energymin = 0.6;
        options.energymax = 1;
      }
      if (energy.indexOf('- average') > -1)
        options.energymax = 0.6;
      if (energy.indexOf('- high') > -1)
        options.energymax = 1;

      var danceability = $('#search-danceability').val().toLowerCase();
      options.danceabilitymin = 0;
      options.danceabilitymax = 1;
      if (danceability.indexOf('low') == 0)
      {
        options.danceabilitymin = 0;
        options.danceabilitymax = 0.3;
      }
      if (danceability.indexOf('average') == 0)
      {
        options.danceabilitymin = 0.3;
        options.danceabilitymax = 0.58;
      }
      if (danceability.indexOf('high') == 0)
      {
        options.danceabilitymin = 0.58;
        options.danceabilitymax = 1;
      }
      if (danceability.indexOf('- average') > -1)
        options.danceabilitymax = 0.58;
      if (danceability.indexOf('- high') > -1)
        options.danceabilitymax = 1;


      options.sortbyplaylist = $('#search-sortbyplaylist').val();
    }
    EventHandler.addArtistMenusFunctionality(Output.content);
    EchoCheck.powerSearch(mode,options,function(res)
    {
      $('#search_results').removeClass('loading');
      $('#permaheader').find('.csv_container,.spot_container').addClass('active');
      if (mode == 'artist')
      {
        Output.addArtistsToPage(res.artists,$('#search-sortby').val());
        if (!res.artists.length)
        {
          Output.saveArtistRow('No artists found');
          Output.addContentRows();
        } 
      }
      else if (mode == 'song' || mode == 'playlist')
      {
        
        if (!res.songs.length)
        {
          Output.saveSongRow('No songs found');
          Output.addContentRows();
        }
        else
        {
          if (mode == 'song')
            Output.addSongsToPage(res.songs,$('#search-sortby').val());
          else
            Output.addSongsToPage(res.songs,$('#search-sortbyplaylist').val(),options);
        }
      }
      Output.content.trigger('create');
      $('#permafooter').show();
      $('#clip_content').css('visibility','visible');
    });
  });

  $('#search-primary').on('keypress',function(e)
  {
    if (e.keyCode == 13 && !e.ctrlKey && !e.shiftKey && !e.altKey)
      $('#search').find('input.submit').trigger('click');
  });

  // auto select mode based on initial href
  if (Modernizr.sessionstorage && !$('#help').length)
  {
    var startsetting = sessionStorage.getItem('startsearchsetting');
    if (startsetting == 'song')
    {
      $('#search-byartist').prop('checked',false);
      $('#search-bysong').trigger('click').prop('checked',true);
      $('#permaheader').find('nav li a').removeClass('active');
      $('#permaheader a.song').addClass('active');
    }
    if (startsetting == 'playlist')
    {
      $('#search-byartist').prop('checked',false);
      $('#search-byplaylist').trigger('click').prop('checked',true);
      $('#permaheader').find('nav li a').removeClass('active');
      $('#permaheader a.playlist').addClass('active');
    }
    if (startsetting == 'artist')
    {
      $('#search-byartist').trigger('click').prop('checked',true);
      $('#permaheader').find('nav li a').removeClass('active');
      $('#permaheader a.artist').addClass('active');
    }
  }
  

  // add styles functionality
  EventHandler.addsearchCheckboxFunctionality('styles');
  
  // add moods functionality
  EventHandler.addsearchCheckboxFunctionality('moods');

  Output.setOutputToPage($('#top'));
  // have extra JQuery based animation for collapsible menus, add on demand terms and related items
  EventHandler.addArtistMenusFunctionality(Output.content);

  // fetch artists from echonest
  EchoCheck.fetchTopHotArtists(40,function(res)
  {
    Output.setOutputToPage($('#top'));
    Output.addArtistsToPage(res.artists);
    Output.content.trigger('create');
  });
});

EchoCheck = {
  api: 'PWNYOEPUNHQTGZLHY',
  base: 'http://developer.echonest.com/api/v4/',
  callJSON: function(url,inputdata,callback)
  {
    $.ajax({
      url: url,
      dataType: 'json',
      data: inputdata,
      success: function(data)
      {
        if (EchoCheck.checkResponse(data))
        {
          if (typeof callback == 'function')
            callback(data.response);
        }
      },
      error: function(res,status)
      {
        if (Output.currentId == 'search_results')
        {
          $('#search_results').removeClass('loading');
          Output.saveArtistRow('Unexpected error from server.');
          Output.addContentRows();
        }
        else
        {
          Output.setOutputToPage($('#search_results'));
          $('#search_results').removeClass('loading');
          Output.saveArtistRow('Unexpected error from server.');
          Output.addContentRows();
          $('#clip_content').hide();
          UserAgent.changePage('#search_results');
        }       
      },
      timeout: 4000
    });
  },
  checkResponse: function(data)
  {
    if (data.response) 
    {
      if (data.response.status.code !== 0) 
      {
        if (Output.currentId == 'search_results')
        {
          $('#search_results').removeClass('loading');
          Output.saveArtistRow('Unexpected error from server. ' + data.response.status.message);
          Output.addContentRows();
        }
        else
        {
          Output.setOutputToPage($('#search_results'));
          $('#search_results').removeClass('loading');
          Output.saveArtistRow('Unexpected error from server. ' + data.response.status.message);
          Output.addContentRows();
          $('#clip_content').hide();
          UserAgent.changePage('#search_results');
        }
      } 
      else 
      {
        return true;
      }
    } 
    else 
    {
      if (Output.currentId == 'search_results')
      {
        Output.saveArtistRow('Unexpected error from server.');
        Output.addContentRows();
      }
      else
      {
        Output.setOutputToPage($('#search_results'));
        Output.saveArtistRow('Unexpected error from server. ' + data.response.status.message);
        Output.addContentRows();
        $('#clip_content').hide();
        UserAgent.changePage('#search_results');
      }
    }
    return false; 
  },
  findRelatedArtists: function(artistnameorid,namemode,callback)
  {
    if (typeof artistnameorid != 'string') return;
    var url = this.base + 'artist/similar?callback=?&bucket=id:spotify-WW&bucket=hotttnesss&bucket=familiarity&bucket=terms';
    var inputdata = {'format':'jsonp','api_key':this.api,'limit':true,'start':0,'results':30};
    if (namemode)
      inputdata.name = artistnameorid;
    else
      inputdata.id = artistnameorid;
    this.callJSON(url,inputdata,callback);
  },
  fetchTopTerms: function(findmood,callback)
  {
    if (typeof findmood != 'boolean' && typeof findmood != 'undefined') return;
    var url = this.base + 'artist/list_terms?callback=?';
    var searchtype = (findmood) ? 'mood' : 'style';
    this.callJSON(url,{'format':'jsonp','api_key':this.api,'type':searchtype},callback);
  },
  fetchTopHotArtists: function(results,callback)
  {
    if (typeof results != 'number') return;
    var url = this.base + 'artist/top_hottt?callback=?&bucket=id:spotify-WW&bucket=hotttnesss&bucket=familiarity&bucket=terms';
    this.callJSON(url,{'format':'jsonp','api_key':this.api,'limit':true,'results': results},callback);
  },
  powerSearch: function(mode,options,callback)
  {
    if (typeof mode != 'string' || typeof options != 'object') return;
    var url = this.base + 'artist/search?callback=?&bucket=id:spotify-WW&bucket=hotttnesss&bucket=familiarity&bucket=terms';
    if (mode == 'song')
      url = this.base + 'song/search?callback=?&bucket=id:spotify-WW&bucket=tracks&bucket=song_hotttnesss&bucket=artist_hotttnesss&bucket=audio_summary&bucket=artist_familiarity';
    else if (mode == 'playlist')
    {
      url = this.base + 'playlist/static?callback=?&bucket=id:spotify-WW&bucket=tracks&bucket=song_hotttnesss&bucket=artist_hotttnesss&bucket=audio_summary&bucket=artist_familiarity';
      if (options.primary && options.playlisttype && options.playlisttype == 'artistdescription')
      {
        var items = options.primary.split(',');
        for (var i = 0; i < items.length; i++)
        {
          url += '&description=' + jQuery.trim(items[i]);
        }
      }
      else if (options.primary && options.playlisttype && (options.playlisttype == 'artistradio' || options.playlisttype == 'artist' || options.playlisttype == 'songradio'))
      {
        var items2 = options.primary.split(',');
        for (var j = 0; j < items2.length; j++)
        {
          // check if item is direct spotify reference, if so add to artist_id or track_id
          if (items2[j].indexOf('spotify:artist') > -1)
            url += '&artist_id=spotify-WW:' + jQuery.trim(items2[j].replace('spotify:',''));
          else 
          {
            if (items2[j].indexOf('spotify:track') > -1)
              url += '&track_id=spotify-WW:' + jQuery.trim(items2[j].replace('spotify:',''));
            else
              url += '&artist=' + jQuery.trim(items2[j]);
          }
        }
      }
    }
    var inputdata = {'format':'jsonp','api_key':this.api,'sort':'hotttnesss-desc','limit':true,results:50,min_hotttnesss:0.1};
    if (options.primary && mode == 'artist')
    {
      delete inputdata.min_hotttnesss;
      inputdata.name = options.primary;
    }
    else {
      if (mode == 'song' && options.combined)
        inputdata.combined = options.combined;
      if (options.styles)
        inputdata.style = options.styles;
      if (options.moods)
        inputdata.mood = options.moods;
      if (options.description && mode != 'playlist')
        inputdata.description = options.description;
      if (mode == 'song')
      {
        delete inputdata.min_hotttnesss;
        if (options.hotnessmin || options.hotnessmin === 0)
          inputdata.song_min_hotttnesss = options.hotnessmin;
        if (options.hotnessmax)
          inputdata.song_max_hotttnesss = options.hotnessmax;
      }
      else if (mode == 'playlist')
      {
        delete inputdata.min_hotttnesss;
        if (options.hotnessmin || options.hotnessmin === 0)
          inputdata.artist_min_hotttnesss = options.hotnessmin;
        if (options.hotnessmax)
          inputdata.artist_max_hotttnesss = options.hotnessmax;
      }
      else
      {
        if (options.hotnessmin || options.hotnessmin === 0)
          inputdata.min_hotttnesss = options.hotnessmin;
        if (options.hotnessmax)
          inputdata.max_hotttnesss = options.hotnessmax;    
      }
      if (mode == 'song' || mode == 'playlist')
      {
        if (options.familiaritymin || options.familiaritymin === 0)
          inputdata.artist_min_familiarity = options.familiaritymin;
        if (options.familiaritymax)
          inputdata.artist_max_familiarity = options.familiaritymax;          
      }
      else
      {
        if (options.familiaritymin || options.familiaritymin === 0)
          inputdata.min_familiarity = options.familiaritymin;
        if (options.familiaritymax)
          inputdata.max_familiarity = options.familiaritymax;       
      }
      if (options.startyear)
      {
        inputdata.artist_end_year_after = options.startyear+1;
        if (options.startyear == 2012)
          inputdata.artist_end_year_after = 'present';
      }
      if (options.endyear)
      {
        inputdata.artist_start_year_before = options.endyear+1;
        if (options.endyear == 2012)
          inputdata.artist_start_year_before = 'present';
      }
      if (mode == 'song')
      {
        inputdata.sort = 'song_hotttnesss-desc';          
      }
      if (options.sortby)
        inputdata.sort = options.sortby;
      if (options.results)
        inputdata.results = options.results;
      if (mode == 'playlist')
      {
        delete inputdata.sort;
        if (options.playlisttype && options.playlisttype == 'artistdescription')
        {
          delete inputdata.artist;
          inputdata.type = 'artist-description';
        }
        else
        {
          delete inputdata.description;
          if (options.playlisttype == 'songradio')
            inputdata.type = 'song-radio';
          else
          {
            if (options.playlisttype == 'artist')
              inputdata.type = 'artist';
            else
              inputdata.type = 'artist-radio';
          }
        }
        if (options.variety)
          inputdata.variety = options.variety;
        if (options.mintempo)
          inputdata.min_tempo = options.mintempo;
        if (options.maxtempo)
          inputdata.max_tempo = options.maxtempo;
        if (options.distribution)
          inputdata.distribution = options.distribution;
        if (options.songhotnessmin || options.songhotnessmin === 0)
          inputdata.song_min_hotttnesss = options.songhotnessmin;
        if (options.songhotnessmax)
          inputdata.song_max_hotttnesss = options.songhotnessmax;
        if (options.energymin || options.energymin === 0)
          inputdata.min_energy = options.energymin;
        if (options.energymax)
          inputdata.max_energy = options.energymax;
        if (options.danceabilitymin || options.danceabilitymin === 0)
          inputdata.min_danceability = options.danceabilitymin;
        if (options.danceabilitymax)
          inputdata.max_danceability = options.danceabilitymax;
        if (options.sortbyplaylist && options.sortbyplaylist != "random")
          inputdata.sort = options.sortbyplaylist;
      }
    }
    this.callJSON(url,inputdata,callback);
  }   
};

Output = {
  artistDetail: {},
  clipboard: null,
  colorSpectrumLength: 10,
  colorSpectrumIndex: 0,
  content: null,
  contentId: '',
  contentRows: [],
  contentSongLinkRows: [],
  footerContent: '<div class="footer"><div><ul>' +
          '<li><a class="search" href="#search">Search</a></li>' +
          '<li><a class="top" href="#top">Top</a></li>' +
          '</ul></div></div>',   
  plainTextContentRows: [],
  songDetail: {},
  addRow: function(text)
  {
    this.content.append('<div><h3>' + text + '</h3></div>').trigger('create');
    this.colorSpectrumLengthIndex++;
  },
  // takes currently cached rows of content (artists or songs), dumps all into content area at once
  addContentRows: function(content)
  {
    if (!content)
      this.content.append(this.contentRows.join('')).trigger('create');
    else
      content.append(this.contentRows.join('')).trigger('create');
    this.contentRows = [];
  },
  addArtistsToPage: function(artists,sortmethod)
  {
    for (var i = 0; i < artists.length; i++)
    {
      var currartist = artists[i];
      var existingdetail = Output.artistDetail[currartist.name];
      if (typeof existingdetail == 'undefined')
      {
        Output.artistDetail[currartist.name] = {echoid:currartist.id,spotlink:null,terms:null};
        existingdetail = Output.artistDetail[currartist.name];
      }
      else
        existingdetail.echoid = currartist.id;
      existingdetail[this.contentId + '_order'] = i;
      var currterms = [];
      for (var j = 0; j < currartist.terms.length; j++)
        currterms.push(currartist.terms[j].name);
      existingdetail.terms = currterms;
      var spotlink = '#';
      if (typeof currartist.foreign_ids == 'object' && typeof currartist.foreign_ids[0] == 'object')
        spotlink = 'spotify://' + currartist.foreign_ids[0].foreign_id.replace('spotify-WW:','');
      Output.saveArtistRow(currartist.name,currartist.hotttnesss,currartist.familiarity,currterms,spotlink);
    }
    if (typeof sortmethod == 'string')
      Output.sortOutput(sortmethod,false);
    Output.addContentRows();
  },
  addCheckboxesToPage: function(checkboxitems)
  {
    var fieldcontainer = Output.content.find('fieldset');
    if (!fieldcontainer.length) return;
    var optionstext = '';
    for (var i = 0; i < checkboxitems.length; i++)
    {
      var name = checkboxitems[i].name.replace(/(\s)+/,'_');
      optionstext += '<input type="checkbox" name="style-' + name + '" id="style-' + name + '" class="custom" />';
      optionstext += '<label for="style-' + name + '">' + checkboxitems[i].name + '</label>';
    }
    fieldcontainer.append(optionstext); 
    Output.content.trigger('create');
  },
  addNewPage: function(id,headertext,newclass)
  {
    if (typeof id != 'string' || typeof headertext != 'string') return;
    id = id.replace(/\s+/g,'_');
    var emptypagetext = '<div class="page" id="' + id + '" class="' + newclass + '"><div class="header"><h2>' + headertext + 
              '</h2></div><div class="content"></div>';
    $('#permafooter').before(emptypagetext);
  },
  addSongsToPage: function(songs,sortmethod,limits)
  {
    for (var i = 0; i < songs.length; i++)
    {
      var currsong = songs[i];
      var existingdetail = Output.songDetail[currsong.title];
      if (typeof existingdetail == 'undefined')
      {
        Output.songDetail[currsong.title] = {echoartistid:currsong.artist_id,echosongid:currsong.id,spotlink:null};
        existingdetail = Output.songDetail[currsong.title];
      }
      else
      {
        existingdetail.id = currsong.id;
        existingdetail.artist_id = currsong.artist_id;
      }
      existingdetail[this.contentId + '_order'] = i;
      var spotlink = '#';
      if (typeof currsong.tracks == 'object' && typeof currsong.tracks[0] == 'object')
        spotlink = 'spotify://' + currsong.tracks[0].foreign_id.replace('spotify-WW:','');
      if (typeof limits != 'object' || Output.filterOutput(currsong,limits))
        Output.saveSongRow(currsong.title,currsong.artist_name,currsong.song_hotttnesss,currsong.artist_hotttnesss,currsong.artist_familiarity,currsong.audio_summary.danceability,currsong.audio_summary.energy,currsong.audio_summary.tempo,spotlink);
    }
    if (typeof sortmethod == 'string' && sortmethod != 'random')
      Output.sortOutput(sortmethod,true);
    Output.addContentRows();
    if (UserAgent.miniWidth)
    {
      $('#search_results').click(function(e) {
        e.preventDefault();
        if (e.target.tagName == 'H3')
        {
          var spotifylink = $(e.target).siblings('ul').find('a');         
          if (spotifylink.length)
            document.location.href = spotifylink.attr('href');
        }
      });
    }  
  },
  // note artist position is zero indexed
  addSpotifyLinkToArtistRow: function(link,artistpos)
  {
    var artistrow = this.content.children().eq(artistpos);
    if (!artistrow.length) return;
    var list;
    list = artistrow.find('ul');
    list.prepend('<li><a href="' + link + '>Spotify Link</a></li>').trigger('create');
  },
  addSpotifyLinkToSongRow: function(link,songpos)
  {
    var songrow = this.content.children().eq(songpos);
    if (!songrow.length) return;
    var list;
    list = songrow.find('ul');
    list.prepend('<li><a href="' + link + '>Spotify Link</a></li>').trigger('create');
  },
  clearCheckboxesPage: function(pageid)
  {
    var checkeditems2 = $('#search').find('input').filter(':checked');
    checkeditems2.prop('checked',false);
    $('#search-' + pageid).text('-');
  },
  saveArtistRow: function(name,hotness,familiarity,terms,spotifylink)
  {
    var artistrowtext;
    // header
    artistrowtext = '<div class="artistrow"><h3>' + name + '</h3>';
    this.colorSpectrumIndex++;
    // row details
    if (typeof hotness == 'undefined')
    {
      artistrowtext += '</div>';
    }
    else
    {
      artistrowtext += '<ul>';
      if (UserAgent.miniWidth)
        artistrowtext += '<li><a href="' + spotifylink + '">Spotify Link</a></li><li>H: ' + Math.round(hotness*100) + '%</li><li>F: ' + Math.round(familiarity*100) + '%</li>';
      else
        artistrowtext += '<li><a href="' + spotifylink + '">Spotify Link</a></li><li>Hotness: ' + Math.round(hotness*100) + '%</li><li>Familiarity: ' + Math.round(familiarity*100) + '%</li>';
      this.artistDetail[name].terms = terms;
      artistrowtext += '</ul></div>';
    }
    this.contentRows.push(artistrowtext);
    this.plainTextContentRows.push('"' + name + '"');
  },
  saveSongRow: function(title,artistname,songhotness,artisthotness,artistfamiliarity,danceability,energy,tempo,spotifylink)
  {
    var songrowtext;
    // header
    var currcolor = Math.floor(this.colorSpectrumIndex / this.colorSpectrumLength) % 2 ? (this.colorSpectrumIndex % this.colorSpectrumLength) : this.colorSpectrumLength - (this.colorSpectrumIndex % this.colorSpectrumLength);
    if (typeof artistname == 'undefined')
      songrowtext = '<div class="songrow"><h3>' + title + '</h3>';
    else
      songrowtext = '<div class="songrow"><h3>' + title + ' - ' + artistname + '</h3>';
    this.colorSpectrumIndex++;
    // row details
    if (typeof artistname == 'undefined')
    {
      songrowtext += '</div>';
    }
    else
    {
      songrowtext += '<ul>';
      songrowtext += '<li><a href="' + spotifylink + '">Spotify Link</a></li>';
      songrowtext += '<li>SH: ' + Math.round(songhotness*100) + '%</li><li>AH: ' + Math.round(artisthotness*100) + '%</li>';
      songrowtext += '<li>AF: ' + Math.round(artistfamiliarity*100) + '%</li><li>D: ' + Math.round(danceability*100) + '%</li>';
      if (!UserAgent.miniWidth)
        songrowtext += '<li>E: ' + Math.round(energy*100) + '%</li><li class="last">T: ' + tempo + '</li>';
      songrowtext += '</ul></div>';
    }
    this.contentRows.push(songrowtext);
    this.plainTextContentRows.push('"' + title + '","' + artistname + '"');
    this.contentSongLinkRows.push(spotifylink);
  },
  // changes all focus of the output factory to this new page object element
  setOutputToPage: function(page)
  {
    if (typeof page != 'object') return;
    var newcontent = $(page).find('.content');
    if (!newcontent.length) return;
    this.contentId = page.attr('id');
    this.contentRows = [];
    this.contentSongLinkRows = [];
    if (page.attr('id') == 'search_results')
    {
      if (Modernizr.sessionstorage && sessionStorage.getItem('startsearchsetting') == 'artist')
        this.plainTextContentRows = ['"Artist"'];
      else if (Modernizr.sessionstorage && sessionStorage.getItem('startsearchsetting') == 'song')
        this.plainTextContentRows = ['"Song"'];
      else
        this.plainTextContentRows = ['"Song","Artist"'];
    }
    else
      this.plainTextContentRows = ['"Artist"'];
    this.content = newcontent;
    this.colorSpectrumIndex = 0;
  },
  filterOutput: function(item,limits)
  {
    return ((item.artist_familiarity >= limits.familiaritymin) &&
            (item.artist_familiarity <= limits.familiaritymax) &&
            (item.artist_hotttnesss >= limits.hotnessmin) &&
            (item.artist_hotttnesss <= limits.hotnessmax) &&
            (item.audio_summary.danceability >= limits.danceabilitymin) &&
            (item.audio_summary.danceability <= limits.danceabilitymax) &&
            (item.audio_summary.energy >= limits.energymin) &&
            (item.audio_summary.energy <= limits.energymax) &&
            (limits.mintempo.length === 0 || item.audio_summary.tempo >= limits.mintempo) &&
            (limits.maxtempo.length === 0 || item.audio_summary.tempo <= limits.maxtempo) &&
            (item.song_hotttnesss >= limits.songhotnessmin) &&
            (item.song_hotttnesss <= limits.songhotnessmax));
  },
  sortOutput: function(sortvalue,songmode)
  {
    var sortdesc = true;
    if (songmode)
    {
      if (sortvalue.indexOf('asc') > -1)
        sortdesc = false;
      if (sortvalue.indexOf('song_hotttnesss') > -1 || sortvalue.indexOf('hotness') > -1)
        sortvalue = 'SH';
      if (sortvalue.indexOf('artist_hotttnesss') > -1)
        sortvalue = 'AH';
      if (sortvalue.indexOf('artist_familiarity') > -1 || sortvalue.indexOf('familiarity') > -1)
        sortvalue = 'AF';
      if (sortvalue.indexOf('tempo') > -1)
        sortvalue = 'T';
      if (sortvalue.indexOf('danceability') > -1)
        sortvalue = 'D';
      if (sortvalue.indexOf('energy') > -1)
        sortvalue = 'E';
    }
    var patt = new RegExp('>' + sortvalue + ': (\\d)+','i');
    Output.contentRows.sort(function(a,b)
    {
      var matcha = a.match(patt);
      var matchb = b.match(patt);
      if (!matcha || !matchb) return 1;
      var compa = parseFloat(matcha[0].match(/\d+/)[0],10);
      var compb = parseFloat(matchb[0].match(/\d+/)[0],10);
      return sortdesc ? compb - compa : compa - compb;
    });
    // recut plain text
    songmode = (Output.contentRows[0].match(/<h3>(.*)<\/h3>/)[1].indexOf('-') > -1);
    if (songmode)   
      Output.plainTextContentRows = ['Artist,Song'];
    else
      Output.plainTextContentRows = ['Artist'];
    Output.contentSongLinkRows = [];
    for (i = 0; i < Output.contentRows.length; i++)
    {
      var name = Output.contentRows[i].match(/<h3>(.*)<\/h3>/)[1];
      if (songmode)
      {
        var link = Output.contentRows[i].match(/<a href="(.*)">Spotify/)[1];
        var track = $.trim(name.match(/-(.*)/)[1]);
        var artist = $.trim(name.match(/-(.*)/)[1]);
        Output.plainTextContentRows.push('"' + track + '","' + artist + '"');
        Output.contentSongLinkRows.push(link);
      }
      else
      {
        Output.plainTextContentRows.push('"' + name + '"');
      }
    }
  }
};

EventHandler = {
  addArtistMenusFunctionality: function(content)
  {
    var targetevent = 'click';
    var target = '.ui-collapsible-heading a';
    targetevent = 'mouseover';
    target = 'div.artistrow,div.songrow';
    content.on(targetevent,target,function() 
    { 
      $this = $(this);
      if (!$this.find('a.terms_link:visible').length)
      {
        var content;
        content = $this;
        
        // dynamically insert terms, related items if it's not there
        if (!content.find('a.terms_link').length)
        {
          var lookupname;
          lookupname = jQuery.trim($this.find('h3').html().replace(/<span(.*)<\/span>/,''));
          var detail = Output.artistDetail[lookupname];
          if (typeof detail == 'object')
          {
            var listview;
            listview = content.find('ul');
            var listviewcontents = listview.html();
            var newlisttext = '<ul>' + listviewcontents + '<li><a class="terms_link" href="#">Terms</a></li>';
            newlisttext += '<li class="last"><a class="related_link" href="#">Related artists</a></li></ul>';
            listview.replaceWith(newlisttext);
            content.trigger('create');  
          }
          // clicking on the terms event handler 
          content.on('click','a.terms_link',function()
          {
            // check if page exists
            $('#permaheader').find('nav a.top').removeClass('active');
            var termspageid = lookupname.replace(/\s+/g,'') + '_terms';
            if (!$('#' + termspageid).length)
            {
              Output.addNewPage(termspageid,lookupname + ' terms','terms');
              Output.setOutputToPage($('#' + termspageid));
              var termstext = '<ul>';
              for (var i = 0; i < detail.terms.length; i++)
              {
                termstext += '<li class="termsrow"><a href="#search">' + detail.terms[i] + '</a></li>';
              }
              termstext += '</ul>';
              Output.content.append(termstext).trigger('create');
              UserAgent.changePage('#' + termspageid);
              $('#' + termspageid).on('click','a',function()
              {
                $('#search-terms').val(jQuery.trim($(this).text()));
                UserAgent.changePage('#search');
                $('#permaheader nav a.artist').trigger('click');
                return false;
              });
            }
            else
              UserAgent.changePage('#' + termspageid);
            return false;
          });
          // clicking on related link event handler
          content.on('click','a.related_link',function()
          {
            // check if page exists
            $('#permaheader').find('nav a.top').removeClass('active');
            var relatedartistpageid = lookupname.replace(/\s+/g,'') + '_related';
            if (!$('#' + relatedartistpageid).length)
            {
              Output.addNewPage(relatedartistpageid,lookupname + ' related artists','related');
              Output.setOutputToPage($('#' + relatedartistpageid));
              EventHandler.addArtistMenusFunctionality(Output.content);
              UserAgent.changePage('#' + relatedartistpageid);
              $('#' + relatedartistpageid).addClass('loading');
              $('#permafooter').css('visibility','hidden');
              EchoCheck.findRelatedArtists(detail.echoid,false,function(res)
              {
                Output.addArtistsToPage(res.artists);
                $('#permafooter').css('visibility','visible');
                $('#' + relatedartistpageid).removeClass('loading');
              });
              return false;
            }
            else
              UserAgent.changePage('#' + relatedartistpageid);             
          });
        }
        $this.find('a.terms_link,a.related_link').parent().show();
      }
    });
  },
  addsearchCheckboxFunctionality: function(pageid)
  {
    var fieldcontainer = $('#' + pageid).find('fieldset');
    if (!fieldcontainer.length) return;
    var target;
    target = 'label';
    fieldcontainer.find(target).click(function()
    {
      var checkedfield;
      checkedfield = $(this).prev().attr('name').replace('style-','').replace('_',' ');
      var textcontainer;
      textcontainer = $('#search-' + pageid);
      var text = jQuery.trim(textcontainer.text());
      if (this.checked || (!$(this).prev()[0].checked))
      {
        if (text == '-')
        {
          text = checkedfield;
        }
        else
          text += ', ' + checkedfield;
      }
      else
      {
        text = text.replace(', ' + checkedfield,'').replace(checkedfield + ',','').replace(checkedfield,'');
        if (text === '')
        {
          text = '-';
        }
      }
      textcontainer.text(text);
    });
  }
};




