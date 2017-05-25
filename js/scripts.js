// Wait until the DOM is loaded
$(document).ready(()=> {
    // All API calls go to this link
    const apiBaseUrl = 'http://api.themoviedb.org/3';
    // All images use this link
    const imageBaseUrl = 'http://image.tmdb.org/t/p/';

    const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key=' + apiKey;

    let buttonsHTML = '';
    buttonsHTML += `<button class="all-button all">All Genres</button>`
    for (i=0; i<genreArray.length; i++) {
        buttonsHTML += `<button class="genre-button all">${genreArray[i].name}</button>`
    }
    $('#genre-buttons').html(buttonsHTML)
    // console.log(nowPlayingUrl)
    // Make AJAX request to nowPlayingUrl
    $.getJSON(nowPlayingUrl, (nowPlayingData)=> {
        // console.log(nowPlayingData)
        let nowPlayingHTML = getHTML(nowPlayingData);
        
        console.log(nowPlayingData);
        let nowPlayingTitle = `<h1>Now Playing:</h1>`
        $('#grid-header').html(nowPlayingTitle)
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
                });
                // open the modal
                
            });
            
            
        });
        // console.log($('#movie-grid'))
        $grid = $('#movie-grid').isotope({
            itemSelector: '.movie-poster',
    
        });
        // $grid.imagesLoaded().progress( function() {
        //     $grid.isotope('layout');
        // });
        $('.genre-button').click(function(){
            $grid.isotope({ filter: '.'+this.innerText })
        })
        $('.all-button').click(function() {
            $grid.isotope({ filter: '.all' });
        });
    });

    $('#movie-form').submit((event)=> {
        // Don't submit form! Js will handle
        event.preventDefault();
        let userInput = encodeURI($('#search-input').val());
        $('#search-input').val('');
        let searchUrl = apiBaseUrl + '/search/movie?query=' + userInput + '&api_key='+apiKey;
        $.getJSON(searchUrl, (searchMovieData)=> {
            let searchMovieHTML = getHTML(searchMovieData);
            let searchResults = `<h1>Search Results:</h1>`
            $('#grid-header').html(searchResults);
            $('#movie-grid').html(searchMovieHTML);
            console.log(searchMovieData)

            $grid = $('#movie-grid').isotope({
            itemSelector: '.movie-poster',
        });
        console.log($grid)
            
            $('.genre-button').click(function(){
                $grid.isotope({ filter: '.'+this.innerText })
            })
            $('.all-button').click(function() {
                $grid.isotope({ filter: '.all' });
            });
            
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
            
            
        })
    
        // console.log($('#movie-grid'))
        
        

    })    
    function getHTML(data) {
        let newHTML = '';
        for (let i=0; i < data.results.length; i++) {
            // set up a var for the genre ids for THIS movie
            let thisMovieGenres = data.results[i].genre_ids;
            let movieGenreClassList = " ";
            console.log(data.results[i])
            // loop through all genres
            for (let j=0; j < genreArray.length; j++) {
                // check to see if the genre we are on (genreArray[j]) is in THIS movie
                if (thisMovieGenres.indexOf(genreArray[j].id) > -1) {
                    // HIT! this genre id is in THIS movie's genre id list so we need to add the name to the class list
                    movieGenreClassList += genreArray[j].name + " ";
                }
                
            }
            console.log(movieGenreClassList);
            let posterUrl = imageBaseUrl +'w300'+ data.results[i].poster_path;
            newHTML += `<div class="movie-poster ${movieGenreClassList} all" movie-id="${data.results[i].id}"><img src="${posterUrl}"></div>`;
        }
        return newHTML;
    }

});