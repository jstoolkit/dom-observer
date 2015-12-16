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
 * @param {MutationObserverInit} options - The object with the observer config
 * @param {changeCallback} callback - The function that will receive the reports
 * @param {Boolean} [lastChange=false] - Whether or not to return only the last change
 * @access public
 * @exports dom-observer
 * @example <caption>Instantiates an observer for all elements in body</caption>
 * var observer = require('dom-observer');
 * var myObserver = observer(document.body, { subtree: true }, myCallback);
 * @since 0.1.0
 */
export default (target, options, callback, lastChange) => {
  // Bring prefixed MutationObserver for older Chrome/Safari and Firefox
  // TODO: REMOVE THIS IF BLOCK WHEN POSSIBLE
  if (!window.MutationObserver) {
    window.MutationObserver =
      window.webkitMutationObserver || window.mozMutationObserver;
  }

  let _callback = callback;

  /**
   * Handle MutationObserver mutations
   * @function
   * @param {MutationRecord[]} mutations - The mutations
   * @access private
   * @since 0.1.0
   */
  const mutationHandler = (mutations) => {
    if (lastChange) {
      _callback(mutations.pop());
    } else {
      _callback(mutations);
    }
  };

  /**
   * The inner MutationObserver used to watch for mutations
   * @access private
   * @type MutationObserver
   * @const
   * @since 0.1.0
   */
  const observer = new MutationObserver(mutationHandler);

  /**
   * Spawn a new observer with the specified config
   * @function
   * @param {HTMLElement} _target - The element to observe
   * @param {MutationObserverInit} options - The config to respect
   * @access private
   * @since 0.1.0
   */
  function observe(_target, _options) {
    if (!(_target instanceof HTMLElement)) {
      throw new Error('You must set a target element!');
    }
    if (callback) {
      observer.observe(_target, _options);
    }
  }

  /**
   * The instance of DomObserver with the public API
   * @const
   * @access public
   * @since 0.1.0
   */
  const self = (() => {
    observe(target, options);
    return {
      /**
       * Add a target to the current observer
       * @function
       * @param {HTMLElement} _target - The element to observe
       * @returns {DomObserver} self - The current instance of dom-observer
       * @example <caption>Add a new element to an existent observer</caption>
       * var myElement = document.querySelector('#awesomeElement');
       * myObserver.addTarget(myElement);
       * @access public
       * @since 0.1.0
       */
      addTarget: (_target) => {
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
      andObserve: (_target, _options) => {
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
      changeCallback: (fn) => {
        _callback = fn;
        return self;
      },
      /**
       * Expose MutationObserver's takeRecords method
       * @function
       * @returns {MutationRecord[]} The array of mutations
       * @example <caption>Taking records</caption>
       * myObserver.takeRecords(); // Now do something with the info.
       * @access public
       * @since 0.1.0
       */
      takeRecords: () => { observer.takeRecords(); },
      /**
       * Clean the MutationObserver record pool and return this instance
       * @function
       * @returns {DomObserver} self - The current instance of dom-observer
       * @example <caption>Wiping the reports</caption>
       * myObserver.wipe(); // OK, clean.
       * @access public
       * @since 0.1.0
       */
      wipe: () => {
        observer.takeRecords();
        return self;
      },
      /**
       * Remove all previous observer configuration
       * @function
       * @returns {DomObserver} self - The current instance of dom-observer
       * @example <caption>Stopping all reporters</caption>
       * myObserver.disconnect(); // No more change reports
       * @access public
       * @since 0.1.0
       */
      removeAllTargets: () => {
        observer.disconnect();
        return self;
      },
    };
  })();

  return self;
};
