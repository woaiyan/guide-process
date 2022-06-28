export default class GuideProcess {
    constructor(nodes) {
        this.nodes = [];
        this.mask = null;
        this.guide = null;
        this.tip = null;
        this.index = 0;
        this.isDestroy = false;
        this.position = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            position: "absolute"
        };
        if (!nodes || !nodes.length) {
            throw Error("please input array of HTMLElement");
        }
        this.nodes = nodes;
        this.init();
    }
    get maxIndex() {
        return this.nodes.length;
    }
    get currentIndex() {
        return this.index + 1;
    }
    init() {
        this.initMask();
        this.initGuide();
    }
    initMask() {
        const mask = document.createElement("div");
        mask.style.position = "fixed";
        mask.style.top = "0px";
        mask.style.left = "0px";
        mask.style.width = "100%";
        mask.style.height = "100%";
        this.mask = mask;
    }
    initGuide() {
        const guide = document.createElement("div");
        guide.style.background = `transparent`;
        guide.style.boxShadow = `rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px`;
        this.guide = guide;
    }
    getOffsetTopByBody(el) {
        let offsetTop = 0;
        while (el && el.tagName !== 'BODY') {
            offsetTop += el.offsetTop;
            el = el.offsetParent;
        }
        return offsetTop;
    }
    getOffsetLeftByBody(el) {
        let offsetLeft = 0;
        while (el && el.tagName !== 'BODY') {
            offsetLeft += el.offsetLeft;
            el = el.offsetParent;
        }
        return offsetLeft;
    }
    getPosition(el) {
        if (el.style.position === "fixed") {
            const info = el.getBoundingClientRect();
            return {
                left: info.left,
                top: info.top,
                width: info.width,
                height: info.height,
                position: "fixed"
            };
        }
        else {
            return {
                left: this.getOffsetLeftByBody(el),
                top: this.getOffsetTopByBody(el),
                width: el.offsetWidth,
                height: el.offsetHeight,
                position: "absolute"
            };
        }
    }
    setPosition() {
        this.position = this.getPosition(this.nodes[this.index]);
        if (this.mask && this.guide) {
            this.guide.style.position = this.position.position;
            this.guide.style.top = `${this.position.top}px`;
            this.guide.style.left = `${this.position.left}px`;
            this.guide.style.width = `${this.position.width}px`;
            this.guide.style.height = `${this.position.height}px`;
            this.nodes[this.index].scrollIntoView({ block: "center", behavior: "smooth", inline: "center" });
        }
    }
    start() {
        if (this.isDestroy) {
            return;
        }
        this.index = 0;
        this.setPosition();
        document.body.append(this.mask);
        document.body.append(this.guide);
    }
    next() {
        if (this.isDestroy) {
            return;
        }
        this.index++;
        if (this.nodes[this.index]) {
            this.setPosition();
        }
        else {
            this.destroy();
        }
    }
    pre() {
        if (this.isDestroy) {
            return;
        }
        this.index--;
        if (this.nodes[this.index]) {
            this.setPosition();
        }
        else {
            this.destroy();
        }
    }
    destroy() {
        var _a, _b;
        (_a = this.mask) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = this.guide) === null || _b === void 0 ? void 0 : _b.remove();
        this.mask = null;
        this.guide = null;
        this.isDestroy = true;
    }
}
