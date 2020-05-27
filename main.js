var userContainer = document.getElementById("user-info");
var btn = document.getElementById("btn");

btn.addEventListener("click", function() {
  loadUsers();
});

function loadUsers() {
  debugger;
  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', 'https://json.medrating.org/users/');
  ourRequest.onload = function() {
      debugger;
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
  loadUserAlbums(id, event.target.parentNode);
}

function onAlbumClick(id, event) {
  loadUserPhotos(id, event.target.parentNode)
}

function onPhotosClick(id, event) {
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
    content += "<li class='album'><span  onClick='onAlbumClick(" + id + ", event)'>" + title + "</span><ul class='photos'></ul></li>";
  }
  
  container.getElementsByClassName('albums')[0].insertAdjacentHTML('beforeend', content);
}

function renderUserPhotos(data, container) {
  var content = "";

  for (i = 0; i < data.length; i++) {
    var title = data[i].title ? data[i].title : 'None';
    var url= data[i] ? data[i].url : null;
    var id = data[i].id;
    content += "<li class='photo'><img width='30px' src='" + url + "' /></li>";
  }

  container.getElementsByClassName('photos')[0].insertAdjacentHTML('beforeend', content);
}
