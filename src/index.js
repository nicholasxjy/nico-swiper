import domWidth from 'dom-helpers/query/width'
import domStyle from 'dom-helpers/style'

import './style.css'

const defaultOptions = {
  gutter: 0,
  slideWidth: 0,
  defaultIndex: 0,
  defaultOffset: 0,
  containerClass: '.nswiper-container',
  slideClass: '.nswiper-slide',
  duration: 300,
  autoplay: 0
}

const isNode = el => el instanceof HTMLElement
const range = (num, arr) => Math.min(Math.max(num, arr[0]), arr[1])

class NSwiper {
  constructor(wrapper, opts) {
    if (typeof wrapper === 'string') {
      this.wrapper = document.querySelector(wrapper)
    } else if (isNode(wrapper)) {
      this.wrapper = wrapper
    }
    if (!this.wrapper) {
      throw new Error('Swiper wrapper element is not correct')
    }
    this.opts = Object.assign({}, defaultOptions, opts)
    this.container = this.wrapper.querySelector(this.opts.containerClass)
    this.handleEventStart = this.handleEventStart.bind(this)
    this.hanldeEventMove = this.hanldeEventMove.bind(this)
    this.handleEventEnd = this.handleEventEnd.bind(this)
    this.handleSlideChange = this.handleSlideChange.bind(this)

    this.init()
  }
  init() {
    const {
      slideClass,
      slideWidth,
      gutter,
      duration,
      defaultIndex,
      autoplay
    } = this.opts
    this.currentIndex = defaultIndex || 0
    this.slides = this.container.querySelectorAll(slideClass)
    this.count = this.slides.length
    this.slideWidth = slideWidth || domWidth(this.container)

    // set initial style
    const offset = this.calculateOffset()
    const containerStyle = {
      width: this.slideWidth * this.count + gutter * (this.count + 1) + 'px',
      transform: `translate3d(${offset}px, 0, 0)`
    }
    domStyle(this.container, containerStyle)
    for (let i = 0; i < this.count; i++) {
      domStyle(this.slides[i], {
        width: this.slideWidth + 'px',
        marginRight: gutter + 'px',
        transform: 'translate3d(0, 0, 0)'
      })
    }
    // attach events
    this.attachEvents()
    // set autoplay
    this.setAutoPlay()
  }
  attachEvents() {
    this.container.addEventListener('touchstart', this.handleEventStart)
    this.container.addEventListener('touchmove', this.hanldeEventMove)
    this.container.addEventListener('touchend', this.handleEventEnd)
    this.container.addEventListener('transitionend', this.handleSlideChange)
  }
  setAutoPlay() {
    const { autoplay } = this.opts
    if (autoplay > 0) {
      if (typeof autoplay !== 'number') {
        throw new Error('autplay option must be a number')
      }
      this.timer = setInterval(() => {
        if (this.currentIndex === this.count - 1) {
          this.currentIndex = 0
          this.move(0)
        } else {
          this.move(1)
        }
      }, autoplay)
    }
  }
  calculateOffset() {
    const { gutter, defaultOffset } = this.opts
    return (
      -this.currentIndex * (this.slideWidth + gutter) - gutter - defaultOffset
    )
  }
  handleEventStart(e) {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.deltaX = 0
    this.startX = e.touches[0].clientX
  }
  hanldeEventMove(e) {
    this.deltaX = e.touches[0].clientX - this.startX
    this.move(0, range(this.deltaX, [-this.slideWidth, this.slideWidth]))
  }
  handleEventEnd() {
    const { autoplay } = this.opts
    if (this.deltaX) {
      const stepIndex = this.deltaX > 0 ? -1 : 1
      const step = Math.abs(this.deltaX) > 50 ? stepIndex : 0
      this.move(step)
    }
    if (autoplay > 0 && this.timer) {
      this.setAutoPlay()
    }
  }
  handleSlideChange() {
    const { onSlideChange } = this.opts
    if (onSlideChange && typeof onSlideChange === 'function') {
      onSlideChange(this.currentIndex)
    }
  }
  move(step = 0, offset = 0) {
    const { gutter, defaultOffset, duration } = this.opts
    if (step) {
      this.currentIndex = this.currentIndex + step
      if (this.currentIndex < 0) {
        this.currentIndex = 0
      }
      if (this.currentIndex > this.count - 1) {
        this.currentIndex = this.count - 1
      }
    }
    let tempOffset
    if (offset) {
      tempOffset =
        offset -
        this.currentIndex * this.slideWidth -
        gutter * this.currentIndex -
        defaultOffset
    } else {
      tempOffset = this.calculateOffset()
    }
    domStyle(this.container, {
      transitionDuration: duration + 'ms',
      transform: `translate3d(${tempOffset}px, 0, 0)`
    })
  }
  goNext() {
    this.move(1)
  }
  goPrev() {
    this.move(-1)
  }
  destroy() {
    this.container.removeEventListener('touchstart', this.handleEventStart)
    this.container.removeEventListener('touchmove', this.hanldeEventMove)
    this.container.removeEventListener('touchend', this.handleEventEnd)
    this.container.removeEventListener('transitionend', this.handleSlideChange)
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

export default NSwiper
