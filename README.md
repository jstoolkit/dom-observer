# dom-observer

[![Build]](https://circleci.com/gh/jstoolkit/dom-observer/tree/master) [![SemVer]](http://semver.org/)
[![License]](LICENSE)

[![Tests](https://saucelabs.com/browser-matrix/dom-observer-oss.svg)](https://saucelabs.com/u/dom-observer-oss)

An abstraction for [Mutation Observer](https://developer.mozilla.org/pt-BR/docs/Web/API/MutationObserver) with some extra features in ~1kb gzipped.

Useful to observe an DOM element for changes without taking too much hit on performance, the [Mutation Observer](https://developer.mozilla.org/pt-BR/docs/Web/API/MutationObserver) technique is used by many libraries and frameworks.

This lib intention is to provide quick and simple access to the Mutation Observer features by abstracting the API into a simple function call and adding some handy methods.

## Getting Started

As usual most package managers are supported.

### NPM

`npm install dom-observer`

### Bower

`bower install dom-observer`

### Direct Download

1. [Download ZIP](https://github.com/jstoolkit/dom-observer/archive/v0.1.0.zip)
2. Unzip
3. Grab the JS in the `dist` folder.
4. Profit!

### CDN

[RawGit](https://cdn.rawgit.com/jstoolkit/dom-observer/v0.1.0/dist/dom-observer.min.js)

## Basic Usage

It's really simple if you know how Mutation Observers work.

This lib is designed to ease your life when dealing with MOs.

Take a look at this:

```javascript
// My function that handle mutations
function handleMutations(mutations) {
  mutations.forEach(mutation, () => {
    console.log('YO', mutation);
  });
}

// Import the module, a global var is exposed too if you're not into modules
import observe from 'dom-observer';
const myTarget = document.body;
const myObserver = observe(myTarget, handleMutations);
```

That would be the same as doing the following using just the MutationObserver:

```javascript
// My function that handle mutations
function handleMutations(mutations) {
  mutations.forEach(mutation, () => {
    console.log('YO', mutation);
  });
}

const myTarget = document.body;
const myObserver = new MutationObserver(handleMutations);
myObserver.observe(myTarget, {
  attributes: true,
  childList: true,
  characterData: true
});
```

Notice that with the lib we default to all 3 properties (attributes, childList and characterData) true when you pass no object.

Of course you can specify to just observe attributes by setting it explicitly to true, then the lib will respect that.

In fact, the observe function second argument is MutationObserverInit object. Meaning it will respect options like `subtree` or `attributeFilter` too. Please check the [MO docs](https://developer.mozilla.org/pt-BR/docs/Web/API/MutationObserver#MutationObserverInit) if you're lost.

As you would expect the callback, in this case the `handleMutations` function, receives as first argument an array of [MutationRecord](https://developer.mozilla.org/pt-BR/docs/Web/API/MutationObserver#MutationRecord) so you can handle the DOM mutations as you please.

### Adding targets to the observer

It's not recommended but you can add a new target to an existent observer with `addTarget`.

The lib allows you to add a new target while maintaining the config from the constructor.

```javascript
myObserver.addTarget(document.querySelector('#myElement'));
```

### Adding a new target with new config

If you want to add an entirely new target with config you can do it too with `andObserve`.

```javascript
myObserver.andObserve(document.querySelector('#myElement'), {
  attributes: true
});
```

### Chaning the function that handles mutations on the fly

You can change the callback you set on the observe function later on with `changeCallback`.

```javascript
function myNewFunc(mutations) {
  console.log('I\'m handling the changes now!');
}
myObserver.changeCallback(myNewFunc);
```

### Taking records

This mirrors the behaviors of the original Mutation Observer `takeRecords()` method. It works as you expect.

```javascript
myObserver.takeRecords(); // Will return the records cached
```

### Wipe

This new handy function wiped the records cache and returns a chainable instance of `dom-observer`.

```javascript
myObserver.wipe(); // Cache is now clean and returns myObserver
```

### Chaining

The lib was designed to make it easy to chain functionality.

```javascript
const myObserver = observe(myTarget, handleMutations)
  .addTarget(document.querySelector('#otherElement'))
  .andObserve(document.querySelector('#yetAnotherElement'), {
    childList: true
  });
```

## Docs

[We are working to put them in the wiki](https://github.com/jstoolkit/dom-observer/issues/2)

As of now please check the `docs` folder. It works best if you clone the project and use your local browser.

## License

[MIT License](LICENSE)

[Build]: https://img.shields.io/circleci/project/jstoolkit/dom-observer/master.svg
[SemVer]: https://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: https://img.shields.io/github/license/jstoolkit/dom-observer.svg
