<template>
  <div>
      <x-header :left-options="{showBack: false}" style="backgroundColor:rgb(100, 100, 100)" >选择学生</x-header>
      <div style="height:100px"></div>
      <x-button v-for="n in studentList" type="primary"  v-bind:key="n.id" @click.native="Sumit(n.id)">
          {{n.name}}
      </x-button>
  </div>
</template>

<script>
import { XButton,XHeader } from "vux"
import { mapState,mapMutations,mapActions } from "vuex";
export default {
    components:{
        XButton,
        XHeader
    },
    data(){
        return{}
    },
    methods:{
        ...mapMutations(['choiceStudent']),
        Sumit(num){
            console.log(num)
            this.choiceStudent(num)
            this.$router.push({path: '/studentScore',query:{isSumit:'yes'}})
        } 
    },
    computed:{
        ...mapState(["userInfo"]),
        studentList(){
            return this.userInfo.students
        }
    },
    mounted(){
        
    }

};
</script>

