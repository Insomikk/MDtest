var userContainer = document.getElementById("user-info");
var btn = document.getElementById("btn");
var modal = document.getElementById('modal');
var modalImg = document.getElementById('modal-img');

modal.addEventListener('click', function(event) {
  if (event.target === modal) {
  modal.classList.add('closed');
  }
})

btn.addEventListener("click", function() {
  loadUsers();
});

function loadUsers() {
  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', 'https://json.medrating.org/users/');
  ourRequest.onload = function() {
  var users = JSON.parse(ourRequest.responseText);
  renderUsers(users);
  };
  ourRequest.send();
}

function loadUserAlbums(userId, container) {
  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', 'https://json.medrating.org/albums/?userId=' + userId);
  ourRequest.onload = function() {
  var albums = JSON.parse(ourRequest.responseText);
  renderUserAlbums(albums, container);
  };
  ourRequest.send();
}

function loadUserPhotos(albumId, container) {
   var ourRequest = new XMLHttpRequest();
   ourRequest.open('GET', 'https://json.medrating.org/photos/?albumId=' + albumId);
   ourRequest.onload = function() {
   var photos = JSON.parse(ourRequest.responseText);
   renderUserPhotos(photos, container);
   };
   ourRequest.send();
}

function onUserClick(id, event) {
   var containerElement = event.target.parentNode;
   var isOpen = containerElement.classList.contains('opened');
  
  if (isOpen) {
    containerElement.classList.remove('opened');
    containerElement.getElementsByClassName('albums')[0].innerHTML = '';
  } else {
    containerElement.classList.add('opened');
    loadUserAlbums(id, containerElement);
  }
}

function onAlbumClick(id, event) {
  var containerElement = event.target.parentNode;
  var isOpen = containerElement.classList.contains('opened');
  
  if (isOpen) {
    containerElement.classList.remove('opened');
    containerElement.getElementsByClassName('photos')[0].innerHTML = '';
  } else {
    containerElement.classList.add('opened');
    loadUserPhotos(id, containerElement);
  }
}

function onPhotosClick(src) {
  modal.classList.remove('closed');
  modalImg.src = src;
}

function renderUsers(data) {
  var content = "";

  for (i = 0; i < data.length; i++) {
    var name = data[i].name ? data[i].name : '';
    var id = data[i].id;
    content += "<li class='user'><span onClick='onUserClick(" + id + ", event)'>" + name + "</span><ul class='albums'></ul></li>";
  }

  userContainer.insertAdjacentHTML('beforeend', content);
}

function renderUserAlbums(data, container) {
  var content = "";

  for (i = 0; i < data.length; i++) {
    var title = data[i].title ? data[i].title : 'No name';
    var id = data[i].id;
    content += "<li class='album'><span onClick='onAlbumClick(" + id + ", event)'>" + title + "</span><ul class='photos'></ul></li>";
  }
  
  container.getElementsByClassName('albums')[0].insertAdjacentHTML('beforeend', content);
}

function renderUserPhotos(data, container) {
  var content = "";

  for (i = 0; i < data.length; i++) {
    var title = data[i].title ? data[i].title : 'None';
    var url= data[i] ? data[i].url : null;
    var id = data[i].id;
    content += "<li class='photo'><img width='70px' onClick='onPhotosClick(\"" + url + "\")' src='" + url + "' /></li>";
  }

  container.getElementsByClassName('photos')[0].insertAdjacentHTML('beforeend', content);
}

// get favorites from local storage or empty array
var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
// add class 'fav' to each favorite
favorites.forEach(function(favorite) {
  document.getElementById(favorite).className = 'fav';
});
// register click event listener
document.querySelector('.list').addEventListener('click', function(e) {
  var id = e.target.id,
      item = e.target,
      index = favorites.indexOf(id);
  // return if target doesn't have an id (shouldn't happen)
  if (!id) return;
  // item is not favorite
  if (index == -1) {
    favorites.push(id);
    item.className = 'fav';
  // item is already favorite
  } else {
    favorites.splice(index, 1);
    item.className = '';
  }
  // store array in local storage
  localStorage.setItem('favorites', JSON.stringify(favorites));
});

//https://jsfiddle.net/farhadB/ocgcejg2/