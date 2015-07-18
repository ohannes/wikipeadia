goog.provide('ARapi.wikipedia.scrollBarController');

/**
 * @constructor
 * @param {Element} container
 * @param {Element} content
 * @param {number} contentVisibleWidth
 * @param {number} contentVisibleHeight
 * @param {number} horizontalScrollHeight
 * @param {number} verticalScrollWidth
 * @param {string} scrollColor
 */
var scrollBarController = function(container, content, contentVisibleWidth, contentVisibleHeight, horizontalScrollHeight, verticalScrollWidth, scrollColor)
{
	/** @type {Element} */this.container = container;
	/** @type {Element} */this.content = content;
	/** @type {number} */this.contentVisibleWidth = contentVisibleWidth;
	/** @type {number} */this.contentVisibleHeight = contentVisibleHeight;
	/** @type {string} */this.scrollColor = scrollColor;
	
	/** @type {number} */this.scrollStepCoefficient;
	/** @type {number} */this.scrollDimensionCoefficient;
	/** @type {string} */this.contentStyleContainerId;
	/** @type {string} */this.horizontalScrollStyleContainerId;
	/** @type {string} */this.verticalScrollStyleContainerId;
	
	/** @type {string} */this.contentId;
	/** @type {string} */this.allContainerId;
	/** @type {string} */this.horizontalScrollId;
	/** @type {string} */this.verticalScrollId;
	
	/** @type {number} */this.contentWidth;
	/** @type {number} */this.contentHeight;
	/** @type {number} */this.horizontalScrollStep;
	/** @type {number} */this.verticalScrollStep;
	/** @type {number} */this.horizontalScrollHeight = horizontalScrollHeight;
	/** @type {number} */this.horizontalScrollWidth;
	/** @type {number} */this.verticalScrollWidth = verticalScrollWidth;
	/** @type {number} */this.verticalScrollHeight;
	/** @type {boolean} */this.horizontalScrollEnable;
	/** @type {boolean} */this.verticalScrollEnable;
	/** @type {boolean} */this.isFocusOnContent;
	/** @type {boolean} */this.isHorizontalScrollAtLeftMost;
	/** @type {boolean} */this.isHorizontalScrollAtRightMost;
	/** @type {boolean} */this.isVerticalScrollAtTop;
	/** @type {boolean} */this.isVerticalScrollAtBottom;
	
	/** @type {Element} */this.contentRail;
	/** @type {Element} */this.contentStyleContainer;

	/** @type {Element} */this.horizontalScroll;
	/** @type {Element} */this.horizontalScrollRail;
	/** @type {Element} */this.horizontalScrollStyleContainer;
	
	/** @type {Element} */this.verticalScroll;
	/** @type {Element} */this.verticalScrollRail;
	/** @type {Element} */this.verticalScrollStyleContainer;
	
	/** @type {Element} */this.allContainer;
	
	this.initialize();
}

