let sended = false;
const formurl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSep2PfB66gyH1qUvlFKSbFq0vSwFSyGl9305Q3X1u9jcx-5hA/formResponse";
{
    const $form = document.querySelector("#form-");
    $form.addEventListener('submit', function (event) {
        if (sended) return;
        if (document.getElementById("jwt").value == "") {
            alert("認証エラー ページをリロードしてやり直してください。");
            return;
        }
        sended = true;
        // event.preventDefault();
        // submitFetch($form);
        document.getElementById("sending").style.display = "block";
    });
    window.addEventListener("load", function () {
        google.accounts.id.initialize({
            client_id: "933814646281-t87epbrjts9dtf7bblcas9b8a1n3fjs0.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }  // customization attributes
        );
        //google.accounts.id.prompt(); // also display the One Tap dialog
    })
    autoFormatTel();
    initRequiredMessage($form);
    initPrefectureOptions($form);
    initListeners($form);
    inputCheck($form);
    autoInputSameAddress();
}

function autoFormatTel() {
    const telBox = document.querySelectorAll("input[type='tel']");
    //電話番号の入力欄から離れたら発動
    for(const inputTel of telBox){
        inputTel.addEventListener('blur', () => {
            // バリデーション関数
            let validateTelNeo = function (value) {
                return /^[0０]/.test(value) && libphonenumber.isValidNumber(value, 'JP');
            }

            // 整形関数
            let formatTel = function (value) {
                return new libphonenumber.AsYouType('JP').input(value);
            }

            const postdata = inputTel.value;//入力した電話番号を取得
            //入力した内容がバリデーションに引っかかったときはエラー
            if (!validateTelNeo(postdata)) {
                console.log('ERROR')
                return
            }
            let formattedTel = formatTel(postdata);//入力した電話番号を整形
            console.log(formattedTel);
            inputTel.value = formattedTel;//整形した電話番号を入力欄に返す
        });
    }
}


function autoInputSameAddress() {
    document.getElementById("autoInputSameAddress").addEventListener("click", function () {
        document.getElementById("emergency-zipcode").value = document.getElementById("zipcode").value;
        document.getElementById("emergency-address_prefecture").value = document.getElementById("address_prefecture").value;
        document.getElementById("emergency-address1").value = document.getElementById("address1").value;
        document.getElementById("emergency-address2").value = document.getElementById("address2").value;
        document.getElementById("emergency-address3").value = document.getElementById("address3").value;
    });
}

function initRequiredMessage($form) {
    for (const $input of $form.querySelectorAll("[required]")) {
        const $container = $input.closest(".inputContainer").querySelector("label");
        const $message = $container.appendChild(document.createElement("span"));
        $message.textContent = "必須";
        $message.classList.add("requiredMessage");
    }
}

function initPrefectureOptions($form) {
    const prefectures = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];
    const $select_prefecture = document.querySelector("#address_prefecture");
    const $select_prefecture2 = document.querySelector("#emergency-address_prefecture");

    for (const prefecture of prefectures) {
        const $option = document.createElement("option");
        $option.textContent = prefecture;
        $option.value = prefecture;
        $select_prefecture.appendChild($option);

        const $option2 = document.createElement("option");
        $option2.textContent = prefecture;
        $option2.value = prefecture;
        $select_prefecture2.appendChild($option2);
    }
}

function initListeners($form) {
    document.getElementById("zipcode").addEventListener("input", inputEvent => zipcodeInputHandler($form, inputEvent, 0));
    document.getElementById("emergency-zipcode").addEventListener("input", inputEvent => zipcodeInputHandler($form, inputEvent, 1));
}


function zipcodeInputHandler($form, inputEvent, type) {
    const _zipcode = inputEvent.target.value.trim();
    const $input = inputEvent.target;

    if (!_zipcode.match(/^\d{3}-?\d{4}$/))
        return;

    const zipcode = _zipcode.replace("-", "");
    autoInputAddressFromZipcode($form, zipcode, type);
}

