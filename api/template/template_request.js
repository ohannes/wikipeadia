goog.provide('ARapi.template.request');
goog.require('ARapi.template.page');
goog.require('tools.MS_XMLHttpRequest');
goog.require('ARapi.template.requestParameter');

/**
 * @constructor
 *
 */
ARapi.template.request = function() {};

/**
 * @param {string} url
 * @param {Array.<requestParameter>} urlParameters
 * @param {ARapi.template.page} callbackClass
 */
ARapi.template.request.prototype.templateGETrequest = function(url,urlParameters,callbackClass)
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
	
	xhr.onreadystatechange = /**@type {function(string)}*/function(responseText)
	{
		callbackClass.callBackFunc(responseText);
	}
	xhr.send();
}

/**
 * @param {string} url 
 * @param {Array.<requestParameter>} urlParameters
 * @param {ARapi.template.page} callbackClass
 */
ARapi.template.request.prototype.templatePOSTrequest = function(url,urlParameters,callbackClass)
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
 * @param {string} url
 * @param {string} param1
 * @param {string} param2
 * @param {string} param3
 * @param {ARapi.template.page} callbackClass
 */
ARapi.template.request.prototype.getMainPage = function(url, param1, param2, param3, param4, callbackClass)
{
	/**@type {Array.<requestParameter>} */var paramList = new Array();
	/**@type {requestParameter}*/var param1P	=	new requestParameter("param1", param1);
	/**@type {requestParameter}*/var param2P	=	new requestParameter("param2", param2);
	/**@type {requestParameter}*/var param3P	=	new requestParameter("param3", param3);
	paramList.push(param1P);
	paramList.push(param2P);
	paramList.push(param3P);
	this.templateGETrequest(url, paramList, callbackClass);
}
