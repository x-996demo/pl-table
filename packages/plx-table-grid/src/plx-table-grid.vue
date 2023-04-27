<template>
    <div class="plTableBox" :style="[plTableHeight]">
        <plx-grid ref="singleTable"
                  class="singleTable"
                  style="width: 100%"
                  :data="isArrayFn(data) ? data : []"
                  :show-footer="summaryMethod ? showSummary : false"
                  :max-height="newMaxHeight"
                  :height="newHeight"
                  :border="border"
                  :stripe="stripe"
                  :row-key="rowKey"
                  :size="size"
                  :show-header="showHeader"
                  :show-overflow="showOverflow"
                  :footer-method="footerMethod"
                  :show-header-overflow="showHeaderOverflow"
                  :highlight-current-row="highlightCurrentRow"
                  :highlight-hover-row="highlightCurrentRow"
                  :row-class-name="rowClassName"
                  :cell-class-name="cellClassName"
                  :header-row-class-name="headerRowClassName"
                  :header-cell-class-name="headerCellClassName"
                  :header-row-style="headerRowStyle"
                  :header-cell-style="headerCellStyle"
                  :row-style="rowStyle"
                  :cell-style="cellStyle"
                  :sort-config="{ sortMethod: sortMethod, defaultSort: defaultSort }"
                  :span-method="arraySpanMethod"
                  @current-change="currentChange"
                  @select-change="plSelect"
                  @resizable-change="headerDragend"
                  @cell-mouseenter="cellMouseEnter"
                  @cell-mouseleave="cellMouseLeave"
                  @cell-click="cellClick"
                  @cell-dblclick="cellDblclick"
                  @cell-context-menu="rowContextmenu"
                  @header-cell-context-menu="headerContextmenu"
                  @radio-change="radioChange"
                  @header-cell-click="headerClick"
                  @select-all="selectAll"
                  @filter-change="filterChange"
                  @sort-change="sortChange"
                  @scroll="tableBodyScroll">
            <!--无数据布局-->
            <template slot="empty">
                <slot name="empty">{{ emptyText }}</slot>
            </template>
            <slot/>
        </plx-grid>
        <div class="myPagination" v-if="paginationShow" ref="myPagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="newcurrentPage"
                    :pager-count="pagerCount"
                    :page-sizes="pageSizes"
                    :page-size="newPageSize"
                    :layout="layout"
                    :total="total"/>
        </div>
        <div class="plDialog" ref="plDialog">
            <div style="width: 100%;height: 100%;" v-if="plDialogFals">
                <div class="table-cus-header">{{ fieldTitle }}</div>
                <div class="checkListBox">
                    <draggable tag="ul"
                               :options="{disabled: !fieldSort}"
                               v-model="newDialogData">
                        <li v-for="(item, index) in newDialogData" :key="index">
                            <el-checkbox v-model="item.state" :disabled="item.disabled">{{ item.name }}</el-checkbox>
                            <i class="iconfont"
                               :class="[amendBtnIcon || 'el-icon-edit']"
                               v-if="showAmend"
                               @click="amendField(item, index)"/>
                        </li>
                    </draggable>
                </div>
                <div class="table-cus-footer">
                    <el-button @click="closeModal()">取消</el-button>
                    <el-button type="primary" @click="confirmField">确定</el-button>
                    <el-button type="warning" @click="reset">重置</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import Vue from 'vue'
    import draggable from 'vuedraggable'
    import ElPagination from 'pl-table/packages/pagination'
    import { parseHeight } from './util'
    export default {
        name:'PlxTableGrid',
        components: {draggable, ElPagination},
        props: {
            showOverflow: { type: Boolean, default: true },
            showHeaderOverflow: { type: Boolean, default: true },
            data: {type: Array, default: () => []}, // 表格数据
            height: [String, Number],
            maxHeight: [String, Number],
            sortMethod: Function,
            dialogData: {type: Array, default: () => []}, // 选择显示字段数组
            defaultSort: Object, // 默认的排序列的 prop 和顺序
            stripe: {default: false, type: Boolean}, // 是否为斑马纹
            size: {default: '', type: String}, // Table 的尺寸
            showHeader: {default: true, type: Boolean}, // 是否显示表头
            emptyText: {default: '暂无数据', type: String}, // 空数据时显示的文本内容
            border: {default: true, type: Boolean}, // 是否显示纵向边框
            showSummary: {default: false, type: Boolean}, // 是否需要合计
            summaryMethod: Function, // 自定义的合计计算方法
            fieldSort: { default: true, type: Boolean }, // 字段排序
            rowKey: Boolean, // 支持树类型的数据。此时，必须要指定 row-key (注意，当开启useVirtual时，无效)
            highlightCurrentRow: { default: true, type: Boolean }, // 是否要高亮当前行
            showAmend: { default: false, type: Boolean }, // 是否显示修改字段名按钮(侧滑框)
            amendBtnIcon: { default: '', type: String }, // 修改字段按钮的图标(侧滑框)
            fieldTitle: { default: '选择显示字段', type: String }, // 弹框的标题(侧滑框)
            spanMethod: Function, // 合并行或列的计算方法
            rowClassName: [String, Function], // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
            rowStyle: [Object, Function], // 行的 style 的回调方法
            cellClassName: [String, Function], // 行单元格的 className 的回调方法
            cellStyle: [Object, Function], // 行单元格的 style 的回调方法
            headerRowClassName: [String, Function], // 表头行的 className 的回调方法
            headerRowStyle: [Object, Function], // 表头行的 style 的回调方法
            headerCellClassName: [String, Function], // 表头单元格的 className 的回调方法
            headerCellStyle: [Object, Function], // 表头单元格的 style 的回调方法
            paginationShow: {default: false, type: Boolean}, // 是否需要分页器
            total: {default: 0, type: Number}, // 总条数
            pagerCount: { default: 5, type: Number }, // 页码按钮的数量，当总页数超过该值时会折叠
            pageSize:{ default: 10, type: Number }, // 每页条数
            currentPage: { default: 1, type: Number }, // 当前页
            pageSizes: { default: () => [10, 20, 30, 50], type: Array }, // 每页显示个数选择器的选项设置
            layout: { default: 'total, sizes, prev, pager, next, jumper', type: String } // 分页组件布局，子组件名用逗号分隔
        },
        data () {
            return {
                _times: '', // 弹框定时器
                plDialogFals: false, // 侧滑弹框是否开启
                newDialogData: [], // 新自定义字段的数据
                aBox: '', // 蒙层节点
                newPageSize: '', // 每页条数
                newcurrentPage: '', // 当前页
                newHeight: null, // 表格高度
                newMaxHeight: null // 表格最大高度
            }
        },
        created () {
            this.newPageSize = this.pageSize
            this.newcurrentPage = this.currentPage
        },
        mounted () {
            this.$ready = true
        },
        computed: {
            plTableHeight() {
                if (this.height) {
                    return {
                        height: this.height + 'px'
                    };
                } else if (this.maxHeight) {
                    const maxHeight = parseHeight(this.maxHeight);
                    if (typeof maxHeight === 'number') {
                        return {
                            'max-height': this.maxHeight + 'px'
                        };
                    }
                }
                return {};
            }
        },
        methods: {
            // 分页器的事件
            handleSizeChange (val) {
                this.newPageSize = val
                this.$emit('handlePageSize', { size: this.newPageSize, page: this.newcurrentPage })
            },
            handleCurrentChange (val) {
                this.newcurrentPage = val
                this.$emit('handlePageSize', { size: this.newPageSize, page: this.newcurrentPage })
            },
            // 判断数组
            isArrayFn (value){
                if (typeof Array.isArray === 'function') {
                    return Array.isArray(value);
                } else {
                    return Object.prototype.toString.call(value) === '[object Array]';
                }
            },
            // 利用数组中的filter方法数组去重
            removal (data) {
                if (this.isArrayFn(data)) {
                    return data.filter(function(element,index,self){
                        return self.indexOf(element) === index;
                    })
                } else {
                    throw new Error('需要的是数组');
                }
            },
            // 数组对象去重的方法
            removalDataObj (arr, key) {
                if (this.isArrayFn(arr)) {
                    let result = [];
                    let obj = {};
                    for(let i =0; i<arr.length; i++){
                        if(!obj[arr[i].row[key]]){
                            result.push(arr[i]);
                            obj[arr[i].row[key]] = true;
                        }
                    }
                    return result
                } else {
                    throw new Error('需要的是数组');
                }
            },
            // 打开自定义字段框
            plDialogOpens () {
                this._times = null
                this.$refs.plDialog.style.width = 300 + 'px'
                this._times = setTimeout(() => {
                    this.plDialogFals = true
                }, 100)
                // 创建节点（主要用来弹出menu窗口时，不让起点击外面）
                this.aBox = document.createElement('div')
                this.aBox.className = 'modal-backdrop'
                this.aBox.style.display = 'block'
                this.aBox.onclick = () => {
                    this.closeModal()
                }
                document.body.appendChild(this.aBox)
            },
            // 关闭自定义字段框（取消选择）
            closeModal () {
                this.plDialogFals = false
                clearTimeout(this._times)
                this.$refs.plDialog.style.width = 0 + 'px'
                this.aBox.style.display = 'none'
                this.clearNode()
                this.newDialogData = JSON.parse(JSON.stringify(this.dialogData))
            },
            // 确认按钮
            confirmField () {
                this.$emit('show-field', this.newDialogData)
                this.plDialogFals = false
                clearTimeout(this._times)
                this.$refs.plDialog.style.width = 0 + 'px'
                this.aBox.style.display = 'none'
                this.clearNode()
            },
            // 重置按钮
            reset () {
                this.$emit('reset', this.newDialogData)
                this.plDialogFals = false
                clearTimeout(this._times)
                this.$refs.plDialog.style.width = 0 + 'px'
                this.aBox.style.display = 'none'
                this.clearNode()
            },
            // 修改字段名按钮事件
            amendField (item, index) {
                this.$emit('amend-field', item, index)
            },
            // 删除节点
            clearNode () {
                // 删除节点
                let parent = this.aBox ? this.aBox.parentNode : ''
                parent && parent.removeChild(this.aBox)
                let doms = document.getElementsByClassName('modal-backdrop')
                if (doms.length > 0) {
                    document.body.removeChild(doms[0])
                }
                this.aBox = null
            },

            // 表格方法

            // 合计的方法summaryMethod
            footerMethod (param) {
                if (typeof this.summaryMethod === 'function' && this.summaryMethod) {
                    return this.summaryMethod(param)
                } else {
                    return []
                }
            },
            // 合并行或列的计算方法
            arraySpanMethod (objs) {
                // 是否有条件开启合并列
                if (typeof this.spanMethod === 'function') {
                    return this.spanMethod(objs)
                } else {
                    return ''
                }
            },
            // 用于单选表格，设定某一行为选中行
            setCurrentRow (row) {
                if (row) {
                    this.$refs.singleTable.setCurrentRow(row);
                } else {
                    this.$refs.singleTable.setCurrentRow();
                }
            },
            // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
            toggleRowSelection (rows) {
                if (rows && this.isArrayFn(rows)) {
                    this.newtoggleRowSelections(rows)
                } else {
                    console.error('数据格式需要一个数组')
                }
            },
            // 用于多选表格，切换某一行的选中状态
            newtoggleRowSelections (datas) {
                if (datas.length > 0 && this.$refs.singleTable) {
                    datas.forEach(item => {
                        if (item.selected) {
                            this.$refs.singleTable.setCheckboxRow(item.row, item.selected)
                        } else if (item.selected === false) {
                            this.$refs.singleTable.setCheckboxRow(item.row, false)
                        } else if (item.selected === undefined) {
                            this.$refs.singleTable.setCheckboxRow(item.row, '')
                        }
                    })
                    // 当选择项发生变化时会触发该事件
                    const data = this.$refs.singleTable.getCheckboxRecords()
                    this.$emit('selection-change', data)
                }
            },
            // 用于多选表格，切换所有行的选中状态
            toggleAllSelection (checked = true) {
                if (this.$refs.singleTable) {
                    this.$refs.singleTable.setAllCheckboxRow(checked)
                    // 当选择项发生变化时会触发该事件
                    const data = this.$refs.singleTable.getCheckboxRecords()
                    this.$emit('selection-change', data)
                } else {
                    console.error('toggleAllSelection方法为找到，可能表格未加载完毕')
                }
            },
            // 用于多选表格，清空用户的选择
            clearSelection () {
                if (this.$refs.singleTable) {
                    this.$refs.singleTable.clearCheckboxRow()
                    // 当选择项发生变化时会触发该事件
                    const data = this.$refs.singleTable.getCheckboxRecords()
                    this.$emit('selection-change', data)
                } else {
                    console.error('clearSelection方法为找到，可能表格未加载完毕')
                }
            },
            // 用于清空排序条件，数据会恢复成未排序的状态
            clearSort () {
                this.$refs.singleTable.clearSort()
            },
            // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态
            clearFilter (columnKey) {
                this.$refs.singleTable.clearFilter(columnKey)
            },
            // 手动对 Table 进行排序
            sort (prop, order) {
                this.$refs.singleTable.sort(prop, order)
            },
            // 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
            doLayout () {
                this.$refs.singleTable.recalculate()
            },
            // 让表格滚动条回到顶部，和左侧
            pagingScrollTopLeft (top = 0, left = 0) {
                this.$refs.singleTable.scrollTo(left, top)
            },
            // 设置表格数据
            reloadData (data) {
                this.$refs.singleTable.reloadData(data)
            },
            // 设置表格高度
            setHeight () {
                if (!this.$ready && this.paginationShow) return Vue.nextTick(() => this.setHeight());
                const { myPagination } = this.$refs;
                if (this.height) {
                    this.newHeight = parseHeight(this.height) - (myPagination ? myPagination.offsetHeight : 0)
                    this.newMaxHeight = null
                } else if (this.maxHeight) {
                    this.newMaxHeight = parseHeight(this.maxHeight) - (myPagination ? myPagination.offsetHeight : 0)
                    this.newHeight = null
                }
            },

            // 表格事件

            // 表格滚动时会触发该事件
            tableBodyScroll ({type,fixed,scrollTop,scrollLeft,isX,isY},event) {
                let obj = {type,fixed,scrollTop,scrollLeft,isX,isY}
                // 当表格滚动暴露滚动事件
                this.$emit('table-body-scroll', obj, event)
            },
            // 当用户手动勾选全选 Checkbox 时触发的事件	selection
            selectAll ({selection}) {
                this.$emit('select-all', selection)
                // 当选择项发生变化时会触发该事件
                this.$emit('selection-change', selection)
            },
            // 当用户手动勾选数据行的 Checkbox 时触发的事件
            plSelect ({selection,reserves,checked,row}) {
                this.$emit('select', selection, row)
                // 当选择项发生变化时会触发该事件
                this.$emit('selection-change', selection)
            },
            // 只对 type=radio 有效，当手动勾选并且值发生改变时触发的事件
            radioChange ({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event) {
                this.$emit('radio-change', row, column)
            },
            // 当表格的排序条件发生变化的时候会触发该事件
            sortChange ({column,property,order}) {
                let objs = {column, prop: property, order}
                this.$emit('sort-change', objs)
            },
            // 当表格的当前行发生变化的时候会触发该事件
            currentChange ({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event) {
                this.$emit('current-change', row)
            },
            // 当表格的筛选条件发生变化的时候会触发该事件
            filterChange ({column,property,values,datas,filters}) {
                this.$emit('filter-change', filters)
            },
            // 当单元格 hover 进入时会触发该事件
            cellMouseEnter ({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event) {
                this.$emit('cell-mouse-enter', row, column, cell, event)
            },
            // 当单元格 hover 退出时会触发该事件
            cellMouseLeave ({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell}, event) {
                this.$emit('cell-mouse-leave', row, column, cell, event)
            },
            // 当某个单元格被点击时会触发该事件
            cellClick ({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell}, event) {
                this.$emit('cell-click', row, column, cell, event)
                // row-click	当某一行被点击时会触发该事件	row, event, column
                this.$emit('row-click', row, event, column)
            },
            // 当某个单元格被双击击时会触发该事件
            cellDblclick ({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event) {
                this.$emit('cell-dblclick', row, column, cell, event)
                // 当某一行被双击时会触发该事件
                this.$emit('row-dblclick', row, column, event)
            },
            // 单元格被鼠标右键点击时触发该事件
            rowContextmenu ({type,row,rowIndex,column,columnIndex,cell},event) {
                console.log(213121)
                this.$emit('row-contextmenu', row, column, event)
            },
            // 当某一列的表头被点击时会触发该事件
            headerClick ({triggerResizable,triggerSort,triggerFilter,$rowIndex,column,columnIndex,$columnIndex,cell},event) {
                this.$emit('header-click', column, event)
            },
            // 当某一列的表头被鼠标右键点击时触发该事件	column, event
            headerContextmenu ({type,column,columnIndex,cell},event) {
                this.$emit('header-contextmenu', column, event)
            },
            // 当拖动表头改变了列的宽度的时候会触发该事件(newWidth, oldWidth, column, event)
            headerDragend ({$rowIndex, column, columnIndex, $columnIndex, fixed, isHidden}) {
                let obj = {$rowIndex, column, columnIndex, $columnIndex, fixed, isHidden}
                this.$emit('header-dragend', obj)
            }
        },
        watch: {
            data: {
                immediate: true,
                handler (val) {
                    if (!this.isArrayFn(val)) {
                        throw new Error('表格数据需要的是数组格式，请检查你的数据格式');
                    }
                }
            },
            dialogData: {
                deep: true,
                immediate: true,
                handler (val) {
                    this.newDialogData = JSON.parse(JSON.stringify(val))
                }
            },
            currentPage (val) {
                this.newcurrentPage = val
            },
            pageSize (val) {
                this.newPageSize = val
            },
            height: {
                immediate: true,
                handler(value) {
                    this.setHeight();
                }
            },
            maxHeight: {
                immediate: true,
                handler(value) {
                    this.setHeight();
                }
            }
        }
    }
</script>
