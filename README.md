## NSwiper

NSwiper is a swiper plugin for mobile web (only for mobile)

## Features

- Small
- Simple
- No other dependencies

## Installation

```bash
$ npm install --save nico-swiper
```

## Getting started

```html
<div id="swiper1" class="nswiper-wrapper">
  <div class="nswiper-container">
    <div class="nswiper-slide">
      <div class="slide">
        <img src="https://wpimg.wallstcn.com/2ab21ec8-7882-4db5-b764-c6735ddc1dd1.png" alt="slide">
      </div>
    </div>
    <div class="nswiper-slide">
      <div class="slide">
        <img src="https://wpimg.wallstcn.com/d1f71496-5391-412d-8386-5fcbaba276f6.jpg" alt="slide">
      </div>
    </div>
    <div class="nswiper-slide">
      <div class="slide">
        <img src="https://wpimg.wallstcn.com/6342464e-71c1-497e-bebc-202910aa992c.jpg" alt="slide">
      </div>
    </div>
    <div class="nswiper-slide">
      <div class="slide">
        <img src="https://wpimg.wallstcn.com/5af3a726-4d23-4cde-8364-4f1809b61f89.jpg" alt="slide">
      </div>
    </div>
  </div>
</div>
```

```javascript
import NSwiper from 'nico-swiper'
// or <script src="NSwiper.min.js"></script>
const swiper = new NSwiper('#swiper', {
  gutter: 0, // slide gap
  slideWidth: 0, // custom slide width, if not set will be parent width
  defaultIndex: 0, // initial slide to show
  defaultOffset: 0, // initial offset
  containerClass: '.nswiper-container', // custom container class
  slideClass: '.nswiper-slide', // custom container slide class
  duration: 300, // slide transition duration
  autoplay: 0 // must be a number, if set will swipe slide auto
  onSlideChange: function(index) {} // slide changed callback, index is the current slide index
})

// next slide
swiper.goNext()
// prev slide
swiper.goPrev()

// destroy
swiper.destroy()
```

## FAQ

- how to add indicators ?

  good question, we can use onSlideChange callback implement our custom indicators

- custom prev next ?

  use instance method goNext and goPrev, like swiper.goNext()

- pc support

  maybe

- examples ?

  check it on [http://chef-salad.com/nico-swiper/](http://chef-salad.com/nico-swiper/)

  and pictures used in demo from a singer called 9m88
