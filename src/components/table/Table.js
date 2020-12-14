import { ExcelComponent } from '../../core/ExcelComponent';
import { createTable } from './table.template';
import {resizeHendler} from './table.resize';
import {shouldResize} from './table.function';

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown'],
    });
  }

  toHTML() {
    return createTable(20);
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHendler(this.$root, event);
    }
  }
}
