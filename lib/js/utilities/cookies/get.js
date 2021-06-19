module.exports = function get(name, defaultValue) {
  let cookieName = encodeURIComponent(name) + "=",
    cookieStart = document.cookie.indexOf(cookieName),
    cookieValue = defaultValue || null,
    cookieEnd;

  if (cookieStart > -1) {
    cookieEnd = document.cookie.indexOf(";", cookieStart);
    if (cookieEnd == -1) {
      cookieEnd = document.cookie.length;
    }
    cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
  }

  return cookieValue;
};