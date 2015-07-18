goog.provide('ARapi.wikipedia.page');

/**
 * @interface
 */
ARapi.wikipedia.page = function() { };
/**
 * @param {string} xmlString
 */
ARapi.wikipedia.page.prototype.callBackFunc = function(xmlString) { };
/**
 * @param {Event} event
 */
ARapi.wikipedia.page.prototype.handleKey = function(event) { };

ARapi.wikipedia.page.prototype.prepareLayout = function() { };
