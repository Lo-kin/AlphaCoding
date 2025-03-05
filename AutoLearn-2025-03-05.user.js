// ==UserScript==
// @name         AutoLearn
// @namespace    http://tampermonkey.net/
// @version      2025-03-05
// @description  try to take over the world!
// @author       Lokin
// @match        https://sxgxy.alphacoding.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        none
// ==/UserScript==



var logi = [];
var next;
var back;
var GUIText = "加载中......";
var NewPageStat = false

var typeTime = {
    "document" : 30,
    "video" : 180,
    "single" : 3,
    "file" : 30,
    "aced" : 10,
};
(function() {
    'use strict';
    
    // 保存原始的console.log函数
    const originalLog = console.log;
    // 重写console.log函数
    console.log = function(...args) {
        // 将日志内容保存到数组中
        if (args[0] == "lessonLearningDetail")
        {
            logi = []
            logi.push(args)
            NewPageStat = true
        }

        // 调用原始的console.log函数
        originalLog.apply(console, args);
    };
    var cssList = [
        "margin-right:50px;",
        "margin-bottom:50px;",
        "width : 250px ;",
        "height : 300px ;",
        "background-color : #a9cf32;",
        "border-style : outset;",
        "border-width : 5px;",
        "border-color : #98bf21;",

        "position:fixed;",
        "top:150px;",
        "right:10px;",
    ]
    var css = AccepetCss(cssList)

    var StatBar = document.createElement("div")
    StatBar.class = "default"
    StatBar.id = "StatBar"
    StatBar.style = css
    document.body.appendChild(StatBar)

    var Title = document.createElement("p")
    Title.style = "text-align: center;font-size:26px"
    Title.id = "showTitle"
    Title.innerText = "努力加载中>w<"

    var Passage = document.createElement("p")
    Passage.style = "text-align:left;font-size:18px"
    Passage.id = "showPassage"
    Passage.innerText = GUIText

    var link = document.createElement("a")
    link.style = "bottom: 0;right: 0;position: absolute;"
    link.innerText = "See more about Cyan Project"
    link.href = "https://github.com/Lo-kin"

    document.getElementById("StatBar").appendChild(Title)
    document.getElementById("StatBar").appendChild(Passage)
    document.getElementById("StatBar").appendChild(link)
    waitElement()
})();

function AccepetCss(list)
{
    var tmp = ""
    list.forEach((item, index) => {
        tmp += item
    })
    return tmp
}

function UpdateGUIText()
{
    var lessonInfo = (logi[0])[1].lesson
    var lessonData = (logi[0])[1].learnData
    var title = lessonInfo.title
    var lessonType = lessonInfo.type
    var learnStat = lessonData.aced
    var score = lessonData.score
    var delayTime = typeTime[lessonType]
    if (learnStat == true)
    {
        learnStat = "已学习"
        delayTime = typeTime["aced"]
    }
    else
    {
        learnStat = "未学习"
    }


    var text = "现在正在学习标题为:\n " + title  + "\n类型为" + lessonType + " 的课程\n需要大概 " + delayTime + " 秒去学习\n这节课 " + learnStat + "\n这节课一共得到了 " + score + "分"
    GUIText = text
    document.getElementById("showPassage").innerText = GUIText
}

function waitElement() {
    var testload = document.getElementsByClassName("h-9 border px-5 rounded-r")
    if (testload.length != 1)
    {
        console.log(document.getElementById("showTitle").innerText)
        document.getElementById("showTitle").innerText = "努力加载中>w<"
        setTimeout(() => {
            waitElement()
        }, 2000);
    }
    else
    {
        document.getElementById("showTitle").innerText = "开始刷课!~"
        next = document.getElementsByClassName("h-9 border px-5 rounded-r")[0]
        back = document.getElementsByClassName("border h-9 px-5 rounded-l")[0]
        console.log("Flush Lesson Info Done")
        waitNewpageInfo()
    }
}

function waitNewpageInfo()
{
    if (NewPageStat == false)
    {
        document.getElementById("showTitle").innerText = "努力加载中>w<"
        setTimeout(() => {
            waitNewpageInfo()
        }, 1000);
    }
    else
    {
        document.getElementById("showTitle").innerText = "开始刷课!~"
        console.log("New Page Stat Load Sucess");
        NewPageStat = false
        get()
    }
}

function get()
{
    var delay = 30
    var type = "none"
    var num = 0
    UpdateGUIText()
    logi.forEach((item, index) => {
        if (item[0] == "lessonLearningDetail")
        {
            var lessonInfo = item[1]
            var lesson = lessonInfo.lesson
            delay = typeTime[lesson.type]
            if (lessonInfo.learnData.aced == true)
            {
                delay = 10
            }
            type = lesson.type
        }
    })
    console.log("Wait for " + delay + "s , Lesson Type = " + type)
    setTimeout(() => {
        next.click()
        console.log("Lesson Complete")
        waitNewpageInfo()
    }, delay * 1000);

}