async function autoInputAddressFromZipcode($form, zipcode, type) {
    const $msg_searching = document.getElementById("statusMessage-searching");
    setAllAddressInputDisabled($form, true);
    $msg_searching.style.display = "inline";

    const result_fetchAddress = await new Promise(resolve => {
        fetchAddressFromZipcode(zipcode).then(resolve);
        setTimeout(resolve.bind(this, { isSuccess: false, code: "TIMEOUT" }), 1000 * 15);
    });

    setAllAddressInputDisabled($form, false);
    $msg_searching.style.display = "none";

    if (result_fetchAddress.isSuccess) {
        const addressData = result_fetchAddress.value;
        if (type === 0) {
            document.getElementById("address_prefecture").value = addressData.address1;
            document.getElementById("address1").value = addressData.address2;
            document.getElementById("address2").value = addressData.address3;
        } else {
            document.getElementById("emergency-address_prefecture").value = addressData.address1;
            document.getElementById("emergency-address1").value = addressData.address2;
            document.getElementById("emergency-address2").value = addressData.address3;
        }
    } else {
        throw Error(`${result_fetchAddress.error.code}`);
    }
}

async function fetchAddressFromZipcode(zipcode) {
    const apiURL = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;
    const response = await fetch(apiURL);
    if (response.status !== 200)
        return {
            isSuccess: false,
            error: {
                code: "HTTP_REQUEST_ERROR"
            }
        };

    const responseData = await response.json();
    if (responseData.status === 400)
        return {
            isSuccess: false,
            error: {
                code: "INVALID_ZIPCODE"
            }
        };

    if (responseData.status === 200) {
        if (responseData.results == null)
            return {
                isSuccess: false,
                error: {
                    code: "ADDRESS_NOT_FOUND"
                }
            };
        return {
            isSuccess: true,
            value: responseData.results[0]
        };
    }

    console.log(responseData);
    throw Error(`not implemented`);
}

function setAllAddressInputDisabled($form, isDisabled) {
    for (const $input of [document.getElementById("address_prefecture"), document.getElementById("address1"), document.getElementById("address2"), document.getElementById("address3"), document.getElementById("emergency-address_prefecture"), document.getElementById("emergency-address1"), document.getElementById("emergency-address2"), document.getElementById("emergency-address3")])
        if (isDisabled)
            $input.setAttribute("disabled", "");
        else
            $input.removeAttribute("disabled");
}

function inputCheck($form) {
    checkRoutine(/^[\u30A1-\u30FC]+$/, "blurKana");
    checkRoutine(/^[^\s]+$/, "normalRequire");
    checkRoutine(/^0\d{1,3}-\d{1,4}-\d{4}$/, "blurTel");
    checkRoutine(/^\d{3}-?\d{4}$/, "zipcodeInput");
    document.getElementById("emergency-mei").addEventListener("input", function () {
        if (document.getElementById("emergency-mei").value === document.getElementById("mei")) {
            alert("緊急連絡先は、親や兄弟など「自分以外の人物」にしてください。");
            document.getElementById("emergency-mei").value = "";
        }
    });
    document.getElementById("emergency-tel-1").addEventListener("input", function () {
        if (document.getElementById("emergency-tel-1").value === document.getElementById("tel")) {
            alert("自分の電話番号と同じ番号を入力しないでください。");
            document.getElementById("emergency-tel-1").value = "";
        }
    });
}

function checkRoutine(reg, classname) {
    for (const box of document.getElementsByClassName(classname)) {
        box.addEventListener("blur", function () {
            if (!box.value.match(reg)) {
                box.classList.add("err");
            } else {
                box.classList.remove("err");
            }
        })
        box.addEventListener("input", function () {
            if (box.value.match(reg)) {
                box.classList.remove("err");
            }
        })
    }
}

