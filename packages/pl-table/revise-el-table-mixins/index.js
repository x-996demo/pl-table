import Table from '../../../packages/table';

import './table-extend'
import tableMixins from './table.mixins'
import plTableTreeMixins from '../pl-table-tree-mixins/pl-table-tree-mixins'
if (!Table.mixins) {
  Table.mixins = []
}
Table.mixins.push(tableMixins)
Table.mixins.push(plTableTreeMixins)
