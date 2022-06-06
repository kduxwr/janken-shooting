

$(function(){
    setInterval(function(){
        $('h3').fadeOut(700,function(){$(this).fadeIn(700)});
    },1000);
});

let score = 0;
let startFlg = true;
let gameOverFlg = false;

// ーーー　方向キー入力　ーーー
let arrowFlg = [false, false, false, false];

$(window).on('keydown', function(e) {
    if(e.keyCode == 37)
        arrowFlg[0] = true;
    else if(e.keyCode == 38)
        arrowFlg[1] = true;
    else if(e.keyCode == 39)
        arrowFlg[2] = true;
    else if(e.keyCode == 40)
        arrowFlg[3] = true;
    return false;
});

$(window).on('keyup', function(e) {
    if(e.keyCode == 37)
        arrowFlg[0] = false;
    else if(e.keyCode == 38)
        arrowFlg[1] = false;
    else if(e.keyCode == 39)
        arrowFlg[2] = false;
    else if(e.keyCode == 40)
        arrowFlg[3] = false;
    return false;
});
// ーーー　ENDー方向キー入力　ーーー

// ーーー　それ以外のキー入力　ーーー
$(window).on('keydown', function(e) {
    if(gameOverFlg) {
        location.reload(true);
    }
    if(startFlg) {
        startFlg = false;
        $('.start').remove();
        $('.display').show();
        setInterval(gent, 1000);
    }
    let shotKind = 0;
    if(e.keyCode == 65) {
        shotKind = 1;
        score -= 5;
        $('.score span').text(score);
    } else if(e.keyCode == 83){
        shotKind = 2;
        score -= 5;
        $('.score span').text(score);
    } else if(e.keyCode == 68) {
        shotKind = 3;
        score -= 5;
        $('.score span').text(score);
    } else if(e.keyCode == 87) {
        shotKind = 4;
        score -= 200;
        $('.score span').text(score);
    }
    if(shotKind) {
        filename = ['gu.png', 'choki.png', 'pa.png', 'saikyo.png'];
        let tama = $('<img class="tama tama-' + shotKind + '" src="images/' + filename[shotKind-1] + '">').appendTo('.display');
        tamaList.push({obj:tama,kind:shotKind-1});
        let myoff = $('.my').offset();
        switch(shotKind) {
            case 1:
                tama.offset({top:myoff.top+48, left:myoff.left});
                break;
            case 2:
                tama.offset({top:myoff.top+48, left:myoff.left+64});
                break;
            case 3:
                tama.offset({top:myoff.top+48, left:myoff.left+128});
                break;
            case 4:
                tama.offset({top:myoff.top , left:myoff.left+64});
                break;
        }
    }        
});

// ーーー　ENDーそれ以外のキー入力　ーーー


// ーーー　メインループ　ーーー
let tamaList = [];
let tekiList = [];

