<template>
    <div>
        <div id="divTop" style="position:fixed;top:0;_position:relative; z-index:100;width:100%">
          <x-header style="backgroundColor:rgb(100, 100, 100)" title='选择学生'  >
          </x-header>
          <search placeholder='根据学生姓名或学号检索学生' cancel-text=' ' v-model="searchTxt" @on-submit="getStudentList" 
          @on-cancel="onCancel" top="46px" >
            <x-button mini type="primary" slot="right" @click.native="getStudentList">搜索</x-button>
          </search>
        </div>
        <div style="margin-top:90px">
          <Group>
              <radio  :options='this.rDataStudent' style="font-size:90%"  @on-change="change"></radio>
          </group>
          <load-more :show-loading="false" :tip="loadText" background-color="#fbf9fe"></load-more>
          <div style="height:80px"></div>
          <x-button style="position:fixed;bottom:0;_position:relative; z-index:100;width:100%" type="primary" v-if="isShowButton" action-type="button"  @click.native='Submit' link="/Score" >确定</x-button>
        </div>    
    </div>
</template>

<script>
import { Group, Radio, XHeader, XButton, Search,LoadMore } from "vux";
import { mapState, mapMutations } from "vuex";
import axios from "axios";

var data={
  loadText:"加载中",
  pageSize : 20,
  pageIndex : 1,
  rDataStudent:[],
  stuId: "",
  stuName: "",
  searchTxt: ""
}

export default {
  components: {
    Group,
    Radio,
    XHeader,
    XButton,
    Search,
    LoadMore
  },
  data() {
    return data;
  },
  computed: {
    ...mapState(["userInfo", "currentHost"]),
    isShowButton() {
      return this.rDataStudent.length > 0;
    }
  },
  methods: {
    ...mapMutations(["setRStudentData", "Set_Student"]),
    Submit() {
      this.Set_Student({
        studentId: this.stuId,
        studentName: this.stuName
      });
    },

    onCancel() {
      console.log("on cancel");
    },

    change(key, value) {
      this.stuId = key;
      this.stuName = value.split("-")[0];
    },
    getStudentList() {
      this.pageIndex = 1
      this.rDataStudent.splice(0, this.rDataStudent.length)
      axios
        .get(this.currentHost, {
          params: {
            actionName: "XWGFScore/GetStudent",
            filter: $(".weui-search-bar__input")[0].value,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex
          },
          withCredentials: true
        })
        .then(data => {
          this.pageIndex = this.pageIndex + 1;
          for (var i = 0; i < data.data.data.length; i++) {
            this.rDataStudent.push({
              key: data.data.data[i].Id,
              value:
                data.data.data[i].Name +
                "-" +
                data.data.data[i].GradeName +
                data.data.data[i].GroupName +
                "(" +
                data.data.data[i].StudyCode +
                ")"
            });
          }

          if(data.data.data.length<20){
            this.loadText="暂无数据"
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    var state = this.$store.state;
    getList(state);

    $(window).scroll(function() {
      let scrollTop = $(this).scrollTop();
      let scrollHeight = $(document).height();
      let windowHeight = $(this).height();
      if (scrollTop + windowHeight === scrollHeight) {
        data.searchTxt = $(".weui-search-bar__input")[0].value;
        getList(state);
      }
    });

    $(".weui-icon-clear").click(function() {
      data.pageIndex = 1;
      data.searchTxt="";
      data.rDataStudent.splice(0, data.rDataStudent.length);
      getList(state);
    });
  }
};

function getList(state){
        axios
        .get(state.currentHost, {
          params: {
            actionName: "XWGFScore/GetStudent",
            filter: data.searchTxt,
            pageSize: data.pageSize,
            pageIndex: data.pageIndex
          },
          withCredentials: true
        })
        .then(data1 => {
          data.pageIndex = data.pageIndex + 1;
          for (var i = 0; i < data1.data.data.length; i++) {
            data.rDataStudent.push({
              key: data1.data.data[i].Id,
              value:
                data1.data.data[i].Name +
                "-" +
                data1.data.data[i].GradeName +
                data1.data.data[i].GroupName +
                "(" +
                data1.data.data[i].StudyCode +
                ")"
            });
          }

          if(data1.data.data.length<20){
            data.loadText="暂无数据"
          }
        })
        .catch(err => {
          console.log(err);
        });
}
</script>

<style>

</style>
