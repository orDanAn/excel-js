import { toInlineStyle } from '../../core/utils';
import { DEFAULT_STYLES } from '../../constants';
import { parse } from '../../core/parse';

const CODES = {
  A: 65,
  Z: 90,
};

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 24;

function getWidth(state, index) {
  return (state[index] || DEFAULT_WIDTH) + 'px';
}

function getHeight(state, index) {
  return (state[index] || DEFAULT_HEIGHT) + 'px';
}

function toCell(state, row) {
  return function(_, col) {
    const id = `${row}:${col}`;
    const width = getWidth(state.colState, col);
    const data = state.dataState[id];
    const styles = toInlineStyle({...DEFAULT_STYLES, ...state.styleState[id]});
    return `
    <div
      class="cell"
      contenteditable
      data-col=${col}
      data-id=${id}
      data-type="cell"
      data-value="${data || ''}"
      style="${styles}; width: ${width}"
    >${parse(data) || ''}
    </div>
     `;
  };
}

function toColumn({col, index, width}) {
  return `
    <div class="column"
    data-type="resizeble"
    data-col=${index}
    style="width: ${width}">
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `;
}

function createRow(index, content, state) {
  const resize = index
    ? '<div class="row-resize" data-resize="row"></div>'
    : '';
  const height = getHeight(state, index);
  return `
    <div
      style="height: ${height}"
      class="row"
      data-type="resizeble"
      data-row="${index}">
      <div class="row-info">
        ${index ? index : ''}
        ${resize}        
        </div>
      <div class="row-data">${content}</div>
    </div>
  `;
}


function toChar(_, index) {
  return String.fromCharCode(CODES.A + index);
}

function withWidthFrom(state) {
  return function(col, index) {
    return {
      col, index, width: getWidth(state.colState, index),
    };
  };
}

export function createTable(rowsCount = 15, state = {}) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(withWidthFrom(state))
      .map(toColumn)
      .join('');

  rows.push(createRow(null, cols, {}));

  for (let i = 0; i < rowsCount; i++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(toCell(state, i))
        .join('');
    rows.push(createRow(i + 1, cells, state.rowState));
  }

  return rows.join('');
}


