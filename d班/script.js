$('#send').click(function () {
    const canvas = document.getElementById("canvas")
    let src = ctx.getImageData(0, 0, canvas.width, canvas.height)
    console.log(src.data);
    const newArray = [];
    for (let i = 0; i < src.data.length; i+=canvas.width) {
        const arr = [];
        for (let j = 0; j < canvas.width; j++) {
            if(src.data[ i + (j*4+3) ] > 128){
                arr.push(1);
            }else{
                arr.push(0);
            }
        }
        newArray.push(arr);
    }
    console.log(newArray);
});

var canvas = document.getElementById('canvas');
var ctx = document.getElementById("canvas").getContext("2d");
canvas.width = 800;
canvas.height = 800;

function drawCoordinates(x, y, mouseX, mouseY) {
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(x, y);
    ctx.lineCap = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = defocolor;
    ctx.closePath();
    ctx.stroke();
    mouseX = x;
    mouseY = y;
}

var $document = $(document);
var $hitarea = $('#hitarea');
var $x = $('#x');
var $y = $('#y');
var supportTouch = 'ontouchend' in document;// タッチイベントが利用可能かの判別

var EVENTNAME_TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown';
var EVENTNAME_TOUCHMOVE = supportTouch ? 'touchmove' : 'mousemove';
var EVENTNAME_TOUCHEND = supportTouch ? 'touchend' : 'mouseup';

var mouseX = "";
var mouseY = "";

var updateXY = function (event) {
    var original = event.originalEvent;
    var x, y;
    if (original.changedTouches) {
        x = original.changedTouches[0].pageX;
        y = original.changedTouches[0].pageY;
    } else {
        x = event.pageX;
        y = event.pageY;
    }
    $x.text(x);
    $y.text(y);
    return [x, y];
};

// イベント設定
var handleStart = function (event) {
    event.preventDefault();// タッチによる画面スクロールを止める
    [x, y] = updateXY(event);
    mouseX = x;
    mouseY = y;
    bindMoveAndEnd();
};
var handleMove = function (event) {
    event.preventDefault(); // タッチによる画面スクロールを止める
    [x, y] = updateXY(event);
    drawCoordinates(x, y, mouseX, mouseY)
    mouseX = x;
    mouseY = y;
};
var handleEnd = function (event) {
    [x, y] = updateXY(event);
    drawCoordinates(x, y, mouseX, mouseY)
    mouseX = "";
    mouseY = "";
    unbindMoveAndEnd();
};
var bindMoveAndEnd = function () {
    $document.on(EVENTNAME_TOUCHMOVE, handleMove);
    $document.on(EVENTNAME_TOUCHEND, handleEnd);
};
var unbindMoveAndEnd = function () {
    $document.off(EVENTNAME_TOUCHMOVE, handleMove);
    $document.off(EVENTNAME_TOUCHEND, handleEnd);
};

$hitarea.on(EVENTNAME_TOUCHSTART, handleStart);

let defocolor = "#000000";
function watchColorPicker(event) {
    defocolor = event.target.value;
}
document.querySelector("#color").addEventListener("change", watchColorPicker, false);

function removePaint() {
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFD";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}