import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Create");
    }

    async getHtml() {
        return `
        <div class="box">
    <div class="post-section">
        <h2>Create a New Post</h2>
       <form id="story-form">
        <div class="upload-options">
            <input type="file" name="image" accept=".jpg,.jpeg" class="upload-btn" />
        </div>
        <textarea type="text" name="description" placeholder="Write your post here..."></textarea>
        <div class="form-group">
    <label for="exampleFormControlSelect1">Example select</label>
    <select class="form-control" name="verb">
    <option>Listening to</option>
    <option>Playing</option>
    <option>Eating</option>
    <option>In</option>
    </select>
  </div>
            <div class="form-group">
                <label >Status</label>
                <input type="text" name="noun" class="form-control"
                    placeholder="Enter Status">
                <small id="emailHelp" class="form-text text-muted">Put your status above</small>
            </div>

        <button type="submit" class="post-btn">Post</button>
       </form>
    </div>
</div>
        `;
    }
}