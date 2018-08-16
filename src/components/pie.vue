<template>
    <div class="pie">
        <div 
        style="height:300%;width:100%;" 
        id="pie"
        :data="data">
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
export default {
    //props:['pie'],
    props: {
        data: {
            type: Array,
            default: () => {
                return [];
            }
        },
       
    },
    data() {
        return {
            title: ""
        };
    },
    methods: {
        drawPie() {
            var myChart = echarts.init(document.getElementById('pie'));
            var zgh = {
                title: {
                    top: 0,
                    left: 20,
                    text: ""
                },
                color: [
                    "#61A5E8",
                    "#7ECF51",
                    "#EECB5F",
                    "#9570E5",
                    "#E16757",
                    "#E3935D"
                ],
                series: [
                    {
                        left: 10,
                        name: "占比",
                        type: "pie",
                        center: ["50%", "50%"],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false,
                                    formatter: "{b} : {c} ({d}%)"
                                }
                            }
                        },
                        label: {
                            normal: {
                                //不显示分叉
                                show: true,
                            },
                            emphasis: {
                                //怪异
                                show: true,
                                label: {
                                    show: true,
                                    formatter: "{b}:{d}%"
                                },
                                textStyle: {
                                    fontSize: "20",
                                    fontWeight: "bold"
                                },
                                labelLine: {}
                            }
                        },
                        data: this.data
                    }
                ]
            };

            myChart.setOption(zgh);
        },
        init() {}
    },
    created(){
         this.init();
    },
    mounted() {
        setTimeout(e => {
            this.drawPie();
        }, 1000);
      
    }
};
</script>

<style scoped>
</style>
