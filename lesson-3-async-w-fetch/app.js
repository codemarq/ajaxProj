(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    const responseContainer = document.querySelector('#response-container');
    const appid = '';
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
})();
