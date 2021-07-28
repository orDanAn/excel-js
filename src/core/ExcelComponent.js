import { DomListener } from './DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name;
    this.emitter = options.emitter;
    this.unsubScribers = [];

    this.prepare();
  }
  // создали хук перед событием init
  prepare() {

  }
  // Возвращаем шаблон компоненту
  toHTML() {
    return '';
  }
  // уведомляем слушателей про event
  // подписываемся на события
  $emit(event, ...args) {
    this.emitter.emit(event, ...args);
  }
  // устанавливаем слушателей
  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn);
    this.unsubScribers.push(unsub);
  }

  // инициализация компнента
  init() {
    this.initDomListeners();
  }
  // удаляем компонент
  destroy() {
    this.removeDomListeners();
    this.unsubScribers.forEach(unsub => unsub());
  }
}
