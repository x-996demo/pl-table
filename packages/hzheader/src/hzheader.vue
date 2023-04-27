<template slot-scope="scope">
    <div class="hz-header" style="width:100%; height: 23px; cursor: pointer; user-select: none;" @click="click">
      <i class="el-icon-circle-check" v-if="full"></i>
      <i class="el-icon-circle-close" v-else-if="empty"></i>
      <i class="el-icon-remove-outline" v-else></i>
    </div>
</template>

<script>
import _ from 'underscore';

export default {
  name: 'HzHeader',
  componentName: 'HzHeader',
  props: {
      store: {
        type: Object,
      },
      $ix: {
        type: Number,
      },
      $index: {
        type: Number,
      },
      item: {
          type: Object,
          default: {}
      },
      selectable: {
          type: Function,
          default: () => {
              return true;
          }
      }
  },
  data() {
    return {
    };
  },
  computed: {
    full() {
      return this.store.states.selected.length === this.store.states.data.length;
    },
    empty() {
      return this.store.states.selected.length === 0;
    }
  },
  methods: {
    click() {
      if (this.full) {
        this.store.dragcleanup();
      } else {
        this.store.dragall();
      }
    }
  },
};
</script>