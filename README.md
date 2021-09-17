# vuedate

## Install
```
npm install vuedate-ui -S
```

## Quick Start

### entry (main.js)
import Vue from 'vue'
import vueDate from 'vuedate-ui'
Vue.use(vueDate)

### component
```
<template>
    <div id="app">
        <div>示例一</div>
        <div class="date-container">
            <vue-date :options="options1" @change="change1"></vue-date>
        </div>
        <div style="margin-top: 30px;">示例二</div>
        <div class="date-container">
            <vue-date :options="options2" @change="change2"></vue-date>
        </div>
    </div>
</template>
<script>
export default {
    name: 'App',
    data() {
        return {
            options1: {
                color: 'rgba(255,100,131,1)',
                intervalColor: 'rgba(255,100,131,0.3)',
                begin: '',
                end: '',
                beginTip: '开始',
                endTip: '结束',
                length: 24, // 月数
            },
            options2: {
                color: '',
                intervalColor: '',
                begin: '',
                end: '',
                beginTip: '入住',
                endTip: '离店',
                length: 2, // 月数
            },
        }
    },
    components: {},
    methods: {
      change1 (data){
        console.log('获取日期1')
        console.log(data)
      },
      change2 (data){
        console.log('获取日期2')
        console.log(data)
      },
    }
}
</script>
```

