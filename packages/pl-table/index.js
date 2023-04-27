import './revise-el-table-mixins'
import PlTable from './src/plTable';

PlTable.install = function(Vue) {
  Vue.component(PlTable.name, PlTable);
};

export default PlTable;
