
var element = document.querySelector('#log-in');
element.addEventListener("submit", function (event) {
    event.preventDefault()
    const formData = new FormData(element);
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    fetch("/log-in", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            role
        })
    }).then((data) => data.json()).then((data) => {
        if (data?.status == 200) {
            if (role === 'Customer') {
                window.location.href = '/cart';
            } else {
                window.location.href = '/rentals/list';
            }

            return
        } else {
            const emailErr = document.getElementById('email-error');
            emailErr.textContent = data?.email;
            const passError = document.getElementById('password-error');
            passError.textContent = data?.password;
            return
        }
    }).catch((error) => {
    })
})
