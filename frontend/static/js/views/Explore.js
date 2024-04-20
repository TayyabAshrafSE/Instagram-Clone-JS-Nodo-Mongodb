import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Explore");
    }

    async getHtml() {
        return `
        <div class="explore-container">
        <div class="search-bar">
            <input type="text" placeholder="Search...">
            <button><i class="fas fa-search"></i></button>
        </div>
        <div class="image-grid">
            <div class="image-row">
                <div class="image-item">
                    <img src="https://via.placeholder.com/300x200" alt="Image 1">
                </div>
                <div class="image-item">
                    <img src="https://via.placeholder.com/300x200" alt="Image 2">
                </div>
                <div class="image-item">
                    <img src="https://via.placeholder.com/300x200" alt="Image 3">
                </div>
            </div>
            <div class="image-column">
                <div class="image-item">
                    <img src="https://via.placeholder.com/300x200" alt="Image 4">
                </div>

              
            </div>
        </div>
    </div>
        `;
    }
}