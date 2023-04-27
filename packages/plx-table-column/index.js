import { Column } from 'plxy-grid'
Column.install = function(Vue) {
  Vue.component(Column.name, Column);
};

export default Column;
