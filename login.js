
function redirectHome() {
    window.location = "/home.html";
}


function login() {
    var button = document.getElementById("login-button");
    button.addEventListener("click", async function () {
        try {
            is_valid = validateForm()
            if (!is_valid) {
                return
            }
            is_email = ValidateEmail()
            if (!is_email) {
                return
            }
            var data = new URLSearchParams();
            data.append('username', document.getElementById("email").value);
            data.append('password', document.getElementById("password").value);
            var requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data,
            };
            let url = "http://hidemyemail.click/auth/token"
            let res = await fetch(url, requestOptions);
            result = await res.json();
            if (result.access_token) {
                await chrome.storage.session.set({ "token": result.access_token })
                return redirectHome()
            } else {
                displayMessage("error", "Sai email hoặc mật khẩu")
                return
            }
        } catch (error) {
            console.log(error);
        }
    });
}

function displayMessage(state, message) {
    let content = ``
    if ("error".localeCompare(state) == 0) {
        content = `<div class="alert alert-danger" role="alert">
            <strong>Lỗi!</strong> ${message}
        </div>`
    }
    document.getElementById("alert-message").innerHTML = content;
    document.getElementById("alert-message").style.display = "block";
    window.setTimeout(function () {
        var alerts = document.querySelectorAll('.alert');
        for (var i = 0; i < alerts.length; i++) {
            alerts[i].style.opacity = 0;
            alerts[i].style.transition = 'opacity 0.5s';
            alerts[i].style.transition += ', height 0.5s';
            alerts[i].addEventListener('transitionend', function (e) {
                if (e.propertyName === 'opacity') {
                    this.parentNode.removeChild(this);
                }
            });
        }
    }, 4000);
}

function ValidateEmail() {
    let email = document.getElementById("email").value
    console.log("ValidateEmail")
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    displayMessage("error", "Vui lòng nhập đúng định dạng email")
    return (false)
}

function validateForm() {

    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    if (email == "" || password == "") {
        displayMessage("error", "Vui lòng điền đầy đủ thông tin")
        return false;
    }
    return true;
}

async function CheckSessions() {
    const auth = await chrome.storage.session.get(["token"]);
    if (auth.token) {
        window.location.href = "/items.html";
        return
    }
    return login()
}
document.addEventListener("DOMContentLoaded", function () { CheckSessions(); }, false);
