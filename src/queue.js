const { NotImplementedError } = require('../extensions/index.js');

const { ListNode } = require('../extensions/list-node.js');

/**
 * Implement the Queue with a given interface via linked list (use ListNode extension above).
 *
 * @example
 * const queue = new Queue();
 *
 * queue.enqueue(1); // adds the element to the queue
 * queue.enqueue(3); // adds the element to the queue
 * queue.dequeue(); // returns the top element from queue and deletes it, returns 1
 * queue.getUnderlyingList() // returns { value: 3, next: null }
 */
class Queue {
  head = null;
  tail = null;
  size = 0;

  getUnderlyingList() {
    if (this.size === 0) {
      return undefined;
    }
    let currentElement = this.head;
    let currentQueue = {value: currentElement.value, next: null};
    let currentQueueNext = currentQueue;
    while (currentElement.next !== null) {
      currentElement = currentElement.next;
      currentQueueNext.next = {value: currentElement.value, next: null};
      currentQueueNext = currentQueueNext.next;
    }
    return currentQueue;
  }

  enqueue(value) {
    const newElement = new ListNode(value);
    if (this.size === 0) {
      this.head = newElement;
    } else {
      this.tail.next = newElement;
    }
    this.tail = newElement;
    this.size += 1;
  }

  dequeue() {
    const topElement = this.size === 0 ? null : this.head.value;
    if (this.size === 1) {
      this.head = null;
      this.tail = null;
      this.size = 0;
    } else {
      const topNextElement = this.head.next;
      this.head = topNextElement;
      this.size -= 1;
    }
    return topElement;
  }
}

module.exports = {
  Queue
};