setInterval(function() {
    const speed = 8;
    let myoff = $('.my').offset();
    let addtop = 0;
    let addleft = 0;

    if(arrowFlg[0]) {
        addleft -= speed;
    }
    if(arrowFlg[1]) {
        addtop -= speed;
        //shotKind = 1;
    }
    if(arrowFlg[2]) {
        addleft += speed; 
        //shotKind = 2;
    }
    if(arrowFlg[3]) {
        addtop += speed;
        //shotKind = 1;
    }

    $('.my').offset({top:myoff.top + addtop, left:myoff.left + addleft});
    var displayOff = $('.display').offset();

    let tamaRemoveList = [];
    for(let i = 0; i < tamaList.length; i++) {
        const mytamaspeed = -2;
        let tamaoff = tamaList[i].obj.offset();
        if(tamaoff.top > displayOff.top) {
            tamaList[i].obj.offset({top: tamaoff.top + mytamaspeed, left: tamaoff.left});
        } else {
            tamaList[i].obj.remove();
            tamaRemoveList.push(i);
        }
    }
    for(let i = 0; i < tamaRemoveList.length; i++) {
        tamaList.splice(tamaRemoveList[i]-i, 1); 
    }
    
    let tekiRemoveList = [];
    for(let i = 0; i < tekiList.length; i++) {
        const tamaspeed = +1;
        let tekioff = tekiList[i].obj.offset();
        if(tekioff.top < displayOff.top + 720) {
            tekiList[i].obj.offset({top: tekioff.top + tamaspeed, left: tekioff.left});
        } else {
            tekiList[i].obj.remove();
            tekiRemoveList.push(i);
        }
    }
    for(let i = 0; i < tekiRemoveList.length; i++) {
        tekiList.splice(tekiRemoveList[i]-i, 1);    
    }
    if(tekiRemoveList.length) {
        $('.gameover').show();
        gameOverFlg = true;
    }

    tamaRemoveList = [];
    tekiRemoveList = [];
    for(let i = 0; i < tamaList.length; i++) {
        for(j = 0; j < tekiList.length; j++) {
            let tamaoff = tamaList[i].obj.offset();
            let tekioff = tekiList[j].obj.offset();
            let toplen = tamaoff.top - tekioff.top;
            let leftlen = tamaoff.left - tekioff.left;
            let length = toplen * toplen + leftlen * leftlen;
            if(length < 4000 ) {
                console.log(tamaList[i].kind + 'teki'+ tekiList[j].kind)
                if((tamaList[i].kind == 0 && tekiList[j].kind == 1)
                || (tamaList[i].kind == 1 && tekiList[j].kind == 2)
                || (tamaList[i].kind == 2 && tekiList[j].kind == 0)
                || tamaList[i].kind == 3) {

                    tekiList[j].obj.remove();
                    tamaList[i].obj.remove();
                    tamaRemoveList.push(i);
                    tekiRemoveList.push(j);
                    let win = $('<img class="win" src="images/win.png">').appendTo('.display');
                    win.offset({top: tekioff.top, left: tekioff.left});
                    score += 100;
                    $('.score span').text(score);
                    setInterval(function() {
                        win.remove();
                    }, 500);
                    
                }
                // else if((tamaList[i].kind == 1 && tekiList[j].kind == 0)
                // || (tamaList[i].kind == 2 && tekiList[j].kind == 1)
                // || (tamaList[i].kind == 0 && tekiList[j].kind == 2)) {
                //     tekiList[j].obj.remove();
                //     tamaList[i].obj.remove();
                //     tamaRemoveList.push(i);
                //     tekiRemoveList.push(j);
                //     let lose = $('<img class="lose" src="images/lose.png">').appendTo('.display');
                //     lose.offset({top: tekioff.top, left: tekioff.left});
                //     score -= 100;
                //     $('.score span').text(score);
                //     setInterval(function() {
                //         lose.remove();
                //     }, 500);
                // }
                // else {
                //     tekiList[j].obj.remove();
                //     tamaList[i].obj.remove();
                //     tamaRemoveList.push(i);
                //     tekiRemoveList.push(j);
                //     let aiko = $('<img class="aiko" src="images/aiko.png">').appendTo('.display');
                //     aiko.offset({top: tekioff.top, left: tekioff.left});
                //     score -= 50;
                //     $('.score span').text(score);
                //     setInterval(function() {
                //         aiko.remove();
                //     }, 500);
                // }
                
            }
        }
    }
    for(let i = 0; i < tamaRemoveList.length; i++) {
        tamaList.splice(tamaRemoveList[i]-i, 1);
    }
    for(let i = 0; i < tekiRemoveList.length; i++) {
        tekiList.splice(tekiRemoveList[i]-i, 1);
    }
}, 16); // 約60FPS
// ーーー　ENDーメインループ　ーーー


// ーーー　敵生成　ーーー
let intervalCnt = 1;
let gentCnt = 0;

function gent() {
    if(intervalCnt > 0) {
        intervalCnt--;
    } else {
        let filename = ['tgu.png', 'tchoki.png', 'tpa.png'];

        let rand = Math.floor(Math.random() * 3);
        let rand2 = Math.floor(Math.random() * 420);
        //console.log(rand)
        let displayOff = $('.display').offset();
        let teki = $('<img class="teki teki-' + rand + '" src="images/' + filename[rand] + '">').appendTo('.display');
        teki.offset({top: displayOff.top-64, left: displayOff.left + rand2});
        tekiList.push({obj:teki,kind:rand});
        
        if(gentCnt < 5) {
            intervalCnt = 1 + Math.floor(Math.random() * 3);
        } else if(gentCnt < 10) {
            intervalCnt = 1 + Math.floor(Math.random() * 2);
        }
        else if(gentCnt < 20) {
            intervalCnt = 1 + Math.floor(Math.random() * 1);
        }
        else {
            intervalCnt = Math.floor(Math.random() * 1);
        }
    } 
    gentCnt++;
}
// ーーー　ENDー敵生成　ーーー
