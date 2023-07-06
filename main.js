window.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('scroll', function () {
        //初期画面スクロールによって背景変更
        let scrolly = window.scrollY;
        if (scrolly > window.innerHeight / 3) {
            if (document.getElementById('mainBody').classList.contains("pagetop")) {
                document.getElementById('mainBody').classList.remove("pagetop");
                document.getElementById('mainMenu').classList.remove("pagetop");
                document.getElementById('mainMenu').style.display = ("block");
            }
        } else {
            if (!(document.getElementById('mainBody').classList.contains("pagetop"))) {
                document.getElementById('mainBody').classList.add("pagetop");
                document.getElementById('mainMenu').classList.add("pagetop");
                document.getElementById('mainMenu').style.display = ("none");
            }
        }
        //下線長さスクロールによって調整
        let consepts = document.getElementsByClassName("concept");
        for (let concept of consepts) {
            if (scrolly + window.innerHeight * 0.5 > concept.getBoundingClientRect().top && scrolly - window.innerHeight * 1.2 < concept.getBoundingClientRect().top) {
                if (!(concept.classList.contains("concept-disp"))) {
                    concept.classList.add("concept-disp");
                }
            } else {
                if (concept.classList.contains("concept-disp")) {
                    concept.classList.remove("concept-disp");
                }
            }
        }
    });
    function scroll_effect() {
        let element = document.getElementsByClassName('scroll-up');
        if (!element) return;

        let scrollY = window.pageYOffset;
        let windowH = window.innerHeight;
        let showTiming = 150; // 要素を表示するタイミング
        for (let i = 0; i < element.length; i++) {
            let elemClientRect = element[i].getBoundingClientRect();
            let elemY = scrollY + elemClientRect.top;
            if (scrollY > elemY - windowH + showTiming) {
                element[i].classList.add('is-show');
            }
        }
    }
    window.addEventListener('scroll', scroll_effect); // スクロール時に実行
    //ロード画面
    const loading = document.getElementById("loading");
    loading.querySelector(".container").style.opacity = 1;
    if (loading) {
        console.log("Loaded");
        window.addEventListener('load', (event) => {
            setTimeout(() => {
                loading.classList.add("loaded");
            }, 1000);
            setTimeout(() => {
                loading.style.display = "none";
            }, 2500);
        });
    }
    //スマホメニュー
    const spMenu = document.getElementById("spMenu");
    const topgo = document.getElementById("topgo");
    if (spMenu) {
        const menuIcon = spMenu.querySelector(".humberger-menu-icon");
        menuIcon.addEventListener("click", function () {
            if (menuIcon.classList.contains("menu-open")) {
                menuIcon.classList.remove("menu-open");
                spMenu.classList.add("hidden");
            } else {
                menuIcon.classList.add("menu-open");
                spMenu.classList.remove("hidden");
            }
        });
        topgo.addEventListener("click", function () {
            if (topgo) {
                if (menuIcon.classList.contains("menu-open")) {
                    menuIcon.classList.remove("menu-open");
                    spMenu.classList.add("hidden");
                }
            }
        });
    }

    //iOS判定
    if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
        const normals = document.getElementsByClassName("normal");
        for (const normal of normals) {
            normal.classList.remove("normal");
            normal.classList.add("iphone");
        }
    }
    //フッタ変更
    this.document.getElementById("footerDate").innerHTML = ("2016-" + new Date().getFullYear());


});