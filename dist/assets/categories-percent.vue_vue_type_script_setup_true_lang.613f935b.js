import"./index.a2bf8911.js";/* empty css                *//* empty css                */import{d as u,aL as p,C as s,aE as f,aH as e,aI as o,aN as d,aO as m,u as r,bO as C,br as g}from"./arco.b02d9b55.js";import{u as _}from"./loading.7f7bf96d.js";import{u as h}from"./chart-option.82f43b60.js";const v=u({__name:"categories-percent",setup(y){const{loading:a}=_(),{chartOption:n}=h(t=>({legend:{left:"center",data:["\u7EAF\u6587\u672C","\u56FE\u6587\u7C7B","\u89C6\u9891\u7C7B"],bottom:0,icon:"circle",itemWidth:8,textStyle:{color:t?"rgba(255, 255, 255, 0.7)":"#4E5969"},itemStyle:{borderWidth:0}},tooltip:{show:!0,trigger:"item"},graphic:{elements:[{type:"text",left:"center",top:"40%",style:{text:"\u5185\u5BB9\u91CF",textAlign:"center",fill:t?"#ffffffb3":"#4E5969",fontSize:14}},{type:"text",left:"center",top:"50%",style:{text:"928,531",textAlign:"center",fill:t?"#ffffffb3":"#1D2129",fontSize:16,fontWeight:500}}]},series:[{type:"pie",radius:["50%","70%"],center:["50%","50%"],label:{formatter:"{d}%",fontSize:14,color:t?"rgba(255, 255, 255, 0.7)":"#4E5969"},itemStyle:{borderColor:t?"#232324":"#fff",borderWidth:1},data:[{value:[148564],name:"\u7EAF\u6587\u672C",itemStyle:{color:t?"#3D72F6":"#249EFF"}},{value:[334271],name:"\u56FE\u6587\u7C7B",itemStyle:{color:t?"#A079DC":"#313CA9"}},{value:[445694],name:"\u89C6\u9891\u7C7B",itemStyle:{color:t?"#6CAAF5":"#21CCFF"}}]}]}));return(t,b)=>{const l=p("Chart"),i=C,c=g;return s(),f(c,{loading:r(a),style:{width:"100%"}},{default:e(()=>[o(i,{class:"general-card","header-style":{paddingBottom:"0"},"body-style":{padding:"20px"}},{title:e(()=>[d(m(t.$t("workplace.categoriesPercent")),1)]),default:e(()=>[o(l,{height:"310px",option:r(n)},null,8,["option"])]),_:1})]),_:1},8,["loading"])}}});export{v as _};
