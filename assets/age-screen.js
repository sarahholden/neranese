// // GET COOKIE -------------
// function getCookie(name) {
//   const dc = document.cookie;
//   const prefix = `${name}=`;
//   let begin = dc.indexOf(`; ${prefix}`);
//   if (begin == -1) {
//     begin = dc.indexOf(prefix);
//     if (begin != 0) return null;
//   } else {
//     begin += 2;
//     var end = document.cookie.indexOf(';', begin);
//     if (end == -1) {
//       end = dc.length;
//     }
//   }
//
//   return decodeURI(dc.substring(begin + prefix.length, end));
// }
//
// // SET COOKIE -------------
// function setCookie (cookieName) {
//   const date = new Date();
//   const days = 30;
//
//   // Get unix milliseconds at current time plus number of days
//   date.setTime(+date + days * 86400000); // 24 * 60 * 60 * 1000
//   window.document.cookie = `${cookieName +
//     '=' +
//     'no' +
//     '; expires='}${date.toGMTString()}; path=/`;
// }
//
//
// // Get cookies on load;
// var isOfAge = getCookie('age-popup-dismissed');
//
// // if (true) {
// if (isOfAge === null) {
//   $('body').addClass('show-age-popup');
//   $('.js-age-screen').addClass('js-animate');
// }
//
//
// // CLOSE POPUP -------------
// $('.js-close-age-screen').on('click', function () {
//   $('body').removeClass('show-age-popup');
//   setCookie('age-popup-dismissed');
// });
