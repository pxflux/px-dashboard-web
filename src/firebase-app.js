import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const app = Firebase.initializeApp({
  apiKey: "AIzaSyAYMwrJAFUxlY-Igs_ts-goUAkLwN2ZPKc",
  authDomain: "pxfluxplayer.firebaseapp.com",
  databaseURL: "https://pxfluxplayer.firebaseio.com",
  projectId: "pxfluxplayer",
  storageBucket: "pxfluxplayer.appspot.com",
  messagingSenderId: "434021624365"
});

export function store(accountId, id, path, data, imageRemoved, imageFile) {
  const promise = save(id, "accounts/" + accountId + "/" + path, data);
  if (imageRemoved) {
    promise.then(function(ref) {
      return removeFile(ref);
    });
  } else if (imageFile) {
    promise.then(function(ref) {
      return uploadFile(ref, "/accounts/" + accountId + "/" + path, imageFile);
    });
  }
  return promise;
}

function save(id, path, data) {
  if (id) {
    const source = app.database().ref(path + "/" + id);
    return source.update(data).then(function() {
      return source;
    });
  } else {
    return app
      .database()
      .ref(path)
      .push(data)
      .then(function(ref) {
        return ref;
      });
  }
}

function uploadFile(ref, path, file) {
  return ref
    .once("value")
    .then(function(snapshot) {
      const val = snapshot.val();
      return val && val.image ? val.image.storageUri : null;
    })
    .then(function(storageUri) {
      if (storageUri && storageUri.startsWith("gs://")) {
        return app
          .storage()
          .refFromURL(storageUri)
          .delete();
      }
    })
    .then(function() {
      return ref.update({
        image: {
          displayUrl: null,
          storageUri: null
        }
      });
    })
    .then(function() {
      const filePath = [path + "/" + ref.key, getFileExtension(file)]
        .map(_ => _)
        .join(".");
      return app
        .storage()
        .ref(filePath)
        .put(file);
    })
    .then(function(snapshot) {
      return ref.update({
        image: {
          displayUrl: snapshot.metadata.downloadURLs[0],
          storageUri: app
            .storage()
            .ref(snapshot.metadata.fullPath)
            .toString()
        }
      });
    })
    .then(function() {
      return ref;
    });
}

function removeFile(ref) {
  return ref
    .once("value")
    .then(function(snapshot) {
      const val = snapshot.val();
      return val && val.image ? val.image.storageUri : null;
    })
    .then(function(storageUri) {
      if (storageUri && storageUri.startsWith("gs://")) {
        return app
          .storage()
          .refFromURL(storageUri)
          .delete();
      }
    })
    .then(function() {
      return ref.update({
        image: {
          displayUrl: null,
          storageUri: null
        }
      });
    })
    .then(function() {
      return ref;
    });
}

function getFileExtension(file) {
  if (file) {
    switch (file.type) {
      case "image/jpeg":
      case "image/jpg":
        return "jpg";
      case "image/png":
        return "png";
      case "image/gif":
        return "gif";
    }
  }
  return null;
}

export default app;
