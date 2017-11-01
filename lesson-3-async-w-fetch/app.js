(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    const responseContainer = document.querySelector('#response-container');
    const appid = '72edb3e6540e522d1fff7cf6cac4b522d657d63be6c99a5de717a11f5a619442';
    const nytKey = '1b8ad75b08d7499ab6862418e9cc2c3a';
    const requestHeaders = new Headers();
    let searchedForText;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        requestHeaders.append('Authorization', `Client-ID ${appid}`);

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
             headers: requestHeaders
        }).then(response => response.json())
        .then(addImage)
        .catch(e => requestError(e, 'image'));

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytKey}`)
            .then(addArticles)
            .catch(e => requestError(e, 'article'))
    });

    

    function addImage(data) {
        let htmlContent = '';
        const firstImage = data.results[0];
    
        if (firstImage) {
            htmlContent = `<figure>
                <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = 'Unfortunately, no image was returned for your search.'
        }
    
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }

    function addArticles () {
        let htmlContent = '';
        const articles = data.response.docs;
        
       if (data.response && data.response.docs && data.response.docs.length > 1) {
           htmlContent = `<ul>${articles.map(article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
           </li>`).join('')}</ul>`;
       } else {
           htmlContent = '<div class = "error-no-articles">No articles available.</div>';
       }

       responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    };
})();
