<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>倉庫管理アプリ</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        #loading{
            text-align: center;
            width: 100%;
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translateY(-50%) translateX(-50%);
        }
        #loading > h3{
            font-size: 2rem;
            font-weight: normal;
            display: inline-block;
            margin-left: 1rem;
        }
        #loading > svg{
            display:  inline-block;
            width: 2rem;
            height: 2rem;
            transform: translateY(0.4rem);
        }
        #display-area,#list-area{
            display:none;
        }
        .item{
            width: 90%;
            box-shadow: 0 0 4px 2px #0004;
            padding: 0.5rem;
            border-radius: 6px;
            margin: 0.5rem auto;
        }
        .item-name{
            display: block;
            font-weight: bold;
        }
        .edit,.submit{
            display:none;
        }
        .submit{
            width: 50%;
            height: 3rem;
            text-align: center;
            font-size: 1.2rem;
            margin: 3rem auto;
        }
        .img-item img{
            max-width: 80vw;
            max-height: 80vw;
            display: block;
            border: solid 2px #0004;
        }
        input[type="text"],select{
            width: 90%;
            height: 1.4rem;
            font-size: 1.2rem;
        }
        textarea{
            width: 90%;
            height: 10rem;
            font-size: 1.2rem;
        }
        .row{
            margin: 1rem;
            width: 80%;
            border-top: solid 1px #0004;
            border-bottom: solid 1px #0004;
            color: #000;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <script>
        const gasurl = "https://script.google.com/macros/s/AKfycbxtnnMFT2To7ebFQPJQtRdU_-bIW0g3yQ8LLnnUMKhRG49qgk2V-2RHZXevr3I9YFCq/exec";
        let url = new URL(window.location.href);
        let params = url.searchParams;
        // idパラメータがなかった場合一覧表示 あった場合個別ページ
        if(params.get('id')){
            fetch(gasurl + "?mode=exist&id=" + params.get('id'),
                {
                    "method": "GET",
                    'cache': 'no-store'
                })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    // レスポンス json の処理
                    console.log(json);
                    document.getElementById("loading").style.display = "none";
                    //存在しない場合作成
                    if(json.result == "Ok" && json.exist === false){
                        for(const edit of document.querySelectorAll(".edit")){
                            edit.style.display = "block";
                            edit.setAttribute("name",edit.parentNode.getAttribute("id"));
                            const now = new Date();
                            const nowStr = `${now.getFullYear()}/${("00"+(now.getMonth()+1)).slice(-2)}/${("00"+now.getDate()).slice(-2)} ${("00"+now.getHours()).slice(-2)}:${("00"+now.getMinutes()).slice(-2)}`;
                            // GMT+0900
                            switch(edit.parentNode.getAttribute("id")){
                                case "id":
                                    edit.value = params.get('id');
                                    break;
                                case "created":
                                    edit.value = nowStr;
                                    break;
                                case "updated":
                                    edit.value = nowStr;
                                    break;
                                default:
                                    break;
                            }
                        }
                        // for(const imgInput of document.querySelectorAll(".img-upload")){
                            
                        // }
                        document.getElementById("submit").style.display = "block";
                        document.getElementById("display-area").style.display = "block";
                    }
                    //存在する場合表示
                    else if(json.result == "Ok" && json.exist === true){
                        Object.keys(json.data).forEach(function (key) {
                            if(document.getElementById(key).classList.contains("img-item")){
                                if(json.data[key] !== ""){
                                    document.getElementById(key).querySelector(".item-body").innerHTML = `<img src="${json.data[key]}">`;
                                }
                            }else{
                                document.getElementById(key).querySelector(".item-body").innerHTML = String(json.data[key]).replace(/\n/g,"<br>");
                            }
                        });
                        document.getElementById("display-area").style.display = "block";
                    }
                })
                .catch(err => {
                    // エラー処理
                    console.error(err);
                });
        }else{
            fetch(gasurl + "?mode=list",
                {
                    "method": "GET",
                    'cache': 'no-store'
                })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    // レスポンス json の処理
                    console.log(json);
                    let str = "";
                    for(const rdata of json.list){
                        str+=`
                        <a href="https://shibalab.com/souko/?id=${rdata.id}">
                        <div class="row">
                            ${rdata.product_name}
                        </div>
                        </a>
                        `;
                    }
                    document.getElementById("list-area").insertAdjacentHTML("beforeEnd",str);
                    document.getElementById("loading").style.display = "none";
                    document.getElementById("list-area").style.display = "block";
                })
        }
    </script>
    <div id="loading">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#2589d0">
            <circle cx="12" cy="2" r="2" opacity=".1">
                <animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin="0"/>
            </circle>
            <circle transform="rotate(45 12 12)" cx="12" cy="2" r="2" opacity=".1">
                <animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin=".125s"/>
            </circle>
            <circle transform="rotate(90 12 12)" cx="12" cy="2" r="2" opacity=".1">
                <animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin=".25s"/>
            </circle>
            <circle transform="rotate(135 12 12)" cx="12" cy="2" r="2" opacity=".1">
                <animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin=".375s"/>
            </circle>
            <circle transform="rotate(180 12 12)" cx="12" cy="2" r="2" opacity=".1">
                <animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin=".5s"/>
            </circle>
            <circle transform="rotate(225 12 12)" cx="12" cy="2" r="2" opacity=".1">
                <animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin=".625s"/>
            </circle>
            <circle transform="rotate(270 12 12)" cx="12" cy="2" r="2" opacity=".1">
                <animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin=".75s"/>
            </circle>
            <circle transform="rotate(315 12 12)" cx="12" cy="2" r="2" opacity=".1">
                <animate attributeName="opacity" from="1" to=".1" dur="1s" repeatCount="indefinite" begin=".875s"/>
            </circle>
        </svg>
        <h3>
            now loading...
        </h3>
    </div>
    <div id="display-area">
        <form method="post" action="./index.php" enctype="multipart/form-data">
            <div class="item" id="id">
                <div class="item-name">
                    ID
                </div>
                <div class="item-body">
                    
                </div>
                <input class="edit" type="text" readonly="readonly">
            </div>
            <div class="item" id="created">
                <div class="item-name">
                    作成日
                </div>
                <div class="item-body">
                    
                </div>
                <input class="edit" type="text" readonly="readonly">
            </div>
            <div class="item" id="updated">
                <div class="item-name">
                    更新日
                </div>
                <div class="item-body">
                    
                </div>
                <input class="edit" type="text" readonly="readonly">
            </div>
            <div class="item" id="class">
                <div class="item-name">
                    備品分類
                </div>
                <div class="item-body">
                    
                </div>
                <select class="edit">
                    <option value="備品">備品</option>
                    <option value="消耗品">消耗品</option>
                </select>
            </div>
            <div class="item" id="category">
                <div class="item-name">
                    製品分類
                </div>
                <div class="item-body">
                    
                </div>
                <input list="category-list" class="edit" type="text">
                <datalist id="category-list">
                    <option value="プロジェクタ">プロジェクタ</option>
                    <option value="スクリーン">スクリーン</option>
                    <option value="工具">工具</option>
                    <option value="PC・タブレット">PC・タブレット</option>
                    <option value="電子機器">電子機器</option>
                </datalist>
            </div>
            <div class="item" id="product_name">
                <div class="item-name">
                    製品名
                </div>
                <div class="item-body">
                    
                </div>
                <input class="edit" type="text">
            </div>
            <div class="item" id="quantity">
                <div class="item-name">
                    個数
                </div>
                <div class="item-body">
                    
                </div>
                <input class="edit" type="text">
            </div>
            <div class="item" id="case_num">
                <div class="item-name">
                    ケース番号
                </div>
                <div class="item-body">
                    
                </div>
                <input class="edit" type="text">
            </div>
            <div class="item" id="spec">
                <div class="item-name">
                    スペック
                </div>
                <div class="item-body">
                    
                </div>
                <textarea class="edit"></textarea>
            </div>
            <div class="item img-item" id="img1">
                <div class="item-name">
                    画像1
                </div>
                <div class="item-body">
                    
                </div>
                <input class="img-upload edit" type="file" accept="image/*">
            </div>
            <div class="item img-item" id="img2">
                <div class="item-name">
                    画像2
                </div>
                <div class="item-body">
                    
                </div>
                <input class="img-upload edit" type="file" accept="image/*">
            </div>
            <div class="item img-item" id="img3">
                <div class="item-name">
                    画像3
                </div>
                <div class="item-body">
                    
                </div>
                <input class="img-upload edit" type="file" accept="image/*">
            </div>
            <div class="item" id="rent_flag">
                <div class="item-name">
                    貸し出し中
                </div>
                <div class="item-body">
                    
                </div>
            </div>
            <div class="item" id="rent_date">
                <div class="item-name">
                    貸出日
                </div>
                <div class="item-body">
                    
                </div>
            </div>
            <div class="item" id="return_plan_date">
                <div class="item-name">
                    返却予定日
                </div>
                <div class="item-body">
                    
                </div>
            </div>
            <div class="item" id="return_date">
                <div class="item-name">
                    返却日
                </div>
                <div class="item-body">
                    
                </div>
            </div>
            <div class="item" id="user_name">
                <div class="item-name">
                    借主氏名
                </div>
                <div class="item-body">
                    
                </div>
            </div>
            <div class="item" id="user_num">
                <div class="item-name">
                    借主学番
                </div>
                <div class="item-body">
                    
                </div>
            </div>
            <div class="item" id="user_list">
                <div class="item-name">
                    貸し出し履歴
                </div>
                <div class="item-body">
                    
                </div>
            </div>
            <input type="submit" class="submit" name="submit" id="submit" value="送信">
        </form>
    </div>
    <div id="list-area">

    </div>
    <?php
    if (isset($_POST['submit'])) {//送信ボタンが押された場合
        //画像を保存
        $URLS = [];
        for ($i = 1; $i <= 3; $i++) {
            $imgNum = "img".$i;
            $image = uniqid(mt_rand(), true);//ファイル名をユニーク化
            $image .= '.' . substr(strrchr($_FILES[$imgNum]['name'], '.'), 1);//アップロードされたファイルの拡張子を取得
            $file = "images/$image";
            if (!empty($_FILES[$imgNum]['name'])) {//ファイルが選択されていれば$imageにファイル名を代入
                //画像ファイルかのチェック
                move_uploaded_file($_FILES[$imgNum]['tmp_name'], './images/' . $image);//imagesディレクトリにファイル保存
                if (exif_imagetype($file)) {
                    $URLS[] = $file;
                }
            }
        }
        //form dataを送信
        $formdata = array();
        foreach ($_POST as $key => $value) {
            $formdata = array_merge($formdata, array($key => $value));
        }
        for ($i = 0; $i < count($URLS); $i++) {
            $formdata = array_merge($formdata, array("img".($i+1) => "http://shibalab.com/souko/".$URLS[$i]));
        }
        $json = json_encode($formdata,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
        $id = $formdata['id'];
        echo(
            <<< EOM
            <script>
            console.log($json);
            fetch(gasurl,
            {
                "method": "POST",
                "Content-Type": "application/x-www-form-urlencoded",
                "body": JSON.stringify({
                    mode: "new",
                    data: $json
                }),
                'cache': 'no-store'
            })
            .then(response => {
                return response.json();
            })
            .then(json => {
                // レスポンス json の処理
                console.log(json);
                location.href = "http://shibalab.com/souko/?id=$id";
            })
            .catch(err => {
                // エラー処理
                console.error(err);
                alert("エラー");
            });
            </script>
            EOM
        );
    }
    ?>
</body>

</html>

