goog.provide('ARapi.template.xmlParser');
goog.require('ARapi.tools.xmlParser');

/**
 * @param {string} xmlString
 */
function templateParser(xmlString) {
	var xmlParser = new DOMParser();
	var xmlDoc = xmlParser.parseFromString(xmlString, "text/xml");
	
	return;
}