scrollBarController.prototype.initialize = function()
{
	this.isHorizontalScrollAtLeftMost = true;
	this.isHorizontalScrollAtRightMost = false;
	this.isVerticalScrollAtTop = true;
	this.isVerticalScrollAtBottom  = false;
	
	this.removeFocusablesInContent();
	
	this.contentId = this.content.id;
	this.allContainerId = "scrollAllContainer" + "for" + this.contentId;
	this.horizontalScrollId = "horizontalScroll" + "for" + this.contentId;
	this.verticalScrollId = "verticalScroll" + "for" + this.contentId;
	
	this.scrollStepCoefficient = 0.025;
	this.scrollDimensionCoefficient = 0.025;
	this.contentStyleContainerId = "scrollContentStyle" + "for" + this.contentId;
	this.horizontalScrollStyleContainerId = "horizontalScrollStyleContainer" + "for" + this.contentId;
	this.verticalScrollStyleContainerId = "verticalScrollStyleContainer" + "for" + this.contentId;
	
	this.horizontalScrollStep = this.contentVisibleWidth * this.scrollStepCoefficient;
	this.verticalScrollStep = this.contentVisibleHeight * this.scrollStepCoefficient;
	
	//this.horizontalScrollHeight = this.contentVisibleHeight * this.scrollDimensionCoefficient;
	//this.verticalScrollWidth = this.contentVisibleWidth * this.scrollDimensionCoefficient;
	
	this.isFocusOnContent = false;
	
	this.contentRail = this.createContentRail();
	this.contentStyleContainer = this.createContentStyleContainer();
	this.contentRail.appendChild(this.content);
	this.contentStyleContainer.appendChild(this.contentRail);

	this.horizontalScroll = this.createHorizontalScroll();
	this.horizontalScrollRail = this.createHorizontalScrollRail();
	this.horizontalScrollStyleContainer = this.createHorizontalScrollStyleContainer();
	this.horizontalScrollRail.appendChild(this.horizontalScroll);
	this.horizontalScrollStyleContainer.appendChild(this.horizontalScrollRail);
	
	this.verticalScroll = this.createVerticalScroll();
	this.verticalScrollRail = this.createVerticalScrollRail();
	this.verticalScrollStyleContainer = this.createVerticalScrollStyleContainer();
	this.verticalScrollRail.appendChild(this.verticalScroll);
	this.verticalScrollStyleContainer.appendChild(this.verticalScrollRail);
	
	this.allContainer = this.createAllContainer();
	this.allContainer.appendChild(this.contentStyleContainer);
	this.allContainer.appendChild(this.verticalScrollStyleContainer);
	this.allContainer.appendChild(this.horizontalScrollStyleContainer);
	
	this.container.appendChild(this.allContainer);

	this.initializeScrolls();
	this.focus();
}

scrollBarController.prototype.removeFocusablesInContent = function()
{
	var replaceElements = ["a", "input", "object"];
	for(var i=0; i<replaceElements.length; i++)
	{
		var elements2Replace = this.content.getElementsByTagName(replaceElements[i]);
		for(var j=elements2Replace.length-1; j>=0; j--)
		{
			var elementContent = elements2Replace[j].innerHTML;
			var replaceElem = document.createElement("span");
			replaceElem.innerHTML = elements2Replace[j].innerHTML;
			elements2Replace[j].parentNode.replaceChild(replaceElem, elements2Replace[j]);
		}
	}
}

