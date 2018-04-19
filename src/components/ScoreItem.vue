<template>
  <div>
    <x-header :left-options="{showBack: true}" style="backgroundColor:rgb(100, 100, 100)" >行为得分选项</x-header>
     <group v-for="item in ScoreItems" :key="item.Id" >
       <cell 
        :title="item.Name"
        :is-link="true"
        :arrow-direction="item.showContent ? 'up' : 'down'"
        @click.native="item.showContent = !item.showContent" style="backgroundColor:#f8f8f8;font-weight:bold"></cell>

        <template v-if="item.showContent">
            <radio style="margin-left:10px;font-size:80%"  :selected-label-style="{color: 'green'}" v-model="radioValue" @on-change="change"  :options="item.rData"></radio>
        </template>
     </group>
     <div style="height:100px"></div>
     <x-button style="position:fixed;bottom:0;_position:relative; z-index:100;width:100%" type="primary"  action-type="button"  @click.native='Submit' link="/Score" >确定</x-button>
  </div>
</template>

<script>
import { Cell, Group, Radio, XHeader,XButton } from "vux";
import { mapState, mapMutations, mapActions } from "vuex";
import axios from "axios";
var ScoreItems=[];
var score={
  behaviorPrincipleId : '',
  behaviorPrincipleName : '',
  score : ''
};
export default {
  components: {
    Group,
    Cell,
    Radio,
    XHeader,
    XButton
  },
  methods: {
    ...mapMutations(['setbehaviorPrinciple']),
    Submit() {
      this.setbehaviorPrinciple(this.score);
    },

    change(key,value){
      this.score={
        behaviorPrincipleId : key.split('|')[0],
        behaviorPrincipleName : value,
        score : key.split('|')[1]
      };
      console.log(this.score);
      this.radioValue=this.score.behaviorPrincipleId
    }
  },
  data() {
    return {
      ScoreItems:ScoreItems,
      score:score,
      radioValue:''
    };
  },
  computed:{
    ...mapState(["currentHost"]),
 
  },
  mounted() {
    //$('.vux-header-title').click(function(){console.log(100)}),
    axios
      .get(this.currentHost, {
        params: {
          actionName:'XWGFScore/GetXWGFProject'
        },
        withCredentials: true
      })
      .then(data => {
        this.ScoreItems=[];
        var result=data.data.data; 
        for (let index = 0; index < result.length; index++) {
          var data={
            rData:[]
          };
          const element = result[index];
          data['Name']=element.Name;
          data['showContent']=false;
          console.log(element['BehaviorPrinciples']);
          var b=element['BehaviorPrinciples'];
          for (let x = 0; x < b.length; x++) {
            var beh=b[x];
            data['rData'].push({key:beh.Id+'|'+beh.Score,value:beh.Name})
          }
          console.log(data);
          this.ScoreItems.push(data);
        }
      })
      .catch(err => console.log(err));


  }
};
</script>
