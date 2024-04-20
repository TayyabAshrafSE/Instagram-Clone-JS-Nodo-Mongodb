import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Profile");
    }

    async getHtml() {
        return `<header>

        <div class="box">
    
            <div class="profile">
    
                <div class="profile-image">
    
                    <div class="avatar-upload">
                        <div class="avatar-edit">
                            <input type='file' id="upload-image" accept=".jpg" />
                            <label for="upload-image"></label>
                        </div>
                        <div class="avatar-preview">
                            <div id="imagePreview" style="background-image: url("/images/default-user.jpg");">
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <h4>Name: </h4>
                    </div>
                    <div class="col-md-6">
                        <h5 id="profile-fullName-text"></h5>
                    </div>
                    <div class="col-md-6">
                        <h4>Email: </h4>
                    </div>
                    <div class="col-md-6">
                        <h5 id="profile-email-text"></h5>
                    </div>
                    <div class="col-md-6">
                        <h4>MISIS: </h4>
                    </div>
                    <div class="col-md-6">
                        <h5 id="profile-misis-text"></h5>
                    </div>
                    <div class="col-md-6">
                        <h4>DOB: </h4>
                    </div>
                    <div class="col-md-6">
                        <h5 id="profile-dob-text"></h5>
                    </div>
                </div>
                <div class="profile-stats">
    
                    <ul>
                        <li><span class="profile-stat-count">164</span> posts</li>
                        <li><span class="profile-stat-count">188</span> followers</li>
                        <li><span class="profile-stat-count">206</span> following</li>
                    </ul>
    
                </div>
    
                <div class="profile-bio">
                    <span><strong>Status: </strong> <span style="font-size:20px;" id="profile-dm"></span></span>
                   
    
                </div>
                <div style="margin-left:5rem !important">
                <button id="btn-status" class="btn btn-primary">change status</button>
            </div>
    
            </div>
        </div>
    </header>
    
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Change Status</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            <form id="status-form"  >
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
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Save changes</button>
            </div>
        </form>
            </div>
            
        </div>
    </div>
</div>
    
    `;
    }
}