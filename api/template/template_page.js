goog.provide('ARapi.template.page');

/**
 * @interface
 */
ARapi.template.page = function() { };
/**
 * @param {string} xmlString
 */
ARapi.template.page.prototype.callBackFunc = function(xmlString) { };
/**
 * @param {Event} event
 */
ARapi.template.page.prototype.handleKey = function(event) { };

ARapi.template.page.prototype.prepareLayout = function() { };
