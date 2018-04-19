<template>
  <div>
    <transition name="fade" v-for="(item, index) in list_btn" :key="index">
      <x-button
        plain
        mini
        v-show="show_btn[index]"
        @click.native="set_attend"
        type="primary"
        style="margin-top:0; margin-left:2px;"
        class="btn"
        :class=" 'btn_' + btnColor[index]"
      >{{ item }}
      </x-button>
    </transition>
  </div>
</template>
<script>
import { XButton } from "vux"
const currentHost = `${Config.api.base}` + 'callIdspApi';

export default {
  name: 'CheackBtn',
  components: {
    XButton
  },
  data() {
    return {
      list_btn:['出勤', '缺勤', '迟到', '请假'],
      btn_text: '出勤',
      show_btn: [],
      btnState: this.value
    }
  },
  props: {
    id:{
      type: String
    },
    value: {
      type: Number
    },
    btnColor: {
      type: Array
    }
  },
  computed: {

  },
  created: function() {
    this.set_show_btn();
  },

  methods: {
    set_show_btn: function() {
      const btn_group = [];
      for (let i = 1; i <= this.list_btn.length; i++) {
        if (i != this.value) {
          btn_group.push(0);
        } else {
          btn_group.push(1);
        }
      }
      this.show_btn = btn_group;
    },
    set_data: function(e) { //上传数据
      const _this = this;
      const state = $(e.currentTarget).index() + 1;

      console.log('now',state)
      console.log('before',_this.btnState)
      if(state !== _this.btnState) {
        _this.btnState = state;
        const params = {
          actionName: 'attend/UpdateAttendDetail',
          attendDetailId: _this.id,
          state: state,
        };
        $.ajaxSettings.beforeSend = function (xhr) {
            // see https://github.com/madrobby/zepto/issues/274
            xhr.withCredentials = true;  // TODO(elsigh): Do this in zepto w/ xhrFields.
        };
        $.post(currentHost, params, function (res) {
            res = JSON.parse(res);
            if(res.code === 1) {
              _this.$emit('btnHandle', res.data);
            }
        });
      }
    },
    set_attend: function(e) {
      const _this = this;
      // showbtn number
      let show_btn_num = 0;
      for (let i = 0; i < _this.show_btn.length; i++) {
        _this.show_btn[i] ? show_btn_num++ : show_btn_num;
      }
      // 如果显示的按钮只有一个
      if (show_btn_num == 1) {
        for (let i = 0; i < _this.show_btn.length; i++) {
          _this.show_btn.splice(i, 1, 1)
        }
      } else { // 如果按钮全部显示
        for (let i = 0; i < _this.show_btn.length; i++) {
          _this.show_btn.splice(i, 1, 0)
        }
        let k = $(e.currentTarget).index();
        _this.show_btn.splice(k, 1, 1)
        _this.set_data(e);
      }
    },
  }

};

</script>
<style lang="less" scoped>
.btn {
  border-radius: 99px;
  padding: 0 0.7em;
  margin: 0
}

.btn_red {
  border-color: red;
  color: red;
}

.btn_orange {
  border-color: orange;
  color: orange;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

</style>