scrollBarController.prototype.focus = function()
{
	this.allContainer.focus();
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createContentRail = function()
{
	var element = document.createElement("div");
	element.style.position = "relative";
	element.style.cssFloat = "left";
	element.style.width = this.contentVisibleWidth + "px";
	element.style.height = this.contentVisibleHeight + "px";
	element.style.overflow = "hidden";
	return element;
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createContentStyleContainer = function()
{
	var element = document.createElement("div");
	element.setAttribute("id", this.contentStyleContainerId);
	return element;
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createHorizontalScroll = function()
{
	var element = document.createElement("div");
	element.setAttribute("id", this.horizontalScrollId);
	element.style.position = "relative";
	element.style.cssFloat = "left";
	element.style.width = "0" + "px";	//initial
	element.style.height = this.horizontalScrollHeight + "px";
	element.style.marginLeft = "0" + "px";	//initial
	element.style.backgroundColor = this.scrollColor;

	return element;
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createHorizontalScrollRail = function()
{
	var element = document.createElement("div");
	element.style.position = "relative";
	element.style.cssFloat = "left";
	element.style.width = this.contentVisibleWidth + "px";
	element.style.height = this.horizontalScrollHeight + "px";

	return element;
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createHorizontalScrollStyleContainer = function()
{
	var element = document.createElement("div");
	element.setAttribute("id", this.horizontalScrollStyleContainerId);
	
	return element;
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createVerticalScroll = function()
{
	var element = document.createElement("div");
	element.setAttribute("id", this.verticalScrollId);
	element.style.position = "relative";
	element.style.cssFloat = "left";
	element.style.width = this.verticalScrollWidth + "px";
	element.style.height = "0" + "px";	//initial
	element.style.marginTop = "0" + "px";	//initial
	element.style.backgroundColor = this.scrollColor;

	return element;
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createVerticalScrollRail = function()
{
	var element = document.createElement("div");
	element.style.position = "relative";
	element.style.cssFloat = "left";
	element.style.width = this.verticalScrollWidth + "px";
	element.style.height = this.contentVisibleHeight + "px";

	return element;
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createVerticalScrollStyleContainer = function()
{
	var element = document.createElement("div");
	element.setAttribute("id", this.verticalScrollStyleContainerId);
	
	return element;
}

/**
 * @return {Element}
 */
scrollBarController.prototype.createAllContainer = function()
{
	/** @type {Element} */var element;
	element = document.createElement("a");
	element.setAttribute("id", this.allContainerId);
	element.setAttribute("href", "#");
	element.style.textDecoration = "none";
	var self = this;
	element.addEventListener('focus', function(){self.focusOnContent();}, false);
	element.addEventListener('blur', function(){self.blurOnContent();}, false);
	
	return element;
}

scrollBarController.prototype.initializeScrolls = function()
{
	var content = document.getElementById(this.contentId)
	this.contentWidth = this.getOffsetWidth(content);
	this.contentHeight = this.getOffsetHeight(this.content);
	content.style.marginTop = "0" + "px";	//initial
	content.style.marginLeft = "0" + "px";	//initial
	
	this.initializeHorizontalScroll();
	this.initializeVerticalScroll();
}

scrollBarController.prototype.initializeHorizontalScroll = function()
{
	if(this.contentVisibleWidth >= this.contentWidth)
		this.horizontalScrollEnable = false;
	else
		this.horizontalScrollEnable = true;
	
	var scroll = document.getElementById(this.horizontalScrollId);
	if(!this.horizontalScrollEnable)
	{
		this.horizontalScrollWidth = this.contentVisibleWidth;
		this.hideHorizontalScrollBar();
	}
	else
	{
		this.horizontalScrollWidth = (this.contentVisibleWidth * this.contentVisibleWidth) / this.contentWidth;
	}
	scroll.style.width = this.horizontalScrollWidth + "px";
}

scrollBarController.prototype.initializeVerticalScroll = function()
{
	if(this.contentVisibleHeight >= this.contentHeight)
		this.verticalScrollEnable = false;
	else
		this.verticalScrollEnable = true;
	
	var scroll = document.getElementById(this.verticalScrollId);
	if(!this.verticalScrollEnable)
	{
		this.verticalScrollHeight = this.contentVisibleHeight;
		this.hideVerticalScrollBar();
	}
	else
	{
		this.verticalScrollHeight = (this.contentVisibleHeight * this.contentVisibleHeight) / this.contentHeight;
	}
	scroll.style.height = this.verticalScrollHeight + "px";
}

/**
 * @return {number}
 */
scrollBarController.prototype.getHorizontalScrollStep = function()
{
	var contentOverflowLength = this.contentWidth - this.contentVisibleWidth;
	var contentStepNumber = contentOverflowLength / this.horizontalScrollStep;
	var scrollMarginLength = this.contentVisibleWidth - this.horizontalScrollWidth;
	
	return scrollMarginLength / contentStepNumber;
}

/**
 * @return {number}
 */
scrollBarController.prototype.getVerticalScrollStep = function()
{
	var contentOverflowLength = this.contentHeight - this.contentVisibleHeight;
	var contentStepNumber = contentOverflowLength / this.verticalScrollStep;
	var scrollMarginLength = this.contentVisibleHeight - this.verticalScrollHeight;
	
	return scrollMarginLength / contentStepNumber;
}

scrollBarController.prototype.hideHorizontalScrollBar = function()
{
	var scrollContainer = document.getElementById(this.horizontalScrollStyleContainerId);
	scrollContainer.style.display = "none";
}

scrollBarController.prototype.hideVerticalScrollBar = function()
{
	var scrollContainer = document.getElementById(this.verticalScrollStyleContainerId);
	scrollContainer.style.display = "none";
}

scrollBarController.prototype.showHorizontalScrollBar = function()
{
	var scrollContainer = document.getElementById(this.horizontalScrollStyleContainerId);
	scrollContainer.style.display = "block";
}

scrollBarController.prototype.showVerticalScrollBar = function()
{
	var scrollContainer = document.getElementById(this.verticalScrollStyleContainerId);
	scrollContainer.style.display = "block";
}

scrollBarController.prototype.focusOnContent = function()
{
	this.isFocusOnContent = true;
}

scrollBarController.prototype.blurOnContent = function()
{
	this.isFocusOnContent = false;
}

/**
 * @param {Event} event
 */
scrollBarController.prototype.handleKey = function(event)
{
	if(this.isFocusOnContent)
	{
		switch(event.keyCode)
		{
			case SYSTEM.KEYS.VK_LEFT:
				this.leftPressed(event);
				break;
			
			case SYSTEM.KEYS.VK_RIGHT:
				this.rightPressed(event);
				break;
			
			case SYSTEM.KEYS.VK_UP:
				this.upPressed(event);
				break;
			
			case SYSTEM.KEYS.VK_DOWN:
				this.downPressed(event);
				break;
		}
		if(((event.keyCode == SYSTEM.KEYS.VK_LEFT || event.keyCode == SYSTEM.KEYS.VK_RIGHT) && this.horizontalScrollEnable) ||
			((event.keyCode == SYSTEM.KEYS.VK_UP || event.keyCode == SYSTEM.KEYS.VK_DOWN) && this.verticalScrollEnable))
			event.preventDefault();
	}
}

/**
 * @param {Event} event
 */
scrollBarController.prototype.leftPressed = function(event)
{
	if(!this.horizontalScrollEnable)
		return;
	
	this.isHorizontalScrollAtLeftMost = false;
	this.isHorizontalScrollAtRightMost = false;
	
	var content = document.getElementById(this.contentId);
	var scroll = document.getElementById(this.horizontalScrollId);
	
	var contentMargin = parseFloat(content.style.marginLeft);
	var scrollMargin = parseFloat(scroll.style.marginLeft);
	
	var newContentMargin = contentMargin + this.horizontalScrollStep;
	var newScrollMargin = scrollMargin - this.getHorizontalScrollStep();
	
	if(newScrollMargin <= 0)
	{
		this.isHorizontalScrollAtLeftMost = true;
		newContentMargin = 0;
		newScrollMargin = 0;
	}
	
	content.style.marginLeft = newContentMargin + "px";
	scroll.style.marginLeft = newScrollMargin + "px";
}

/**
 * @param {Event} event
 */
scrollBarController.prototype.rightPressed = function(event)
{
	if(!this.horizontalScrollEnable)
		return;
	
	this.isHorizontalScrollAtLeftMost = false;
	this.isHorizontalScrollAtRightMost = false;
	
	var content = document.getElementById(this.contentId);
	var scroll = document.getElementById(this.horizontalScrollId);
	
	var contentWidth = this.getOffsetWidth(content);
	var containerWidth = this.getOffsetWidth(content.parentNode);
	
	var scrollWidth = this.getOffsetWidth(scroll);
	var scrollBarWidth = this.getOffsetWidth(scroll.parentNode);
	
	var contentMargin = parseFloat(content.style.marginLeft);
	var scrollMargin = parseFloat(scroll.style.marginLeft);
	
	var newContentMargin = contentMargin - this.horizontalScrollStep;
	var newScrollMargin = scrollMargin + this.getHorizontalScrollStep();
	
	if(scrollWidth + newScrollMargin >= scrollBarWidth)
	{
		this.isHorizontalScrollAtRightMost = true;
		newContentMargin =  containerWidth - contentWidth;
		newScrollMargin = scrollBarWidth - scrollWidth;
	}
	
	content.style.marginLeft = newContentMargin + "px";
	scroll.style.marginLeft = newScrollMargin + "px";
}

/**
 * @param {Event} event
 */
scrollBarController.prototype.upPressed = function(event)
{
	if(!this.verticalScrollEnable)
		return;
	
	this.isVerticalScrollAtTop = false;
	this.isVerticalScrollAtBottom = false;
	
	var content = document.getElementById(this.contentId);
	var scroll = document.getElementById(this.verticalScrollId);
	
	var contentMargin = parseFloat(content.style.marginTop);
	var scrollMargin = parseFloat(scroll.style.marginTop);
	
	var newContentMargin = contentMargin + this.verticalScrollStep;
	var newScrollMargin = scrollMargin - this.getVerticalScrollStep();
	
	if(newScrollMargin <= 0)
	{
		this.isVerticalScrollAtTop = true;
		newContentMargin = 0;
		newScrollMargin = 0;
	}
	
	content.style.marginTop = newContentMargin + "px";
	scroll.style.marginTop = newScrollMargin + "px";
}

/**
 * @param {Event} event
 */
scrollBarController.prototype.downPressed = function(event)
{
	if(!this.verticalScrollEnable)
		return;
	
	this.isVerticalScrollAtTop = false;
	this.isVerticalScrollAtBottom = false;
	
	var content = document.getElementById(this.contentId);
	var scroll = document.getElementById(this.verticalScrollId);
	
	var contentHeight = this.getOffsetHeight(content);
	var containerHeight = this.getOffsetHeight(content.parentNode);
	
	var scrollHeight = this.getOffsetHeight(scroll);
	var scrollBarHeight = this.getOffsetHeight(scroll.parentNode);
	
	var contentMargin = parseFloat(content.style.marginTop);
	var scrollMargin = parseFloat(scroll.style.marginTop);
	
	var newContentMargin = contentMargin - this.verticalScrollStep;
	var newScrollMargin = scrollMargin + this.getVerticalScrollStep();
	
	if(scrollHeight + newScrollMargin >= scrollBarHeight)
	{
		this.isVerticalScrollAtBottom = true;
		newContentMargin =  containerHeight - contentHeight;
		newScrollMargin = scrollBarHeight - scrollHeight;
	}
	
	content.style.marginTop = newContentMargin + "px";
	scroll.style.marginTop = newScrollMargin + "px";
}

scrollBarController.prototype._getOffset = function(elm, height)
{
	var cStyle = elm.ownerDocument && elm.ownerDocument.defaultView && elm.ownerDocument.defaultView.getComputedStyle
		&& elm.ownerDocument.defaultView.getComputedStyle(elm, null),
		ret = cStyle && cStyle.getPropertyValue(height ? 'height' : 'width') || '';
	if (ret && ret.indexOf('.') > -1)
	{
		ret = parseFloat(ret)
			+ parseInt(cStyle.getPropertyValue(height ? 'padding-top' : 'padding-left'), 10)
			+ parseInt(cStyle.getPropertyValue(height ? 'padding-bottom' : 'padding-right'), 10)
			+ parseInt(cStyle.getPropertyValue(height ? 'border-top-width' : 'border-left-width'), 10)
			+ parseInt(cStyle.getPropertyValue(height ? 'border-bottom-width' : 'border-right-width'), 10);
	}
	else
	{
		ret = height ? elm.offsetHeight : elm.offsetWidth;
	}
	return ret;
}
scrollBarController.prototype.getOffsetWidth = function(elm)
{
	return this._getOffset(elm, false);
}
scrollBarController.prototype.getOffsetHeight = function(elm)
{
	return this._getOffset(elm, true);
}
