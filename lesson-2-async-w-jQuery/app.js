/* eslint-env jquery */
(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  const responseContainer = document.querySelector('#response-container');
  const apiID = `Client-ID`;
  const nytKey = '';
  let searchedForText;


  form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    $.ajax({
      url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      headers: {
          Authorization: apiID
      }
    }).done(addImage)
    .fail(function (err){
      requestError(err, 'image');
    });

    $.ajax({ 
        url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytKey}`
      })
      .done(addArticles)
      .fail(function (err) {
        requestError(err, 'article')
      });
  });


  function addImage (images) {
    let htmlContent = '';

    if (images && images.results && images.results[0]) {
        const firstImage = images.results[0];
        console.log(firstImage)

        htmlContent = `<figure>
        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
    } else {
        htmlContent = '<div class="error-no-image">No images available</div>';
    }

    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
  }

  function addArticles (articles) {
    let htmlContent = '';

    if (articles.response && articles.response.docs && articles.response.docs.length > 1) {
      htmlContent = `<ul>${articles.response.docs.map(article => `<li class="article">
        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
        <p>${article.snippet}</p>
      </li>`).join('')}</ul>`;
    } else {
      htmlContent = '<div class = "error-no-articles">No articles available.</div>';
    }

    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
  };
})();
