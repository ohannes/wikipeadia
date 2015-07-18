goog.require('tools.MS_XMLHttpRequest');
goog.require('MSapi.tools.gup');
goog.require('ARapi.tools.systemInfo');
goog.require('graphic.maskPanel');
goog.require('ARapi.tools.xmlParser');
goog.require('ARapi.tools.AR_language');
goog.require('ARapi.tools.htmlEncodingUtils');
goog.require('ARapi.wikipedia.page');
goog.require('ARapi.wikipedia.request');
goog.require('ARapi.wikipedia.requestTypeEnums');
goog.require('ARapi.wikipedia.xmlParser');
goog.require('ARapi.wikipedia.scrollBarController');

/**@define {boolean} */var ENABLE_DEBUG = false;
/**@type {Controller}*/var ctrl;
/**@type {string}*/var defaultLanguage = "tr";

var init = function() {
	window["maskPanel"] = new maskTemplate();
	ctrl = new Controller();
	ctrl.constantMenuItemClicked(MENU_TYPES.SEARCH);
	window.onkeydown = function(/**@type {Event}*/event)
	{
		if(window["maskPanel"].isVisible())
		{
			event.preventDefault();
			event.stopPropagation();
		}
		else
		{
			if(ctrl.activeSubPage != null && ctrl.activeSubPage.isFocusOnPopup)
			{
				ctrl.activeSubPage.handleKey(event);
			}
			else
			{
				ctrl.activePage.handleKey(event);
			}
		}
	}; 
}

/**
 * @constructor
 */
var Controller = function() 
{
	/**@type {ARapi.wikipedia.page}*/this.activePage = null;
	/**@type {ARapi.wikipedia.page}*/this.activeSubPage = null;
	/**@type {ARapi.wikipedia.request}*/this.requestAPI = new ARapi.wikipedia.request();
	this.initConstantMenuArea();
};

Controller.prototype.initConstantMenuArea = function()
{
	/**@type {Element}*/var constantMenuNav = document.getElementById("wikipediaConstantMenuDiv");
	constantMenuNav.innerHTML = "";
	
	/**@type {Element}*/var searchLink = this.createXElement("a", "wikipediaConstantMenuItem", "searchLink", "#", "", false);
	searchLink.addEventListener('click', function(){ctrl.constantMenuItemClicked(MENU_TYPES.SEARCH);},true);
	constantMenuNav.appendChild(searchLink);
	
	/**@type {Element}*/var languageLink = this.createXElement("a", "wikipediaConstantMenuItem", "languageLink", "#", "", false);
	languageLink.addEventListener('click', function(){ctrl.constantMenuItemClicked(MENU_TYPES.LANGUAGE);},true);
	constantMenuNav.appendChild(languageLink);

	languageLink.style.background = 'url(img/flags/' + defaultLanguage + '.png) no-repeat center';
	
	document.getElementById("searchLink").focus();
}

/**
 * @param {number}  pageSource
 */
