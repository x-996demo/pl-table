<template>
  <!-- 使用 useVirtual 属性开启虚拟滚动 使用虚拟滚动时，必须要固定表格高度和行高 -->
  <div style="height: 100%;width: 100%;padding: 0 30px">
    <pl-table :data="data.tableData"
        @drag-change="dragChange"
        @selection-change="dragChange"
    >
      <pl-table-column
          width="120"
          type="drag"
          label="序号">
        </pl-table-column>
      <pl-table-column
          sortable
          width="120"
          prop="name"
          label="名字">
        </pl-table-column>
        <pl-table-column
          width="120"
          prop="age"
          label="年龄">
        </pl-table-column>
    </pl-table>
  </div>
</template>

<script>
  import PlTableColumn from '../../packages/table/src/table-column';
  // 下面是关于pl-table的树形数据的介绍，希望读完下面的文字

  // （最大数量500）当然你可以更多，那么只会导致你遍历时间多，页面等待时间长，（并非渲染节点时间长）
  // 另外 就以下的这个层级，总数据量展开后，就是 500 + 500 x 3 + 3 x 1 = 2003 的总数据量
  // 如果你 第一级是500， 第二级也是500， 第三级是10。 那么你的数据量就是 500 + 500 x 500 + 500 x 10 的总数据量，这是非常吓人的
  // 所以结合自己情况去给树数据，不要瞎乱给下面的数据，树节点避免不鸟去递归，如果你的数据量很大很大，那么你会死在遍历上。
  // 注意,注意，注意：并非第一级不能超过500，是想告诉你们嵌套里面子节点层级数据量不要太大。比如你可这样的： 第一级为1000， 第二级为2-5的数据量，
  // 第三级为2-5的数据量....， 那么这样算下来，就是 1000 + 1000 x 5  + 5 x 5  = 6025的数据量，应该是可以的，但是记住要是太大的嵌套数据。那只会导致
  // 程序卡在遍历数据上，因为程序需要慢慢去递归遍历。这是没有办法的。

  // 但是传统el-table  或者el-tree他们数据量超过200  就会卡。 所以我们已经很好的优化了这一点。不过看来对于树形数据的要求，应该数据量不会太大。
  // 你可以在pl-table的基础上去改改样式，就可以变相的去实现el-tree的组件了哦，你隐藏下头部，把行的高度给小一点。然后隐形边框线。是不是就是el-tree了呢？？？

  var dataList = Array.from({ length: 500 }, (_, idx) => ({
      id: idx + '_' + 1,
      date: '2016-05-03',
      name: 1,
      ab: '欢迎使用pl-table',
      address: idx,
      children: Array.from({ length: 3 }, (_, idx2) => ({
          id: idx + '_' + idx2 + '_' + 1,
          date: '2016-05-03',
          name: 1,
          ab: '欢迎使用pl-table',
          address: idx + '_' + idx2,
          children: Array.from({ length: 1 }, (_, idx3) => ({
              id: idx + '_' + idx2 + '_' + idx3 + '_' + 1,
              date: '2016-05-03',
              name: 1,
              ab: '欢迎使用pl-table',
              address: idx + '_' + idx2 + '_' + idx3
          }))
      }))
  }));
  export default {
    name: 'home',
    components: {
      PlTableColumn,
    },
    data() {
      return {
          data: {
              tableData: [{
                  name: '褚赢',
                  age: 1000,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '杨戬',
                  age: 30,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              },{
                  name: '褚赢1',
                  age: 20,
              },{
                  name: '孙悟空',
                  age: 100,
              }]
          },
      }
    },
    methods: {
       dragChange (val) {
            console.log(val)
        },
       selectable (row, index) {
            if (index === 1) {
                return false
            } else {
                return true
            }
        },
        // 合计
       summaryMethod ({ columns, data }) {
         // 平均值算法（不需要自己去掉）
          function cacl(arr, callback) {
              let ret;
              for (let i=0; i<arr.length;i++) {
                  ret = callback(arr[i], ret);
              }
              return ret;
          }
          // 平均值算法（不需要自己去掉）
          Array.prototype.sum = function () {
              return cacl(this, function (item, sum) {
                  if (typeof (sum) == 'undefined') {
                      return item;
                  }
                  else {
                      return sum += item;
                  }
              });
          };
           // 平均值算法（不需要自己去掉）
          Array.prototype.avg = function () {
              if (this.length == 0) {
                  return 0;
              }
              return this.sum(this) / this.length;
          };
          const means = [] // 合计
          const fenceSums = [] // 平均值
          columns.forEach((column, columnIndex) => {
                if (columnIndex === 0) {
                    means.push('合计')
                    fenceSums.push('平均值')
                } else {
                    const values = data.map(item => Number(item[column.property]));
                    // 合计
                    if (!values.every(value => isNaN(value))) {
                        means[columnIndex] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        // means[columnIndex] += ' 元'
                        // 改变了ele的合计方式，扩展了合计场景
                        // 你以为就只有上面这样玩吗？错啦，你还可以自定义样式哦
                        // means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span>'
                        means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span><br/><span>123</span>'
                    } else {
                        means[columnIndex] = '';
                    }
                    // 平均值
                    const precisions = [];
                    let notNumber = true;
                    values.forEach(value => {
                        if (!isNaN(value)) {
                            notNumber = false;
                            let decimal = ('' + value).split('.')[1];
                            precisions.push(decimal ? decimal.length : 0);
                        }
                    });
                    if (!notNumber) {
                        fenceSums[columnIndex] = values.avg()
                    } else {
                        fenceSums[columnIndex] = '';
                    }
                }
            })
          // 返回一个二维数组的表尾合计
          return [means, fenceSums]
      },
       setHei (val) {
           this.height = val
       },
       tableBodyScroll ({ scrollTop }, e) {
         this.top = scrollTop
       },
       allSelection () {
           this.$refs.plTable.toggleAllSelection()
       },
       clearSelection () {
         this.$refs.plTable.clearSelection()
         this.$refs.plTable2.clearSelection()
       },
       setData (num) {
            this.data.tableData = Array.from({ length: num }, (_, idx) => ({
              id: idx + 1,
              date: '2016-05-03',
              name: 1,
              ab: '欢迎使用pl-table',
              address: 1 + idx
            }))
       },
       scrollBottom () {
          this.$refs.plTable.scrollBottom()
       },
       pagingScrollTopLeft (val) {
          this.$refs.plTable.pagingScrollTopLeft(val, 0)
       },
       // 分页事件
       handlePageSize ({page, size}) {
         console.log(page, size)
       },
        // 获取已经展开的节点
       getTreeExpansionEvent () {
          console.log(this.$refs.plTreeTable.getTreeExpandRecords())
       }
    }
  }
</script>
<style>
  body, html {
    margin: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  body ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 5px;
      border-radius: 5px;
      background-color: rgba(144, 147, 153, 0.5);
  }
    .selectTr td {
        background: #ccc !important;
        color: red !important;
    }
</style>
