<template>
  <div>
    <group gutter="0">
      <x-header
        title="出勤记录"
        style="position:fixed;top:0;width:100%;z-index: 10;"
        :left-options="{showBack: ($route.query.showBack ? true : false)}"
      ></x-header>
      <div style="padding-top: 46px;">
        <cell :title="item.name + '（' + item.teacher + '）'"
          :inline-desc=" item.time "
          v-for="(item) of list"
          :key="item.id"
        >
          <span :style="myColor(item.state)"> {{ item.mark }}</span>
        </cell>
      </div>
    </group>
    <toast v-model="showToast" type="text" :time="1000">{{ message }}</toast>
    <span style="position:fixed; top:200px;width:100%;text-align:center;" v-show="showLoad">
      <inline-loading></inline-loading>
      <p style="margin-top:10px;">加载中</p>
    </span>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { Group, XHeader, Cell, Toast, InlineLoading } from "vux"
const currentHost = `${Config.api.base}` + 'callIdspApi';
import axios from "axios";
import { formatDate } from "../lib/format";

export default {
  name: 'AttendDetails',
  components: {
    Group,
    XHeader,
    Cell,
    Toast,
    InlineLoading
  },
  data() {
    return {
      showToast: false,
      message: '暂无出勤记录',
      list: [],
    }
  },
  computed: mapState(['userInfo', 'showLoad']),
  created() {
    this.fetchData();
    
    if(!this.$route.query.showBack){
      window.addEventListener('popstate',function(){
        window.history.go(-1); //屏蔽浏览器自带的后退键 
      })
    }
  },
  methods: {
    ...mapMutations(['SetShowLoad']),
    ...mapActions(['Get_UserInfo']),
    fetchData: async function() {
      const _this = this;
      _this.SetShowLoad(1);
      const params = {
        actionName: 'attend/GetAttendDetailsByStudentId',
        studentId: sessionStorage.getItem('studentId'),
        schoolperiodid: sessionStorage.getItem('schoolperiodid'),
      }
      _this.getRequest(params).then(res => {
        _this.SetShowLoad(false);
        if(res.data.code){
          const data = res.data.data;
          const list = [];
          for(const i in data) {
            const time = formatDate(data[i].CreatedTime) 
              + ' ' + (data[i].WhatTime ? '第'+ data[i].WhatTime + '节': '');
            let mark = '出勤';
            if(data[i].State === 2) {
              mark = '缺勤';
            }else if(data[i].State === 3) {
              mark = '迟到';
            }else if(data[i].State === 4) {
              mark = '请假';
            }

            list.push({
              name: data[i].CourseGroupName,
              id: data[i].Id,
              teacher: data[i].CreatorName,
              time: time,
              state: data[i].State,
              mark: mark
            });
          }
          _this.list = list;
          !_this.list.length ? _this.showToast = true : false;
        }
      })
    },
    myColor: function(state) {
      let myStyle = {}
      switch (state) {
        case 1:
          myStyle = {
            color: 'green'
          };
          break;
        case 2:
          myStyle = {
            color: 'red'
          };
          break;
        case 3:
          myStyle = {
            color: 'orange'
          };
          break;
        case 4:
          myStyle = {
            color: 'green'
          };
          break;
      }
      return myStyle;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
