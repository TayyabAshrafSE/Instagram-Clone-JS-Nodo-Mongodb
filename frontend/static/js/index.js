import Home from "./views/Home.js";
import Posts from "./views/Posts.js";
import PostView from "./views/PostView.js";
import Settings from "./views/Settings.js";
import Explore from "./views/Explore.js";
import Notification from "./views/Notification.js";
import Message from "./views/Message.js";
import Create from "./views/Create.js";
import Profile from "./views/Profile.js";
import login from "./views/login.js";
import Signin from "./views/Signin.js";
import Util from "./util.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

// Existing imports and other setup remain unchanged

// Modified router function
const router = async () => {
    const routes = [
        { path: "/", view: Home },
        { path: "/posts", view: Posts },
        { path: "/posts/:id", view: PostView },
        { path: "/settings", view: Settings },
        { path: "/explore", view: Explore },
        { path: "/notification", view: Notification },
        { path: "/messege", view: Message },
        { path: "/create", view: Create },
        { path: "/profile", view: Profile },
        { path: "/login", view: login },
        { path: "/signin", view: Signin },
    ];

    // Check login status
    const isLoggedIn = Util.isLoggedIn();

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    // Default to login if not logged in and not on login page
    if (!match || (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/signin")) {
        match = {
            route: { path: "/login", view: login },
            result: ["/login"]
        };
        history.pushState(null, null, "/login");
    }

    const view = new match.route.view(getParams(match));
    document.querySelector("#app").innerHTML = await view.getHtml();

    // Manage sidebar visibility
    const sidebar = document.querySelector('nav');
    if (location.pathname === "/login" || location.pathname === "/signin" || !isLoggedIn) {
        sidebar.classList.add('hidden');
    } else {
        sidebar.classList.remove('hidden');
    }
};

// Call router on load and on popstate
window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", router);

// Event delegation for navigation links
document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});

const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"),
    logoutBtn = body.querySelector(".logout-btn");


toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
})

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerText = "Light mode";
    } else {
        modeText.innerText = "Dark mode";

    }
});

logoutBtn.addEventListener("click", () => {
    Util.logout();
    window.location.href = "/login"
});


const toastContainer = $('.toast-container');
Util.toastContainer = toastContainer;
const defaultProfilePictureUrl = '/images/default-user.jpg';

