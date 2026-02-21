(function () {
  const COUNTER_CONTAINER_ID = 'visit-counter';
  const SCRIPT_ID = 'busuanzi-script';
  const BUSUANZI_SCRIPT_SRC = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';

  function isLocalEnvironment() {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
  }

  function getCounterContainer() {
    return document.getElementById(COUNTER_CONTAINER_ID);
  }

  function setCounterVisible(visible) {
    const container = getCounterContainer();
    if (!container) {
      return;
    }

    container.hidden = !visible;
  }

  function injectBusuanziScript() {
    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = BUSUANZI_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }

  function setupCounter() {
    const container = getCounterContainer();
    if (!container) {
      return;
    }

    if (isLocalEnvironment()) {
      setCounterVisible(false);
      return;
    }

    setCounterVisible(true);
    injectBusuanziScript();
  }

  function bindMutationObserver() {
    if (document.documentElement.dataset.busuanziObserverBound === 'true') {
      return;
    }

    const observer = new MutationObserver(function () {
      setupCounter();
    });

    observer.observe(document.documentElement, {childList: true, subtree: true});
    document.documentElement.dataset.busuanziObserverBound = 'true';
  }

  setupCounter();
  bindMutationObserver();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCounter);
  }

  window.addEventListener('load', setupCounter);
})();
