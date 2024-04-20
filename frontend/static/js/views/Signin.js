import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("SignIn");
  }

  async getHtml() {
    return `
    <div class="box">
    <div class="forms">
        <!-- Registration Form -->
        <div class="form signup">
            <span class="title">Registration</span>

            <form id="signup-form" >
                <div class="input-field">
                    <input type="text" name="full_name" placeholder="Enter your name" required>
                    <i class="uil uil-user"></i>
                </div>
                <div class="input-field">
                    <input type="text" name="email" placeholder="Enter your email" required>
                    <i class="uil uil-envelope icon"></i>
                </div>
                <div class="input-field">
                    <input type="text" name="misis" placeholder="Enter your MISIS" required>
                    <i class="uil uil-user"></i>
                </div>
                <div class="input-field">
                    <input type="date" name="dob" placeholder="Enter your DOB" required>
                    <i class="uil uil-calendar-alt icon"></i>
                </div>
                <div class="input-field">
                    <input type="password" name="password" class="password" placeholder="Create a password" required>
                    <i class="uil uil-lock icon"></i>
                </div>

                <div>
                    <button class="btn-signup" type="submit"> Signup</button>
                </div>
            </form>

            <div class="login-signup">
                <span >Already a member?
                    <a href="/login" class="login-link" style="text-decoration:none; color:#5372F0">Login Now</a>
                </span>
            </div>
        </div>
    </div>
</div>
        `;
  }
}