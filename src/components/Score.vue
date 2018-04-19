<template>
    <div>
        <x-header :left-options="{showBack: false}" style="backgroundColor:rgb(100, 100, 100)">
            <span>教师评分</span>
        </x-header>

        <!-- <alert v-model="isShowAlert" title="Congratulations" content="Your Message is sent successfully~"></alert> -->
        <group>
            <cell title="选择学生"  :value="studentName" is-link link="/StudentList" ></cell>
        </group>

        <group>
            <cell  title="行为规范项目" :value="behaviorPrincipleName" is-link link="/ScoreItem"></cell>
        </group>
        
        <group>
            <x-input title="得分" placeholder="" type="number" :value="score" placeholder-align="right" @on-blur="onBlur" text-align="right"></x-input>
        </group>
        
        <group> 
            <x-textarea :max="200" v-model="value" placeholder="评语" ></x-textarea>
        </group>
        <x-button type="primary" action-type="button" @click.native="Sumit">提交</x-button>

        <toast v-model="isSumit" :time="1000">提交成功</toast>
    </div>
</template>

<script>
import {
  Group,
  Cell,
  XInput,
  XTextarea,
  XButton,
  XHeader,
  Alert,
  Toast
} from "vux";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import axios from "axios";
export default {
  components: {
    Group,
    Cell,
    XInput,
    XTextarea,
    XButton,
    XHeader,
    Alert,
    Toast
  },
  data() {
    return {
      //:this.$store.state.isShowAlert,
      value: "",
      isSumit: false
    };
  },
  computed: {
    ...mapState([
      "studentId",
      "studentName",
      "behaviorPrincipleName",
      "score",
      "remark",
      "schoolPeriodId",
      "periodCourseId",
      "courseGroupId",
      "currentHost"
    ]),
    behaviorPrincipleName: function() {
      if (this.$store.state.behaviorPrincipleName.length > 10) {
        return this.$store.state.behaviorPrincipleName.substr(0, 8) + "...";
      } else {
        return this.$store.state.behaviorPrincipleName;
      }
    }
  },
  methods: {
    ...mapActions(["GetWXUid", "Check_PeriodCourse", "Get_UserInfo"]),
    ...mapMutations(["setScore", "setRemark"]),
    OnClick() {},
    Sumit() {
      this.$store.dispatch("Update_Score", this.value).then(d => {
        if (d.code === 1) {
          this.isSumit = true;
          this.value = "";
        }
      });
    },
    onBlur(val) {
      this.setScore(val);
    }
  },
  mounted() {
    var state = this.$store.state;
    if (!state.isLoaded) {
      this.Get_UserInfo();
    }
  }
};
</script>


