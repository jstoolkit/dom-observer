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

exports.default = function (target, options, callback, lastChange) {
  // Bring prefixed MutationObserver for older Chrome/Safari and Firefox
  // TODO: REMOVE THIS IF BLOCK WHEN POSSIBLE
  if (!window.MutationObserver) {
    window.MutationObserver = window.webkitMutationObserver || window.mozMutationObserver;
  }

  var _callback = callback;

  var mutationHandler = function mutationHandler(mutations) {
    if (lastChange) {
      _callback(mutations.pop());
    } else {
      _callback(mutations);
    }
  };
  var observer = new MutationObserver(mutationHandler);

  function observe(_target, _options) {
    if (!(_target instanceof HTMLElement)) {
      throw new Error('You must set a target element!');
    }
    if (callback) {
      observer.observe(_target, _options);
    }
  }

  var self = (function () {
    observe(target, options);
    return {
      addTarget: function addTarget(_target) {
        observe(_target, options);
        return self;
      },
      andObserve: function andObserve(_target, _options) {
        observe(_target, _options);
        return self;
      },
      changeCallback: function changeCallback(fn) {
        _callback = fn;
        return self;
      },
      takeRecords: function takeRecords() {
        observer.takeRecords();
      },
      wipe: function wipe() {
        observer.takeRecords();
        return self;
      },
      removeAllTargets: function removeAllTargets() {
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