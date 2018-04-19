<template>
  <div>
    <div class="weui-cells__title">{{ title }}</div>
    <div class="weui-cells weui-cells_radio yx-cells">
        <a class="weui-cell weui-cell_access" href="javascript:;" @click="isOpen">
          <div class="weui-cell__bd">
            <p>{{ name }}</p>
          </div>
          <div class="weui-cell__ft yx-cell-arrow-transition" :class="open? 'yx-cell-arrow-up' : 'yx-cell-arrow-down' ">
          </div>
        </a>
        <label class="weui-cell weui-check__label" @click="showClick" :for="'radio'+ insertIntoId + index" v-show="open" v-for="(item,index) in newOptions" :key="index">
          <div class="weui-cell__bd">
            <p>{{ item.value }}</p> 
          </div>
          <div class="weui-cell__ft">
            <input type="radio" checked="checked" class="weui-check" :name="NewRadioName" :id="'radio'+ insertIntoId + index" :value="item.key">
            <span class="weui-icon-checked"></span>
          </div>
        </label>
      </div>
  </div>
</template>
<script>

import 'weui'
import Lib from '../lib/public.js'

export default {
  name: 'listRadio',
  props: {
    title: String,
    name: String,
    radioName: String,
    options: {
      type: Array,
      default: function () {
        return []
      }
    },
  },
  data: function() {
    return {
      open: 0,
      insertIntoId: Lib.randomString(4)
    }
  },
  computed: {
    newMsg: function() {
      return this.title;
    },
    newOptions: function() {
      return this.options;
    },
    NewRadioName: function() {
      const name = this.radioName ? this.radioName : 'radioName'
      return name;
    }
  },
  components: {

  },
  methods: {
    isOpen: function() {
      console.log('click')
      this.open === 1 ? this.open = 0 : this.open = 1;

    },
    showClick: function(){
      console.log('click')
      console.log($(this))
      $(this).parent().find('label').attr('checked','')
      $(this).attr('checked','checked')
    }
  },

  beforeCreate: function () {
    console.log(Lib.randomString(4))
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.yx-cells {
  /*background-color: #f8f8f8;*/
  /*margin:0;*/
}

.yx-cell-arrow-up:after {
  webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
}

.yx-cell-arrow-down:after {
  webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
}

.yx-cell-arrow-transition:after {
  -webkit-transition: -webkit-transform 300ms;
  transition: -webkit-transform 300ms;
  transition: transform 300ms;
  transition: transform 300ms, -webkit-transform 300ms;
}

</style>
