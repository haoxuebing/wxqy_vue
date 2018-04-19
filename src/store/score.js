import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
var qs = require('qs');
// import VueResource from 'vue-resource';
import * as TypeScore from './types/types_score';
axios.defaults.withCredentials = true;
// Vue.use(VueResource);
Vue.use(Vuex);
const currentHost = `${Config.api.base}`+'callIdspApi';
const getUserInfoHost = `${Config.api.base}`+'getUserInfo';
export default new Vuex.Store({
    //状态树数据源  辅助函数mapState
    state: {
        userInfo: {
        },
        xwgfProject: {},
        course: {
            periodCourseId: '',
            courseGroupId: ''
        },
        scoreDetail:{},
        studentScore:{},
        studentId: '',
        studentName: '',
        score: '',
        behaviorPrincipleId: '',
        behaviorPrincipleName: '',
        isLoaded:false,
        currentHost:`${Config.api.base}`+'callIdspApi',
        isShowAlert:false
    },
    //全局计算属性 辅助函数mapGetters
    getters: {
        schoolPeriodName:state=>{
            var schoolperiodid=state.userInfo.schoolperiodid;
            return state.userInfo.schoolperiods.filter(d=>d.id===schoolperiodid)[0].name;
        }
    },
    //修改全局属性
    mutations: {
        [TypeScore.Set_Student](state, student) {
            state.studentId = student.studentId;
            state.studentName = student.studentName;
        },
        setbehaviorPrinciple(state, behaviorPrinciple) {
            state.behaviorPrincipleId = behaviorPrinciple.behaviorPrincipleId;
            state.behaviorPrincipleName = behaviorPrinciple.behaviorPrincipleName;
            state.score = behaviorPrinciple.score;
        },
        setUserInfo(state,userinfo){
            state.userInfo=userinfo;
        },
        setCourse(state,course){
            state.course.courseGroupId=course.courseGroupId;
            state.course.periodCourseId=course.periodCourseId;
            state.isLoaded=true;
        }, 
        setScore(state,score){
            state.score=score;
        },
        setScoreDetail(state,scoreDetail){
            state.scoreDetail=scoreDetail;
        },   
        setStudentScore(state,score){
            state.studentScore.StudentName=score.StudentName;
            state.studentScore.StudyCode=score.StudyCode;
            state.studentScore.StudentId=score.StudentId;
            state.studentScore.Score=score.Score;
            state.studentScore.Details=score.Details;
        },
        choiceStudent(state,studentid){
            state.userInfo.studentid=studentid
        }
    },
    //异步事件
    actions: {
        //获取当前学期行为规范课程
        [TypeScore.Check_PeriodCourse](context,schoolPeriodId) {

            return new Promise(function(resolve,reject){
                axios.get(currentHost, {
                    params: {
                        schoolPeriodId: schoolPeriodId,
                        actionName: 'XWGFScore/CheckPeriodCourse'
                    }, withCredentials: true
                }).then(data => {
                    if(data.data.code===1){
                        context.commit('setCourse',data.data.data);
                    }
                    resolve();
                }).catch(err => {
    
                })
            })
            
        },
        //获取当前用户信息
        [TypeScore.Get_UserInfo](context) {
            return new Promise(function(resolve,reject){
                axios.get(getUserInfoHost, {
                    withCredentials: true
                }).then(data => {
                    console.log('userData')
                    console.log(data.data)
                    context.commit('setUserInfo',data.data);
                    context.dispatch('Check_PeriodCourse',data.data.schoolperiodid).then(result=>{
                        resolve(context.state);
                    })
                }).catch(err => console.log(err));
            })
            
        },
        //获取行为规范项目列表
        [TypeScore.Get_XWGFProject](context) {
            axios.get(currentHost, {
                params: {
                    actionName: 'XWGFScore/GetXWGFProject',
                },
                withCredentials: true
            }).then((data) => {
                context.state.xwgfProject = data;
            }).catch((err) => console.log(err));
        },
        //更新学生成绩
        [TypeScore.Update_Score](context,remark) {
            context.state.isShowAlert=false;
            return new Promise(function(resolve,reject){
                axios({
                    url:currentHost,
                    method:'POST',
                    data:qs.stringify({
                        actionName:'XWGFScore/UpdateScore',
                        periodCourseId: context.state.course.periodCourseId,
                        courseGroupId: context.state.course.courseGroupId,
                        behaviorPrincipleId: context.state.behaviorPrincipleId,
                        studentId: context.state.studentId,
                        remark: remark,
                        score: context.state.score
                    }),         
                    withCredentials: true
                }).then(function (result) {
                    context.state.isShowAlert=true;    
                    context.state.studentId=''
                    context.state.studentName=''
                    context.state.score=''
                    context.state.behaviorPrincipleId=''
                    context.state.behaviorPrincipleName=''
                    resolve({code:1});
                }).catch(function (result) { });

            })
            
        }
    }
});