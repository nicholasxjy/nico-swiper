'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var domWidth = _interopDefault(require('dom-helpers/query/width'));
var domStyle = _interopDefault(require('dom-helpers/style'));

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".nswiper-wrapper {\n  width: 100%;\n  overflow: hidden;\n}\n\n.nswiper-container {\n  width: 100%;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-flex-wrap: nowrap;\n      -ms-flex-wrap: nowrap;\n          flex-wrap: nowrap;\n}\n.nswiper-slide {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 0;\n      -ms-flex: 1 0;\n          flex: 1 0;\n}\n";
styleInject(css);

var defaultOptions = {
  gutter: 0,
  slideWidth: 0,
  defaultIndex: 0,
  defaultOffset: 0,
  containerClass: '.nswiper-container',
  slideClass: '.nswiper-slide',
  duration: 300,
  autoplay: 0
};

var isNode = function isNode(el) {
  return el instanceof HTMLElement;
};

var range = function range(num, arr) {
  return Math.min(Math.max(num, arr[0]), arr[1]);
};

var NSwiper =
/*#__PURE__*/
function () {
  function NSwiper(wrapper, opts) {
    if (typeof wrapper === 'string') {
      this.wrapper = document.querySelector(wrapper);
    } else if (isNode(wrapper)) {
      this.wrapper = wrapper;
    }

    if (!this.wrapper) {
      throw new Error('Swiper wrapper element is not correct');
    }

    this.opts = Object.assign({}, defaultOptions, opts);
    this.container = this.wrapper.querySelector(this.opts.containerClass);
    this.handleEventStart = this.handleEventStart.bind(this);
    this.hanldeEventMove = this.hanldeEventMove.bind(this);
    this.handleEventEnd = this.handleEventEnd.bind(this);
    this.handleSlideChange = this.handleSlideChange.bind(this);
    this.init();
  }

  var _proto = NSwiper.prototype;

  _proto.init = function init() {
    var _this$opts = this.opts,
        slideClass = _this$opts.slideClass,
        slideWidth = _this$opts.slideWidth,
        gutter = _this$opts.gutter,
        duration = _this$opts.duration,
        defaultIndex = _this$opts.defaultIndex,
        autoplay = _this$opts.autoplay;
    this.currentIndex = defaultIndex || 0;
    this.slides = this.container.querySelectorAll(slideClass);
    this.count = this.slides.length;
    this.slideWidth = slideWidth || domWidth(this.container); // set initial style

    var offset = this.calculateOffset();
    var containerStyle = {
      width: this.slideWidth * this.count + gutter * (this.count + 1) + 'px',
      transform: "translate3d(" + offset + "px, 0, 0)"
    };
    domStyle(this.container, containerStyle);

    for (var i = 0; i < this.count; i++) {
      domStyle(this.slides[i], {
        width: this.slideWidth + 'px',
        marginRight: gutter + 'px',
        transform: 'translate3d(0, 0, 0)'
      });
    } // attach events


    this.attachEvents(); // set autoplay

    this.setAutoPlay();
  };

  _proto.attachEvents = function attachEvents() {
    this.container.addEventListener('touchstart', this.handleEventStart);
    this.container.addEventListener('touchmove', this.hanldeEventMove);
    this.container.addEventListener('touchend', this.handleEventEnd);
    this.container.addEventListener('transitionend', this.handleSlideChange);
  };

  _proto.setAutoPlay = function setAutoPlay() {
    var _this = this;

    var autoplay = this.opts.autoplay;

    if (autoplay > 0) {
      if (typeof autoplay !== 'number') {
        throw new Error('autplay option must be a number');
      }

      this.timer = setInterval(function () {
        if (_this.currentIndex === _this.count - 1) {
          _this.currentIndex = 0;

          _this.move(0);
        } else {
          _this.move(1);
        }
      }, autoplay);
    }
  };

  _proto.calculateOffset = function calculateOffset() {
    var _this$opts2 = this.opts,
        gutter = _this$opts2.gutter,
        defaultOffset = _this$opts2.defaultOffset;
    return -this.currentIndex * (this.slideWidth + gutter) - gutter - defaultOffset;
  };

  _proto.handleEventStart = function handleEventStart(e) {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.deltaX = 0;
    this.startX = e.touches[0].clientX;
  };

  _proto.hanldeEventMove = function hanldeEventMove(e) {
    this.deltaX = e.touches[0].clientX - this.startX;
    this.move(0, range(this.deltaX, [-this.slideWidth, this.slideWidth]));
  };

  _proto.handleEventEnd = function handleEventEnd() {
    var autoplay = this.opts.autoplay;

    if (this.deltaX) {
      var stepIndex = this.deltaX > 0 ? -1 : 1;
      var step = Math.abs(this.deltaX) > 50 ? stepIndex : 0;
      this.move(step);
    }

    if (autoplay > 0 && this.timer) {
      this.setAutoPlay();
    }
  };

  _proto.handleSlideChange = function handleSlideChange() {
    var onSlideChange = this.opts.onSlideChange;

    if (onSlideChange && typeof onSlideChange === 'function') {
      onSlideChange(this.currentIndex);
    }
  };

  _proto.move = function move(step, offset) {
    if (step === void 0) {
      step = 0;
    }

    if (offset === void 0) {
      offset = 0;
    }

    var _this$opts3 = this.opts,
        gutter = _this$opts3.gutter,
        defaultOffset = _this$opts3.defaultOffset,
        duration = _this$opts3.duration;

    if (step) {
      this.currentIndex = this.currentIndex + step;

      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      }

      if (this.currentIndex > this.count - 1) {
        this.currentIndex = this.count - 1;
      }
    }

    var tempOffset;

    if (offset) {
      tempOffset = offset - this.currentIndex * this.slideWidth - gutter * this.currentIndex - defaultOffset;
    } else {
      tempOffset = this.calculateOffset();
    }

    domStyle(this.container, {
      transitionDuration: duration + 'ms',
      transform: "translate3d(" + tempOffset + "px, 0, 0)"
    });
  };

  _proto.goNext = function goNext() {
    this.move(1);
  };

  _proto.goPrev = function goPrev() {
    this.move(-1);
  };

  _proto.destroy = function destroy() {
    this.container.removeEventListener('touchstart', this.handleEventStart);
    this.container.removeEventListener('touchmove', this.hanldeEventMove);
    this.container.removeEventListener('touchend', this.handleEventEnd);
    this.container.removeEventListener('transitionend', this.handleSlideChange);

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  return NSwiper;
}();

module.exports = NSwiper;
