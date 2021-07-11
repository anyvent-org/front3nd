const EventBus = require('@anyvent-org/front3nd/js/utilities/EventBus');
const throttle = require('@anyvent-org/front3nd/js/utilities/throttle');

const THROTTLE_MS = 25;
const DIRECTION_UP = 1;
const DIRECTION_DOWN = -1;

const EVENT_SCROLL = 'scroll';

class ScrollService {

  constructor() {
    this.eventBus = new EventBus();

    this.onScroll = throttle(this.onScroll.bind(this), THROTTLE_MS);
    document.addEventListener('scroll', this.onScroll.bind(this));

    this.scrollTop = 0;
  }

  subscribe(observer) {
    this.eventBus.subscribe(EVENT_SCROLL, observer);
  }

  onScroll(e) {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const direction = scrollTop > this.scrollTop ? DIRECTION_UP : DIRECTION_DOWN;

    this.eventBus.publish(EVENT_SCROLL, { event: e, direction, scrollTop });
    this.scrollTop = scrollTop;
  }

}

module.exports = {
  scrollService: new ScrollService(),
  DIRECTION_UP,
  DIRECTION_DOWN,
  EVENT_SCROLL,
};