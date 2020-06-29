<template>
    <div class="date-wrapper">
        <div class="date-con" v-if="date_data.arr">
            <div class="date-top">
                <div class="date-grid-item date-grid-item-2 date-top-time">
                    <div class="date-begin text-left">
                        <div class="date-tip">{{date_data.beginTip}}日期</div>
                        <div><span class="date-day">{{getMDTime(date_data.begin)}}</span><span class="date-week">{{getWeekDay(date_data.begin)}}</span></div>
                    </div>
                    <div class="date-end text-right">
                        <div class="date-tip">{{date_data.endTip}}日期</div>
                        <div><span class="date-day">{{getMDTime(date_data.end)}}</span><span class="date-week">{{getWeekDay(date_data.end)}}</span></div>
                    </div>
                </div>
                <div class="date-flex-item">
                    <div class="item text-center date-week-item" v-for="(item, index) in weekArr" v-bind:key="index" :data-index="index" v-text="item"></div>
                </div>
            </div>
            <div class="date-month">
                <div :data-index="index" v-for="(item, index) in date_data.arr">
                    <div class="date-month-title">{{item.year + '年' + item.month + '月'}}</div>
                    <div class="date-month-content date-grid-item">
                        <div class="item date-month-day-item empty" v-for="(e_item, e_index) in item.day_arr[0].week"></div>
                        <div class="item date-month-day-item" :style="getMonthDayItemStyle(item, index, e_item, e_index)" :data-year="item.year" :data-month="item.month" :data-day="e_item.day" :data-month-index="index" :data-date-index="e_index" :class="getMonthDayItemClass(item, index, e_item, e_index)" v-for="(e_item, e_index) in item.day_arr" @click.stop="chooseDay(item, index, e_item, e_index)">
                            <div class="text">{{e_item.day}}</div>
                            <div class="tip">{{deginClickData != '' ? getClickTip(index, e_index) : e_item.tip}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'vueDate',
    data() {
        return {
            weekArr: ['日', '一', '二', '三', '四', '五', '六'],
            defautlColor: 'rgba(28,176,246,1)',
            defaultIntervalColor: 'rgba(28,176,246,0.3)',
            dayMs: 24 * 60 * 60 * 1000,
            date_data: {},
            // 点击一次，样式需要根据当前点击的开始时间计算
            deginClickData: '',
        }
    },
    methods: {
    	emitDateData (){
    		console.log(this.date_data)
    		this.$emit('change',this.date_data)
    	},
        getClickTip(index, e_index) {
            return index === this.deginClickData.beginMonthIndex && e_index === this.deginClickData.beginDateIndex ? this.date_data.beginTip : ''
        },
        // 获取日期默认的class
        getMonthDayItemClass(item, index, e_item, e_index) {
            let date_data = this.date_data;
            let defaultBegin = date_data.defaultBegin;
            let begin = date_data.begin;
            let end = date_data.end;
            let year = item.year;
            let month = item.month;
            let day = e_item.day;
            let item_date = new Date(year + '/' + month + '/' + day);
            let now_date = new Date(defaultBegin);
            let begin_date = new Date(begin);
            let end_date = new Date(end);
            let res = '';
            if (this.deginClickData) {
            	if(+item_date < +now_date){
            		res = 'disabled default-disabled'
            	}else if(+item_date < +this.deginClickData.date){
            		res = 'disabled'
            	}else if(this.deginClickData.beginMonthIndex === index && e_index === this.deginClickData.beginDateIndex){
            		res = 'begin'
            	}
            	return res
            }
            // 如果小于当前时间的，则返回 disabled default-disabled
            if (+item_date < +now_date) {
                res = 'disabled default-disabled'
            } else if (+item_date === +begin_date) {
                res = 'begin'
            } else if (+item_date > +begin_date && +item_date < +end_date) {
                res = 'during'
            } else if (+item_date === +end_date) {
                res = 'end'
            }
            return res
        },
        getMonthDayItemStyle(item, index, e_item, e_index){
        	if(this.deginClickData){
        		return index === this.deginClickData.beginMonthIndex && e_index === this.deginClickData.beginDateIndex ? 'background-color:'+ this.date_data.color + ';color: #fff;border-radius:3px': ''
        	}
        	return e_item.backgroudColor ? 'background-color:' + e_item.backgroudColor : ''
        },
        chooseDay(item, index, e_item, e_index) {
            let year = item.year;
            let month = item.month;
            let day = e_item.day;
            let defaultBegin = this.date_data.defaultBegin
            let item_date = new Date(year + '/' + month + '/' + day);
            let now_date = new Date(defaultBegin);
            if(+item_date < +now_date) return
            if (this.deginClickData == '') {
                this.deginClickData = {
                    time: year + '/' + month + '/' + day,
                    date: item_date,
                    beginMonthIndex: index,
                    beginDateIndex: e_index,
                }
            } else {
                // 如果开始和截止选择了同一天，则return
                if (+item_date <= +this.deginClickData.date) {
                    return
                }
                let beginMI = this.date_data.beginMonthIndex;
                let beginDI = this.date_data.beginDateIndex;
                let endMI = this.date_data.endMonthIndex;
                let endDI = this.date_data.endDateIndex;
                let arr = this.date_data.arr;
                // 清空之前的day数据内容
                // 如果开始月份等于结束月份
                if (beginMI === endMI) {
                    for (let i = beginDI; i <= endDI; i++) {
                        this.$set(this.date_data.arr[beginMI].day_arr[i], 'backgroudColor', '');
                        this.$set(this.date_data.arr[beginMI].day_arr[i], 'tip', '');
                    }
                } else {
                    for (let i = beginMI; i <= endMI; i++) {
                        let day_arr = arr[i].day_arr;
                        let j = 0;
                        if (i === beginMI) {
                        	// 如果是第一个月
                            for (j = beginDI; j < day_arr.length; j++) {
                                this.$set(this.date_data.arr[i].day_arr[j], 'backgroudColor', '');
                                this.$set(this.date_data.arr[i].day_arr[j], 'tip', '');
                            }
                        }else if(i === endMI){
                        	// 如果是最后一个月
                        	for (j = 0; j <= endDI; j++) {
                                this.$set(this.date_data.arr[i].day_arr[j], 'backgroudColor', '');
                                this.$set(this.date_data.arr[i].day_arr[j], 'tip', '');
                            }
                        }else{
                        	for (j = 0; j < day_arr.length; j++) {
                                this.$set(this.date_data.arr[i].day_arr[j], 'backgroudColor', '');
                                this.$set(this.date_data.arr[i].day_arr[j], 'tip', '');
                            }
                        }
                    }
                }
                this.$set(this.date_data, 'beginMonthIndex', this.deginClickData.beginMonthIndex);
                this.$set(this.date_data, 'beginDateIndex', this.deginClickData.beginDateIndex);
                this.$set(this.date_data, 'endMonthIndex', index);
                this.$set(this.date_data, 'endDateIndex', e_index);
                // 设置开始时间和截止时间
                this.$set(this.date_data, 'begin', this.deginClickData.time);
                this.$set(this.date_data, 'end', year + '/' + month + '/' + day);

                this.$set(this.date_data, 'dateLength', Math.floor(((+new Date( year + '/' + month + '/' + day)) - (+new Date(this.deginClickData.time))) / this.dayMs));
                // 设置当前day数据内容
                // 如果开始月份等于结束月份
                beginMI = this.deginClickData.beginMonthIndex;
                beginDI = this.deginClickData.beginDateIndex;
                endMI = index;
                endDI = e_index;
                if (beginMI === index) {
                    for (let j = beginDI; j <= endDI; j++) {
                        if(j === beginDI){
                        	console.log(this.date_data.endTip)
                            this.$set(this.date_data.arr[index].day_arr[j], 'backgroudColor', this.date_data.color);
                            this.$set(this.date_data.arr[index].day_arr[j], 'tip', this.date_data.beginTip);
                        }else if(j === endDI){
                	 		console.log(endDI)
                        	console.log(this.date_data.endTip)
                            this.$set(this.date_data.arr[index].day_arr[j], 'backgroudColor', this.date_data.color);
                            this.$set(this.date_data.arr[index].day_arr[j], 'tip', this.date_data.endTip);
                        	console.log(this.date_data.arr[index].day_arr)
                        }else{
                            this.$set(this.date_data.arr[index].day_arr[j], 'backgroudColor', this.date_data.intervalColor);
                        }
                    }
                } else {
                    for (let i = this.deginClickData.beginMonthIndex; i <= index; i++) {
                        let day_arr = arr[i].day_arr;
                        let j = 0;
                        if (i === beginMI) {
                        	// 如果是第一个月
                            for (j = beginDI; j < day_arr.length; j++) {
                            	if(j == beginDI){
									this.$set(this.date_data.arr[i].day_arr[j], 'backgroudColor', this.date_data.color);
                               		this.$set(this.date_data.arr[i].day_arr[j], 'tip', this.date_data.beginTip);
                            	}else{
                            		this.$set(this.date_data.arr[i].day_arr[j], 'backgroudColor', this.date_data.intervalColor);
                            	}
                            }
                        }else if(i === endMI){
                        	// 如果是最后一个月
                        	for (j = 0; j <= endDI; j++) {
                        		if(j === endDI){
                            	    this.$set(this.date_data.arr[i].day_arr[j], 'backgroudColor', this.date_data.color);
	                                this.$set(this.date_data.arr[i].day_arr[j], 'tip', this.date_data.endTip);
                        		}else{
                            	    this.$set(this.date_data.arr[i].day_arr[j], 'backgroudColor', this.date_data.intervalColor);
                        		}
                            }
                        }else{
                        	for (j = 0; j < day_arr.length; j++) {
                                this.$set(this.date_data.arr[i].day_arr[j], 'backgroudColor', this.date_data.intervalColor);
                            }
                        }

                    }
                }
                this.deginClickData = '';
                this.emitDateData()
            }
        },
        getMDTime(time) {
            time = typeof time === 'string' ? new Date(time.replace(/-/g, '/')) : time
            let month = time.getMonth() + 1;
            let date = time.getDate();
            return month > 9 ? month : ('0' + month) + '月' + (date > 9 ? date : '0' + date) + '日'
        },
        getWeekDay(time) {
            time = typeof time == 'string' ? new Date(time.replace(/-/g, '/')) : time
            return '周' + this.weekArr[time.getDay()]
        },
        isLeapYear(year) {
            return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
        },
        getDays(str) {
            //构造当前日期对象  safira下，要将日期字符串中的-替换成/才能解析
            var date = typeof str == 'undefined' ? new Date() : new Date(str.replace(/-/g, '/'));
            //获取年份
            var year = date.getFullYear();
            //获取当前月份
            var month = date.getMonth() + 1;
            //定义当月的天数；
            var days;
            //当月份为二月时，根据闰年还是非闰年判断天数
            if (month === 2) {
                days = this.isLeapYear(year) == 0 ? 28 : 29;
            } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
                days = 31;
            } else {
                //其他月份，天数为：30.
                days = 30;
            }
            //输出天数
            return days
        },
    },
    computed: {
        text() {
            return JSON.stringify(this.options)
        },
    },
    props: ['options'],
    watch: {
        options: {
            handler(newVal) {
                if (!newVal) return
                // 根据传入的数据格式化日期数据
                // 当前时间
                let now = new Date();
                let now_year = now.getFullYear();
                let now_month = now.getMonth();
                let now_date = now.getDate();
                // let now_day = now.getDay();
                // 截止日期 默认为+1天
                let defaultDays = 1; //默认截止时间+1天
                let dateLength = defaultDays; //天数
                let end_now = new Date(now.getTime() + this.dayMs * defaultDays);
                let end_now_year = end_now.getFullYear();
                let end_now_month = end_now.getMonth();
                let end_now_date = end_now.getDate();
                // let end_now_day = end_now.getDay();

                let defaultBegin = now_year + '/' + (now_month + 1) + '/' + now_date;
                let defaultEnd = end_now_year + '/' + (end_now_month + 1) + '/' + end_now_date;

                let begin = defaultBegin;
                let end = defaultEnd;
                let beginMonthIndex = 0;
                let beginDateIndex = now_date - 1;
                let endMonthIndex = 0;
                let endDateIndex = end_now_date - 1;
                now = new Date(now_year + '/' + (now_month + 1) + '/' + now_date);
                let options = newVal;
                // 如果有传入开始时间或截止时间，则使用传入的时间计算
                if (options && options.begin && options.end) {
                    if (new Date(options.begin) < new Date(options.end) && new Date(options.begin) >= now) {
                        var begin_time = new Date(options.begin);
                        var begin_year = begin_time.getFullYear();
                        var begin_month = begin_time.getMonth();
                        var begin_date = begin_time.getDate();
                        var end_time = new Date(options.end);
                        var end_year = end_time.getFullYear();
                        var end_month = end_time.getMonth();
                        var end_date = end_time.getDate();
                        begin = options.begin;
                        end = options.end;
                        beginMonthIndex = begin_year === now_year ? begin_month - now_month : (begin_year - now_year) * 12 + (begin_month - now_month) - 1;
                        beginDateIndex = begin_date - 1;
                        endMonthIndex = end_year === now_year ? end_month - now_month : (end_year - now_year) * 12 + (end_month - now_month) - 1;
                        endDateIndex = end_date - 1;
                        dateLength = Math.floor(end_time - begin_time) / this.dayMs;
                    } else {
                        console.warn('time is incorrect');
                    }
                }
                let color = options.color || this.defautlColor;
                let intervalColor = options.intervalColor || this.defaultIntervalColor;
                console.log(color)
                console.log(intervalColor)
                let beginTip = options.beginTip || '';
                let endTip = options.endTip || '';
                let length = options.length || 12;
                var weekArr = this.weekArr;
                var year = now_year;
                let date_data = {
                    arr: [],
                    defaultBegin: defaultBegin,
                    defaultEnd: defaultEnd,
                    weekArr: weekArr,
                    begin: begin,
                    end: end,
                    beginTip: beginTip,
                    endTip: endTip,
                    beginMonthIndex: beginMonthIndex,
                    beginDateIndex: beginDateIndex,
                    endMonthIndex: endMonthIndex,
                    endDateIndex: endDateIndex,
                    color: color,
                    intervalColor: intervalColor,
                    dateLength: dateLength,
                };
                for (let i = 0; i < length; i++) {
                    let month = now_month + i;
                    // 如果循环中的月份index > 11，则年份要++1
                    if (month % 12 == 0) {
                        ++year;
                    }
                    month -= Math.floor(month / 12) * 12;
                    month += 1; //转化Wie实际的月份，不是index
                    let days = this.getDays(year + '/' + month + '/1');
                    let month_obj = {};
                    month_obj.days = days;
                    month_obj.month = month;
                    month_obj.year = year;

                    let month_day_arr = [];
                    for (let j = 0; j < days; j++) {
                        let text = '';
                        let day = j + 1;
                        let day_now = new Date(year + '/' + month + '/' + day);
                        text = day + '';
                        let tip = '';
                        let day_color = '';
                        let disabled = false;
                        if (day_now.getTime() === now.getTime()) {
                            text = '今天';
                        } else if (day_now.getTime() > now.getTime() && day_now.getTime() - now.getTime() <= this.dayMs * 1) {
                            text = '明天'
                        } else if (day_now.getTime() - now.getTime() > this.dayMs * 1 && day_now.getTime() - now.getTime() <= this.dayMs * 2) {
                            text = '后天'
                        }
                        // 如果是设置的开始日期或者截止日期，则设置tip，和color
                        if (i === date_data.beginMonthIndex && j === date_data.beginDateIndex) {
                            tip = date_data.beginTip;
                            day_color = color;
                        }
                        if (i === date_data.endMonthIndex && j === date_data.endDateIndex) {
                            tip = date_data.endTip;
                            day_color = color;
                        }
                        // 初始化如果是开始到结束之间，设置颜色
                        if (day_now.getTime() > new Date(begin).getTime() && day_now.getTime() < new Date(end).getTime()) {
                            day_color = intervalColor;
                        }
                        //  如果早于当前时间，不可设置
                        if (day_now.getTime() < now.getTime()) {
                            disabled = true
                        }
                        let week = day_now.getDay(); //获取日期周几
                        month_day_arr.push({
                            day: day,
                            text: text,
                            tip: tip,
                            week: week,
                            isWeekend: week === 0 || week === 6,
                            backgroudColor: day_color,
                            // disabled: disabled,
                        })
                    }
                    month_obj.day_arr = month_day_arr;
                    date_data.arr.push(month_obj)
                }
                this.date_data = date_data;
                this.emitDateData()
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
<style>
.date-wrapper {
    height: 100%;
}

.date-con {
    height: 100%;
    background-color: #fff;
    color: rgba(30, 36, 48, 1);
}

.date-grid-item {
    display: grid;
}

.date-grid-item-2 {
    grid-template-columns: 1fr 1fr;
}

.date-flex-item {
    display: flex;
}

.date-flex-item>.item {
    flex: 1;
}

.text-left {
    text-align: left;
}

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
}

.date-top {
    width: 100%;
    background-color: #fff;
}

.date-top-time {
    padding: 0 20px 20px;
}

.date-top-time .date-tip {
    font-size: 14px;
    line-height: 14px;
    color: rgba(163, 173, 182, 1);
    padding-top: 20px;
    padding-bottom: 10px;
}

.date-top-time .date-day {
    font-size: 18px;
    line-height: 18px;
}

.date-top-time .date-week {
    font-size: 13px;
    color: rgba(163, 173, 182, 1);
    padding-left: 5px;
}

.date-week-item {
    padding: 8px 0;
    font-size: 14px;
    line-height: 14px;
    color: rgba(163, 173, 182, 1);
    border-top: 1px solid rgba(229, 233, 235, 1);
    border-bottom: 1px solid rgba(229, 233, 235, 1);
}

.date-month {
    height: calc(100% - 118px);
    font-size: 14px;
    line-height: 14px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.date-month-content {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}

.date-month-title {
    padding: 15px 0;
    text-align: center;
}

.date-month-day-item {
    text-align: center;
    cursor: pointer;
}

.date-month-day-item.disabled {
    color: rgba(163, 173, 182, 1);
}

.date-month-day-item.begin {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}

.date-month-day-item.end {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}

.date-month-day-item.during {
    background-color: rgba(28, 176, 246, 0.3);
    /*color: #fff;*/
}

.date-month-day-item.begin,
.date-month-day-item.end {
    background-color: rgba(28, 176, 246, 1);
    color: #fff;
}

.date-month-day-item .text {
    padding-top: 10px;
    padding-bottom: 6px;
}

.date-month-day-item .text.date-weekend {
    color: rgba(28, 176, 246, 1);
}

.date-month-day-item .tip {
    padding-bottom: 6px;
}
</style>