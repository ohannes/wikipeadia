goog.provide('ARapi.wikipedia.request');
goog.require('ARapi.wikipedia.page');
goog.require('tools.MS_XMLHttpRequest');
goog.require('ARapi.wikipedia.requestParameter');

/**
 * @constructor
 *
 */
ARapi.wikipedia.request = function() {};

/**
 * @param {string} url
 * @param {Array.<requestParameter>} urlParameters
 * @param {ARapi.wikipedia.page} callbackClass
 */
ARapi.wikipedia.request.prototype.wikipediaGETrequest = function(url,urlParameters,callbackClass)
{
	/**@type {MS_XMLHttpRequest}*/var xhr = new MS_XMLHttpRequest();
	
	/**@type {string}*/var lastURL = url; 
	if(urlParameters != null && urlParameters.length > 0)
	{
		lastURL += '?';
		for(var i = 0 ; i < urlParameters.length; i++)
		{
			 lastURL = lastURL + urlParameters[i].paramName + '=' +  urlParameters[i].paramValue;
			 if(i != urlParameters.length -1)
				lastURL += "&";
		}	
	}
	xhr.open("GET", lastURL, true);
	//alert(lastURL);
	xhr.onreadystatechange = /**@type {function(string)}*/function(responseText)
	{
		callbackClass.callBackFunc(responseText);
	}
	xhr.send();
}

/**
 * @param {string} url 
 * @param {Array.<requestParameter>} urlParameters
 * @param {ARapi.wikipedia.page} callbackClass
 */
ARapi.wikipedia.request.prototype.wikipediaPOSTrequest = function(url,urlParameters,callbackClass)
{
	/**@type {MS_XMLHttpRequest}*/var xhr = new MS_XMLHttpRequest();
	
	/**@type {string}*/var lastURL = url; 
	if(urlParameters != null && urlParameters.length > 0)
	{
		lastURL += '?';
		for(var i = 0 ; i < urlParameters.length; i++)
		{
			 lastURL = lastURL + urlParameters[i].paramName + '=' +  urlParameters[i].paramValue;
			 if(i != urlParameters.length -1)
				lastURL += "&";
		}	
	}
	xhr.open("POST",lastURL,true);
	xhr.onreadystatechange = /**@type {function(string)}*/function(responseText)
	{
		callbackClass.callBackFunc(responseText);    
	}
	xhr.send();
}


/**
 * @param {string} country
 * @param {string} action
 * @param {string} prop
 * @param {string} titles
 * @param {string} rvprop
 * @param {string} format
 * @param {string} rvparse
 * @param {string} rvsection
 * @param {ARapi.wikipedia.page} callbackClass
 */
ARapi.wikipedia.request.prototype.search = function(country, action, prop, titles, rvprop, format, rvparse, rvsection, callbackClass)
{
	/**@type {Array.<requestParameter>} */var paramList = new Array();
	if(action != "")
	{
		/**@type {requestParameter}*/var actionP	=	new requestParameter("action", action);
		paramList.push(actionP);
	}
	if(prop != "")
	{
		/**@type {requestParameter}*/var propP		=	new requestParameter("prop", prop);
		paramList.push(propP);
	}
	if(titles != "")
	{
		/**@type {requestParameter}*/var titlesP	=	new requestParameter("titles", titles.replace(" ", "%20"));
		paramList.push(titlesP);
	}
	if(rvprop != "")
	{
		/**@type {requestParameter}*/var rvppropP	=	new requestParameter("rvprop", rvprop);
		paramList.push(rvppropP);
	}
	if(format != "")
	{
		/**@type {requestParameter}*/var formatP	=	new requestParameter("format", format);
		paramList.push(formatP);
	}
	if(rvparse != "")
	{
		/**@type {requestParameter}*/var rvparseP	= 	new requestParameter("rvparse", rvparse);
		paramList.push(rvparseP);
	}
	if(rvsection != "")
	{
		/**@type {requestParameter}*/var rvsectionP	= 	new requestParameter("rvsection", rvsection);
		paramList.push(rvsectionP);
	}
	this.wikipediaGETrequest("http://" + country.toLowerCase() + ".wikipedia.org/w/api.php", paramList, callbackClass);
}

/**
 * @param {string} country
 * @param {string} action
 * @param {string} titles
 * @param {string} prop
 * @param {string} format
 * @param {string} llcontinue
 * @param {ARapi.wikipedia.page} callbackClass
 */
ARapi.wikipedia.request.prototype.getLanguageOptions = function(country, action, titles, prop, format, llcontinue, callbackClass)
{
	/**@type {Array.<requestParameter>} */var paramList = new Array();
	if(action != "")
	{
		/**@type {requestParameter}*/var actionP	=	new requestParameter("action", action);
		paramList.push(actionP);
	}
	if(titles != "")
	{
		/**@type {requestParameter}*/var titlesP	=	new requestParameter("titles", titles.replace(" ", "%20"));
		paramList.push(titlesP);
	}
	if(prop != "")
	{
		/**@type {requestParameter}*/var propP		=	new requestParameter("prop", prop);
		paramList.push(propP);
	}
	if(format != "")
	{
		/**@type {requestParameter}*/var formatP	=	new requestParameter("format", format);
		paramList.push(formatP);
	}
	if(llcontinue != "")
	{
		/**@type {requestParameter}*/var llcontinueP=	new requestParameter("llcontinue", llcontinue);
		paramList.push(llcontinueP);
	}
	this.wikipediaGETrequest("http://" + country.toLowerCase() + ".wikipedia.org/w/api.php", paramList, callbackClass);
}
