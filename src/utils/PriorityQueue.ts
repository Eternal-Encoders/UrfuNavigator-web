// Thanks for user719662 from https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript

export class PriorityQueue<T> {
    top: number
    _heap: T[]
    _comparator: (a: T, b: T) => boolean

    constructor(comparator = (a: T, b: T) => a > b) {
        this._heap = [];
        this.top = 0;
        this._comparator = comparator;
    }

    parent = (i: number): number => ((i + 1) >>> 1) - 1;
    left = (i: number): number => (i << 1) + 1;
    right = (i: number): number => (i + 1) << 1;

    size() {
        return this._heap.length;
    }

    isEmpty() {
        return this.size() == 0;
    }

    peek() {
        return this._heap[this.top];
    }

    push(...values: T[]) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }

    pop() {
        const poppedValue = this.peek();
        const heap_bottom = this.size() - 1;
        if (heap_bottom > this.top) {
        this._swap(this.top, heap_bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
}

    replace(value: T) {
        const replacedValue = this.peek();
        this._heap[this.top] = value;
        this._siftDown();
        return replacedValue;
    }

    _greater(i: number, j: number) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i: number, j: number) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    _siftUp() {
        let node = this.size() - 1;
        while (node > this.top && this._greater(node, this.parent(node))) {
            this._swap(node, this.parent(node));
            node = this.parent(node);
        }
    }

    _siftDown() {
        let node = this.top;
        while (
            (this.left(node) < this.size() && this._greater(this.left(node), node)) ||
            (this.right(node) < this.size() && this._greater(this.right(node), node))
        ) {
        const maxChild = (this.right(node) < this.size() && this._greater(this.right(node), this.left(node))) ? 
            this.right(node) : 
            this.left(node);
        this._swap(node, maxChild);
        node = maxChild;
        }
    }
}