function submitFetch($form) {
    if (sended) return;
    if (document.getElementById("jwt").value == "") {
        alert("認証エラー ページをリロードしてやり直してください。");
        return;
    }
    let formBody = "";
    for (const formItem of document.querySelectorAll(".formItem")) {
        formBody += `&${formItem.getAttribute("name")}=${encodeURIComponent(formItem.value)}`;
    }
    formBody = formBody.slice(1);
    console.log(formBody);
    fetch(formurl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    });
    sended = true;
}

// Google login

(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
        factory();
}((function () {
    'use strict';

    /**
     * The code was extracted from:
     * https://github.com/davidchambers/Base64.js
     */

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    function InvalidCharacterError(message) {
        this.message = message;
    }

    InvalidCharacterError.prototype = new Error();
    InvalidCharacterError.prototype.name = "InvalidCharacterError";

    function polyfill(input) {
        var str = String(input).replace(/=+$/, "");
        if (str.length % 4 == 1) {
            throw new InvalidCharacterError(
                "'atob' failed: The string to be decoded is not correctly encoded."
            );
        }
        for (
            // initialize result and counters
            var bc = 0, bs, buffer, idx = 0, output = "";
            // get next character
            (buffer = str.charAt(idx++));
            // character found in table? initialize bit storage and add its ascii value;
            ~buffer &&
                ((bs = bc % 4 ? bs * 64 + buffer : buffer),
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                    bc++ % 4) ?
                (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)))) :
                0
        ) {
            // try to find character in table (0-63, not found => -1)
            buffer = chars.indexOf(buffer);
        }
        return output;
    }

    var atob = (typeof window !== "undefined" &&
        window.atob &&
        window.atob.bind(window)) ||
        polyfill;

    function b64DecodeUnicode(str) {
        return decodeURIComponent(
            atob(str).replace(/(.)/g, function (m, p) {
                var code = p.charCodeAt(0).toString(16).toUpperCase();
                if (code.length < 2) {
                    code = "0" + code;
                }
                return "%" + code;
            })
        );
    }

    function base64_url_decode(str) {
        var output = str.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += "==";
                break;
            case 3:
                output += "=";
                break;
            default:
                throw "Illegal base64url string!";
        }

        try {
            return b64DecodeUnicode(output);
        } catch (err) {
            return atob(output);
        }
    }

    function InvalidTokenError(message) {
        this.message = message;
    }

    InvalidTokenError.prototype = new Error();
    InvalidTokenError.prototype.name = "InvalidTokenError";

    function jwtDecode(token, options) {
        if (typeof token !== "string") {
            throw new InvalidTokenError("Invalid token specified");
        }

        options = options || {};
        var pos = options.header === true ? 0 : 1;
        try {
            return JSON.parse(base64_url_decode(token.split(".")[pos]));
        } catch (e) {
            throw new InvalidTokenError("Invalid token specified: " + e.message);
        }
    }

    /*
     * Expose the function on the window object
     */

    //use amd or just through the window object.
    if (window) {
        if (typeof window.define == "function" && window.define.amd) {
            window.define("jwt_decode", function () {
                return jwtDecode;
            });
        } else if (window) {
            window.jwt_decode = jwtDecode;
        }
    }

})));
//# sourceMappingURL=jwt-decode.js.map

function handleCredentialResponse(response) {
    const responsePayload = jwt_decode(response.credential);
    if (!responsePayload.email.includes("@shibaura-it.ac.jp")) {
        document.getElementById("alertArea").style.display = "block";
    } else {
        document.getElementById("alertArea").style.display = "none";
        document.getElementById("jwt").value = response.credential;
        document.getElementById("gakuban").value = responsePayload.email.slice(0, 7).toUpperCase();
        document.querySelector(".header-wrap").classList.add("hide");
        setTimeout(() => {
            document.querySelector(".header-wrap").style.display = "none";
            document.querySelector(".formMain").style.display = "block";
            document.querySelector(".formMain").classList.remove("hide");
        }, 800);
    }
}

