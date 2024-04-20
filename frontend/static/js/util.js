export default class Util {
    static currentUser = null;
    static toastContainer;

    static cacheCurrentUser = async () => {
        if (!this.isLoggedIn()) return null;

        try {

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            if (this.currentUser === null) {
                const response = await fetch('/M00853622/current-user', {
                    method: 'GET',
                    headers
                });

                if (!response.ok) throw new Error("Something went wrong. Please try again later!");

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Oops, we haven't got JSON!");
                }
                
                this.currentUser = await response.json();
            }

            return this.currentUser;
        } catch (e) {
            console.log(e.message);
            this.toast('error', e.message);
        }
    }

    static JSONFormData = form => {
        const formData = new FormData(form);
        const json = {};

        formData.forEach((value, key) => {
            json[key] = value;
        });

        return json;
    }

    static getCookie = name => {
        return document.cookie.split('; ').find(cookie => cookie.split('=')[0] === name);
    }

    static isLoggedIn = () => {
        return this.getCookie('session') !== undefined;
    }

    static toast = (type, message) => {
        const newToast = $('<div class="toast ' + type + '">' + message + '</div>');

        this.toastContainer.append(newToast);

        setTimeout(() => newToast.remove(), 5000);
    }

    static logout = () => {
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
}