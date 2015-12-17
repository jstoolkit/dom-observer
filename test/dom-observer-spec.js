// PhantomJS prior to 2.0 doesn't support MutationObserver
import MutationObserverShim from 'mutationobserver-shim';
import { expect } from 'chai';
import observer from '../src/dom-observer.js';
import sinon from 'sinon';

let myObserver;
let myElement;
let textNode;
let mySpy;

before(() => {
  textNode = document.createTextNode('teste');
  document.body.appendChild(textNode);
  document.body.appendChild(document.createElement('div'));
});
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

    it('should expose disconnect', () => {
      expect(myObserver).itself.to.respondTo('disconnect');
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
          if (mySpy.args[0][0][0].type === 'attributes') {
            done();
          } else {
            throw new Error('Not reporting attribute changes');
          }
        }, 100);
      });

      it('should detect changes on childList', (done) => {
        myObserver = observer(myElement, { childList: true }, mySpy, false);
        document.body.appendChild(document.createElement('h1'));
        setTimeout(() => {
          if (mySpy.args[0][0][0].type === 'childList') {
            done();
          } else {
            throw new Error('Not reporting childList changes');
          }
        }, 100);
      });

      it('should detect changes on characterData', (done) => {
        myObserver = observer(myElement, {
          childList: true,
          characterData: true,
          subtree: true,
        }, mySpy, false);
        textNode.textContent = 'change';
        setTimeout(() => {
          if (mySpy.args[0][0][0].type === 'characterData') {
            done();
          } else {
            throw new Error('Not reporting characterData changes');
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

      it('should report the final change when lastChange is truthy', (done) => {
        myObserver = observer(myElement, {
          attributes: true,
          childList: true,
        }, mySpy, true);
        document.body.setAttribute('test', 'test');
        document.body.appendChild(document.createElement('h1'));
        setTimeout(() => {
          if (mySpy.args[0][0].type === 'childList') {
            done();
          } else {
            throw new Error('Should report only last changes');
          }
        }, 100);
      });
    });
  });

  describe('addTarget', () => {
    it('must require a valid HTMLElement', () => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      const registerTarget = () => {
        myObserver.addTarget(false);
      };
      expect(registerTarget).to.throw(Error);
    });

    it('should return self', () => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      expect(myObserver.addTarget(document.querySelector('div')))
        .to.be.equal(myObserver);
    });

    it('should report changes releated to the new target', (done) => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      const myNewTarget = document.querySelector('div');
      myObserver.addTarget(myNewTarget);
      myNewTarget.setAttribute('test', 'test');
      setTimeout(() => {
        if (mySpy.args[0][0][0].type === 'attributes') {
          done();
        } else {
          throw new Error('Not reporting changes on the new target');
        }
      }, 100);
    });
  });

  describe('andObserve', () => {
    it('must require a valid HTMLElement', () => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      const registerTarget = () => {
        myObserver.andObserve(false, {});
      };
      expect(registerTarget).to.throw(Error);
    });

    it('should return self', () => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      expect(myObserver.andObserve(document.querySelector('div'), {
        childList: true,
      })).to.be.equal(myObserver);
    });

    it('should report changes releated to the new observer', (done) => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      const myNewTarget = document.querySelector('div');
      myObserver.andObserve(myNewTarget, { childList: true });
      myNewTarget.appendChild(document.createElement('h1'));
      setTimeout(() => {
        if (mySpy.args[0][0][0].type === 'childList') {
          done();
        } else {
          throw new Error('Not reporting changes on the new target');
        }
      }, 100);
    });
  });

  describe('changeCallback', () => {
    it('should return self', () => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      expect(myObserver.changeCallback(() => {})).to.be.equal(myObserver);
    });

    it('should report changes to the new callback', (done) => {
      const testFunc = () => { return; };
      myObserver = observer(myElement, { attributes: true }, testFunc, false);
      myObserver.changeCallback(mySpy);
      document.body.setAttribute('test', 'test2');
      setTimeout(() => {
        if (mySpy.called) {
          done();
        } else {
          throw new Error('Not reporting attribute change');
        }
      }, 100);
    });
  });

  describe('takeRecords', () => {
    it('should return the records in store', () => {
      myObserver = observer(myElement, {
        attributes: true,
        childList: true,
      }, mySpy, false);
      document.body.setAttribute('test', 'test3');
      document.body.appendChild(document.createElement('div'));
      expect(myObserver.takeRecords().length).to.eql(2);
    });
  });

  describe('wipe', () => {
    it('should return self', () => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      expect(myObserver.wipe()).to.be.equal(myObserver);
    });

    it('should clean the record list', () => {
      myObserver = observer(myElement, {
        attributes: true,
        childList: true,
      }, mySpy, false);
      document.body.setAttribute('test', 'test3');
      document.body.appendChild(document.createElement('div'));
      myObserver.wipe();
      expect(myObserver.takeRecords().length).to.eql(0);
    });
  });

  describe('disconnect', () => {
    it('should return self', () => {
      myObserver = observer(myElement, { attributes: true }, mySpy, false);
      expect(myObserver.disconnect()).to.be.equal(myObserver);
    });

    it('should stop reporting changes after disconnect', () => {
      myObserver = observer(myElement, {
        attributes: true,
        childList: true,
      }, mySpy, false);
      myObserver.disconnect();
      document.body.setAttribute('test', 'test3');
      document.body.appendChild(document.createElement('div'));
      expect(myObserver.takeRecords().length).to.eql(0);
    });
  });
});
