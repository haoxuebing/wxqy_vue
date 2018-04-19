<template>
    <div>
        <group gutter="0">
            <x-header
                title="考勤活动"
                :left-options="{showBack:false}"
                style="position:fixed;top:0;width:100%;z-index: 10;"
            >
                <a slot="right" @click="toMore" >更多学期</a>
            </x-header>
            <div style="padding-top: 46px;">
                <cell :title="item.CourseGroupName"
                    :inline-desc=" '任课老师：' + item.TeacherName"
                    v-for="(item) of list"
                    v-show="item.CourseGroupName !== '请选择'"
                    :key="item.CourseGroupId"
                    is-link
                    @click.native="toHistory($event)"
                ></cell>
            </div>
        </group>
        <x-icon
            type="ios-plus"
            class="cell-x-icon"
            @click="toNewAttend"
            size="80"
            style="z-index:10; position:fixed; right: 20px; bottom: 80px;"
        ></x-icon>
        <span style="position:fixed; top:200px;width:100%;text-align:center;" v-show="showLoad">
            <inline-loading></inline-loading>
            <p style="margin-top:10px;">加载中</p>
        </span>
        <alert v-model="showAlert" title="">您不是任课教师或综合课程负责人</alert>
    </div>
</template>

<script>
import { Group, XHeader, Cell, InlineLoading, Alert } from "vux"
import { mapState, mapMutations, mapActions } from "vuex";
export default {
    name:'AttendList',
    components: {
        Group,
        XHeader,
        Cell,
        InlineLoading,
        Alert
    },
    data(){
        return{
            showAlert: false,
        }
    },
    props: {},
    computed: {
        ...mapState(['isLoaded','CourseGroupList','AciveSchoolPeriodId', 'showLoad']),
        list:function() {
            const _this = this;
            const newList = []
            !_this.CourseGroupList.length && _this.isLoaded ? _this.showAlert = true : _this.showAlert = false;
            return this.CourseGroupList;
        }
    },
    created:function() {
        const _this = this;
        if (!_this.isLoaded) {
            _this.Get_UserInfo();
        }else{
            _this.Get_CourseGroupList(_this.AciveSchoolPeriodId);
        }
    },
    methods: {
        ...mapActions(['Get_UserInfo', 'Get_CourseGroupList']),
        ...mapMutations(['SetCourse']),
        toMore: function() {
            this.$router.push('/year');
        },
        toNewAttend: function(){
            const _this = this;
            if(!_this.CourseGroupList.length){
                _this.showAlert = true
            }else{
                _this.$router.push({path: '/newAttend', query: { showBack: true }});
            }
        },
        toHistory: function(e){
            const index = $(event.currentTarget).index();
            // 选择课程
            this.SetCourse(this.list[index]);
            this.$router.push('/history');
        }
    }
};
</script>

<style lang="less" scoped>
.vux-x-icon {
  fill: #F70968;
}
.cell-x-icon {
  display: block;
  fill: green;
}

</style>

