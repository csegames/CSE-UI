
//Parallax
(function(){

setTimeout(function() {
  
$.fn.parallax = function(resistance, mouse) {
    $el = $(this);
    TweenLite.to($el, 1, {
      x: -((mouse.clientX - window.innerWidth / 1) / resistance),
      y: -((mouse.clientY - window.innerHeight / 1) / resistance)
    });
  };
  
  $.fn.parallaxy = function(resistance, mouse) {
    $el = $(this);
    TweenLite.to($el, 1, {
      x: -((mouse.clientX - window.innerWidth / 1) / resistance)
    });
  };
  
  $(document).mousemove(function(e) {  
    $(".ray1").parallaxy(50, e);  
    $(".ray2").parallaxy(25, e);
    $(".ray3").parallaxy(70, e);
    $(".particle").parallax(10, e);
    $(".char").parallaxy(40, e);
    $(".floor").parallaxy(50, e);
    $(".flag").parallaxy(20, e);
    $(".bg").parallaxy(25, e);
    });
  
  
  
  //dust
  
  /* ---- particles.js config ---- */
  
  particlesJS("dust", {
    "particles": {
      "number": {
        "value": 50,
        "density": {
          "enable": true,
          "value_area": 1300
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.4,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 2.5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false
      },
      "move": {
        "enable": true,
        "speed": .5,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
        },
        "onclick": {
          "enable": false
        },
        "resize": false
      }
    },
    "retina_detect": true
  });

}, 500);

})()