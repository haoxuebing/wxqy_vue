import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as TypeScore from './types/types_score';
import { getRequest } from "../lib/http";
var qs = require('qs');

const currentHost = `${Config.api.base}` + 'callIdspApi';
const getUserInfoHost = `${Config.api.base}` + 'getUserInfo';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    isLoaded:false,
    showLoad:true,
    userInfo: {
    },
    AciveSchoolPeriodId:'',
    schoolperiodslist: [],
    CourseGroupList: [],
    course: {
      coursegroupname: '',
      coursegroupid: ''
    },
    ActiveCourseGroup: {
      CourseGroupName: '请选择',
      CourseGroupId: '',
      type: 0
    },
    studentList: [],
  },
  getter: {

  },
  mutations: {
    // 加载中
    SetShowLoad(state, showLoad) {
      state.showLoad = showLoad;
    },
    // 用户信息
    SetUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 某年级教学班列表
    SetCourseGroupList(state, list) {
      state.CourseGroupList = list;
    },
    // 当前年级id
    SetSchoolPeriodId(state, schoolperiodid) {
      state.userInfo.schoolperiodid = schoolperiodid;
    },
    // 选中年级数据
    SetAciveSchoolPeriodId(state, AciveSchoolPeriodId) {
      state.AciveSchoolPeriodId = AciveSchoolPeriodId;
    },
    // 年级列表
    SetSchoolPeriodsList(state, schoolperiodslist) {
      state.schoolperiodslist = schoolperiodslist;
    },
    // 课程信息
    SetCourse(state, course) {
      state.course.coursegroupname = course.CourseGroupName;
      state.course.coursegroupid = course.CourseGroupId;
    }
  },
  //异步事件
  actions: {
    //获取当前用户信息
    [TypeScore.Get_UserInfo]({ state, commit, dispatch }) {
      return new Promise(function (resolve, reject) {
        // 异步取数据
        axios.get(getUserInfoHost, {
          withCredentials: true
        }).then(res => {
          const data = res.data;
          commit('SetUserInfo', data);
          commit('SetSchoolPeriodsList', data.schoolperiods)
          commit('SetAciveSchoolPeriodId', data.schoolperiodid)
          dispatch('Get_CourseGroupList', data.schoolperiodid);
          resolve();
        }).catch(err => {
          console.log(err)
        })
        
      })
    },
    // 获取年级列表
    [TypeScore.Get_SchoolPeriodsList]({ state, commit, dispatch }) {
      return new Promise(function (resolve, reject) {
        state.showLoad = true;
        const params = {
          actionName: 'eval/GetSchoolPeriods'
        };
        getRequest(params).then(res => {
          state.showLoad = false;
          if (res.data.code) {
            commit('SetSchoolPeriodsList', res.data.data);
          }
          resolve();
        });
      })
    },
    // 获取教学班或者综合活动
    [TypeScore.Get_CourseGroupList]({ state, commit }, schoolperiodid) {
      return new Promise(function (resolve, reject) {
        state.showLoad = true;
        // 异步取数据
        const params = {
          actionName: 'attend/GetCourseGroupList',
          schoolperiodid: schoolperiodid
        };
        getRequest(params).then(data => {
          state.showLoad = false;
          if (data.data.code === 1) {
            // console.log(data)
            const newList = data.data.data;
            // 数据存sessionStorage
            //sessionStorage.setItem('CourseGroupList', JSON.stringify(newList));

            // 数据存内存store
            commit('SetCourseGroupList', newList);
            state.isLoaded = true;
          };
          resolve();
        });
      })
    },

  },

});
//export default store;
