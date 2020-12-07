import {capitalize} from './utils';

export class DomListener {
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error('No $root provide for DomListener');
    }
    this.$root = $root;
    this.listeners = listeners;
  }

  initDomListeners() {
    // console.log(this.listeners);
    this.listeners.forEach(listener => {
      const method = getMethodName(listener);
      const name = this.name || '';
      if (!this[method]) {
        throw new Error(
            `Method ${method} is not implemented in ${name} Component`
        );
      }
      this[method] = this[method].bind(this);
      // смотри dom.js метод on
      this.$root.on(listener, this[method]);
    });
  }

  removeDomListeners() {
    this.listeners.forEach(listener => {
      const method = getMethodName(listener);

      this.$root.off(listener, this[method]);
    });
  }
}

function getMethodName(eventName) {
  return 'on' + capitalize(eventName);
}
