<template>
  <div class="line">
    <div :id="this.echart.id" :style="{height:this.echart.height}"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
    props: ["echart"],
    data() {
        return {
            echarts: {}
        };
    },
    methods: {
        drawLine() {
            let myChart = echarts.init(document.getElementById(this.echart.id));
            myChart.setOption({
                color: ["#61A5E8"],
                title: {
                    text: this.echarts.title,
                    textStyle: {
                        fontSize: 30
                    }
                },
            
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross"
                    }
                },
                xAxis: {
                    type: "",
                    data: this.echart.xData
                },
                yAxis: {
                    type: "value",
                    axisPointer: {
                        snap: true
                    }
                },
                series: [
                    {
                        name: "新增人数",
                        data: this.echart.data,
                        type: "line",
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                lineStyle: {
                                    width: 4,
                                    type: "solid",
                                    shadowColor: "rgba(0,0,0,0)", //默认透明
                                    shadowBlur: 5,
                                    shadowOffsetX: 3,
                                    shadowOffsetY: 3
                                }
                            }
                        }
                    },
                    {
                        name: this.echart.in,
                        data: this.echart.y1Data,
                        type: "line",
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                lineStyle: {
                                    width: 4,
                                    type: "solid",
                                    shadowColor: "rgba(0,0,0,0)", //默认透明
                                    color: "#EECB5F",
                                    shadowBlur: 5,
                                    shadowOffsetX: 3,
                                    shadowOffsetY: 3
                                }
                            }
                        }
                    },
                    {
                        name: this.echart.out,
                        data: this.echart.y2Data,
                        type: "line",
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                lineStyle: {
                                    width: 4,
                                    type: "solid",
                                    shadowColor: "rgba(0,0,0,0)", //默认透明
                                    color: "#7ECF51",
                                    shadowBlur: 5,
                                    shadowOffsetX: 3,
                                    shadowOffsetY: 3
                                }
                            }
                        }
                    },
                    {
                        name: "矿工费",
                        data: this.echart.y3Data,
                        type: "line",
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                lineStyle: {
                                    width: 4,
                                    type: "solid",
                                    shadowColor: "rgba(0,0,0,0)", //默认透明
                                    shadowBlur: 5,
                                    shadowOffsetX: 3,
                                    shadowOffsetY: 3
                                }
                            }
                        }
                    }
                ]
            });
        },
        init() {
            
        }
    },
    created() {},
    mounted() {
      console.log(this.echart)
        setTimeout(e => {
            this.drawLine();
        }, 1000);
    }
};
</script>

<style scoped>
</style>
