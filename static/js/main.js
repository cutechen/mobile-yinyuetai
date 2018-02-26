/**
 * Created by cutechen on 2018/2/17.
 */
"use strict";
window.onload = function() {
    sp.app.reATag();
    sp.app.hdNavToggle();
    sp.app.navTransform();
    sp.app.slideTransform();
    sp.app.mvTab();
};
var sp = {};
sp.tools = {};
sp.app = {};
sp.app.reATag = function(e) {
    var a = document.querySelectorAll("a");
    var len = a.length;
    for (var i = 0; i < len; i++) {
        a[i].addEventListener("click", function(e) {
            e.preventDefault();
        });
        a[i].addEventListener("touchmove", function() {
            this.reflag = true;
        });
        a[i].addEventListener("touchend", function() {
            if (!this.reflag) {
                window.location.href = this.href;
            }
            this.reflag = false;
        });
    }
};
sp.app.hdNavToggle = function() {
    var headerMenu = document.querySelector("#headerMenu");
    var headerSubnav = document.querySelector("#headerSubnav");
    var menuToggle = document.querySelector("#menuToggle");
    var flag = null;
    headerMenu.addEventListener("touchstart", function(e) {
        if (headerSubnav.style.display == "block") {
            flag = false;
        } else {
            flag = true;
        }
        if (flag) {
            headerSubnav.style.display = "block";
            menuToggle.setAttribute("class", "iconfont icon-close");
        } else {
            headerSubnav.style.display = "none";
            menuToggle.setAttribute("class", "iconfont icon-liebiao");
        }
        e.stopPropagation();
    });
    document.addEventListener("touchstart", function(e) {
        var this_class = e.target.className;
        if (this_class != "header-subnav-item") {
            headerSubnav.style.display = "none";
            menuToggle.setAttribute("class", "iconfont icon-liebiao");
        }
    });
};
sp.app.navTransform = function() {
    var nav = document.querySelector("#nav");
    var navList = nav.children[0];
    var navList_width = 0;
    var startPoint = 0, oldX = 0, translateX = 0, moveDiff = 0;
    var startTime = 0, endTime = 0;
    for (var i = 0; i < navList.children.length; i ++) {
        navList_width += navList.children[i].offsetWidth;
    }
    navList.style.width = navList_width + 100 + "px";
    navList.addEventListener("touchstart", function(e) {
        this.style.transition = "none";
        startPoint = e.changedTouches[0].clientX;
        oldX = translateX;
        startTime = new Date().getTime();
    });
    navList.addEventListener("touchmove", function(e) {
        var currentX = e.changedTouches[0].clientX;
        moveDiff = currentX - startPoint;
        translateX = moveDiff + oldX;
        this.style.transform = "translateX("+translateX+"px)";
    });
    navList.addEventListener("touchend", function(e) {
        var speed = 0;
        var timeDiff = 0;
        endTime = new Date().getTime();
        timeDiff = endTime - startTime;
        speed = moveDiff / timeDiff * 100;
        console.log(speed)
        translateX += speed;
        this.style.transition = "500ms";
        if (translateX > 0) {
            translateX = 0;
            this.style.transition = "500ms cubic-bezier(.08,1.44,.6,1.46)";
        } else if (translateX < -1 * (navList_width - nav.offsetWidth)) {
            translateX = -1 * (navList_width - nav.offsetWidth);
            this.style.transition = "500ms cubic-bezier(.08,1.44,.6,1.46)";
        }
        this.style.transform = "translateX("+translateX+"px)";
    });
};
sp.app.slideTransform = function() {
    function changeSkey() {
        if (skey == 0) {
            skey = slength / 2;
        } else if (skey == slength - 1) {
            skey = slength / 2 - 1;
        }
        translateX = -skey * slide.offsetWidth;
        oldX = translateX;
        slideList.style.transform = "translateX("+translateX+"px)";
    }
    function changeCkey() {
        var ckey = 0;
        ckey = skey;
        for (var i = 0; i < slength / 2; i++) {
            slideCtrl.children[i].className = "";
        }
        if (ckey > slength / 2 - 1) {
            ckey -= slength / 2;
        }
        slideCtrl.children[ckey].setAttribute("class", "active");
    }
    var slide = document.querySelector("#slide");
    var slideList = slide.querySelector(".slide-list");
    slideList.innerHTML += slideList.innerHTML;
    var slideCtrl = slide.querySelector(".slide-ctrl");
    var slideTeam = slide.querySelectorAll(".slide-item-img");
    var slength = slideTeam.length;
    var startPoint = 0, translateX = 0, oldX = 0, skey = 0;
    var startPointY = 0, startDirection = true, fristMove = true;
    var timer = null;
    slide.style.height = slideTeam[0].offsetHeight + "px";
    slideList.style.width = slength + "00%";
    for (var i = 0; i < slength; i++) {
        slideList.children[i].style.width = 1 / slength * 100 + "%";
    }
    for (var i = 0; i < slength / 2; i++) {
        var newSpan = document.createElement("span");
        slideCtrl.appendChild(newSpan);
    }
    slideCtrl.children[0].setAttribute("class", "active");
    slide.addEventListener("touchstart", function(e) {
        slideList.style.transition = "none";
        clearInterval(timer);
        startPoint = e.changedTouches[0].clientX;
        startPointY = e.changedTouches[0].clientY;
        changeSkey();
        startDirection = true;
        fristMove = true;
    });
    slide.addEventListener("touchmove", function(e) {
        var sitewrap = document.querySelector(".sitewrap");
        if (!startDirection) {
            return false;
        }
        var moveX = e.changedTouches[0].clientX;
        var diff = moveX - startPoint;
        var diffY = e.changedTouches[0].clientY - startPointY;
        if (fristMove) {
            fristMove = false;
            if (Math.abs(diffY) > Math.abs(diff)) {
                startDirection = false;
            } else {
                sitewrap.style.overflow = "hidden";
            }
        }
        if (startDirection) {
            translateX = diff + oldX;
            slideList.style.transform = "translateX("+translateX+"px)";
        }
        document.addEventListener("touchstart", function() {
            sitewrap.style.overflow = "auto";
        });
    });
    slide.addEventListener("touchend", function() {
        slideList.style.transition = ".5s";
        skey = Math.round(-translateX / slide.offsetWidth);
        translateX = -skey * slide.offsetWidth;
        slideList.style.transform = "translateX("+translateX+"px)";
        changeCkey();
        timer = setInterval(autoplay, 3500);
    });
    timer = setInterval(autoplay, 3500);
    function autoplay() {
        slideList.style.transition = "none";
        changeSkey();
        setTimeout(function() {
            slideList.style.transition = "1s";
            skey ++;
            translateX = -skey * slide.offsetWidth;
            slideList.style.transform = "translateX("+translateX+"px)";
            changeCkey();
        }, 30);
    }
};
sp.app.mvTab = function() {
    function changeTab(obj) {
        var tabMain = obj.querySelector(".mv-tab-main");
        var twidth = tabMain.children[0].offsetWidth;
        var startPoint = 0, translateX = 0, oldX = 0;
        var startPointY = 0, startDirection = true, fristMove = true;
        var ckey = 0;
        tabMain.style.transform = "translateX("+ -twidth +"px)";
        tabMain.addEventListener("touchstart", function(e) {
            this.style.transition = "none";
            startPoint = e.changedTouches[0].clientX;
            startPointY = e.changedTouches[0].clientY;
            oldX = translateX = -twidth;
            startDirection = true;
            fristMove = true;
        });
        tabMain.addEventListener("touchmove", function(e) {
            if (!startDirection) {
                return false;
            }
            var moveX = e.changedTouches[0].clientX;
            var moveY = e.changedTouches[0].clientY;
            var diff = moveX - startPoint;
            var diffY = moveY - startPointY;
            translateX = diff + oldX;
            if (fristMove) {
                fristMove = false;
                if (Math.abs(diffY) > Math.abs(diff)) {
                    startDirection = false;
                } else {
                    sitewrap.style.overflow = "hidden";
                }
            }
            if (startDirection) {
                this.style.transform = "translateX("+translateX+"px)";
            }
        });
        tabMain.addEventListener("touchend", function() {
            this.style.transition = ".5s";
            var tabTag = obj.querySelector(".mv-tab-tag");
            var cloud = obj.querySelector(".mv-tab-tag-cloud");
            var tkey = Math.round(translateX / twidth);
            translateX = tkey * twidth;
            this.style.transform = "translateX("+translateX+"px)";
            if (tkey == 0) {
                ckey -= 1;
            } else if (tkey == -2) {
                ckey += 1;
            }
            if (ckey > tabTag.children.length - 2) {
                ckey = 0;
            } else if (ckey < 0) {
                ckey = tabTag.children.length - 2;
            }
            cloud.style.transform = "translateX("+Math.abs(ckey) * cloud.offsetWidth+"px)";
            translateX = -twidth;
            setTimeout(function() {
                tabMain.style.transition = "none";
                tabMain.style.transform = "translateX("+translateX+"px)";
            }, 500);
        });
    }
    var tabs = document.querySelectorAll(".mv-tab");
    var sitewrap = document.querySelector(".sitewrap");
    for (var i = 0, len = tabs.length; i < len; i++) {
        changeTab(tabs[i]);
    }
    document.addEventListener("touchstart", function() {
        sitewrap.style.overflow = "auto";
    });
};