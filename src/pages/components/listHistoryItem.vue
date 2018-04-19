<template>
    <div>
        <swipeout-item ref="swipeoutItem" :disabled="true">
            <div slot="left-menu" style="position:relative;">
                <check-icon :value.sync="selected" 
                    style="margin-top:-12px;position: absolute;top: 50%;left: 20px;
                    display:inline-block;height:23px;"
                ></check-icon>
            </div>

            <cell :title="name + '考勤' + '（'+ teacher +'）'"
                :inline-desc="time"
                is-link
                @click.native="toDetail"
                slot="content"
                class="demo-content vux-1px-b"
            ></cell>
        </swipeout-item>
    </div>
</template>

<script>
import { Cell, SwipeoutItem, Confirm, CheckIcon } from "vux"

export default {
    name:'AttendListHistory',
    components: {
        Cell,
        SwipeoutItem,
        Confirm,
        CheckIcon
    },
    data(){
        return{
            selected: false,
            showConfirm:false,
            agreeDelete: false
        }
    },
    props: {
        name:{
            type: String
        },
        id:{
            type: String
        },
        teacher:{
            type: String
        },
        time:{
            type: String
        }
    },
    computed: {},
    methods: {
        toDetail: function(){
            let _this = this;
            sessionStorage.setItem('ActiveAttendanceName', _this.name);
            sessionStorage.setItem('ActiveAttendanceId', _this.id);
            _this.$router.push('/check_roster');
        },
        openMe:function(){
            let _this = this;
            _this.$refs.swipeoutItem.open('left')
        },
        closeMe:function(){
            let _this = this;
            _this.$refs.swipeoutItem.close();
        }
    }
   
};
</script>

<style lang="less" scoped>

</style>

