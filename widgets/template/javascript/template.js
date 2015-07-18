goog.require('tools.MS_XMLHttpRequest');
goog.require('MSapi.tools.gup');
goog.require('ARapi.tools.systemInfo');
goog.require('graphic.maskPanel');
goog.require('ARapi.tools.xmlParser');
goog.require('ARapi.tools.AR_language');
goog.require('ARapi.tools.htmlEncodingUtils');
goog.require('ARapi.template.page');
goog.require('ARapi.template.request');
goog.require('ARapi.template.requestTypeEnums');
goog.require('ARapi.template.xmlParser');

/**@define {boolean} */var ENABLE_DEBUG = true;
/**@type {Controller}*/var ctrl;

var init = function()
{
	window["maskPanel"] = new maskTemplate();
	ctrl = new Controller();
	ctrl.checkAndUpdateT0Param("template");
	ctrl.requestAPI = new ARapi.template.request();
	ctrl.initConstantMenuArea();
	ctrl.constantMenuItemClicked(MENU_TYPES.TYPE1);
	window.onkeydown = function(/**@type {Event}*/event)
	{
		if(window["maskPanel"].isVisible())
		{
			event.preventDefault();
			event.stopPropagation();
		}
		else
		{
			ctrl.activePage.handleKey(event);
		}
	};
}

/**
 * @constructor
 */
var Controller = function()
{
	/**@type {ARapi.template.page}*/this.activePage = null;
	/**@type {ARapi.template.request}*/this.requestAPI = null;
};

/**
 * @param {string} applicationName
 */
Controller.prototype.checkAndUpdateT0Param = function(applicationName)
{
	var oldT0Param = "";
	var newT0Param = "";

	if(window.localStorage.getItem(applicationName + 'T0Param') != undefined && window.localStorage.getItem(applicationName + 'T0Param') != null)
		oldT0Param = window.localStorage.getItem(applicationName + 'T0Param');

	if(gup('t0') != undefined && gup('t0') != null)
		newT0Param = gup('t0');

	if(oldT0Param != newT0Param)
		this.removeItemsFromLocalStorage();

	window.localStorage.setItem(applicationName + 'T0Param', newT0Param);
}

Controller.prototype.removeItemsFromLocalStorage = function()
{
	var localStorageItems = [
								"item1",
								"item2",
								"item3"
							];

	for(var i=0; i<localStorageItems.length; i++)
	{
		var item = window.localStorage.getItem(localStorageItems[i]);
		if(item != undefined)
			window.localStorage.removeItem(localStorageItems[i]);
	}
}

Controller.prototype.initConstantMenuArea = function()
{
	/**@type {Element}*/var constantMenuDiv = document.getElementById("templateConstantMenuDiv");
	constantMenuDiv.innerHTML = "";

	/**@type {Element}*/var Menu1Link = this.createXElement("a", "templateConstantMenuItem", "Menu1", "#", "Menu1", false);
	Menu1Link.addEventListener('click', function(){ctrl.constantMenuItemClicked(MENU_TYPES.TYPE1);},true);
	constantMenuDiv.appendChild(Menu1Link);

	/**@type {Element}*/var Menu2Link = this.createXElement("a", "templateConstantMenuItem", "Menu2", "#", "Menu2", false);
	Menu2Link.addEventListener('click', function(){ctrl.constantMenuItemClicked(MENU_TYPES.TYPE2);},true);
	constantMenuDiv.appendChild(Menu2Link);

	/**@type {Element}*/var Menu3Link = this.createXElement("a", "templateConstantMenuItem", "Menu3", "#", "Menu3", false);
	Menu3Link.addEventListener('click', function(){ctrl.constantMenuItemClicked(MENU_TYPES.TYPE3);},true);
	constantMenuDiv.appendChild(Menu3Link);

	document.getElementById("templateHeaderDiv").innerHTML = "HEADER";
	document.getElementById("templateContentDiv").innerHTML = "CONTENT";
	document.getElementById("templateFooterDiv").innerHTML = "FOOTER";

	document.getElementById("Menu1").focus();
}

/**
 * @param {number}  pageSource
 */
Controller.prototype.constantMenuItemClicked= function(pageSource)
{
	switch(pageSource)
	{
		case MENU_TYPES.TYPE1:
			alert("menu type 1 clicked");
			ctrl.activePage = new pageType1();
			break;
		case MENU_TYPES.TYPE2:
			alert("menu type 2 clicked");
			ctrl.activePage = new pageType2();
			break;
		case MENU_TYPES.TYPE3:
			alert("menu type 3 clicked");
			ctrl.activePage = new pageType3();
			break;
	}
}

/**
 * @param	{string}	elementTag
 * @param	{string}	elementClass
 * @param	{string}	elementId
 * @param	{string}	elementInnerHTML
 * @param	{boolean}	languageSupport
 * @return	{Element}
 */
