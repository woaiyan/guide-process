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
    option: GuideOption;
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
    constructor(nodes: HTMLElement[] | HTMLCollectionOf<Element>, option: GuideOption);
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
    destroy(): void;
    getOffsetLeftByBody(e: HTMLElement): number;
    getOffsetTopByBody(e: HTMLElement): number;
    getPosition(e: HTMLElement): GuidePosition;
    initGuide(): void;
    initMask(): void;
    initTip(): void;
    setPosition(animation: boolean): void;
    next(): void;
    pre(): void;
    start(): void;
    updateTip(): void;
}
export {};
