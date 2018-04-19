<template>
  <div>
    <group gutter="0" style="position: fixed; top: 0px; width: 100%; z-index: 10;">
      <x-header :title="CourseGroupName"></x-header>
    </group>
    <card style="padding-top:46px;" v-show="showTotal">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r"><span>应到</span>{{ totalAttend.ClassCount + '人'}}</div>
        <div class="vux-1px-r"><span style="color: green">出勤</span>{{ totalAttend.AttendCount + '人'}}</div>
        <div class="vux-1px-r"><span style="color: red">缺勤</span>{{ totalAttend.AbsenceCount + '人'}}</div>
        <div class="vux-1px-r"><span style="color: orange">迟到</span>{{ totalAttend.LateCount + '人'}}</div>
        <div><span style="color: green">请假</span>{{ totalAttend.LeaveCount + '人'}}</div>
      </div>
    </card>
    <group gutter="0" style="padding-bottom: 42px;">
      <cell :title="student.StudentName"
        :inline-desc="student.Code"
        v-for="(student) of studentList"
        :key="student.StudentId"
      >
        <img slot="icon"
          width="40"
          style="display:block;margin-right:5px;"
          :src="student.Sex === 1 ? boy : girl"
        />
        <CheckBtn
          :id="student.Id"
          :value="student.State"
          :btnColor="btn_color"
          @btnHandle="changeData"
        ></CheckBtn>
      </cell>
    </group>
    <group gutter="0" style="position:fixed; bottom: 0; width:100%;">
      <x-button
        type="default"
        @click.native="toRandom"
      >随机点名</x-button>
    </group>
    <toast v-model="showToast" type="text" :time="1000">{{ message }}</toast>
    <span style="position:fixed; top:200px;width:100%;text-align:center;" v-show="showLoad">
      <inline-loading></inline-loading>
      <p style="margin-top:10px;">加载中</p>
    </span>
  </div>
</template>
<script>
import { Group, XHeader, XButton, Card, Cell, Flexbox, FlexboxItem, Toast, InlineLoading } from "vux"
import store from "../store/attend";
import CheckBtn from "./components/check_btn";
import { mapState, mapMutations } from "vuex";
import { getRequest } from '../lib/http';

export default {
  name: 'manualAttendance',
  data() {
    return {
      showToast: false,
      message: '',
      btn_color: ['green', 'red', 'orange', 'green'],
      studentList: [],
      totalAttend: {},
      showTotal: false,
      boy: "./static/image/stu_boy.png",
      girl: "./static/image/stu_girl.png"
    }
  },
  components: {
    Group,
    XHeader,
    XButton,
    Card,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    CheckBtn,
    Toast,
    InlineLoading
  },
  computed: {
    ...mapState(['showLoad']),
    CourseGroupName() {
      return sessionStorage.getItem('ActiveAttendanceName');
    },
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
        this.studentList = res.data.data;
      }
    });

    const params2 = {
      actionName: 'attend/GetAttendanceBatchById',
      id: sessionStorage.getItem('ActiveAttendanceId')
    }
    getRequest(params2).then(res => {
      if(res.data.code){
        this.totalAttend = res.data.data;
        this.showTotal = true;
      }
    });
  },
  methods: {
    ...mapMutations(['SetShowLoad']),
    changeData: function(data) {
      const _this = this;
      _this.totalAttend = data;
      _this.message = '学生出勤状态已更改';
      _this.showToast = true;
    },
    toRandom: function () {
      this.$router.push('/check_roster_random');
    }
  }
};

</script>
<style scoped lang="less">
.weui-panel {
  margin: 0; 
  // background:  #fbf9fe;
}

.card-demo-flex {
  display: flex;
}

.card-demo-content01 {
  padding: 10px 0;
}

.card-padding {
  padding: 15px;
}

.card-demo-flex>div {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 300;
}

.card-demo-flex span {
  margin-bottom: 20px;
  display: block;
}

.btn_attend {
  color: green;
  border: 1px solid green;
  display: inline-block;
  width: 80px;
  height: 35px;
  border-radius: 35px;
  line-height: 35px;
  text-align: center;
}
</style>
