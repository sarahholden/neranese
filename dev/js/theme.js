$(document).ready(function() {
  console.log('Custom Shopify theme development by Sarah Holden:');
  console.log('https://saraheholden.com/');
  console.log('---');
  console.log('Design by Kati Forner Design:');
  console.log('https://katiforner.com/');

  $('.site-content').addClass('loaded');

  let isTabletDown = $(window).innerWidth() <= 1023;

  /* ---------------------------------------------
  HAMBURGER MENU
  ------------------------------------------------ */
  let lastScrollPosition = 0;

  $('.hamburger').on('click', function(e) {
    e.preventDefault();

    if ($('body').hasClass('open-mobile-nav')) {
      $('body').removeClass('open-mobile-nav');
      // Once the body is unfixed, scroll to the last position
      $(window).scrollTop(lastScrollPosition);
    } else {
      // Record last scroll position (for fixed body)
      lastScrollPosition = $(window).scrollTop();
      $('body').addClass('open-mobile-nav');
    }
  });


  /* ---------------------------------------------
  DROPDOWN SUBMENU
  ------------------------------------------------ */
  function closeNavDropdowns () {
    $('.expanded').removeClass('expanded');
    $('.nav-wrapper').removeClass('has-open-inner-menu');
    $('.nav-wrapper_dropdown').attr('aria-expanded', 'false');
  }

  function openNavDropdown (self) {

    var listItemWrapper = $(self).closest('li');
    $(listItemWrapper).addClass('expanded');
    $('.nav-wrapper').addClass('has-open-inner-menu');
    // TOGGLE ARIA-EXPANDED FOR ADA
    $(listItemWrapper).find('.nav-wrapper_dropdown').attr('aria-expanded', 'true');

  }

  $('.nav-wrapper_dropdown-trigger').on('mouseenter', function (e) {
    if (!isTabletDown) {
      closeNavDropdowns();
      openNavDropdown(this);
    }

  });

  $('.js-solo-link, .logo-wrapper, .nav-wrapper__right').on('mouseenter', function (e) {
    if (!isTabletDown) {
      closeNavDropdowns();
    }
  });

  $('.nav-wrapper').on('mouseleave', function () {
    if (!isTabletDown) {
      closeNavDropdowns();
    }
  });

  // MOBILE SUBNAV
  $('.nav-wrapper_dropdown-trigger').on('click', function (e) {
    if (isTabletDown) {
      e.preventDefault();

      if ($(this).closest('li').hasClass('expanded')) {
        // Close Submenus
        closeNavDropdowns();
      } else {

        // Otherwise, open submenu
        closeNavDropdowns();
        openNavDropdown(this);
      }
    }

  });



  /* ---------------------------------------------
    EXTERNAL LINKS - OPEN IN NEW TAB (NAV)
  ------------------------------------------------ */
  // Switch selectors if all links should open in a new tab, instead of just the nav (only use for small sites)
  var links = document.links;
  for (let i = 0, linksLength = links.length ; i < linksLength ; i++) {
    if (links[i].hostname !== window.location.hostname) {
      links[i].target = '_blank';
      links[i].rel = 'noreferrer noopener';
    }
  }


  /* ---------------------------------------------
    CUSTOM PARALLAX & SCROLLING ZOOM EFFECTS
  ------------------------------------------------ */
  gsap.registerPlugin(ScrollTrigger);

  // Set Defaults for ScrollTrigger (like showing markers for debugging)
  ScrollTrigger.defaults({
    markers: false,
  });

  /*** Different ScrollTrigger setups for various screen sizes (media queries) ***/
  ScrollTrigger.matchMedia({
    // desktop
    "(min-width: 1024px)": function() {
      gsap.utils.toArray('[data-from]').forEach((elem, i) => {
        const from = JSON.parse(elem.dataset.from);
        const to = JSON.parse(elem.dataset.to);
        const start = elem.dataset.start ? elem.dataset.start : "top bottom";
        const end = elem.dataset.end ? elem.dataset.end : "bottom top";

        let tl = gsap.timeline({
          scrollTrigger: {
             trigger: elem,
             scrub: true,
             start: start,
             end: end,
          }
        });

        // const vars = Object.assign(from, stObj);
        tl.fromTo(elem, from, to)
      });
    },

    // mobile
    "(max-width: 1024px)": function() {
      gsap.utils.toArray('[data-mobile-from]').forEach((elem, i) => {
        const from = JSON.parse(elem.dataset.mobileFrom);
        const to = JSON.parse(elem.dataset.mobileTo);
        const start = elem.dataset.start ? elem.dataset.start : "top bottom";
        const end = elem.dataset.end ? elem.dataset.end : "bottom top";

        let tl = gsap.timeline({
          scrollTrigger: {
             trigger: elem,
             scrub: true,
             start: start,
             end: end,
          }
        });

        // const vars = Object.assign(from, stObj);
        tl.fromTo(elem, from, to)
      });
    }

  });

  // SIMPLE FADE & SLIDE
  gsap.utils.toArray('.scroll-enter').forEach((elem, i) => {
    const delay = elem.dataset.delay ? elem.dataset.delay : 0;
    let tl = gsap.timeline({
      scrollTrigger: {
         trigger: elem,
         start: "center bottom"
      }
    });

    tl.fromTo(elem, 1.2, {autoAlpha: 0, y: 20}, {autoAlpha: 1, y: 0, ease:Power4.easeOut, delay: delay});
  });

  /* ---------------------------------------------
    ADD CLASS ON ENTRY
  ------------------------------------------------ */
  gsap.utils.toArray('.js-animate').forEach((elem, i) => {
    ScrollTrigger.create({
      trigger: elem,
      start: 'top 80%',
      onEnter: self => $(elem).addClass('animate-in')
    });
  });

  $('.js-animate-on-load').addClass('animate-in');

  /* ---------------------------------------------
    STAGGER / BATCH ANIMATION
  ------------------------------------------------ */
  // Opacity set to 0 in CSS on load to avoid FOUC
  ScrollTrigger.batch('[data-stagger]', {
    onEnter: batch => gsap.to(batch, 1.5, {autoAlpha: 1, y: 0, stagger: 0.15, ease:Power1.easeOut}),
    start: "40px bottom",
  });

  /* ---------------------------------------------
    SPLIT TEXT
  ------------------------------------------------ */
  // Text animation helper function
  function triggerTextAnimation (delay, start, elem) {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: elem,
        start: start
      }
    });

    const splitLineChild = new SplitText(elem, { type: "lines", linesClass: "split-line-child" });
    const splitTextLines = new SplitText(elem, { type: "lines", linesClass: "split-line-wrap-++" });

    tl.staggerFrom($(elem).find('.split-line-child'), 1.2, {y: '100%', ease: Power3.easeOut, delay: delay}, 0.15)
      .add( function () {
        splitTextLines.revert();
        splitLineChild.revert();
      });

  }


  document.fonts.ready.then(function () {
    $('[data-reveal="lines-masked"]').addClass('loaded');
    $('[data-reveal="lines-masked-desc"]').addClass('loaded');
    $('[data-reveal="words-masked"]').addClass('loaded');

    // REGULAR TEXT ANIMATION
    gsap.utils.toArray('[data-reveal="lines-masked"]').forEach((elem, i) => {
      const delay = elem.dataset.delay ? elem.dataset.delay : 0;
      const start = elem.dataset.start ? elem.dataset.start : "center bottom";
      triggerTextAnimation(delay, start, elem);
    });

    gsap.utils.toArray('[data-reveal="lines-masked-desc"]').forEach((elem, i) => {
      const delay = elem.dataset.delay ? elem.dataset.delay : 0;
      const start = elem.dataset.start ? elem.dataset.start : "center bottom";
      triggerTextAnimation(delay, start, $(elem).find('p'));
    });

  });

  /* ---------------------------------------------
    NAV FIXED WHEN SCROLLING UP
  ------------------------------------------------ */
  let lastScroll = 0;
  /* Header Scroll & Hover */
  let navWrapperHeight = $('.nav-wrapper').innerHeight();
  let promoBarHeight = $('.promo-bar').length > 0 ? $('.promo-bar').innerHeight() : 0;

  $(window).on('scroll', function () {
    navWrapperHeight = $('.nav-wrapper').innerHeight();
    promoBarHeight = $('.promo-bar').length > 0 ? $('.promo-bar').innerHeight() : 0;
  });

  $(window).on('scroll', () => {
    const scrollTop = $(window).scrollTop();
    const isScrollingDown = scrollTop > lastScroll;

    if (scrollTop < promoBarHeight || isScrollingDown && scrollTop < navWrapperHeight + promoBarHeight) {
      // If the user is scrolling down but isn't past the nav yet, or has scrolled less than the promo bar height
      // Unfix it!
      $('.nav-wrapper').removeClass('is-fixed-hidden is-fixed-visible');
    } else if (isScrollingDown && scrollTop > navWrapperHeight + promoBarHeight) {
      // If the user is scrolling down and has passed the nav, hide it!
      $('.nav-wrapper').addClass('is-fixed-hidden').removeClass('is-fixed-visible');
    } else {
      // If the user is scrolling up and hasn't reached the promo bar yet, fix it!
      $('.nav-wrapper').addClass('is-fixed-visible').removeClass('is-fixed-hidden');
    }

    lastScroll = scrollTop;
  });

  /* ---------------------------------------------
    NAV SEARCH
  ------------------------------------------------ */
  $('.js-nav-search #Search').on('input', function () {
    if ($(this).val().length > 0) {
      $('.js-nav-search').find('.placeholder-text').hide();
    } else {
      $('.js-nav-search').find('.placeholder-text').show();
    }
  });

  $('.js-open-search').on('click', function (e) {
    e.preventDefault();

    $('body').toggleClass('open-search-bar');
    setTimeout(function () {
      $('#Search').focus();
    }, 200);
  });

  $('.js-close-search').on('click', function () {
    $('body').removeClass('open-search-bar');
  });

  /* ---------------------------------------------
    SWIPER
  ------------------------------------------------ */
  // const swiper = new Swiper('.swiper-container-myclass', {
  //   pagination: {
  //     el: '.swiper-pagination',
  //     clickable: 'true'
  //   },
  // navigation: {
  //   nextEl: '.swiper-next',
  //   prevEl: '.swiper-prev',
  // },
  //   speed: 600,
  //   allowTouchMove: true,
  //   loop: true,
  //   effect: 'fade',
  //   fadeEffect: {
  //     crossFade: true
  //   },
  //   autoplay: {
  //     delay: 10000,
  //     disableOnInteraction: true
  //   }
  // });

  if ($('.swiper-container-pdp').length > 0) {
    const pdpSwiper = new Swiper('.swiper-container-pdp', {
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },
      speed: 600,
      allowTouchMove: true,
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
    });

    $('.js-product-thumbs a').on('click', function (e) {
      e.preventDefault();
      pdpSwiper.slideTo($(this).index() + 1, 500);
    });

  }


    // breakpoint where swiper will be destroyed
    // and switches to a dual-column layout
    const breakpoint = window.matchMedia( '(min-width:768px)' );
    // keep track of swiper instances to destroy later
    let mobileSwiper;

    const breakpointChecker = function() {

      if ( breakpoint.matches === true ) {
    	  if ( mobileSwiper !== undefined ) {
          mobileSwiper.destroy( true, true );
        }
    	  return;

      } else if ( breakpoint.matches === false ) {

        // fire small viewport version of swiper
        return enableSwiper();

      }

    };



    const enableSwiper = function() {
      mobileSwiper = new Swiper ('.swiper-container-mobile', {
        slidesPerView: 1.2,
        speed: 600,
        allowTouchMove: true,
        loop: false,
        spaceBetween: 15,
        mousewheel: {
          forceToAxis: true
        },
      });

    };

    breakpoint.addListener(breakpointChecker);

    breakpointChecker();

  /* ---------------------------------------------
  SWATCHES
  ------------------------------------------------ */
  if ($('.js-single-option-selector').length > 0) {
    $('.swatch :radio').change(function() {
      var optionIndex = $(this).closest('.swatch').attr('data-option-index');
      var optionValue = $(this).val();
      $(this)
        .closest('form')
        .find('.js-single-option-selector')
        .eq(optionIndex)
        .val(optionValue)
        .trigger('change');
    });
  }

  /* ---------------------------------------------
  Product Image Zoom
  ------------------------------------------------ */
  function unzoom (self) {
    $(self).find('.zoom').css('opacity', 0);

  }

  function zoom (self, event) {
    var offset = $(self).offset();
    var left = event.pageX - offset.left;
    var top = event.pageY - offset.top;

    $(self).find('.zoom').css({
      width: '200%',
      opacity: 1,
      left: -left,
      top: -top
    })
  }

  $('.zoom-on-hover').mousemove(function(e) {
    if (!isTabletDown) {
      zoom(this, e);
    }
  });

  $('.zoom-on-hover').mouseleave(function(){
    unzoom(this);
   });






  /* ---------------------------------------------
  Accordion
  ------------------------------------------------ */
  $('.accordion').on('click', '.accordion-toggle', function() {
    var $accordionPanel = $(this).closest('.accordion-panel');
    $accordionPanel.toggleClass('expanded');
    $accordionPanel.find('.accordion-text').slideToggle(300);

    // TOGGLE ARIA-EXPANDED FOR ADA
    $accordionPanel.attr('aria-expanded', function (i, attr) {
      return attr == 'true' ? 'false' : 'true';
    });

  });

  $('.js-accordion-heading').on('click', function() {
    var $accordionWrapper = $(this).next('.accordion');
    // $accordionWrapper.fadeToggle(300);
    if ($accordionWrapper.hasClass('active-accordion')) {
      // $accordionWrapper.stop(true, true).fadeOut({ duration: 600, queue: false }).slideUp(600);
      $accordionWrapper.fadeOut(500);
    } else {
      // $accordionWrapper.stop(true, true).fadeIn({ duration: 600, queue: false }).css('display', 'none').slideDown(600);
      $accordionWrapper.fadeIn(500);
    }

    $accordionWrapper.toggleClass('active-accordion');

    // TOGGLE ARIA-EXPANDED FOR ADA
    $accordionWrapper.attr('aria-expanded', function (i, attr) {
      return attr == 'true' ? 'false' : 'true';
    });

  });


  /* ---------------------------------------------
  Panel
  ------------------------------------------------ */
  $('.panel-switcher__tab').on('click', function () {
    var parent = $(this).closest('.panel-switcher');
    var panelToShow = $(this).data('panel');
    $(parent).find('.panel-switcher__tab').removeClass('active');
    $(this).addClass('active');

    $(parent).find('.panel-switcher__text').hide();
    $(parent).find('.panel-switcher__text[data-panel="' + panelToShow + '"]').fadeIn();

  });


  /* ---------------------------------------------
  VIEW CART
  ------------------------------------------------ */
  $('.js-view-cart').on('click', function(e) {
    e.preventDefault();
    $('body').addClass('open-cart');
  });

  $('.js-close-cart').on('click', function(e) {
    e.preventDefault();
    $('body').removeClass('open-cart');
  });

  // Use if opening the cart drawer and redirecting from the cart page
  // if (window.location.hash && window.location.hash == '#view-cart') {
  //   $('body').addClass('open-cart');
  // }

  // // CART NOTE
  // $('#CartSpecialInstructions').on('blur', function (){
  //   // Set a custom cart note.
  //   CartJS.setNote($(this).val());
  // })

  /* ---------------------------------------------
  SMOOTH SCROLL
  ------------------------------------------------ */
  $('.js-scroll-to').on('click', function(e) {
    e.preventDefault();

    var thisTarget = $(this).attr('href');

    if (thisTarget == '#bottom') {
      var targetOffset = $('#top').offset().top + $('#top').outerHeight() - $(window).height();
    } else {
      var targetOffset = $(thisTarget).offset().top;
    }

    $('html, body').animate({
      scrollTop: targetOffset
    }, 600);
  });

  /* ---------------------------------------------
  COOKIES
  ------------------------------------------------ */
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


  /* ---------------------------------------------
  EMAIL POPUP
  ------------------------------------------------ */
  // // Get cookies on load;
  // const hasVisited = getCookie('email-popup-dismissed');
  //
  // // if (true) {
  // if (hasVisited === null) {
  //   setTimeout(function () {
  //     $('body').addClass('show-email-popup');
  //     $('.email-popup-form-wrapper').addClass('js-animate');
  //   }, 10000);
  // }
  //
  //
  // KLAVIYO FORM START ------
  function validateEmail (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function closePopup () {

  }

  // SUCCESS =========================
  function formSubmitted ($form) {
    // SHOW SUCCESS MESSAGE
    $form.find('.js-inner-form-wrap').hide();
    $form.find('.success-message').fadeIn();

    // Briefly show success message, then hide popup
    setTimeout(function () {
      $('body').removeClass('show-email-popup email-submitted');
    }, 3000);
  }

  // FORM SUBMIT =========================
  $('.js-klaviyo-form').on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);
  	var email = $(this).find("input[type=email]").val();

    // CHECK FOR VALID EMAIL ADDRESS
    if (validateEmail(email)) {
      $($form).find('.error-message').fadeOut();

      var listId = $form.data('list-id');

      $.ajax({
        url: "https://manage.kmail-lists.com/ajax/subscriptions/subscribe",
        method: "POST",
        crossDomain: true,
        dataType: 'json',
        data: {
          "g": listId,
          '$consent': 'web',
          'email': email,
        },
        success: function (data) {
          formSubmitted($form);
        }
      });
    } else {
      $($form).find('.error-message').fadeIn();
    }
  });



  // $('.js-close-email-popup').on('click', function () {
  //   // DON'T SHOW AGAIN
  //   setCookie('email-popup-dismissed');
  //   $('body').removeClass('show-email-popup');
  // });




  // /* ---------------------------------------------
  // CURSOR
  // ------------------------------------------------ */
  //
  // // var cursorsInitiated = false;
  // function initCursor () {
  //
  //   var mouseOverElements = document.querySelectorAll(".js-cursor");
  //   var followers = [];
  //
  //   for (var i = 0; i < mouseOverElements.length; i++) {
  //     followers.push(createFollower(mouseOverElements[i]));
  //   }
  //
  //   window.addEventListener("resize", invalidateFollowers);
  //   window.addEventListener("scroll", invalidateFollowers);
  //
  //   function invalidateFollowers() {
  //     for (var i = 0; i < followers.length; i++) {
  //       followers[i].bounds = null;
  //     }
  //   }
  //
  //   function createFollower(parent) {
  //
  //     var requestId = null;
  //
  //     var follower = parent.querySelector(".follower");
  //
  //     var mouse = {
  //       bounds: null,
  //       x: 0,
  //       y: 0
  //     };
  //
  //     TweenLite.set(follower, {
  //       xPercent: -50,
  //       yPercent: -50
  //     });
  //
  //     parent.addEventListener("mousemove", onMouseMove);
  //     parent.addEventListener("mouseenter", onMouseEnter);
  //     parent.addEventListener("mouseleave", onMouseLeave);
  //     parent.addEventListener("mousedown", onMouseDown);
  //     parent.addEventListener("mouseup", onMouseUp);
  //
  //     if ($(parent).hasClass('js-has-click-targets')) {
  //       $(parent).find('a').on('mouseenter', onMouseEnterAnchor);
  //       $(parent).find('button').on('mouseenter', onMouseEnterAnchor);
  //       $(parent).find('a').on('mouseleave', onMouseLeaveAnchor);
  //       $(parent).find('button').on('mouseleave', onMouseLeaveAnchor);
  //     }
  //
  //     function onMouseMove(event) {
  //
  //       if (mouse.bounds == null) {
  //         mouse.bounds = parent.getBoundingClientRect();
  //       }
  //
  //       mouse.x = event.clientX - mouse.bounds.left;
  //       mouse.y = event.clientY - mouse.bounds.top;
  //
  //       if (!requestId) {
  //         requestId = requestAnimationFrame(updateFollower);
  //       }
  //     }
  //
  //     function onMouseDown () {
  //       $(this).find('.follower').addClass('mousedown');
  //     }
  //
  //     function onMouseUp () {
  //       $(this).find('.follower').removeClass('mousedown');
  //     }
  //
  //     function onMouseEnter () {
  //       $(this).find('.follower').addClass('animate');
  //     }
  //
  //     function onMouseLeave () {
  //       $(this).find('.follower').removeClass('animate');
  //     }
  //
  //     function onMouseEnterAnchor () {
  //       $(this).closest('.js-cursor').find('.follower').addClass('is-click');
  //     }
  //
  //     function onMouseLeaveAnchor () {
  //       $(this).closest('.js-cursor').find('.follower').removeClass('is-click');
  //     }
  //
  //     function updateFollower() {
  //
  //       TweenLite.to(follower, 0.3, {
  //         x: mouse.x,
  //         y: mouse.y
  //       });
  //
  //       requestId = null;
  //     }
  //
  //     return mouse;
  //   }
  //
  // }
  // initCursor();
  //
  // // USE THIS CODE TO INITIATE ONLY ON CERTAIN PAGES
  // // if ($('.template-index').length > 0) {
  // //   if (!cursorsInitiated) {
  // //     initCursor();
  // //   }
  // // }

  // // SLIDER FOR USE WITH GRAB ICON

  // productSlider ();
  //
  //
  // /*Slider function [It is recommended to place a function in a separate JS file, such as "functions.js"]*/
  // function productSlider () {
  //   $('#full-product-list').slick({
  //     dots: false,
  //     arrows: false,
  //     infinite: true,
  //     speed: 300,
  //     slidesToShow: 4,
  //     slidesToScroll: 4,
  //     responsive: [{
  //       breakpoint: 1200,
  //       settings: {
  //         slidesToShow: 4,
  //         slidesToScroll: 4,
  //         infinite: true,
  //         dots: true
  //       }
  //     }, {
  //       breakpoint: 992,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3
  //       }
  //     }, {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3
  //       }
  //     }, {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 2
  //       }
  //     }]
  //   });
  // }

  ScrollTrigger.refresh();


});
