<template>
  <div>
    <group gutter="0" style="padding: 10px;padding-top: 200px;">
      <x-button
        type="primary"
        v-for="student in students"
        :key="student.id"
        @click.native="toAttandDetails(student.id)"
      >{{ student.name }}</x-button>
    </group>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { Group, XButton } from "vux"
import axios from "axios";
const currentHost = `${Config.api.base}` + 'callIdspApi';
const getUserInfoHost = `${Config.api.base}` + 'getUserInfo';

export default {
  name: 'ForStudent',
  components: {
    Group,
    XButton
  },
  data() {
    return {
      userInfo: {},
      students: []
    }
  },
  props: {},
  beforeRouteEnter (to, from, next) { // 路由进入前取数据
    next(vm => vm.fetchData(from));
  },
  methods: {
    ...mapMutations(['SetUserInfo']),
    fetchData: function (from) {
      const _this = this;
      // 异步取数据
      axios.get(getUserInfoHost, {
        withCredentials: true
      }).then(res => {
        _this.userInfo = res.data;
        sessionStorage.setItem('schoolperiodid', _this.userInfo.schoolperiodid);
        if(_this.userInfo.students.length == 1){
          sessionStorage.setItem('studentId', _this.userInfo.students[0].id);
          _this.$router.push({path:'/attendDetails', query:{ showBack: false }})
          // _this.$router.push({path:'/attendDetails', query:{ showBack: false }})
        }else{
          _this.students = res.data.students;
          _this.SetUserInfo(_this.userInfo);
        }
      }).catch(err => {})
    },
    toAttandDetails: function (id) {
      sessionStorage.setItem('studentId', id);
      this.$router.push({path:'/attendDetails', query:{ showBack: true }})
    }
  }
};

</script>
<style lang="less" scoped>
</style>