Controller.prototype.constantMenuItemClicked= function(pageSource)
{
	switch(pageSource)
	{
		case MENU_TYPES.SEARCH:
			this.activePage = new searchPage();
			break ;
		case MENU_TYPES.LANGUAGE:
			if(!this.activePage.displayingResult)
			{
				this.constantMenuItemClicked(MENU_TYPES.SEARCH)
				return;
			}
			this.activeSubPage = new languagePage();
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
 * @param {Element} elm
 * @return {Array.<number>}
 */
Controller.prototype.GetTopLeft = function(elm)
{
	var x, y = 0;

	//set x to elm’s offsetLeft
	x = elm.offsetLeft;


	//set y to elm’s offsetTop
	y = elm.offsetTop;


	//set elm to its offsetParent
	elm = elm.offsetParent;


	//use while loop to check if elm is null
	// if not then add current elm’s offsetLeft to x
	//offsetTop to y and set elm to its offsetParent

	while(elm != null)
	{

	x = parseInt(x, 10) + parseInt(elm.offsetLeft, 10);
	y = parseInt(y, 10) + parseInt(elm.offsetTop, 10);
	elm = elm.offsetParent;
	}

	//here is interesting thing
	//it return Object with two properties
	//Top and Left

	var xy = new Array();
	xy.push(y);
	xy.push(x);

	return xy;
}

/**
 * @constructor
 * @implements {ARapi.wikipedia.page}
 */
var searchPage = function()
{
	/** @type{string}*/this.keyword = "";
	/** @type{number}*/this.rvsectionNumber = 0;
	/** @type{string}*/this.currentLanguage = defaultLanguage;
	/** @type{boolean}*/this.displayingResult = false;
	/** @type{boolean}*/this.lastRvSection = false;
	/** @type{scrollBarController}*/this.scrollCtrl = null;
	this.prepareLayout();
}

searchPage.prototype.initializeSearchData = function()
{
	this.keyword = "";
	this.rvsectionNumber = 0;
	this.displayingResult = false;
	this.lastRvSection = false;
	this.scrollCtrl = null;
	document.getElementById("wikipediaHeaderDiv").innerHTML = "";
	var wikipediaMainContainerDiv = document.getElementById("wikipediaMainContainerDiv");
	var contentDiv = document.getElementById("pageContentDiv");
	if(contentDiv != null)
		wikipediaMainContainerDiv.removeChild(contentDiv);
	var wikipediaSearchContainerDiv = document.getElementById("wikipediaSearchContainerDiv");
	if(wikipediaSearchContainerDiv != null)
		wikipediaMainContainerDiv.removeChild(wikipediaSearchContainerDiv);
	ctrl.activeSubPage = null;
}

searchPage.prototype.search = function()
{
	if(this.keyword == "")
		return;
	ctrl.requestAPI.search(this.currentLanguage, "query", "revisions", this.keyword, "content", "xml", "1", this.rvsectionNumber.toString(), this);
}

/**
 * @param {string} xmlString
 */
searchPage.prototype.callBackFunc = function(xmlString)
{
	this.displayResult(xmlString);
}

/**
 * @param {Event} event
 */
searchPage.prototype.handleKey = function(event)
{
	if(this.scrollCtrl.isFocusOnContent)
		this.scrollCtrl.handleKey(event);
	switch(event.keyCode)
	{
		case SYSTEM.KEYS.VK_BACK:
			this.backPressed();
			break;
		case SYSTEM.KEYS.VK_UP:
			this.upArrowPressed(event);
			break;
		case SYSTEM.KEYS.VK_DOWN:
			this.downArrowPressed(event);
			break;
		case SYSTEM.KEYS.VK_LEFT:
			this.leftArrowPressed(event);
			break;
		case SYSTEM.KEYS.VK_RIGHT:
			this.rightArrowPressed(event);
			break;
		case SYSTEM.KEYS.VK_CHANNEL_PLUS:
			this.pageUpPressed();
			break;
		case SYSTEM.KEYS.VK_CHANNEL_MINUS:
			this.pageDownPressed();
			break;
	}
}

searchPage.prototype.backPressed = function(){}

searchPage.prototype.upArrowPressed = function(event)
{
	if(this.displayingResult)
	{
		if(this.scrollCtrl.isFocusOnContent)
		{
			if(this.scrollCtrl.verticalScrollEnable)
			{
				this.scrollCtrl.handleKey(event);
			}
			else
			{
				document.getElementById("searchLink").focus();
				event.preventDefault();
			}
		}
	}
}

searchPage.prototype.downArrowPressed = function(event)
{
	if(this.displayingResult)
	{
		if(this.scrollCtrl.isFocusOnContent)
		{
			if(this.scrollCtrl.verticalScrollEnable)
			{
				this.scrollCtrl.handleKey(event);
			}
			else
			{
				document.getElementById("languageLink").focus();
				event.preventDefault();
			}
		}
	}
}
searchPage.prototype.leftArrowPressed = function(event)
{
	if(this.displayingResult)
	{
		if(this.scrollCtrl.isFocusOnContent)
		{
			if(this.scrollCtrl.horizontalScrollEnable)
			{
				this.scrollCtrl.handleKey(event);
			}
			else
			{
				document.getElementById("searchLink").focus();
				event.preventDefault();
			}
		}
		else
		{
			this.scrollCtrl.focus();
		}
	}
}

searchPage.prototype.rightArrowPressed = function(event)
{
	if(this.displayingResult)
	{
		if(this.scrollCtrl.isFocusOnContent)
		{
			if(this.scrollCtrl.horizontalScrollEnable)
			{
				this.scrollCtrl.handleKey(event);
			}
			else
			{
				document.getElementById("languageLink").focus();
				event.preventDefault();
			}
		}
		else
		{
			this.scrollCtrl.focus();
		}
	}
}

searchPage.prototype.pageDownPressed = function()
{
	if(!this.displayingResult)
		return;
	if(this.rvsectionNumber == 0)
		return;
	this.rvsectionNumber--;
	this.lastRvSection = false;
	this.search();
}

searchPage.prototype.pageUpPressed = function()
{
	if(!this.displayingResult)
		return;
	if(this.lastRvSection)
		return;
	this.rvsectionNumber++;
	this.search();
}

searchPage.prototype.prepareLayout = function()
{
	this.initializeSearchData();
	var headerDiv = document.getElementById("wikipediaHeaderDiv");
	headerDiv.innerHTML = "Search...";
	
	var wikipediaMainContainerDiv = document.getElementById("wikipediaMainContainerDiv");
	var searchContainerDiv = ctrl.createXElement("div", "", "wikipediaSearchContainerDiv", "", "", false);
	wikipediaMainContainerDiv.appendChild(searchContainerDiv);
	
	var searchStringDiv = ctrl.createXElement("div", "", "wikipediaSearchStringDiv", "", "Find on Wikipedia...", false);
	searchContainerDiv.appendChild(searchStringDiv);
	
	var searchBox = ctrl.createXElement("input", "", "wikipediaSearchBox", "", "", false);
	searchBox.setAttribute("type", "text");
	searchContainerDiv.appendChild(searchBox);
	
	var searchButton = ctrl.createXElement("a", "", "wikipediaSearchButton", "#", "Search", false);
	searchButton.addEventListener	(
										'click',
										function()
										{
											ctrl.activePage.keyword = document.getElementById("wikipediaSearchBox").value;
											ctrl.activePage.search();
										},
										true
									);
	searchContainerDiv.appendChild(searchButton);
	
	searchBox.focus();
}

/**
 * @param {string} xmlString
*/
searchPage.prototype.displayResult = function(xmlString)
{
	this.displayingResult = true;
	var headerDiv = document.getElementById("wikipediaHeaderDiv");
	headerDiv.innerHTML = this.keyword;

	var wikipediaMainContainerDiv = document.getElementById("wikipediaMainContainerDiv");
	var wikipediaSearchContainerDiv = document.getElementById("wikipediaSearchContainerDiv");
	if(wikipediaSearchContainerDiv != null)
		wikipediaMainContainerDiv.removeChild(wikipediaSearchContainerDiv);
	var pageContentDiv = document.getElementById("pageContentDiv");
	if(pageContentDiv != null)
		wikipediaMainContainerDiv.removeChild(pageContentDiv);
	
	pageContentDiv = ctrl.createXElement("div", "", "pageContentDiv", "", "", false);
	wikipediaMainContainerDiv.appendChild(pageContentDiv);
	
	var pageContent = wikipediaPageParser(xmlString);
	if(pageContent == COMMON_STR.ERROR)
	{
		this.lastRvSection = true;
		this.displayWarnForlastRvSection();
		return;
	}
	else if(pageContent == "")
	{
		this.rvsectionNumber--;
		this.showNoContent();
		return;
	}
	else if(pageContent.indexOf("anlam ayrımı") != -1)
	{
		//alert("anlam ayrımı");
		//TODO : find links to other titles
	}
	
	var content = document.createElement("div");
	content.setAttribute("id", "wikipediaSearchedTitleContent");
	content.innerHTML = pageContent;
	this.scrollCtrl = new scrollBarController(pageContentDiv, content, 950, 600, 20, 20, "black")
	this.regulateImagesAndRemoveEditSections(this.scrollCtrl.content);
}

searchPage.prototype.showNoContent = function()
{
	var pageContentDiv = document.getElementById("pageContentDiv");
	pageContentDiv.innerHTML = "NO CONTENT TO SHOW";
}

/**
 * @param {Element} content
*/
searchPage.prototype.regulateImagesAndRemoveEditSections = function(content)
{
	var imgTags = content.getElementsByTagName("img");
	for(var i=0; i<imgTags.length; i++)
	{
		var imgSrc = imgTags[i].getAttribute("src").toString();
		imgSrc = "http:" + imgSrc;
		imgTags[i].setAttribute("src", imgSrc);
	}
	var editsections = content.getElementsByClassName("editsection");
	for(var i=0; i<editsections.length; i++)
		editsections[i].parentNode.removeChild(editsections[i]);	
}

searchPage.prototype.displayWarnForlastRvSection = function()
{
	var pageContentDiv = document.getElementById("pageContentDiv");
	pageContentDiv.innerHTML = "END OF THE PAGE";
}

/**
 * @param {string} selectedLanguage
*/
searchPage.prototype.changeLanguage = function(selectedLanguage)
{
	var keyword = this.keyword;
	this.initializeSearchData();
	this.keyword = keyword;
	this.currentLanguage = selectedLanguage;
	this.search();
}

/**
 * @constructor
 * @implements {ARapi.wikipedia.page}
 */
var languagePage = function()
{
	/** @type{string}*/this.llcontinue  = "";
	/** @type{Array.<string>}*/this.languageOptions = new Array();
	/** @type{boolean}*/this.isFocusOnPopup = false;
	if(ctrl.activePage.keyword != "")
		this.getLanguageOptions();
}

languagePage.prototype.getLanguageOptions = function()
{
	ctrl.requestAPI.getLanguageOptions(defaultLanguage, "query", ctrl.activePage.keyword, "langlinks", "xml", this.llcontinue, this);
}

/**
 * @param {string} xmlString
 */
languagePage.prototype.callBackFunc = function(xmlString)
{
	this.llcontinue = getLangLinkContinue(xmlString);
	var langlinks = getLangLinks(xmlString);
	for(var i=0; i<langlinks.length; i++)
	{
		this.languageOptions.push(langlinks[i]);
	}
	if(this.llcontinue == "")
	{
		this.prepareLayout();
		return;
	}
	this.getLanguageOptions();
}

/**
 * @param {Event} event
 */
languagePage.prototype.handleKey = function(event)
{
	switch(event.keyCode)
	{
		case SYSTEM.KEYS.VK_BACK:
			this.backPressed();
			break;
		case SYSTEM.KEYS.VK_UP:
			this.upArrowPressed();
			event.preventDefault();
			break ;
		case SYSTEM.KEYS.VK_DOWN:
			this.downArrowPressed();
			event.preventDefault();
			break ;
		case SYSTEM.KEYS.VK_LEFT:
			this.leftArrowPressed();
			event.preventDefault();
			break;
		case SYSTEM.KEYS.VK_RIGHT:
			this.rightArrowPressed();
			event.preventDefault();
			break;
	}	
}

languagePage.prototype.backPressed = function()
{
	this.removePopUp();
}

languagePage.prototype.upArrowPressed = function(){}

languagePage.prototype.downArrowPressed = function(){}

languagePage.prototype.leftArrowPressed = function()
{
	var popUp = document.getElementById("langPopUp");
	var langLinks = popUp.childNodes;
	if(langLinks.length == 0)
		return;
	var lastLink = langLinks[langLinks.length-1];
	popUp.removeChild(lastLink);
	popUp.insertBefore(lastLink, langLinks[0]);
	document.getElementById("langPopUp").firstChild.focus();	
}

languagePage.prototype.rightArrowPressed = function()
{
	var popUp = document.getElementById("langPopUp");
	var langLinks = popUp.childNodes;
	if(langLinks.length == 0)
		return;
	var firstLink = langLinks[0];
	popUp.removeChild(firstLink);
	popUp.appendChild(firstLink);
	document.getElementById("langPopUp").firstChild.focus();
}

languagePage.prototype.prepareLayout = function()
{
	var popUp = this.createPopUp();
	var langLink = this.createLangLink(ctrl.activePage.currentLanguage)
	for(var i=0; i<this.languageOptions.length; i++)
	{
		if(this.languageOptions[i] == ctrl.activePage.currentLanguage || this.languageOptions[i] == defaultLanguage)
			continue;
		langLink = this.createLangLink(this.languageOptions[i])
	}
	if(ctrl.activePage.currentLanguage != defaultLanguage)
		langLink = this.createLangLink(defaultLanguage)
	if(popUp.firstChild != undefined)
		popUp.firstChild.focus();
	this.isFocusOnPopup = true;
}

/**
 * @return {Element}
 */
languagePage.prototype.createPopUp = function()
{
	var popUp = ctrl.createXElement("div", "", "langPopUp", "", "", false);
	document.getElementsByTagName("body")[0].appendChild(popUp);
	var xy = ctrl.GetTopLeft(document.getElementById("languageLink"));
	popUp.style.top = (xy[0] + 18).toString() + "px";
	popUp.style.left = (xy[1] + 2).toString() + "px";
	return popUp;
}

/**
 * @param {string} langLinkStr
 * @return {Element}
 */
languagePage.prototype.createLangLink = function(langLinkStr)
{
	var langLink = ctrl.createXElement("a", "langlink", "langlink_" + langLinkStr, "#", "", false);
	langLink.addEventListener('click',function(){ctrl.activeSubPage.selectLanguage(langLinkStr);},'true');
	var langLinkStr_ = "";
	if(LANGUAGE[langLinkStr] != null)
		langLinkStr_ = LANGUAGE[langLinkStr];
	else
		langLinkStr_ = langLinkStr;
	var langlinkFlag = ctrl.createXElement("div", "langlinkFlag", "langlinkFlag_" + langLinkStr, "", langLinkStr_, false);
	langlinkFlag.style.background = "url(img/flags/" + langLinkStr + ".png) no-repeat center";
	langLink.appendChild(langlinkFlag);
	document.getElementById("langPopUp").appendChild(langLink);
	return langLink;
}

languagePage.prototype.removePopUp = function()
{
	document.getElementsByTagName("body")[0].removeChild(document.getElementById("langPopUp"));
	this.isFocusOnPopup = false;
}

/**
 * @param {string} langLinkStr
 */
languagePage.prototype.selectLanguage = function(langLinkStr)
{
	this.removePopUp();
	document.getElementById("languageLink").style.background = "url(img/flags/" + langLinkStr + ".png) no-repeat center";
	ctrl.activePage.changeLanguage(langLinkStr);
}

window["init"] = init;
