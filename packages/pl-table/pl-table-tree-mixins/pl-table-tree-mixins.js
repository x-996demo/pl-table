// 扩展el-table和pl-table
import { isArrayFn } from '../utils/common'
import methods from './methods'
import XEUtils from 'xe-utils/methods/xe-utils'
export default {
    props: {
        treeConfig: [Boolean, Object],// 树形结构配置项
    },
    data () {
        return {
            treeExpandeds: [], // 已经展开的节点
            copyPlTreeData: [], // 复制处理后的数据，这是有层级的
            plTreeData: [] // 对原始数据进行操作的数组
        }
    },
    computed: {
        // pl-table树节点的配置
        treeOpts () {
            return Object.assign({
                children: 'children',
                indent: 20,
                trigger: 'default',
                expandAll: false
            },this.treeConfig)
        }
    },
    methods: {
        ...methods,
        /**
         * 默认行为只允许执行一次
         */
        handleDefaults () {
            if (this.treeConfig) {
                this.handleDefaultTreeExpand()
            } else {
                this.setTreeTableData()
            }
        },
        /**
         * 处理默认展开树节点
         */
        handleDefaultTreeExpand () {
            let { treeConfig, treeOpts, plTreeData, rowKey } = this
            if (treeConfig) {
                let { expandAll, expandRowKeys } = treeOpts
                if (expandAll) {
                    this.setAllTreeExpansion()
                } else if (expandRowKeys) {
                    let defExpandeds = []
                    expandRowKeys.forEach(rowid => {
                        let matchObj = XEUtils.findTree(plTreeData, item => rowid === XEUtils.get(item, rowKey), treeOpts)
                        if (matchObj) {
                            defExpandeds.push(matchObj.item)
                        }
                    })
                    // 设置节点
                    this.setTreeExpansion(defExpandeds, true)
                } else {
                    // 重新加载数据
                    this.setTreeTableData()
                }
            }
        },
        // 初始化树形数据（只会在数据变化调用一次）
        plTreeInit () {
            // 深拷贝数据
            this.plTreeData =  XEUtils.clone(this.data, true)
            // 设置数据级别，计算第一列的左侧空间距
            this.plTreeData.forEach(item => {
                this.setDataLevel(item, 0);
            })
            this.copyPlTreeData = XEUtils.clone(this.plTreeData, true)
            // 初始化方法
            this.handleDefaults()
        },
        //展开变化
        triggerTreeExpandEvent (tabItem, type) {
            const {trigger, children} = this.treeOpts
            if (trigger === type && this.useVirtual && this.rowKey) {
                // 根据rowKey, 获取当前数据中的row，不改变表格数据，改变复制的数据
                let row = this.plTreeData.filter(item => item[this.rowKey] === tabItem[this.rowKey])[0]
                // row || children无子节点。不存在就返回
                if (!row || !row[children]) return
                // 设置节点
                this.setTreeExpansion(row, !row.pl_table_expand)
            }
        },
        //迭代：设置数据级别
        setDataLevel(data, level){
            //自定义数据的级别
            data.pl_table_level = level;
            if(isArrayFn(data[this.treeOpts.children])){
                data[this.treeOpts.children].forEach(childData => {
                    this.setDataLevel(childData, level + 1);
                })
            }
        },
        // 获取当前row对应的层级level
        getTreeLevel (row) {
            const rowInfo = this.plTreeData.filter(item=> item[this.rowKey] === row[this.rowKey])[0]
            return rowInfo.pl_table_level || 0
        },
        // 从树结构中遍历数据（杜绝大量数据遍历）
        eachTreeExpand (data) {
            let treefullData = []
            if (!data) return treefullData
            let hasChildren = (obj) => obj[this.treeOpts.children] !== undefined && obj[this.treeOpts.children] !== null
            let recursionFiltra = (arr) => arr.forEach(obj => {
                treefullData.push(obj)
                // 子节点存在展开，那么继续遍历(非常重要)
                if (hasChildren(obj) && obj.pl_table_expand) {
                    recursionFiltra(obj[this.treeOpts.children])
                }
            })
            if (hasChildren(data)) {
                recursionFiltra(data[this.treeOpts.children])
            }
            return treefullData
        },
        // 设置表格数据
        setTreeTableData () {
            let newData = JSON.parse(JSON.stringify(this.plTreeData))
            // 组装纯数据，给table
            newData.forEach(item=> {
                delete item.pl_table_expand
                delete item.pl_table_level
            })
            this.store.commit('setData', newData);
        }
    }
}