$(document).ready(function () {
    const signupForm = $('#signup-form');
    const loginForm = $('#login-form');
    const profileBtn = $('#profile-btn');
    const uploadImage = $('#upload-image');
    const imagePreview = $('#imagePreview');
    const statusBtn = $('#btn-status');
    const statusForm = $('#status-form');
    const storyForm = $('#story-form');
    const searchInput = $('.search-input');
    const searchResult = $('.search-results');
    const btnFollow = $('#btn-follow');
    const stories = $('.stories');

    signupForm.submit(async function (evt) {
        try {
            evt.preventDefault();

            const formData = Util.JSONFormData(this);

            if (!formData.full_name.match(/^[a-z ]+$/i)) {
                throw new Error('Invalid fullname');
            }

            if (!formData.email.match(/^[a-z0-9-_\.]+@[a-z0-9-_\.]+\.[a-z0-9-_\.]+$/i)) {
                throw new Error('Invalid email address');
            }

            if (!formData.dob.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i)) {
                throw new Error('Invalid date of birth');
            }

            if (!formData.password.match(/^[0-9a-z-_\!@#\$%\^\&\*\(\)]{8,}$/i)) {
                throw new Error('Invalid password');
            }

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const response = await fetch('/M00853622/signup', {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Something went wrong. Please try again later!');
            }

            const responseData = await response.json();

            Util.toast(responseData.status, responseData.message);

            if (responseData.status == 'success') {
                this.reset();
                window.location.href = "/login";
            }
        } catch (e) {
            Util.toast('error', e.message);
        }
    });

    loginForm.submit(async function (evt) {
        try {

            evt.preventDefault();

            const formData = Util.JSONFormData(this);

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const response = await fetch('/M00853622/login', {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Something went wrong. Please try again later!");

            const responseData = await response.json();

            Util.toast(responseData.status, responseData.message);

            if (responseData.status === 'success') {
                this.reset();
            }
            else {
                return;
            }

            Util.currentUser = null;

            await loadCurrentUserData();
            // loadCurrentUserFollowingList();
            // loadCurrentUserStories();

            window.location.href = "/";
        } catch (e) {
            console.log(e);
            Util.toast('error', e.message);
        }
    });

    // SHOW PROFILE INFO OF THE USER

    profileBtn.click(async function (evt) {
        //  evt.preventDefault();
        await loadCurrentUserData();
    })

    if (location.pathname == "/profile") {
        loadCurrentUserData();
    }

    uploadImage.change(async function (evt) {
        try {
            //evt.preventDefault();
            if (this.files.length > 0) {
                const formData = new FormData();

                formData.append('image', this.files[0]);

                const response = await fetch('/M00853622/upload-profile-picture', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error("Something went wrong. Please try again later!");

                const responseData = await response.json();

                if (responseData.status == 'success') {
                    const newPictureUrl = '/user/'
                        + Util.currentUser.misis
                        + '.jpg?v=' + (Math.random() * 1000).toFixed(2);

                    imagePreview.css('background-image', 'url(' + newPictureUrl + ')');
                } else {
                    throw new Error(responseData.message);
                }
            }
        } catch (e) {
            console.log(e);
            Util.toast('error', e.message);
        }
    });

    statusBtn.click(async function (evt) {
        $('#exampleModalCenter').modal('show');
    });

    statusForm.submit(async function (evt) {
        try {

            evt.preventDefault();

            const formData = Util.JSONFormData(this);

            if (formData.noun === '') throw new Error('Status cannot be empty');

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const response = await fetch('/M00853622/update-status', {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Something went wrong. Please try again!');

            const responseData = await response.json();

            Util.toast(responseData.status, responseData.message);

            Util.currentUser.status = `${formData.verb} *${formData.noun}*`;

            this.reset();

            //statusModal.removeClass('visible');

            loadCurrentUserData();
            $('#exampleModalCenter').modal('hide');

        } catch (e) {
            console.log(e);
            Util.toast('error', e.message);
        }
    });

    storyForm.submit(async function (evt) {
        try {

            evt.preventDefault();

            if (this.image.files.length === 0) {
                throw new Error('You must one JPEG image');
            }

            if (this.noun.value === '') {
                throw new Error('Status cannot be empty');
            }

            const formData = new FormData();

            formData.append('description', this.description.value);
            formData.append('verb', this.verb.value);
            formData.append('noun', this.noun.value);
            formData.append('image', this.image.files[0]);

            const response = await fetch('/M00853622/upload-story', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Something went wrong. Please try again!');

            const responseData = await response.json();

            Util.toast(responseData.status, responseData.message);

            //Util.currentUser.status = `${formData.get('verb')} *${formData.get('noun')}*`;

            this.reset();

            //storyModal.removeClass('visible');

            loadCurrentUserData();

        } catch (e) {
            console.log(e);
            Util.toast('error', e.message);
        }
    });

    searchInput.focus(() => searchResult.show());

    $(document).on('mouseup', function (evt) {
        if ($(evt.target).is('.search-input')) return;
        searchResult.hide();
    });

    searchInput.keyup(function () {
        let searchTimeout;
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(async () => {
            try {
                const search = $(this).val();

                if (search === '') {
                    return;
                }

                const response = await fetch('/M00853622/search/' + search);

                if (!response.ok) {
                    throw new Error("Something went wrong. Please try again later!");
                }

                const responseData = await response.json();

                searchResult.html("");

                responseData.forEach(user => {
                    const searchResultItem = $('<div class="search-result-item">' + user.fullName + '</div>');
                    searchResultItem[0].misis = user.misis;
                    searchResult.append(searchResultItem);
                });
            } catch (e) {
                console.log(e);
                Util.toast('error', e.message);
            }
        }, 500);
    });

    $(document).on('click', '.search-result-item, .following-list .profile-id', async function () {
        try {

            const imageView = $('#other_profile_image_preview');
            const fullNameText = $('#other-profile-fullName-text');
            const emailText = $('#other-profile-email-text');
            const misisText = $('#other-profile-misis-text');
            const dobText = $('#other-profile-dob-text');
            const btnFollow = $('#btn-follow');


            Util.cacheCurrentUser();
            const response = await fetch('/M00853622/profile/' + this.misis);

            if (!response.ok) throw new Error("Something went wrong. Please try again later!");

            const responseData = await response.json();

            if (responseData.email === Util.currentUser.email) {
                window.location.href = "/profile"
            } else {
                //modalProfileFollow[0].misis = this.misis;
                //modalProfileFollow.show();
                //modalProfileChange.hide();
            }

            const img = new Image();
            img.src = '/user/' + responseData.misis + '.jpg';

            if (img.complete) {
                imageView.css('background-image', 'url(' + img.src + ')');
            } else {
                img.onload = () => {
                    imageView.css('background-image', 'url(' + img.src + ')');
                }

                img.onerror = () => {
                    imageView.css('background-image', 'url(' + defaultProfilePictureUrl + ')');
                }
            }

            //modalProfileImage.attr('src', '/user/' + responseData.misis + '.jpg');
            fullNameText.text(responseData.fullName);
            btnFollow.text(responseData.isFollowing == 1 ? 'Unfollow' : 'Follow');
            emailText.text(responseData.email);
            misisText.text(responseData.misis);
            dobText.text(responseData.dob);

            $('#Other_profile_modal').modal('show');
        } catch (e) {
            console.log(e);
            this.toast('error', e.message);
        }
    });

    btnFollow.click(async function () {
        try {
            const misis = $('#other-profile-misis-text').text();
            const response = await fetch('/M00853622/toggle-follow/' + misis);

            if (!response.ok) throw new Error("Something went wrong. Please try again later!");

            const responseData = await response.json();

            $(this).text(responseData.isFollowing ? 'Unfollow' : 'Follow');

            Util.toast(responseData.status, responseData.message);

            //loadCurrentUserFollowingList();
            loadCurrentUserStories();
        } catch (e) {
            console.log(e);
            this.toast('error', e.message);
        }
    });

    if (location.pathname == "/") {
        loadCurrentUserStories();
    }

    stories.on('click', '.story', async function () {
        try {
            const response = await fetch('/M00853622/story/' + this.uuid);

            if (!response.ok) throw new Error("Something went wrong. Please try again later!");

            const responseData = await response.json();

            viewStoryModalImage.attr('src', '/story/' + this.uuid + '.jpg');

            viewStoryModalLike[0].uuid = this.uuid;
            viewStoryModalShare[0].uuid = this.uuid;

            viewStoryModalDescription.text(responseData.description);
            viewStoryModalViews.text(responseData.viewCount);
            viewStoryModalLikes.text(responseData.likeCount);
            viewStoryModalShares.text(responseData.shareCount);

            if (responseData.isLiked) {
                viewStoryModalLike.text('❤');
            } else {
                viewStoryModalLike.text('♡︎');
            }

            viewStoryModal.addClass('visible');
        } catch (e) {
            console.log(e);
            this.toast('error', e.message);
        }
    });

    if (location.pathname == "/messege") {
        loadCurrentUserFollowingList();
    }
});




function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            //$('#imagePreview').hide();
            //$('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}


const loadCurrentUserData = async () => {
    try {
        await Util.cacheCurrentUser();

        const profileUserName = $('#profile-fullName-text');
        const profileEmail = $('#profile-email-text');
        const profileMisis = $('#profile-misis-text');
        const profileDob = $('#profile-dob-text');
        const imagePreview = $('#imagePreview');
        const profileDm = $('#profile-dm');

        const img = new Image();
        img.src = '/user/' + Util.currentUser.misis + '.jpg';

        if (img.complete) {
            imagePreview.css('background-image', 'url(' + img.src + ')');
        } else {
            img.onload = () => {
                imagePreview.css('background-image', 'url(' + img.src + ')');
            }

            img.onerror = () => {
                imagePreview.css('background-image', 'url(' + defaultProfilePictureUrl + ')');
            }
        }

        profileUserName.text(Util.currentUser.fullName);
        profileEmail.text(Util.currentUser.email);
        profileMisis.text(Util.currentUser.misis);
        profileDob.text(Util.currentUser.dob);
        profileDm.html(Util.currentUser.status?.replace(/(.*) \*(.*)\*$/, '$1 <b>$2<\/b>'));

    } catch (e) {
        console.log(e.message);
        Util.toast('error', e.message);
    }
}

const loadCurrentUserFollowingList = async () => {
    try {
        const followingList = $('.chat-list');

        const response = await fetch('/M00853622/following-list');

        if (!response.ok) throw new Error('Something went wrong. Please try again later!');

        const responseData = await response.json();

        followingList.html('');

        responseData.forEach(following => {

            const newCard = $('<div class="chat-item"></div>');
            //const newProfileId = $('<div class="profile-id"></div>');
            const newProfileImage = $('<div class="avatar"></div>');
            const newProfileDetails = $('<div class="chat-info"></div>');
            const newProfileName = $('<h4></h4>');
            const newProfileStatus = $('<p></p>');
            //const newProfileMessage = $('<a class="profile-message c-p"></a>');

            //newCard.append(newProfileId);
            //newCard.append(newProfileMessage);
            //newProfileId.append(newProfileDetails);
            newProfileDetails.append(newProfileName);
            newProfileDetails.append(newProfileStatus);
            
            newProfileName.text(following.user[0].fullName);
            newProfileStatus.html(following.user[0].status?.replace(/(.*) \*(.*)\*$/, '$1 <b>$2<\/b>'));
            
            newCard.append(newProfileImage);
            newCard.append(newProfileDetails);
            newCard[0].misis = following.user[0].misis;
            newCard[0].fullName = following.user[0].fullName;
            // newProfileMessage.text('💬');

            const img = new Image();
            img.alt = following.user[0].fullName + '\'s profile image';
            img.src = '/user/' + following.user[0].misis + '.jpg';

            if (img.complete) {
                newProfileImage.append(img);
            } else {
                img.onload = () => {
                    newProfileImage.append(img);
                }

                img.onerror = () => {
                    img.src = defaultProfilePictureUrl;
                    newProfileImage.append(img);
                }
            }

            //newProfileId[0].misis = following.user[0].misis;
            followingList.append(newCard);
        });
    } catch (e) {
        console.log(e);
        Util.toast('error', e.message);
    }
}

const loadCurrentUserStories = async () => {
    try {
        const stories = $('.stories');
        const response = await fetch('/M00853622/stories');

        if (!response.ok) throw new Error('Something went wrong. Please try again later!');

        const responseData = await response.json();

        const newStory = data => {
            const newStory = $('<div class="story"></div>');
            const newStoryThumbnail = $('<div class="story-thumbnail"></div>');
            const newStoryText = $('<div class="story-text"></div>');

            newStory.append(newStoryThumbnail);
            newStory.append(newStoryText);

            newStoryText.text(data.story.description);

            const img = new Image();
            img.alt = data.story.description;
            img.src = '/story/' + data.story.uuid + '.jpg';

            newStoryThumbnail.append(img);

            newStory[0].uuid = data.story.uuid;

            return newStory;
        }

        stories.html('');

        let newStoryRow = $('<div class="story-row"></div>');

        if (responseData.length > 0) {
            const topStory = responseData.splice(0, 1)[0];

            newStoryRow.append(newStory(topStory));

            stories.append(newStoryRow);
        }

        responseData.forEach((data, index) => {
            if (index % 2 == 0) {
                newStoryRow = $('<div class="story-row"></div>');
            }

            newStoryRow.append(newStory(data));
            stories.append(newStoryRow);
        });
    } catch (e) {
        console.log(e);
        Util.toast('error', e.message);
    }
}