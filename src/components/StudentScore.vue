<template>
    <div>
        <div>
            <loading :show="studentScore.isShowLoad" text="加载中..."></loading>
        </div>

        <div v-if="!studentScore.isShowLoad">
            <x-header :left-options="{showBack: false}" style="backgroundColor:rgb(100, 100, 100)" >行为规范得分</x-header>
            <group :title="schoolPeriodName">
                <cell :title="studentScore.StudentName" :inline-desc="studentScore.StudyCode">
                    <div>
                        <span :class="scoreColor" style="font-size:200%">{{studentScore.Score}}</span>
                    </div>
                </cell>
            </group>
            
            <group title="明细">
                <cell v-for="n in studentScore.Details" :title="n.ScoreItem" :key="n.Id" :inline-desc="n.ScoreTime" @click.native="OnClick(n)" link="/ScoreDetail"  is-link>
                    <div>
                        <span :class="n.Score>0?green:red">{{n.Score}}</span>
                    </div>
                </cell>
            </group>
        </div>
    </div>
</template>
<script>
import { Group, Cell, XHeader, XButton, Loading } from "vux";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import axios from "axios";
import { clearTimeout, clearInterval } from "timers";

var studentScore = {
  isShowLoad: true,
  Score: "",
  StudentId: "",
  StudentName: "",
  StudyCode: "",
  Details: []
};

export default {
  components: {
    Group,
    Cell,
    XHeader,
    XButton,
    Loading
  },
  data() {
    return {
      studentScore: studentScore
    };
  },
  computed: {
    ...mapState(["userInfo", "course", "isLoaded", "currentHost"]),
    ...mapGetters(["schoolPeriodName"]),
    scoreColor() {
      if (studentScore.Score < 100) {
        return "red";
      } else {
        return "green";
      }
    },
    red() {
      return "red";
    },
    green() {
      return "green";
    }
  },
  methods: {
    ...mapActions(["Check_PeriodCourse", "Get_UserInfo", "setStudentScore"]),
    ...mapMutations(["setScoreDetail"]),
    Sumit() {},
    OnClick(n) {
      this.setScoreDetail(n);
    }
  },
  mounted() {
    var query = this.$route.query;
    var state = this.$store.state;
    if (!state.isLoaded) {
      this.Get_UserInfo().then(result => {
        if (result.userInfo.students.length > 1) {
          this.$router.push({ path: "/ChoiceStudent" });
        } else
          axios
            .get(result.currentHost, {
              params: {
                actionName: "XWGFScore/GetXWGFScoreByStudentId",
                schoolperiodid: result.userInfo.schoolperiodid,
                periodCourseId: result.course.periodCourseId,
                studentId: result.userInfo.studentid
              },
              withCredentials: true
            })
            .then(data => {
              studentScore.StudentName = data.data.data.StudentName;
              studentScore.StudyCode = data.data.data.StudyCode;
              studentScore.StudentId = data.data.data.StudentId;
              studentScore.Score = data.data.data.Score;
              studentScore.Details = data.data.data.Details;
              studentScore.isShowLoad = false;
            })
            .catch(err => {
              console.log(err);
            });
      });
    } else {
      axios
        .get(state.currentHost, {
          params: {
            actionName: "XWGFScore/GetXWGFScoreByStudentId",
            schoolperiodid: state.userInfo.schoolperiodid,
            periodCourseId: state.course.periodCourseId,
            studentId: state.userInfo.studentid
          },
          withCredentials: true
        })
        .then(data => {
          studentScore.StudentName = data.data.data.StudentName;
          studentScore.StudyCode = data.data.data.StudyCode;
          studentScore.StudentId = data.data.data.StudentId;
          studentScore.Score = data.data.data.Score;
          studentScore.Details = data.data.data.Details;
          studentScore.isShowLoad = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.red {
  color: red;
  font-weight: bold;
}
.green {
  color: green;
  font-weight: bold;
}
</style>
