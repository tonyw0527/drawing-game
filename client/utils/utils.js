const WHITE_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeCAYAAADNK3caAAALEElEQVR4Xu3UwQkAMAwDsXb/oV3oEPdSFjCIcHfbjiNAgACBTOAKb2ZtiAABAl9AeD0CAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEBAeP0AAQIEYgHhjcHNESBAQHj9AAECBGIB4Y3BzREgQEB4/QABAgRiAeGNwc0RIEDgARUudDKqDxgQAAAAAElFTkSuQmCC';

const canvasImgSetting = (canvas, src) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
        canvas.getContext('2d').drawImage(image, 0, 0);
    }
}

class WorkMemory {

    constructor() {
        this.work_stack = [WHITE_PNG];
        this.tmp_stack = [];
    }

    saving(work) {
        if(this.tmp_stack.length !== 0) {
            this.tmp_stack = [];
        }
        this.work_stack.push(work);
        // max cashing lenth
        if(this.work_stack.length === 7) {
            this.work_stack.shift();
        }
    }

    moveToPrev(callback) {
        if(this.work_stack.length === 1){
            return 'end';
        }
        const popedWork = this.work_stack.pop();
        this.tmp_stack.push(popedWork);
        const prevWork = this.work_stack[this.work_stack.length-1];

        callback(prevWork);
    }

    moveToNext(callback) {
        if(this.tmp_stack.length === 0) {
            return 'end';
        }
        const nextWork = this.tmp_stack.pop();
        this.work_stack.push(nextWork);
        
        callback(nextWork);
    }

    init() {
        this.work_stack = [WHITE_PNG];
        this.tmp_stack = [];
    }
}


export { WHITE_PNG, WorkMemory, canvasImgSetting };