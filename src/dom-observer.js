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
  * @param {MutationRecord[]|MutationRecord} mutations - Report array of changes
  * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
  */

/**
 * Instantiate dom-observer
 * @param {HTMLElement} target - The element to observe
 * @param {changeCallback} callback - The function that will receive the reports
 * @param {MutationObserverInit} [options] - The object with the observer config
 * @param {Object} [options={}] - Object containing onlyFirstChange and onlyLastChange
 * @access public
 * @exports dom-observer
 * @example <caption>Instantiates an observer for all elements in body</caption>
 * var observer = require('dom-observer');
 * @returns {DomObserver} self - The newly created instance of DomObserver
 * var myObserver = observer(document.body, myCallback, { subtree: true });
 * @since 0.1.0
 */
const makeObserver = (target, callback, options = {}) => {
  const { onlyLastChange = false, onlyFirstChange = false } = options;
  // Bring prefixed MutationObserver for older Chrome/Safari and Firefox
  // TODO: REMOVE THIS VARIABLE WHEN POSSIBLE
  const MutationObserver = window.MutationObserver ||
                           window.WebKitMutationObserver ||
                           window.MozMutationObserver;

  let self;
  let currentCallback = callback;

  /**
   * Handle MutationObserver mutations
   * @function
   * @param {MutationRecord[]} _mutations - The mutations
   * @access private
   * @since 0.1.0
   */
  const mutationHandler = (_mutations) => {
    if (onlyFirstChange) {
      self.wipe();
      self.disconnect();
      return currentCallback(_mutations);
    }
    if (onlyLastChange) return currentCallback(_mutations.pop());
    return currentCallback(_mutations);
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
   * @param {MutationObserverInit} [options] - The config to respect
   * @access private
   * @since 0.1.0
   */
  function observe(_target, _options) {
    const config = _options;
    const { attributes, childList, characterData } = config;
    if (!(attributes || childList || characterData)) {
      config.attributes = true;
      config.childList = true;
      config.characterData = true;
    }
    if (!(_target instanceof HTMLElement)) {
      throw new Error('You must set a target element!');
    }
    if (currentCallback) {
      observer.observe(_target, config);
    }
  }

  /**
   * The instance of DomObserver with the public API
   * @const
   * @access public
   * @since 0.1.0
   */
  self = (() => {
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
       * myObserver.callback = myNewFunc;
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 1.0.0
       */
      set callback(_fn) {
        currentCallback = _fn;
        return self;
      },
      get callback() {
        return currentCallback;
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
      takeRecords: () => observer.takeRecords(),
      /**
       * Clean the MutationObserver record pool and return this instance
       * @function
       * @example <caption>Wiping the reports</caption>
       * myObserver.wipe(); // OK, clean.
       * @returns {DomObserver} self - The current instance of dom-observer
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
       * @example <caption>Stopping all reporters</caption>
       * myObserver.disconnect(); // No more change reports
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      disconnect: () => {
        observer.disconnect();
        return self;
      },
    };
  })();

  return self;
};

export default makeObserver;
