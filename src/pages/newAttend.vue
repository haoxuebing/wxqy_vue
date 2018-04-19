<template>
  <div>
    <group gutter="0">
      <x-header title="新建考勤" :left-options="{showBack: ($route.query.showBack ? true : false)}"></x-header>
      <popup-picker
        title="<span style='color:red'>＊</span>考勤课程"
        :columns="1"
        :data="list"
        v-model="value"
        @on-change="onChange"
        :display-format="format"
      ></popup-picker>
      <a class="weui-cell weui-cell_access" href="javascript:;" v-if="showAddNum">
        <div class="weui-cell__hd"><span style='color:red'>＊</span></div>
        <div class="weui-cell__bd weui-cell_primary">
            <p>节次</p>
        </div>
        <span style="color:#999999;font-size: 17px;">
          第
            <input type="number"
              v-focus
              v-model="Num"
              name="textNum"
              id="textNum"
              style="border: none;display:inline-block;height:26px;width:25px;font-size:17px;outline:none;"
          />
          
          节</span>
      </a>
    </group>
    <div style="padding: 200px 20px 0 20px;">
      <x-button type="primary" @click.native="submit">开始考勤</x-button>
    </div>
    <toast v-model="showToast" type="text" :time="1000">{{ message }}</toast>
    <alert v-model="showAlert" title="">您不是任课教师或综合课程负责人</alert>
    <span style="position:fixed; top:200px;width:100%;text-align:center;" v-show="showLoad">
      <inline-loading></inline-loading>
      <p style="margin-top:10px;">加载中</p>
    </span>
  </div>
</template>
<script>
import { Group, XHeader, PopupPicker, XButton, XSwitch, Toast, Alert, InlineLoading } from "vux"
import store from "../store/attend";
import { mapState, mapActions } from "vuex";
import * as TypeScore from '../store/types/types_score';
const currentHost = `${Config.api.base}` + 'callIdspApi';
export default {
  name: 'NewAttend',
  components: {
    Group,
    XHeader,
    PopupPicker,
    XButton,
    XSwitch,
    Toast,
    Alert,
    InlineLoading
  },
  data() {
    return {
      showToast: false,
      showAlert: false,
      message: '',
      showAddNum: false,
      isType2: false,
      Num: '',
      value: ['请选择'],
      format: function(value, name, type) {
        return `${name}`
      },
      ActiveCourseGroup: '',
      ActiveAttendanceName: ''
    }
  },
  computed:{
    ...mapState(['CourseGroupList', 'isLoaded', 'showLoad']),
    list: function() {
      const _this = this;
      let newList = [];
      for(let i in _this.CourseGroupList){
        newList.push({
            name: _this.CourseGroupList[i].CourseGroupName,
            value: _this.CourseGroupList[i].CourseGroupId + '',
            type: _this.CourseGroupList[i].Type + '',
        });
      }
      !newList.length && _this.isLoaded ? _this.showAlert = true : _this.showAlert = false;
      return newList;
    }
  },
  directives: {
    focus: {
        inserted: function (el) {
          el.focus();
        }
    }
  },
  created:function() {
    // 异步取数据
    !this.isLoaded ? this.Get_UserInfo() : false ;
  },
  methods: {
    ...mapActions(['Get_UserInfo', 'Get_CourseGroupList']),
    onChange(val) {
      const _this = this;
      //修改 CourseGroupId
      if(val[0]){
        for(let i in _this.CourseGroupList){
          if(val[0] === _this.CourseGroupList[i].CourseGroupId){
            _this.ActiveCourseGroup = _this.CourseGroupList[i];
            _this.ActiveAttendanceName = _this.CourseGroupList[i].CourseGroupName;

            if(_this.CourseGroupList[i].Type === 1){
              _this.showAddNum = true;
            }else{
              _this.showAddNum = false;
              _this.isType2 = true;
            }
          }
        }
      }
    },
    submit: function() {
      const _this = this;
      //修改 CourseGroupName
      let access = _this.sureAccess();
      if(access === true){
        // 新建考勤
        sessionStorage.setItem('Num', _this.Num);
        const params = {
          actionName: 'attend/CreateAttendanceBatch',
          courseGroupId: _this.ActiveCourseGroup.CourseGroupId,
          courseGroupType: _this.ActiveCourseGroup.Type,
          courseGroupName: _this.ActiveCourseGroup.CourseGroupName,
          whatTime: _this.isType2 ? '' : _this.Num
        };
        $.ajaxSettings.beforeSend = function(xhr) {
          xhr.withCredentials = true;
        };
        $.post(currentHost, params, function(res){
          res = JSON.parse(res);
          if(res.code === 1){
            const data = res.data;
            sessionStorage.setItem('ActiveAttendanceName', data.CourseGroupName);
            sessionStorage.setItem('ActiveAttendanceId', data.Id);
            _this.$router.push('/check_roster');
          }else{
          }
        })
      }else{
        _this.message = access;
        _this.showToast = true;
      }
    },
    sureAccess: function(){
      const _this = this;
      const msg1 = '请先选择要考勤的课程';
      const msg2 = '请输入节次';
      if (_this.isType2) { //综合活动
        return true; // 
      }else if (_this.ActiveAttendanceName && _this.Num) { // 课程，节次都已选
        return true;
      }else if(!_this.ActiveAttendanceName){ // 未选课程
        return msg1;
      }else if(!_this.Num){ // 未输入节次
        return msg2;
      }
    }
  }
};
</script>

<style scoped>
</style>
