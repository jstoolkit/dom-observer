export default (target, options, callback, lastChange) => {
  // Bring prefixed MutationObserver for older Chrome/Safari and Firefox
  // TODO: REMOVE THIS IF BLOCK WHEN POSSIBLE
  if (!window.MutationObserver) {
    window.MutationObserver =
      window.webkitMutationObserver || window.mozMutationObserver;
  }

  let _callback = callback;

  const mutationHandler = (mutations) => {
    if (lastChange) {
      _callback(mutations.pop());
    } else {
      _callback(mutations);
    }
  };
  const observer = new MutationObserver(mutationHandler);

  function observe(_target, _options) {
    if (!(_target instanceof HTMLElement)) {
      throw new Error('You must set a target element!');
    }
    if (callback) {
      observer.observe(_target, _options);
    }
  }

  const self = (() => {
    observe(target, options);
    return {
      addTarget: (_target) => {
        observe(_target, options);
        return self;
      },
      andObserve: (_target, _options) => {
        observe(_target, _options);
        return self;
      },
      changeCallback: (fn) => {
        _callback = fn;
        return self;
      },
      takeRecords: () => { observer.takeRecords(); },
      wipe: () => {
        observer.takeRecords();
        return self;
      },
      removeAllTargets: () => {
        observer.disconnect();
        return self;
      },
    };
  })();

  return self;
};
