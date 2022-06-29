(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core'), require('@tweenjs/tween.js')) :
    typeof define === 'function' && define.amd ? define(['@popperjs/core', '@tweenjs/tween.js'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GuideProcess = factory(global.core, global.tween_js));
})(this, (function (core, tween_js) { 'use strict';

    class GuideProcess {
        constructor(nodes, option) {
            this.nodes = nodes;
            this.option = option;
            this.initMask();
            this.initGuide();
            this.initTip();
            function animate() {
                requestAnimationFrame(animate);
                tween_js.update();
            }
            requestAnimationFrame(animate);
        }
        destroy() {
            var _a, _b, _c;
            (_a = this.mask) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = this.guide) === null || _b === void 0 ? void 0 : _b.remove();
            (_c = this.tip) === null || _c === void 0 ? void 0 : _c.remove();
            this.mask = null;
            this.guide = null;
            this.isDestroy = true;
        }
        getOffsetLeftByBody(e) {
            let offsetLeft = 0;
            while (e && e.tagName !== "BODY") {
                offsetLeft += e.offsetLeft;
                e = e.offsetParent;
            }
            return offsetLeft;
        }
        getOffsetTopByBody(e) {
            let offsetTop = 0;
            while (e && e.tagName !== "BODY") {
                offsetTop += e.offsetTop;
                e = e.offsetParent;
            }
            return offsetTop;
        }
        getPosition(e) {
            if (e.style.position === "fixed") {
                const info = e.getBoundingClientRect();
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
                    left: this.getOffsetLeftByBody(e),
                    top: this.getOffsetTopByBody(e),
                    width: e.offsetWidth,
                    height: e.offsetHeight,
                    position: "absolute"
                };
            }
        }
        initGuide() {
            const guide = document.createElement("div");
            guide.style.background = "transparent";
            guide.style.boxShadow = "rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px";
            this.guide = guide;
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
        initTip() {
            const tip = document.createElement("div");
            tip.style.width = "fitContent";
            tip.style.height = "fitContent";
            tip.style.minWidth = "20px";
            tip.style.minHeight = "20px";
            tip.className = "guide-process-tip";
            const tipArrow = document.createElement("div");
            tipArrow.className = "guide-process-arrow";
            const style = document.createElement("style");
            style.innerHTML = `
            .guide-process-arrow {
               position: absolute;
               width: 8px;
               height: 8px;
               background: inherit;
               visibility: hidden;
            }
           .guide-process-arrow::before {
               position: absolute;
               width: 8px;
               height: 8px;
               background: inherit;
               visibility: visible;
               content: '';
               transform: rotate(45deg);
               background: ${this.option.arrowColor};
               z-index: -1;
            }
           .guide-process-tip[data-popper-placement^='top'] > .guide-process-arrow {
                bottom: -4px;
           }
              
           .guide-process-tip[data-popper-placement^='bottom'] > .guide-process-arrow {
                top: -4px;
           }
              
           .guide-process-tip[data-popper-placement^='left'] > .guide-process-arrow {
                right: -4px;
           }
              
           .guide-process-tip[data-popper-placement^='right'] > .guide-process-arrow {
                left: -4px;
           }
        `;
            document.body.appendChild(style);
            tip.append(tipArrow);
            this.defaultTipOption = {
                placement: "top-start",
                modifiers: [
                    {
                        name: "offset",
                        options: {
                            offset: [0, 2],
                        },
                    },
                    {
                        name: "preventOverflow",
                        options: {
                            padding: 8,
                        },
                    },
                    {
                        name: "flip",
                        options: {
                            fallbackPlacements: ["bottom-start"],
                        },
                    },
                    {
                        name: "arrow",
                        options: {
                            element: tipArrow,
                            padding: 5,
                        },
                    },
                ],
            };
            this.tip = tip;
        }
        setPosition(animation) {
            debugger;
            const nextPosition = this.getPosition(this.nodes[this.index]);
            if (!animation) {
                this.position = nextPosition;
                if (this.mask && this.guide) {
                    this.guide.style.position = this.position.position;
                    this.guide.style.top = `${this.position.top}px`;
                    this.guide.style.left = `${this.position.left}px`;
                    this.guide.style.width = `${this.position.width}px`;
                    this.guide.style.height = `${this.position.height}px`;
                    this.nodes[this.index].scrollIntoView({ block: "center", behavior: "smooth", inline: "center" });
                    if (this.tip) {
                        this.tip.style.display = "block";
                    }
                }
            }
            else {
                new tween_js.Tween(this.position)
                    .to(nextPosition, 350)
                    .easing(tween_js.Easing.Quadratic.Out).onUpdate(() => {
                    if (this.guide && this.mask) {
                        this.guide.style.top = `${this.position.top}px`;
                        this.guide.style.left = `${this.position.left}px`;
                        this.guide.style.width = `${this.position.width}px`;
                        this.guide.style.height = `${this.position.height}px`;
                        this.tipInstance.update();
                    }
                }).onStart(() => {
                    if (this.guide) {
                        this.guide.style.position = nextPosition.position;
                        this.nodes[this.index].scrollIntoView({ block: "center", behavior: "smooth", inline: "center" });
                    }
                }).onComplete(() => {
                    if (this.tip) {
                        this.tip.style.display = "block";
                    }
                }).start();
            }
        }
        next() {
            if (this.isDestroy) {
                return;
            }
            this.index++;
            this.tip.style.display = "none";
            if (this.nodes[this.index]) {
                this.setPosition(true);
                this.updateTip();
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
            this.tip.style.display = "none";
            if (this.nodes[this.index]) {
                this.setPosition(true);
                this.updateTip();
            }
            else {
                this.destroy();
            }
        }
        start() {
            if (this.isDestroy) {
                return;
            }
            this.index = 0;
            this.setPosition(false);
            document.body.append(this.mask);
            document.body.append(this.guide);
            this.tipInstance = core.createPopper(this.guide, this.tip, this.defaultTipOption);
            document.body.append(this.tip);
            this.updateTip();
        }
        updateTip() {
            this.tipContent && this.tipContent.remove();
            const tipContent = this.option.getTipContent(this.index + 1);
            if (Object.prototype.toString.call(tipContent) === "[object String]") {
                const fragment = document.createElement("div");
                fragment.innerHTML = tipContent;
                this.tipContent = fragment.firstChild;
            }
            else {
                this.tipContent = tipContent;
            }
            this.tip.append(this.tipContent);
            this.tipInstance.setOptions((options) => (Object.assign(Object.assign({}, this.defaultTipOption), this.option.getTipOption(this.index + 1))));
            this.tipInstance.update();
        }
    }

    return GuideProcess;

}));
