import { ExcelComponent } from '../../core/ExcelComponent';
import { createTable } from './table.template';
import {resizeHandler} from './table.resize';
import {shouldResize, isCell, matrix, nextSelector} from './table.function';
import { TableSelection } from './TableSelection';
import { $ } from '../../core/dom';
import * as actions from '../../redux/actions';
import { DEFAULT_STYLES } from '../../constants';
import { parse } from '../../core/parse';

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      subscribe: [],
      ...options,
    });
  }

  toHTML() {
    return createTable(20, this.store.getState());
  }

  prepare() {
    this.selection = new TableSelection;
  }

  init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);


    this.$on('formula:input',
        value => {
          console.log(value);
          this.selection.current
              .attr('data-value', value)
              .text(parse(value));

          this.updateTextInStore(value);
        });

    this.$on('formula:done',
        () => {
          this.selection.current.focus();
        }
    );

    this.$on('toolbar:appStyle', value => {
      this.selection.applyStyle(value);
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds,
      }));
    });
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(Object.keys(DEFAULT_STYLES));
    this.$dispatch(actions.changeStyles(styles));
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize(data));
      console.log(data);
    } catch (e) {
      console.error('resizeError: ', e);
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event);
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        const $cells = matrix(this.selection.current, $target)
            .map(id => this.$root.find(`[data-id="${id}"]`));
        this.selection.selectGroup($cells);
      } else {
        this.selectCell($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowRight',
      'ArrowLeft',
      'ArrowDown',
      'ArrowUp',
    ];

    const {key} = event;

    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current.id(true);
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next);
    }
  }

  updateTextInStore(text) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value: text,
    }));
  }

  onInput(event) {
    // this.$emit('table:input', $(event.target));
    const text = $(event.target).text();
    this.updateTextInStore(text);
  }
}


