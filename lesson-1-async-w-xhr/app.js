(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    const responseContainer = document.querySelector('#response-container');
    const apiID = `Client-ID <unsplash api key goes here>`;
    const nytKey = 'nyt api key goes here';
    let searchedForText;
    
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        
        const imgRequest = new XMLHttpRequest();
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.onload = addImage;
        imgRequest.onerror = (err) => {
            requestError(err, image);
        }
        imgRequest.setRequestHeader('Authorization', apiID);
        imgRequest.send();
        
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytKey}`);
        articleRequest.send();
    });
    
    
    function addImage () {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        
        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            
            htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }
        
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
    
    function addArticles () {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        
       if (data.response && data.response.docs && data.response.docs.length > 1) {
           htmlContent = `<ul>${data.response.docs.map(article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
           </li>`).join('')}</ul>`;
       } else {
           htmlContent = '<div class = "error-no-articles">No articles available.</div>';
       }

       responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    };
})();