Controller.prototype.createXElement = function(elementTag, elementClass, elementId, elementHref, elementInnerHTML, languageSupport)
{
	/**@type {Element}*/var element = document.createElement(elementTag);
	if(elementClass != "")
	{
		element.setAttribute("class", elementClass);
	}
	if(elementId != "")
	{
		element.setAttribute("id", elementId);
	}
	if(elementHref != "")
	{
		element.setAttribute("href", elementHref);
	}
	if(languageSupport)
	{
		var ID_STR = elementInnerHTML.split(" ");
		element.innerHTML = "<span id='"
		for(var i=0; i<ID_STR.length; i++)
		{
			element.innerHTML += ID_STR[i].toUpperCase();
			if(i != ID_STR.length - 1)
				element.innerHTML += "_";
		}
		 element.innerHTML += "'></span>";
	}
	else
	{
		element.innerHTML = elementInnerHTML;
	}
	return element;
}

/**
 * @constructor
 * @implements {ARapi.template.page}
 */
var pageType1 = function()
{
	/**@type{number}*/this.currentRequestType = REQ_TYPES.TYPE1;
}

/**
 * @param {string} xmlString
 */
pageType1.prototype.callBackFunc = function(xmlString)
{
	switch(this.currentRequestType)
	{
		case REQ_TYPES.TYPE1:
			this.prepareLayout(xmlString)
			break;
		case REQ_TYPES.TYPE2:
			this.prepareLayout(xmlString)
			break;
		case REQ_TYPES.TYPE3:
			this.prepareLayout(xmlString)
			break;
	}
}

/**
 * @param {Event} event
 */
pageType1.prototype.handleKey = function(event)
{
	switch(event.keyCode)
	{
		case SYSTEM.KEYS.VK_BACK:
			this.backPressed();
			break;
		case SYSTEM.KEYS.VK_UP:
			this.upArrowPressed();
			break;
		case SYSTEM.KEYS.VK_DOWN:
			this.downArrowPressed();
			break;
	}
}

pageType1.prototype.backPressed = function()
{
	alert("back button pressed");
}

pageType1.prototype.upArrowPressed = function()
{
	alert("up arrow button pressed");
}

pageType1.prototype.downArrowPressed = function()
{
	alert("down arrow button pressed");
}

pageType1.prototype.prepareLayout = function(xmlString)
{
	var parsedData = templateParser(xmlString);
}

/**
 * @constructor
 * @implements {ARapi.template.page}
 */
var pageType2 = function()
{
	/** @type{number}*/this.currentRequestType = REQ_TYPES.TYPE3;
}

/**
 * @param {string} xmlString
 */
pageType2.prototype.callBackFunc = function(xmlString)
{
	switch(this.currentRequestType)
	{
		case REQ_TYPES.TYPE1:
			this.prepareLayout(xmlString)
			break;
		case REQ_TYPES.TYPE2:
			this.prepareLayout(xmlString)
			break;
		case REQ_TYPES.TYPE3:
			this.prepareLayout(xmlString)
			break;
	}
}

/**
 * @param {Event} event
 */
pageType2.prototype.handleKey = function(event)
{
	switch(event.keyCode)
	{
		case SYSTEM.KEYS.VK_BACK:
			this.backPressed();
			break;
		case SYSTEM.KEYS.VK_UP:
			this.upArrowPressed();
			break;
		case SYSTEM.KEYS.VK_DOWN:
			this.downArrowPressed();
			break;
	}
}

pageType2.prototype.backPressed = function()
{
	alert("back button pressed");
}

pageType2.prototype.upArrowPressed = function()
{
	alert("up arrow button pressed");
}

pageType2.prototype.downArrowPressed = function()
{
	alert("down arrow button pressed");
}

pageType2.prototype.prepareLayout = function(xmlString)
{
	var parsedData = templateParser(xmlString);
}

/**
 * @constructor
 * @implements {ARapi.template.page}
 */
var pageType3 = function()
{
	/** @type{number}*/this.currentRequestType = REQ_TYPES.TYPE3;
}

/**
 * @param {string} xmlString
 */
pageType3.prototype.callBackFunc = function(xmlString)
{
	switch(this.currentRequestType)
	{
		case REQ_TYPES.TYPE1:
			this.prepareLayout(xmlString)
			break;
		case REQ_TYPES.TYPE2:
			this.prepareLayout(xmlString)
			break;
		case REQ_TYPES.TYPE3:
			this.prepareLayout(xmlString)
			break;
	}
}

/**
 * @param {Event} event
 */
pageType3.prototype.handleKey = function(event)
{
	switch(event.keyCode)
	{
		case SYSTEM.KEYS.VK_BACK:
			this.backPressed();
			break;
		case SYSTEM.KEYS.VK_UP:
			this.upArrowPressed();
			break;
		case SYSTEM.KEYS.VK_DOWN:
			this.downArrowPressed();
			break;
	}
}

pageType3.prototype.backPressed = function()
{
	alert("back button pressed");
}

pageType3.prototype.upArrowPressed = function()
{
	alert("up arrow button pressed");
}

pageType3.prototype.downArrowPressed = function()
{
	alert("down arrow button pressed");
}

pageType3.prototype.prepareLayout = function(xmlString)
{
	var parsedData = templateParser(xmlString);
}

window["init"] = init;
