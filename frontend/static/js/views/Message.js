import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Message");
    }

    async getHtml() {
        return `
        <div class="box">
        <div class="chat-container">
        <div class="chat-sidebar">
            <div class="chat-header">
                <h3>Chats</h3>
                <div class="search-bar">
                    <input type="text" placeholder="Search...">
                    <button><i class="fa fa-search"></i></button>
                </div>
            </div>
            <div class="chat-list">
                <div class="chat-item active">
                    <div class="avatar"></div>
                    <div class="chat-info">
                        <h4>John Doe</h4>
                        <p>Hello, how are you?</p>
                    </div>
                </div>
                <div class="chat-item">
                    <div class="avatar"></div>
                    <div class="chat-info">
                        <h4>Jane Smith</h4>
                        <p>I have a question...</p>
                    </div>
                </div>
                <div class="chat-item">
                    <div class="avatar"></div>
                    <div class="chat-info">
                        <h4>Bob Johnson</h4>
                        <p>Thanks for your help!</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-box">
            <div class="chat-header">
                <h3>John Doe</h3>
            </div>
            <div class="chat-body">
                <div class="message received">
                    <div class="avatar"></div>
                    <div class="message-content">
                        <p>Hello, how can I assist you today?</p>
                    </div>
                </div>
                <div class="message sent">
                    <div class="message-content">
                        <p>Hi, I have a question about your product pricing.</p>
                    </div>
                </div>
                <div class="message received">
                    <div class="avatar"></div>
                    <div class="message-content">
                        <p>Sure, please go ahead and ask your question.</p>
                    </div>
                </div>
            </div>
            <div class="chat-footer">
                <input type="text" placeholder="Type your message...">
                <button><i class="fa fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
    </div>
        `;
    }
}