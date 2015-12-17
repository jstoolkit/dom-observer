/*!
 * dom-observer v0.1.0
 * https://github.com/leafui/dom-observer
 * MIT LICENSE © Matheus R. Kautzmann
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DomObserver = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The MutationObserver object
 * @typedef {Object} MutationObserver
 * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
 */

/**
 * The MutationObserverInit object to specify the observer config
 * @typedef {Object} MutationObserverInit
 * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
 */

/**
 * The MutationRecord object that states the changes made in the DOM
 * @typedef {Object} MutationRecord
 * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
 */

/**
 * The callback used to report mutations
 * @callback changeCallback
 * @param {MutationRecord[]|MutationRecord} mutations - Report array of changes, but if lastChange is set to true it will report only the last change.
 * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
 */

/**
 * Instantiate dom-observer
 * @param {HTMLElement} target - The element to observe
 * @param {changeCallback} callback - The function that will receive the reports
 * @param {MutationObserverInit} [options] - The object with the observer config
 * @param {Boolean} [lastChange=false] - Whether or not to return only the last change
 * @access public
 * @exports dom-observer
 * @example <caption>Instantiates an observer for all elements in body</caption>
 * var observer = require('dom-observer');
 * @returns {DomObserver} self - The newly created instance of DomObserver
 * var myObserver = observer(document.body, { subtree: true }, myCallback);
 * @since 0.1.0
 */

exports.default = function (target, callback, options, lastChange) {
  // Bring prefixed MutationObserver for older Chrome/Safari and Firefox
  // TODO: REMOVE THIS VARIABLE WHEN POSSIBLE
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

  var _callback = callback;

  function getCallback() {
    return _callback;
  }

  function setCallback(fn) {
    _callback = fn;
  }

  /**
   * Handle MutationObserver mutations
   * @function
   * @param {MutationRecord[]} mutations - The mutations
   * @access private
   * @since 0.1.0
   */
  function mutationHandler(mutations) {
    if (lastChange) {
      getCallback()(mutations.pop());
    } else {
      getCallback()(mutations);
    }
  }

  /**
   * The inner MutationObserver used to watch for mutations
   * @access private
   * @type MutationObserver
   * @const
   * @since 0.1.0
   */
  var observer = new MutationObserver(mutationHandler);

  /**
   * Spawn a new observer with the specified config
   * @function
   * @param {HTMLElement} _target - The element to observe
   * @param {MutationObserverInit} [options] - The config to respect
   * @access private
   * @since 0.1.0
   */
  function observe(_target, _options) {
    var config = _options || {};
    var attributes = config.attributes;
    var childList = config.childList;
    var characterData = config.characterData;

    if (!(attributes || childList || characterData)) {
      config.attributes = true;
      config.childList = true;
      config.characterData = true;
    }
    if (!(_target instanceof HTMLElement)) {
      throw new Error('You must set a target element!');
    }
    if (callback) {
      observer.observe(_target, config);
    }
  }

  /**
   * The instance of DomObserver with the public API
   * @const
   * @access public
   * @since 0.1.0
   */
  var self = (function () {
    observe(target, options);
    return {
      /**
       * Add a target to the current observer
       * @function
       * @param {HTMLElement} _target - The element to observe
       * @example <caption>Add a new element to an existent observer</caption>
       * var myElement = document.querySelector('#awesomeElement');
       * myObserver.addTarget(myElement);
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      addTarget: function addTarget(_target) {
        observe(_target, options);
        return self;
      },
      /**
       * Add a new target and config to the current observer
       * @function
       * @param {HTMLElement} _target - The element to observe
       * @param {MutationObserverInit} _options - The config to respect
       * @example <caption>Add a new element and config to an observer</caption>
       * var myElement = document.querySelector('#awesomeElement');
       * myObserver.andObserve(myElement, { childList: true });
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      andObserve: function andObserve(_target, _options) {
        observe(_target, _options);
        return self;
      },
      /**
       * Change the function to be called when reporting changes
       * @function
       * @param {Function} fn - The new callback to use
       * @returns {DomObserver} self - The current instance of dom-observer
       * @example <caption>Change the function that handle the changes</caption>
       * var myNewFunc = function(mutations) { console.log('YAY', mutations); }
       * myObserver.changeCallback(myNewFunc);
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      changeCallback: function changeCallback(fn) {
        setCallback(fn);
        return self;
      },
      /**
       * Expose MutationObserver's takeRecords method
       * @function
       * @example <caption>Taking records</caption>
       * myObserver.takeRecords(); // Now do something with the info.
       * @returns {MutationRecord[]} The array of mutations
       * @access public
       * @since 0.1.0
       */
      takeRecords: function takeRecords() {
        return observer.takeRecords();
      },
      /**
       * Clean the MutationObserver record pool and return this instance
       * @function
       * @example <caption>Wiping the reports</caption>
       * myObserver.wipe(); // OK, clean.
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      wipe: function wipe() {
        observer.takeRecords();
        return self;
      },
      /**
       * Remove all previous observer configuration
       * @function
       * @example <caption>Stopping all reporters</caption>
       * myObserver.disconnect(); // No more change reports
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      disconnect: function disconnect() {
        observer.disconnect();
        return self;
      }
    };
  })();

  return self;
};

module.exports = exports['default'];

},{}]},{},[1])(1)
});