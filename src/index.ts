import {createPopper} from "@popperjs/core";
import {Tween, Easing, update} from "@tweenjs/tween.js";

interface GuidePosition {
    left: number;
    top: number;
    width: number;
    height: number;
    position: "fixed" | "absolute";
}

interface GuideOption {
    /**
     * 获取每一步的tip的内容，返回dom元素或dom字符串
     * @param step
     */
    getTipContent: (step: number) => HTMLElement | string;

    /**
     * 控制tip箭头颜色， 默认白色
     */
    arrowColor: string;

    /**
     * 覆盖默认的popper.js配置，每一步的改变都会调用，用于自定义每一步tip的样式和表现，返回格式参考popper.js的option配置
     */
    getTipOption: (step: number) => any;
}

interface GuideProcessInterface {

    /**
     * 外部传入的配置项
     */
    option: GuideOption,

    /**
     * 引导时每一步的目标元素集合
     */
    nodes: HTMLElement[];

    /**
     * 遮罩
     */
    mask: HTMLElement;

    /**
     * 引导聚焦元素
     */
    guide: HTMLElement;

    /**
     * 引导tip
     */
    tip: HTMLElement;

    /**
     * tip箭头
     */
    tipArrow: HTMLElement;

    /**
     * 自定义的tip内容
     */
    tipContent: HTMLElement;

    /**
     * tip箭头颜色
     */
    arrowColor: string;

    /**
     * 当前聚焦元素索引
     */
    index: number;

    /**
     * 引导是否结束或者被销毁，当next或pre到不存在的元素时自动销毁
     */
    isDestroy: boolean;

    /**
     * tip实例
     */
    tipInstance: any;

    /**
     * 聚焦元素位置
     */
    position: GuidePosition;

    /**
     * 默认tip的popper.js配置
     */
    defaultTipOption: any;

    /**
     * 初始化遮罩元素
     */
    initMask: () => void;

    /**
     * 初始化聚焦元素
     */
    initGuide: () => void;


    /**
     * 初始化tip元素
     */
    initTip: () => void;

    /**
     * 辅助函数
     * @param e
     */
    getOffsetTopByBody: (e: HTMLElement) => number;

    /**
     * 辅助函数
     * @param e
     */
    getOffsetLeftByBody: (e: HTMLElement) => number;

    /**
     * 获取下一步的聚焦元素的位置
     * @param e
     */
    getPosition: (e: HTMLElement) => GuidePosition;

    /**
     * 设置聚焦元素的位置
     * @param animation 是否存在动画，开始时不存在
     */
    setPosition: (animation: boolean) => void;

    /**
     * 更新tip的位置和配置
     */
    updateTip: () => void;

    /**
     * 开始引导
     */
    start: () => void;

    /**
     * 下一步，用户可以通过实例进行调用以聚焦到下一个目标，如果下一个不存在，引导结束
     */
    next: () => void;

    /**
     * 下一步，用户可以通过实例进行调用以聚焦到上一个一个目标，如果上一个不存在，引导结束
     */
    pre: () => void;

    /**
     * 结束引导，并销毁引导创建的响应dom元素
     */
    destroy: () => void;
}

export default class GuideProcess implements GuideProcessInterface {
    constructor(nodes: HTMLElement[], option: GuideOption) {
        this.nodes = nodes;
        this.option = option;
        this.initMask();
        this.initGuide();
        this.initTip();

        function animate() {
            requestAnimationFrame(animate);
            update();
        }

        requestAnimationFrame(animate);
    }

    option: GuideOption;
    arrowColor: string;
    defaultTipOption: any;
    guide: HTMLElement;
    index: number;
    isDestroy: boolean;
    mask: HTMLElement;
    nodes: HTMLElement[];
    position: GuidePosition;
    tip: HTMLElement;
    tipArrow: HTMLElement;
    tipInstance: any;
    tipContent: HTMLElement;

    destroy(): void {
        this.mask?.remove();
        this.guide?.remove();
        this.tip?.remove();
        this.mask = null;
        this.guide = null;
        this.isDestroy = true;
    }

    getOffsetLeftByBody(e: HTMLElement): number {
        let offsetLeft = 0;
        while (e && e.tagName !== "BODY") {
            offsetLeft += e.offsetLeft;
            e = e.offsetParent as HTMLElement;
        }
        return offsetLeft;
    }

    getOffsetTopByBody(e: HTMLElement): number {
        let offsetTop = 0;
        while (e && e.tagName !== "BODY") {
            offsetTop += e.offsetTop;
            e = e.offsetParent as HTMLElement;
        }
        return offsetTop;
    }

    getPosition(e: HTMLElement): GuidePosition {
        if (e.style.position === "fixed") {
            const info = e.getBoundingClientRect();
            return {
                left: info.left,
                top: info.top,
                width: info.width,
                height: info.height,
                position: "fixed"
            };
        } else {
            return {
                left: this.getOffsetLeftByBody(e),
                top: this.getOffsetTopByBody(e),
                width: e.offsetWidth,
                height: e.offsetHeight,
                position: "absolute"
            };
        }
    }

    initGuide(): void {
        const guide = document.createElement("div");
        guide.style.background = "transparent";
        guide.style.boxShadow = "rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px";
        this.guide = guide;
    }

    initMask(): void {
        const mask = document.createElement("div");
        mask.style.position = "fixed";
        mask.style.top = "0px";
        mask.style.left = "0px";
        mask.style.width = "100%";
        mask.style.height = "100%";
        this.mask = mask;
    }

    initTip(): void {
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

    setPosition(animation: boolean): void {
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
                this.nodes[this.index].scrollIntoView({block: "center", behavior: "smooth", inline: "center"});
                if (this.tip) {
                    this.tip.style.display = "block";
                }
            }
        } else {
            new Tween(this.position)
                .to(nextPosition, 350)
                .easing(Easing.Quadratic.Out).onUpdate(() => {
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
                    this.nodes[this.index].scrollIntoView({block: "center", behavior: "smooth", inline: "center"});
                }
            }).onComplete(() => {
                if (this.tip) {
                    this.tip.style.display = "block";
                }
            }).start();
        }
    }

    next(): void {
        if (this.isDestroy) {
            return;
        }
        this.index++;
        this.tip.style.display = "none";
        if (this.nodes[this.index]) {
            this.setPosition(true);
            this.updateTip();
        } else {
            this.destroy();
        }
    }

    pre(): void {
        if (this.isDestroy) {
            return;
        }
        this.index--;
        this.tip.style.display = "none";
        if (this.nodes[this.index]) {
            this.setPosition(true);
            this.updateTip();
        } else {
            this.destroy();
        }
    }

    start(): void {
        if (this.isDestroy) {
            return;
        }
        this.index = 0;
        this.setPosition(false);
        document.body.append(this.mask);
        document.body.append(this.guide);
        this.tipInstance = createPopper(this.guide, this.tip, this.defaultTipOption);
        document.body.append(this.tip);
        this.updateTip();
    }

    updateTip(): void {
        this.tipContent && this.tipContent.remove();
        const tipContent = this.option.getTipContent(this.index + 1);
        if (Object.prototype.toString.call(tipContent) === "[object String]") {
            const fragment = document.createElement("div");
            fragment.innerHTML = tipContent as string;
            this.tipContent = fragment.firstChild as HTMLElement;
        } else {
            this.tipContent = tipContent as HTMLElement;
        }
        this.tip.append(this.tipContent);
        this.tipInstance.setOptions((options: any) => ({...this.defaultTipOption, ...this.option.getTipOption(this.index + 1)}));
        this.tipInstance.update();
    }

}
