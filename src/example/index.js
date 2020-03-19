import whenDomReady from 'when-dom-ready';
import init from './init';

(() => {
  whenDomReady().then(() => {
    init();
  });
})();
