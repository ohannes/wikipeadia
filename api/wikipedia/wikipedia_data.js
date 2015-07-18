goog.provide('ARapi.wikipedia.requestParameter');

var xml = {};
xml.api = {};
xml.api.wikipedia = {};

/**
 * @constructor
 * @property {number} prop1
 * @property {string} prop2
 * @property {boolean} prop3
 */
xml.api.wikipedia.object = function(prop1, prop2, prop3) {
	/**@type {number}*/ this.prop1 = prop1;
	/**@type {string}*/ this.prop2 = prop2;
	/**@type {boolean}*/ this.prop3 = prop3;
};

/**
 * @constructor
 * @param {string} paramName
 * @param {string} paramValue
 */
var requestParameter = function(paramName,paramValue)
{	
	/**@type {string}*/ this.paramName = paramName;
	/**@type {string}*/ this.paramValue = paramValue;
}
