<template>
    <div>
        <group gutter="0">
            <x-header title="更多学期" style="position:fixed;top:0;width:100%;z-index: 10;"></x-header>
            <div style="padding-top: 46px;">
                <cell :title="item.name"
                    v-for="(item) of schoolperiodslist"
                    :key="item.id"
                    @click.native="chooseActive"
                    :class="(item.id === AciveSchoolPeriodId) ? 'active' : ''"
                ></cell>
            </div>
        </group>

        <span style="position:fixed; top:200px;width:100%;text-align:center;" v-show="showLoad">
            <inline-loading></inline-loading>
            <p style="margin-top:10px;">加载中</p>
        </span>
    </div>
</template>

<script>
import { Group, XHeader, Cell, InlineLoading } from "vux"
import { mapState, mapMutations } from "vuex";
export default {
    name:'AttendList',
    components: {
        Group,
        XHeader,
        Cell,
        InlineLoading
    },
    data(){
        return{
        }
    },
    computed: mapState(['userInfo', 'AciveSchoolPeriodId','schoolperiodslist', 'showLoad']),
    created: function() {},
    methods: {
        ...mapMutations(['SetSchoolPeriodId', 'SetSchoolPeriodsList', 'SetAciveSchoolPeriodId']),
        chooseActive: function(e){
            const index = $(event.currentTarget).index();
            const id = this.schoolperiodslist[index].id
            // 映射 活动数据
            this.SetAciveSchoolPeriodId(id);
            this.$router.push('/list');
        }
    }
};
</script>

<style lang="less" scoped>
.active {
  color: green;
}

</style>

