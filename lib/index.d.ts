interface GuidePosition {
    left: number;
    top: number;
    width: number;
    height: number;
    position: "fixed" | "absolute";
}
export default class GuideProcess {
    nodes: HTMLElement[];
    mask: HTMLElement | null;
    guide: HTMLElement | null;
    tip: any;
    index: number;
    isDestroy: boolean;
    position: GuidePosition;
    get maxIndex(): number;
    get currentIndex(): number;
    constructor(nodes: HTMLElement[]);
    private init;
    private initMask;
    private initGuide;
    private getOffsetTopByBody;
    private getOffsetLeftByBody;
    private getPosition;
    setPosition(): void;
    start(): void;
    next(): void;
    pre(): void;
    destroy(): void;
}
export {};
