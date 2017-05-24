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
            nowPlayingHTML += `<div class="movie-poster" movie-id=${nowPlayingData.results[i].id}><img src="${posterUrl}"></div>`;
        }
        console.log(nowPlayingData);
        $('#movie-grid').html(nowPlayingHTML);
        $('.movie-poster').click((event)=> {
            console.dir(event.target)
            // change the html inside the modal
            let thisMovieId = event.target.parentElement.attributes[1].value;
            let thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}` ;
            
            $.getJSON(thisMovieUrl, (thisMovieData)=> {
                let thisCastUrl = `${apiBaseUrl}/movie/${thisMovieId}/credits?api_key=${apiKey}`;
                let modalHTML = thisMovieData.overview;
                let modalTitle = thisMovieData.title;
                $.getJSON(thisCastUrl, (thisMovieData)=> {
                    console.log(thisMovieData);
                
                let castList = [];
                for (let i=0; i < 5; i++) {
                    castList.push(thisMovieData.cast[i].name);
                }
                cast = castList.join(', ');
                $.fancybox.open(`<div class="message"><h2>${modalTitle}</h2><h3>Starring:</h3><ul>${cast}</ul><h3>Synopsis:</h3>${modalHTML}</div>`);
                })
                // open the modal
                
            })
            
            
        })
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
            console.log(searchMovieData)

            let thisMovieId = '';
            for (let i=0; i < searchMovieData.length; i++) {
                thisMovieId = searchMovieData.results[i].id;
            }
            let thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}` ;
            
            $.getJSON(thisMovieUrl, (thisMovieData)=> {
                let thisCastUrl = `${apiBaseUrl}/movie/${thisMovieId}/credits?api_key=${apiKey}`;
                let modalHTML = thisMovieData.overview;
                let modalTitle = thisMovieData.title;
                $.getJSON(thisCastUrl, (thisMovieData)=> {
                    console.log(thisMovieData);
                
                let castList = [];
                for (let i=0; i < 5; i++) {
                    castList.push(thisMovieData.cast[i].name);
                }
                cast = castList.join(', ');
                $.fancybox.open(`<div class="message"><h2>${modalTitle}</h2><h3>Starring:</h3><ul>${cast}</ul><h3>Synopsis:</h3>${modalHTML}</div>`);
                })
                // open the modal
                
            })
            
            
        })
    

        function getHTML(data) {
        let newHTML = '';
        for (let i=0; i < data.results.length; i++) {
            let posterUrl = imageBaseUrl +'w300'+ data.results[i].poster_path;
            newHTML += `<div class="movie-poster"><img src="${posterUrl}"></div>`;
        }
        return newHTML;
    }

    })    
    

});