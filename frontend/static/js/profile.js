// $("#imageUpload").change(function () {
//     readURL(this);
// });
// const loadCurrentUserData = async () => {
//     try {
//         const profileImage = $('.profile-image img');
//         const currentUser = getUser();

//         const img = new Image();
//         img.src = '/frontend/Gallery/laila.jpg'; // Use correct path and potentially add user-specific image handling.

//         img.onload = () => {
//             profileImage.attr('src', img.src);
//         }

//         img.onerror = () => {
//             profileImage.attr('src', "/frontend/Gallery/laila.jpg"); // Fallback image path.
//         }

//         // Set the initial source which will trigger `onload` or `onerror`
//         profileImage.attr('src', img.src);

//         // Set user-specific details
//         profileName.text(currentUser.name);
//         profileStatus.html(currentUser.status?.replace(/(.*) \*(.*)\*$/, '$1 <b>$2<\/b>'));

//     } catch (e) {
//         console.log(e.message);
//     }
// }

// function getUser() {
//     return JSON.parse(localStorage.getItem('user')) || {};
// }

// document.addEventListener("DOMContentLoaded", loadCurrentUserData);


// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
//             $('#imagePreview').hide();
//             $('#imagePreview').fadeIn(650);
//         }
//         reader.readAsDataURL(input.files[0]);
//     }
// }
