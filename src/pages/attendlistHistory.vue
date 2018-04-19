<template>
    <div>
        <group gutter="0">
            <x-header title="考勤记录" style="position:fixed;top:0;width:100%;z-index: 10;">
                <a slot="right" @click="deleteAll" v-show="showDelete">{{ !agreeDelete ? '删除' : '确认删除'}}</a>
            </x-header>
            <swipeout style="padding-top: 46px;">
                <ListHistoryItem
                    v-for="(item, index) of list"
                    :key="item.id"
                    :id="item.id"
                    :name="item.CourseGroupName"
                    :teacher="item.CreatorName"
                    :time="item.time"
                    :ref="'ListHistoryItem' + index"
                ></ListHistoryItem>
            </swipeout>
        </group>

        <div v-transfer-dom>
            <confirm v-model="showConfirm"
                title="删除"
                @on-cancel="onCancel"
                @on-confirm="onConfirm"
            >
                <p style="text-align:center;">{{ '考勤记录' }}</p>
            </confirm>
        </div>
        <toast v-model="showToast" type="text" :time="1000">您还未创建过考勤</toast>
        <span style="position:fixed; top:200px;width:100%;text-align:center;" v-show="showLoad">
            <inline-loading></inline-loading>
            <p style="margin-top:10px;">加载中</p>
        </span>
    </div>
</template>

<script>
import { Group, XHeader, Swipeout, Confirm, TransferDomDirective as TransferDom, Toast, InlineLoading } from "vux"
import ListHistoryItem from './components/listHistoryItem';
import { mapState, mapMutations } from 'vuex';
import { formatDate } from "../lib/format";
const currentHost = `${Config.api.base}` + 'callIdspApi';

export default {
    name:'AttendListHistory',
    directives: {
        TransferDom
    },
    components: {
        Group,
        XHeader,
        Swipeout,
        Confirm,
        ListHistoryItem,
        Toast,
        InlineLoading
    },
    props: {},
    data(){
        return{
            list:[],
            showConfirm: false,
            agreeDelete: false,
            showToast: false,
        }
    },
    computed: {
        ...mapState(['course', 'showLoad']),
        showDelete: function() {
            return this.list.length;
        }
    },
    created: function() {
        const _this = this;
        _this.SetShowLoad(1)
        const params = {
            actionName: 'attend/GetAttendsByCourseGroupId',
            CourseGroupId: this.course.coursegroupid
        };
        this.getRequest(params).then(res => {
            if(res.data.code){
                const data = res.data.data
                const newDate = [];
                for(var k in data){
                    const time = formatDate(data[k].CreatedTime)
                        + (data[k].WhatTime ? ('（第' + data[k].WhatTime + '节）') : '');
                    newDate.push({
                        id: data[k].Id,
                        CourseGroupName: data[k].CourseGroupName,
                        CreatorName: data[k].CreatorName,
                        time: time
                    })
                }
                this.list = newDate;
                this.list.length==0 ? this.showToast = true : false;
            }
            _this.SetShowLoad(0);
        });
    },
    methods: {
        ...mapMutations(['SetShowLoad']),
        openAll:function(){
            let _this = this;
            for(var i=0; i<_this.list.length; i++){
                let key = 'ListHistoryItem'+i;
                _this.$refs[key][0].openMe();
            }
        },
        deleteAll:function(e){
            let _this = this;
            
            if(!_this.agreeDelete){
                _this.openAll();
            }else{
                _this.showConfirm = !_this.showConfirm;
            }
            _this.agreeDelete = !_this.agreeDelete;
        },
        onCancel () {
            let _this = this;
            for(let i=0; i<_this.list.length; i++){
                let key = 'ListHistoryItem'+[i];
                _this.$refs[key][0].closeMe();
            }
        },
        onConfirm (msg) {
            let _this = this;
            const selectedList = [];
            for(let i=_this.list.length-1; i>=0; i--){
                let key = 'ListHistoryItem'+[i];
                if(_this.$refs[key][0].selected){
                    selectedList.push(_this.list[i]);
                }
                _this.$refs[key][0].closeMe();
            }
            const attendceBatchIds = [];
            for(let k in selectedList){
                attendceBatchIds.push(selectedList[k].id);
            }
            const params = {
                actionName: 'attend/DeletedAttendByIds',
                attendceBatchIds: attendceBatchIds
            };
            $.ajaxSettings.beforeSend = function (xhr) {
                xhr.withCredentials = true;
            };
            $.post(currentHost, params, function (res) {
                res = JSON.parse(res);
                if(res.data === true) {
                    for(let i=_this.list.length-1; i>=0; i--){
                        let key = 'ListHistoryItem'+[i];
                        if(_this.$refs[key][0].selected){
                            _this.list.splice(i, 1);
                        }
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>

