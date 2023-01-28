export class MaxSizeQueue<Type> {
  maxSize: number;
  items: Type[] = [];

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  peek() {
    return this.items[0];
  }

  push(item: Type) {
    this.items.push(item);
    if (this.items.length > this.maxSize) {
      this.items.shift();
    }
  }
}
