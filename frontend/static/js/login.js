
// The login function is triggered when the user attempts to log in.
function login() {

    if (validateForm()) {
        // Retrieve user information from the form.
        let data = userInfo();

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:5001/M00792924/login", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.result) {
                            localStorage.setItem('user', JSON.stringify(response.result))
                            window.location.href = "/";
                        }
                    } catch (error) {
                        console.error("Error parsing server response:", error);
                    }
                } else {
                    let errorMessage = "Error sending data";
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.message) {
                            errorMessage += ": " + response.message;
                        }
                    } catch (error) {
                        console.error("Error parsing server response:", error);
                    }
                    alert(errorMessage);
                }
            }
        };
        xhr.send(JSON.stringify(data));
    }
}


// The validateForm function checks if the entered user information is valid.
function validateForm() {
    // Retrieve user information from the form.
    var user = userInfo();

    // Check if both email and password fields are filled.
    if (!user.password || !user.email) {
        alert('Please fill in all fields');
        return false;
    }

    // Check if the entered email is valid (contains '@').
    if (!user.email.includes('@')) {
        alert('Please provide a valid email address');
        return false;
    }

    // If all checks pass, return true indicating the form is valid.
    return true;
}

// The userInfo function retrieves user information from the email and password fields.
function userInfo() {
    var email = document.getElementById('email').value.trim();
    var pass = document.getElementById('pass').value.trim();

    // Return an object containing email and password.
    return {
        email: email,
        password: pass
    };
}

// The getUser function retrieves a user from local storage based on the provided email.
function getUser(email) {
    // Retrieve all users from local storage.
    let users = getUsers();
    // Find and return the user with the matching email.
    return users.find(x => x.email == email);
}

// The getUsers function retrieves all users from local storage or returns an empty array if none exist.
function getUsers() {
    return JSON.parse(localStorage.getItem('user')) || {};
}
