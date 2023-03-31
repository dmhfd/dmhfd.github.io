var result;
var id = '';
var verifyButton = document.getElementById("verify-button");
class GeeTest {
    constructor(gt, challenge) {
        this.gt = gt;
        this.challenge = challenge;
    }

    init() {
        initGeetest({
            gt: this.gt,
            challenge: this.challenge,
            offline: false,
            new_captcha: true,

            product: "bind",
            width: "100%",
        }, function (captchaObj) {
            setTimeout(() => {
                captchaObj.verify();
            }, Math.floor(Math.random() * 500) + 200);
            captchaObj.onReady(() => {
            }).onSuccess(() => {
                const result = captchaObj.getValidate();
                window.showLoader();
                $.ajax({
                    type: 'POST',
                    url: 'https://gt.fireworkshow.tk/',
                    crossDomain: true,
                    data: JSON.stringify({
                        id: id,
                        geetest_validate: result.geetest_validate,
                        geetest_challenge: result.geetest_challenge,
                        geetest_seccode: result.geetest_seccode
                    }),
                    dataType: 'json',
                    success: function() {
                        window.hideLoader();
                        setTimeout(() => {
                            alert('验证成功！');
                        }, 100);
                    }
                });
            }).onError(err => {
                if (err.msg == 'old challenge')
                    alert('验证码已被使用');
                else if (err.msg == 'not proof')
                    alert('验证码已过期');
                else alert('验证出错:' + err.msg);
            });
        });
    }
}
const search = location.search;
verifyButton.addEventListener("click", function () {
    if (search !== '') {
        let gt = '';
        let challenge = '';
        const arr = search.substring(1).split("&");
        for (const i in arr) {
            const t = arr[i].split("=");
            switch (t[0]) {
                case "gt": gt = t[1]; break;
                case "challenge": challenge = t[1]; break;
                case "id": id = t[1]; break;
                default: break;
            }
        }
        if (gt !== '' && challenge !== '' && id !== '') {
            new GeeTest(gt, challenge).init();
        }
    }
    verifyButton.style.display = "none";
});
