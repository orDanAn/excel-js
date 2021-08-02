import { DEFAULT_STYLES, DEFAULT_TITLE } from '../constants';
import {storage} from '../core/utils';

const defaultState = {
  rowState: {},
  colState: {},
  dataState: {},
  styleState: {},
  currentText: '',
  currentStyles: DEFAULT_STYLES,
  title: DEFAULT_TITLE,
};

const normalize = state => ({
  ...state,
  currentStyles: DEFAULT_STYLES,
  currentText: '',
});

export const initialState = storage('excel-state')
  ? normalize(storage('excel-state'))
  : defaultState;
