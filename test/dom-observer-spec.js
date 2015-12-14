// PhantomJS prior to 2.0 doesn't support MutationObserver
import MutationObserverShim from 'mutationobserver-shim';
import { expect } from 'chai';
import observer from '../src/dom-observer.js';
import sinon from 'sinon';

let myObserver;
let myElement;
let mySpy;

describe('dom-observer', function test() {
  this.slow(250);
  this.timeout(500);
  beforeEach(() => {
    myElement = document.body;
    mySpy = sinon.spy();
  });
  describe('API', () => {
    beforeEach(() => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
    });

    it('should expose addTarget', () => {
      expect(myObserver).itself.to.respondTo('addTarget');
    });

    it('should expose andObserve', () => {
      expect(myObserver).itself.to.respondTo('andObserve');
    });

    it('should expose changeCallback', () => {
      expect(myObserver).itself.to.respondTo('changeCallback');
    });

    it('should expose takeRecords', () => {
      expect(myObserver).itself.to.respondTo('takeRecords');
    });

    it('should expose wipe', () => {
      expect(myObserver).itself.to.respondTo('wipe');
    });

    it('should expose removeAllTargets', () => {
      expect(myObserver).itself.to.respondTo('removeAllTargets');
    });

    it('should not expose the inner observer', () => {
      expect(myObserver.observer).to.be.undefined;
    });
  });

  describe('observer', () => {
    describe('initialization', () => {
      it('should start observing and reporting when instantiated', (done) => {
        myObserver = observer(myElement, { attributes: true }, mySpy, false);
        document.body.setAttribute('test', 'test');
        setTimeout(() => {
          if (mySpy.calledOnce) {
            done();
          } else {
            throw new Error('Attribute change not reported on time!');
          }
        }, 100);
      });

      it('should not accept initiating without a target', () => {
        const createObserver = () => {
          return observer(false, { attributes: true }, mySpy, false);
        };
        expect(createObserver).to.throw(Error);
      });

      it('should bubble MutationObserver errors', () => {
        const createObserver = () => {
          return observer(myElement, null, mySpy, false);
        };
        expect(createObserver).to.throw(Error);
      });
    });

    describe('changes', () => {
      it('should bundle quick changes', (done) => {
        myObserver = observer(myElement, { attributes: true }, mySpy, false);
        document.body.setAttribute('test', 'test');
        document.body.setAttribute('test', 'test2');
        setTimeout(() => {
          if (mySpy.calledOnce) {
            done();
          } else {
            throw new Error('Must bundle quick changes in one callback');
          }
        }, 100);
      });

      it('should detect changes on attributes', (done) => {
        myObserver = observer(myElement, { attributes: true }, mySpy, false);
        document.body.setAttribute('test', 'test');
        setTimeout(() => {
          if (mySpy.calledOnce) {
            done();
          } else {
            throw new Error('Must bundle quick changes in one callback');
          }
        }, 100);
      });

      it('should detect changes on childList', (done) => {
        myObserver = observer(myElement, { childList: true }, mySpy, false);
        document.body.appendChild(document.createElement('h1'));
        setTimeout(() => {
          if (mySpy.called) {
            done();
          } else {
            throw new Error('Not reporting childList changes');
          }
        }, 100);
      });
    });

    describe('property observing', () => {
      it('should not report changes unrelated to the one specified', (done) => {
        myObserver = observer(myElement, { attributes: true }, mySpy, false);
        document.body.appendChild(document.createElement('h1'));
        setTimeout(() => {
          if (!mySpy.called) {
            done();
          } else {
            throw new Error('Should report only attribute changes');
          }
        }, 100);
      });
    });
  });
});
