import Vue from 'vue'
import 'xe-utils';
import plxyGrid from 'plxy-grid'
Vue.use(plxyGrid)
import PlxTableGrid from './src/plx-table-grid';
PlxTableGrid.install = function(Vue) {
    Vue.component(PlxTableGrid.name, PlxTableGrid);
};

export default PlxTableGrid;
