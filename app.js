const apiKey = 'ab760d56'; // Your OMDb API key

async function searchMovie() {
  const query = document.getElementById('movieSearch').value.trim();
  const resultsContainer = document.getElementById('movieResults');

  if (query.length < 3) {
    resultsContainer.innerHTML = `<p>Please enter at least 3 characters.</p>`;
    return;
  }

  const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`);
  const data = await response.json();

  if (data.Response === 'True') {
    displayMovies(data.Search);
  } else {
    resultsContainer.innerHTML = `<p>No movies found. Try another search.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('movieSearch');
    if (searchBar) {
        searchBar.value = '';
        searchBar.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchMovie();
            }
        });
    }
});

function displayMovies(movies) {
  const resultsContainer = document.getElementById('movieResults');
  resultsContainer.innerHTML = '';
  resultsContainer.style.display = 'grid';
  resultsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(140px, 2fr))';
  resultsContainer.style.gap = '20px';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.onclick = () => getMovieDetails(movie.imdbID);

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x260?text=No+Image'}" alt="${movie.Title}">
        <div class="movie-info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        </div>
    `;

    resultsContainer.appendChild(card);
  });
}



async function getMovieDetails(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
  const movie = await response.json();
  displayMovieDetails(movie);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatAwards(awardsString) {
  if (awardsString === "N/A") return 'Not available';

  const awardLinks = {
    'Oscar': 'https://www.imdb.com/search/keyword/?keywords=oscar-winner',
    'Golden Globe': 'https://www.imdb.com/search/keyword/?keywords=golden-globe-winner',
    'BAFTA': 'https://www.imdb.com/search/keyword/?keywords=bafta-winner',
    'Primetime Emmy': 'https://www.imdb.com/search/keyword/?keywords=emmy-winner',
    'Academy Award': 'https://www.imdb.com/search/keyword/?keywords=academy-award-winner',
    'Critics Choice': 'https://www.imdb.com/search/keyword/?keywords=critics-choice-winner'
  };

  let formatted = awardsString;

  for (const [award, url] of Object.entries(awardLinks)) {
    const regex = new RegExp(`(${award}s?)`, 'gi'); // match plural/singular, case-insensitive
    formatted = formatted.replace(regex, `<a href="${url}" target="_blank" rel="noopener noreferrer">$1</a>`);
  }

  return formatted;
}



function displayMovieDetails(movie) {
  const resultsContainer = document.getElementById('movieResults');
  resultsContainer.style.display = 'block'; // Ensure it's no longer a grid
  resultsContainer.style.gridTemplateColumns = '';
  resultsContainer.style.gap = '';

  resultsContainer.innerHTML = `
    <div class="movie-details">
      

      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}">

    <div class="movie-info">
            <h2>${movie.Title} (${movie.Year})</h2>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Type:</strong> ${movie.Type}</p>

            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            

            <p><strong>Rating:</strong> ${movie.imdbRating} / 10</p>
            <p><strong>Metascore:</strong> ${movie.Metascore !== "N/A" ? movie.Metascore : 'Not available'}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
            <p><strong>Language:</strong> ${movie.Language}</p>
            <p><strong>Country:</strong> ${movie.Country}</p>
            <p><strong>Released:</strong> ${movie.Released}</p>
            <p><strong>Box Office:</strong> ${movie.BoxOffice !== "N/A" ? movie.BoxOffice : 'Not available'}</p>

            <!-- <p><strong>Awards:</strong> ${formatAwards(movie.Awards)}</p> -->
            <p><strong>Awards:</strong> ${movie.Awards !== "N/A" ? movie.Awards : 'Not available'}</p>

            </div>

    </div>

        <div class="buttons">
        <button class="back-button" onclick="searchMovie()"><i class="fa-solid fa-arrow-left"></i></button>
            <button onclick="showTrailer('${movie.Title}')"><i class="fa-solid fa-video"></i></button>
            <button onclick="window.open('https://www.imdb.com/title/${movie.imdbID}/', '_blank')"><i class="fa-brands fa-imdb"></i></button>
        </div>
  `;
}


function showTrailer(title) {
  const search = encodeURIComponent(`${title} trailer`);
  const videoURL = `https://www.youtube.com/embed?autoplay=1&listType=search&list=${search}`;
  
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button" onclick="closeModal()">&times;</span>
        <div class="iframe-container">
            <iframe src="${videoURL}" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) modal.remove();
}
