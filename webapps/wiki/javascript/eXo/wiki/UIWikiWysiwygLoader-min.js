var xwe;eXo.wiki||(eXo.wiki={}); eXo.wiki.Wysiwyg||(eXo.wiki.Wysiwyg={readyState:0,onModuleLoadQueue:[],instances:{},load:function(){if(!(document.getElementById("xwe")||0!=this.readyState)){this.readyState=1;var a=document.createElement("script");a.type="text/javascript";a.src="/wiki/resources/js/xwiki/wysiwyg/xwe/xwe.nocache.js";var b=0,e=document.write,c=function(c){if(2>b){b++;eXo.wiki.Wysiwyg.maybeHookOnScriptLoad();if(!a.parentNode)return;var d=document.createElement("div");d.innerHTML=c.replace(/<script\b([\s\S]*?)<\/script>/gi,'<pre script="script"$1</pre>'); for(c=a.nextSibling;d.firstChild;){var f=d.firstChild;if("pre"==f.nodeName.toLowerCase()&&"script"==f.getAttribute("script")){var g=f;g.removeAttribute("script");for(var f=document.createElement("script"),i=0;i<g.attributes.length;i++){var h=g.attributes[i];("undefined"==typeof h.specified||"boolean"==typeof h.specified&&h.specified)&&f.setAttribute(h.nodeName,h.nodeValue)}f.text="undefined"==typeof g.innerText?g.textContent:g.innerText;d.removeChild(g)}c?a.parentNode.insertBefore(f,c):a.parentNode.appendChild(f)}}2<= b&&(document.write=e,b=a=e=void 0)},d=document.getElementsByTagName("head");0<d.length&&(document.write=c,d[0].appendChild(a))}},onModuleLoad:function(a,b){if("function"==typeof a)switch(this.readyState){case 0:b||this.load();case 1:this.onModuleLoadQueue.push(a);break;case 2:a()}},fireOnModuleLoad:function(){this.readyState=2;for(var a=0;a<this.onModuleLoadQueue.length;a++)this.onModuleLoadQueue[a]();this.onModuleLoadQueue=void 0},maybeHookOnScriptLoad:function(){if(xwe&&xwe.onScriptLoad){var a= xwe.onScriptLoad;xwe.onScriptLoad=function(){eXo.wiki.Wysiwyg.hookGwtOnLoad();a();xwe&&xwe.onScriptLoad&&(xwe.onScriptLoad=a);a=void 0};this.maybeHookOnScriptLoad=function(){}}},hookGwtOnLoad:function(){var a=document.getElementById("xwe"),b=a.contentWindow.gwtOnLoad;a.contentWindow.gwtOnLoad=function(e,c,d){b(function(){eXo.wiki.Wysiwyg.fireOnModuleLoad=function(){};"function"==typeof e&&e()},c,d);eXo.wiki.Wysiwyg.fireOnModuleLoad();a.contentWindow.gwtOnLoad=b;b=a=void 0};this.hookGwtOnLoad=function(){}}, getInstance:function(a){return this.instances[a]},getInstances:function(){return this.instances}}); eXo.wiki.Wysiwyg.onModuleLoad(function(){WysiwygEditor.prototype._beforeToggleFullScreen=function(a){a.memo.target.down(".gwt-RichTextArea")==this.getRichTextArea()&&(this._selectionRange=this.getSelectionRange(),this.getCommandManager().execute("enable","false"))};WysiwygEditor.prototype._afterToggleFullScreen=function(a){a.memo.target.down(".gwt-RichTextArea")==this.getRichTextArea()&&(this.getCommandManager().execute("enable","true"),this.setSelectionRange(this._selectionRange),setTimeout(function(){this.setFocus(!0)}.bind(this), 10))};var a=function(){a.base.constructor.apply(this,arguments);if(this.getRichTextArea()){for(var b=function(a){document.fire("xwiki:wysiwyg:"+a,{instance:this})},e=["loaded","showingSource","showSource","showingWysiwyg","showWysiwyg"],c=0;c<e.length;c++)this.addActionHandler(e[c],b.bind(this));document.observe("xwiki:fullscreen:enter",this._beforeToggleFullScreen.bindAsEventListener(this));document.observe("xwiki:fullscreen:entered",this._afterToggleFullScreen.bindAsEventListener(this));document.observe("xwiki:fullscreen:exit", this._beforeToggleFullScreen.bindAsEventListener(this));document.observe("xwiki:fullscreen:exited",this._afterToggleFullScreen.bindAsEventListener(this));document.fire("xwiki:wysiwyg:created",{instance:this});eXo.wiki.Wysiwyg.instances[this.getParameter("hookId")]=this}};a.prototype=new WysiwygEditor;a.base=WysiwygEditor.prototype;WysiwygEditor=a},!0);eXo.wiki.Wysiwyg.load();