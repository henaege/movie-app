// Wait until the DOM is loaded
$(document).ready(()=> {
    // All API calls go to this link
    const apiBaseUrl = 'http://api.themoviedb.org/3';
    // All images use this link
    const imageBaseUrl = 'http://image.tmdb.org/t/p/';

    const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key=' + apiKey;
    // console.log(nowPlayingUrl)
    // Make AJAX request to nowPlayingUrl
    $.getJSON(nowPlayingUrl, (nowPlayingData)=> {
        // console.log(nowPlayingData)
        let nowPlayingHTML = '';
        for (let i=0; i < nowPlayingData.results.length; i++) {
            let posterUrl = imageBaseUrl +'w300'+ nowPlayingData.results[i].poster_path;
            nowPlayingHTML += `<div><img src="${posterUrl}"></div>`;
        }
        console.log(nowPlayingHTML);
        $('#movie-grid').html(nowPlayingHTML);
        console.log($('#movie-grid'))
    })

    $('#movie-form').submit((event)=> {
        // Don't submit form! Js will handle
        event.preventDefault();
        let userInput = encodeURI($('#search-input').val());
        $('#search-input').val('');
        let searchUrl = apiBaseUrl + '/search/movie?query=' + userInput + '&api_key='+apiKey;
        $.getJSON(searchUrl, (searchMovieData)=> {
            let searchMovieHTML = getHTML(searchMovieData);
            $('#movie-grid').html(searchMovieHTML);
        })

        function getHTML(data) {
        let newHTML = '';
        for (let i=0; i < data.results.length; i++) {
            let posterUrl = imageBaseUrl +'w300'+ data.results[i].poster_path;
            newHTML += `<div><img src="${posterUrl}"></div>`;
        }
        return newHTML;
    }

    })    
    

});