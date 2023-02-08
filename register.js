function redirectAfterSignup() {
    window.location.href = "/after_signup.html";
}


function signup() {
    var SignUpButton = document.getElementById("signup-button");

    SignUpButton.onclick = async function register() {
        try {
            is_valid = validateForm()
            if (!is_valid) {
                return
            }
            is_email = ValidateEmail()
            if (!is_email) {
                return
            }
            isValidPassword = verifyPassword()
            if (!isValidPassword) {
                return
            }
            let _data = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            }
            var requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_data),
            };
            let url = "http://127.0.0.1:8080/auth/register"
            let res = await fetch(url, requestOptions);
            result = await res.json();
            if (result.access_token) {
                return redirectAfterSignup()
            } else {
                displayMessage("error", "Không thể đăng ký tài khoản")
            }
        } catch (error) {
            console.log(error);
        }
    }

}


function ValidateEmail() {
    let email = document.getElementById("email").value
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

function verifyPassword() {
  var pw = document.getElementById("password").value;
  if(pw.length < 8) {
     displayMessage("error", "Độ dài mật khẩu phải có ít nhất 8 ký tự")
     return false;
  }

  if(pw.length > 15) {
    displayMessage("error", "Độ dài mật khẩu không được vượt quá 15 ký tự")
    return false;
  }
  return true;
}


function loadPage() {
    signup()
}

document.addEventListener("DOMContentLoaded", function () { loadPage(); }, false);
