module.exports = function set(name, value, expires, path, domain, secure) {
  let cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  expires = expires ? expires : new Date(2037, 1, 1);
  if (expires instanceof Date) {
    cookieText += "; expires=" + expires.toGMTString();
  }

  if (path) {
    cookieText += "; path=" + path;
  }

  if (domain) {
    cookieText += "; domain=" + domain;
  }

  if (secure) {
    cookieText += "; secure";
  }

  document.cookie = cookieText;
}