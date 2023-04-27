<template slot-scope="scope">
    <div class="hz-selection" style="width:100%; height: 23px; cursor: pointer; user-select: none;" @mousedown="dragmousedown" @mouseover="dragmousemove" @mouseup="mouseupFunc">
        <span style="display: inline-block; width: 2em;">{{ $index + 1 }}</span>
        <i class="el-icon-circle-check" style="color: blue;" v-if="selectable(item) === true && checked === false && checking === true"></i>
        <i class="el-icon-remove-outline" style="color: gray;" v-else-if="selectable(item) === false && checked === false && checking === true"></i>
        <i class="el-icon-circle-check" style="color: red;" v-else-if="checked === true && checking === true"></i>
        <i class="el-icon-circle-check" style="color: green;" v-if="checked === true && checking === false"></i>
    </div>
</template>

<script>
import _ from 'underscore';

export default {
  name: 'HzSelection',
  componentName: 'HzSelection',
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
    checking() {
      let selecting = this.store.selecting;
      for (let ix in selecting) {
        if (selecting[ix] === this.$ix) {
          return true;
        }
      }
      return false;
    },
    checked() {
      let selected = this.store.states.selected;
      for (let ix in selected) {
        if (selected[ix] === this.$ix) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    dragmousedown() {
      this.store.dragmousedown(this.$ix);
    },
    mouseupFunc() {
      this.store.dragmouseup(this.selectable, this.item);
    },
    dragmousemove() {
      this.store.dragmousemove(this.$ix);
    },
  },
};
</script>