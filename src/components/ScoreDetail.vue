<template>
    <div>
        <x-header :left-options="{showBack: true}" style="backgroundColor:rgb(100, 100, 100)">得分明细</x-header>
        <group>
            <x-input title="评分项" text-align="right" :value="scoreDetail.ScoreItem" disabled></x-input>
            <x-input title="评分" text-align="right" :value="scoreDetail.Score" disabled></x-input>
            <x-input title="评分时间" text-align="right" :value="scoreDetail.ScoreTime" disabled></x-input>
            <x-input title="评语" text-align="right" :value="scoreDetail.Remarks" disabled></x-input>            
        </group>
    </div>
</template>

<script>
import { Group,Cell,XHeader,XInput } from "vux";
import {mapState} from 'vuex';
export default {
    components:{
        Group,
        Cell,
        XHeader,
        XInput
    },
    data(){
        return{        
        }
    },
    computed:{
        ...mapState(['scoreDetail'])
    }
}
</script>
