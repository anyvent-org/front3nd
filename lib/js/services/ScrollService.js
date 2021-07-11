const EventBus = require('@anyvent-org/front3nd/js/utilities/EventBus');
const throttle = require('@anyvent-org/front3nd/js/utilities/throttle');

const THROTTLE_MS = 250;
const DIRECTION_UP = 1;
const DIRECTION_DOWN = -1;

const EVENT_SCROLL_UP = 'scroll-up';
const EVENT_SCROLL_DOWN = 'scroll-down';
const EVENT_SCROLL = 'scroll';

class ScrollService {

  constructor() {
    this.eventBus = new EventBus();
    this.subscribe = this.eventBus.subscribe;

    this.onScroll = throttle(this.onScroll.bind(this), 250);
    document.addEventListener('scroll', this.onScroll.bind(this));

    this.scrollPosition = 0;
  }

  onScroll(e) {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    const direction = scrollPosition > this.scrollPosition ? DIRECTION_UP : DIRECTION_DOWN;

    if (direction == DIRECTION_DOWN) {
      this.eventBus.publish(EVENT_SCROLL_DOWN, e, scrollPosition);
    } else {
      this.eventBus.publish(EVENT_SCROLL_UP, e, scrollPosition);
    }

    this.eventBus.publish(EVENT_SCROLL, e, scrollPosition);
  }

}

module.exports = new ScrollService();