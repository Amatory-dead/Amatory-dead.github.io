function initGrad() {
    container = $('#curve-animation')[0];
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 250;
    camera.position.y = 100;
    scene = new THREE.Scene();
    particles = new Array();
    // particles
    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial({
        color: 0x092b4e,
        program: function(context) {
            context.beginPath();
            context.arc(0, 0, 0.2, PI2, 0.5, true);
            context.shadowBlur = 25;
            context.shadowColor = "#092b4e";
            context.fill();
        }
    });
    var geometry = new THREE.Geometry();
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x07213b,
        opacity: 0.3
    }));
    scene.add(line);
    var i = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++] = new THREE.Sprite(material);
            particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scene.add(particle);
            geometry.vertices.push(particle.position);
        }
    }
    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var sound_short_started = false;
var sound_long_started = false;

function animateGrad() {

    $('#curve-animation').addClass('animate');

    if (!sound_short_started) {
        sound_short_started = true;
        var sound_short = new Audio('sound/short.mp3'); 
        sound_short.play();
    }
    // $('.player_short')[0].play();

    $('.logo > svg').one(animationEnd, function(e){
        delay(function(){
            var h = $('.main-wrapper').outerHeight();
            $('.logo').animate({
                'margin-top': -1 * h,
            }, 1000, function(){

                if (!sound_long_started) {
                    sound_long_started = true;
                    var sound_long = new Audio('sound/long.mp3'); 
                    sound_long.play();
                    sound_long.addEventListener('ended', function() {
                        sound_long.currentTime = 0;
                        sound_long.play();
                    }, false);
                }
                // $('.player_long')[0].play();

                $('.main-wrapper').show();
                $('.logo').css('margin-top', 0);
                $('.subtitle').animateCss('fadeIn', function(){
                    $('.subtitle').addClass('in');
                    
                    $('.lang-block').animateCss('fadeIn', function(){
                        $('.lang-block').addClass('in');
                    });

                    $('#calc-block').animateCss('fadeIn', function(){
                        $('#calc-block').addClass('in');
                    });

                    $('.btn-get').animateCss('fadeIn', function(){
                        $('.btn-get').addClass('in');
                    });

                    $('.arrow-down').animateCss('fadeIn', function(){
                        $('.arrow-down').addClass('in');
                    });
                });
            });

        }, 1000);
    });

    requestAnimationFrame(animateGrad);
    render();
}

function render() {
    var i = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            particle.position.y = (Math.sin((ix + count) * 0.7) * 20) + (Math.sin((iy + count) * 0.2) * 60);
            particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4;
        }
    }
    camera.rotation.x = 75;
    renderer.render(scene, camera);
    count += 0.05;
}

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
var SEPARATION = 40,
    AMOUNTX = 35,
    AMOUNTY = 35;
var container, stats;
var camera, scene, renderer;
var particles, particle, count = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

$.fn.extend({
    animateCss: function (animationName, callback) {
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
              callback();
            }
        });
        return this;
    }
});

function initUnits()
{
    calcOdometer = new Odometer({
        el:$('#calc-odometer')[0],
        theme:'default',
        value: 0,
        format: 'd',
        duration:3000
    });
    
    updateUnit(0);

    var $unit = $('#unit');
    var scrollHeight = $unit.outerHeight() / units.length;
    
    $unit.find('.scale-scroll').css('height', scrollHeight);
    
    $unit.find('.nav-arrow').on('click', function(){
        var currentIndex = parseInt($unit.data('index'));
        if($(this).data('nav') == 'up') {
            if(currentIndex > 0) {
                updateUnit(currentIndex - 1);
            }
        }
        else {
            if(currentIndex < units.length) {
                updateUnit(currentIndex + 1);
            }
        }
    });

    $('#calc-block .value').on('blur', function(){
        updateUnit();
    });
}

function updateUnit(index)
{
    var $unit = $('#unit');
    
    if(!index) {
        index = $unit.data('index') || 0;
    }

    var $scroll = $unit.find('.scale-scroll');
    var currentUnit = units[index];
    var value = parseInt($('#calc-block .value').val());
    $unit.data('unit', currentUnit);
    $unit.data('index', index)

    $unit.find('.calc-header').text(currentUnit.name);
    window.calcOdometer.update(value * currentUnit.ratio);

    $scroll.animate({
        'margin-top': $scroll.height() * index
    }, 500);
}

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

var calcOdometer;
var units = [
    {name: 'UTN', ratio: 13},
    {name: 'UTN2', ratio: 3},
    {name: 'UTN3', ratio: 4},
    {name: 'UTN4', ratio: 19},
    {name: 'UTN5', ratio: 67}
];

$(function(){

    var owlConfig = {
        items:1,
        margin: 0,
        dots: false,
        nav: true,
        navText: [
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"/></svg>', 
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"/></svg>'
        ]
    };

    $(window).on('activate.bs.scrollspy', function (e) {
        var nav = $('#side-nav');
        var blockId = nav.find('.active').attr('href');
        nav.removeClass('theme-default theme-dark theme-light');
        if(blockId == '#main-block') {
            nav.addClass('theme-default');
        }
        if(blockId == '#about-block') {
            nav.addClass('theme-dark');
        }
        if(blockId == '#choose-block') {
            nav.addClass('theme-light');
        }
    });

    $('.wow').addClass('not-visible').css('visibility', 'hidden');
    $(window).on('scroll', function (e) {
        $('.wow').each(function(){
            if(isScrolledIntoView($(this))) {
                if(!$(this).hasClass('visible')) {
                    $(this).addClass('visible').removeClass('not-visible');
                    $(this).finish().animateCss('fadeInUp', function(){});    
                }
            }
            /*else {
                if(!$(this).hasClass('not-visible')) {
                    $(this).addClass('not-visible').removeClass('visible');
                    $(this).finish().animateCss('fadeOutDown', function(){});    
                }
            }*/
        });
    });

    $('#side-nav a').on('click', function(){
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 300);
        return false;
    });

	initGrad();
	animateGrad();
    initUnits();

    $('#main-block .arrow-down').on('click', function(){
        $('html, body').animate({
            scrollTop: $('#about-block').offset().top
        }, 500);
    });

    var sliderAbout = $('#about-carousel').owlCarousel(owlConfig);
    var sliderChoose = $('#choose-carousel').owlCarousel(owlConfig);


    sliderAbout.on('changed.owl.carousel', function(event) {
        $('#about-carousel-nav .item').removeClass('active');
        $('#about-carousel-nav .item').eq(event.item.index).addClass('active');
    });

    sliderChoose.on('changed.owl.carousel', function(event) {
        $('#choose-carousel-nav .item').removeClass('active');
        $('#choose-carousel-nav .item').eq(event.item.index).addClass('active');
    });

    $('#about-carousel-nav .item').on('click', function(){
        sliderAbout.trigger('to.owl.carousel', $(this).data('index'));
    });

    $('#choose-carousel-nav .item').on('click', function(){
        sliderChoose.trigger('to.owl.carousel', $(this).data('index'));
    });
});