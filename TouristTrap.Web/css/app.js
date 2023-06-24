// Get the necessary DOM elements
const emailInput = document.querySelector("#email");
const form = document.querySelector("#cuboid form");
const submitIcon = document.querySelector(".submit-icon");
const resetIcon = document.querySelector(".reset-icon");
const status = document.querySelector("#form-status");
const initialStatusMessage = status.innerHTML;
// Add 'ready' class to form when user focuses on email input
emailInput.addEventListener("focus", function () {
    form.classList.add("ready");
});

// Remove 'ready' class from form when user blurs away, but only if there is no content
emailInput.addEventListener("blur", function () {
    if (this.value === "") {
        form.classList.remove("ready");
    }
});

// If the user is typing something, make the arrow green and active
emailInput.addEventListener("keyup", function () {
    // This adds 'active' class only if the input has some text
    submitIcon.classList.toggle("active", this.value.length > 0);
});


function handleError() {
    form.classList.remove("loading"); form.classList.add("ready");
}
async function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    status.innerHTML = initialStatusMessage;
    form.classList.remove("ready");
    form.classList.add("loading");
    var data = new FormData(event.target);
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            form.reset()
            form.classList.remove("loading");
            form.classList.add("complete");
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form"
                }
            })
            setTimeout(handleError, 3000);
        }
    }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form";
        setTimeout(handleError, 3000);
    });
}




// Reset/refresh functionality
resetIcon.addEventListener("click", function () {
    form.classList.remove("complete");
});

// On form submit, remove 'ready' class and add 'loading' class to the form
form.addEventListener("submit", handleSubmit);