goog.provide('ARapi.wikipedia.xmlParser');
goog.require('ARapi.tools.xmlParser');

var replaceStringsOpen =[
							"<?xml",
							"<api",
							"<query",
							"<pages",
							"<page",
							"<revisions",
							"<rev"
						];
					
var replaceStringsClose =	[
								"</api>",
								"</query>",
								"</pages>",
								"</page>",
								"</revisions>",
								"</rev>"
							];

/**
 * @param {string} xmlString
 */
function wikipediaPageParser(xmlString)
{
	//alert(xmlString);
	var xmlParser = new DOMParser();
	var xmlDoc = xmlParser.parseFromString(xmlString, "text/xml");
	
	var errorTag = xmlDoc.getElementsByTagName("error");
	if(errorTag.length > 0)
		return COMMON_STR.ERROR;
	
	var pageTag = xmlDoc.getElementsByTagName("page")[0];
	var missing = pageTag.getAttribute("missing");
	if(missing != null)
		return "";
	
	var revisionsNode = xmlDoc.getElementsByTagName("revisions")[0];
	var innerHTML = getChildNodeValueByName(revisionsNode,"rev");
	
	return innerHTML;
}

/**
 * @param {string} xmlString
 * @return {string}
 */
function getLangLinkContinue(xmlString)
{
	var xmlParser = new DOMParser();
	var xmlDoc = xmlParser.parseFromString(xmlString, "text/xml");
	
	var queryContinue = xmlDoc.getElementsByTagName("query-continue");
	if(queryContinue.length > 0)
	{
		var llcontinueTag = queryContinue[0].getElementsByTagName("langlinks")[0];
		var llcontinue = llcontinueTag.getAttribute("llcontinue");
	}
	if(llcontinue == undefined)
		return "";
	return llcontinue;
}

/**
 * @param {string} xmlString
 * @return {Array.<string>}
 */
function getLangLinks(xmlString)
{
	var xmlParser = new DOMParser();
	var xmlDoc = xmlParser.parseFromString(xmlString, "text/xml");
	
	var langLinkArray = new Array();
	
	var langlinks = xmlDoc.getElementsByTagName("ll");
	for(var i=0; i<langlinks.length; i++)
	{
		var langlink = langlinks[i].getAttribute("lang");
		langLinkArray.push(langlink);
	}
	return langLinkArray;
}
