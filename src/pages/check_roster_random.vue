<template>
  <div>
    <group gutter="0">
      <x-header title="随机点名"></x-header>
    </group>
    <div class="box">
      <div class="img">
        <img
          :src=" activeStudent.Sex === 1 ? './static/image/stu_boy.png' : './static/image/stu_girl.png' "
          style="margin:6px;"
        >
        <p style="line-height:1.5; position:relative; top: -45px;">{{ activeStudent.StudentName }}</p>
        <p style="line-height:1.5; position:relative; top: -45px; color:#999;">{{ activeStudent.studyCode }}</p>
      </div>
    </div>
    <div style="padding: 0 20px; margin-top:15px;">
      <flexbox>
        <flexbox-item>
          <x-button :disabled="disabled2" @click.native="updateState(3, activeStudent.Id)" plain type="primary" style="color:green; border-color:#333;">请假</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button :disabled="disabled2" @click.native="updateState(1, activeStudent.Id)" plain type="primary" style="color:red; border-color:#333;">缺勤</x-button>
        </flexbox-item>
      </flexbox>
      <x-button type="primary" style="margin-top: 15px;" @click.native="start" :disabled="disabled">再点一次</x-button>
    </div>

    <toast v-model="showToast" type="text" :time="1000">{{ message }}</toast>
    <span style="position:fixed; top:200px;width:100%;text-align:center;" v-show="showLoad">
      <inline-loading></inline-loading>
      <p style="margin-top:10px;">加载中</p>
    </span>
  </div>
</template>
<script>
import { Group, XHeader, Flexbox, FlexboxItem, XButton, Toast, InlineLoading } from "vux"
import { getRequest } from '../lib/http';
import { mapState, mapMutations } from 'vuex';
const currentHost = `${Config.api.base}` + 'callIdspApi';

export default {
  name: 'Random',
  data() {
    return {
      showToast: false,
      message: '',
      disabled: false,
      disabled2: false,
      num: 0,
      activeStudent: {
        StudentName: '',
        Code: '',
        src: 'src/static/image/stu_boy.png'
      }
    }
  },
  computed: mapState(['showLoad']),
  components: {
    Group,
    XHeader,
    Flexbox,
    FlexboxItem,
    XButton,
    Toast,
    InlineLoading
  },
  created: function() {
    const _this = this;
    _this.SetShowLoad(1);
    const params = {
      actionName: 'attend/GetAttendDetails',
      AttendanceBatchId: sessionStorage.getItem('ActiveAttendanceId')
    }
    getRequest(params).then(res => {
      _this.SetShowLoad(0);
      if(res.data.code){
        const data = res.data.data;
        for(let i = data.length-1; i>=0; i-- ){
          if(data[i].State !== 1){
            data.splice(i,1)
          }
        }
        _this.studentList = data;
        _this.initStudent();
      }
    });
  },
  methods: {
    ...mapMutations(['SetShowLoad']),
    initStudent: function() {
      const _this = this;
      if(_this.studentList.length > 1){
        // 随机一个学生
        _this.randomNum(_this.studentList.length);
        // 设置 选择学生，并从学生列表删除该学生
        _this.activeStudent = _this.studentList[_this.num];
        _this.studentList.splice(_this.num, 1);

      }else if(_this.studentList.length === 1){
        _this.activeStudent = _this.studentList[0];
        _this.disabled = true;
        _this.disabled2 = false;
      }else{
        _this.disabled = true;
        _this.disabled2 = true;
        _this.showToast = true;
        _this.message = '已全部考勤';
      }
    },
    randomNum: function(length) {
      const _this = this;
      // 生成数组长度内(0-length) 的随机整数，
      _this.num = Math.floor(Math.random() * length);
    },
    start: function() {
      const _this = this;
      _this.disabled = true;
      _this.disabled2 = true;
      let timer1 = setInterval(function() {
        _this.randomNum(_this.studentList.length)
        // 设置 选中学生
        _this.activeStudent = _this.studentList[_this.num];
      }, 100);

      let timer2 = setTimeout(() => {
        clearInterval(timer1);
        // 从学生列表删除选中学生
        _this.studentList.splice(_this.num, 1);

        if(_this.studentList.length >= 1){
          _this.disabled = false;
          _this.disabled2 = false;
        }else{
          _this.disabled = true;
          _this.disabled2 = false;
        }
      }, 2000);
    },
    updateState: function(index, id) {
      const _this = this;
      const params = {
        actionName: 'attend/UpdateAttendDetail',
        attendDetailId: id,
        state: index + 1,
      };
      $.ajaxSettings.beforeSend = function (xhr) {
          // see https://github.com/madrobby/zepto/issues/274
          xhr.withCredentials = true;  // TODO(elsigh): Do this in zepto w/ xhrFields.
      };
      $.post(currentHost, params, function (res) {
          res = JSON.parse(res);
          if(res.code === 1) {
            _this.message = '学生出勤状态已更改';
          }else{
            _this.message = '修改学生出勤状态失败';
          }
          _this.showToast = true;
      });
    }
  }

};

</script>
<style scoped lang="less">
@import '~vux/src/styles/1px.less';
.box {
  text-align: center;
}

.img {
  margin: 80px auto;
  display: inline-block;
  width: 120px;
  height: 120px;
  border: 5px solid #ddd;
  border-radius: 10px;
  line-height: 120px;
}

</style>
