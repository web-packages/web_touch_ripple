import { TouchRippleElement } from "./index";
import { Point } from "./point";
import { PointerPosition, TouchRippleEffectStatusListener } from "./type";

export enum TouchRippleEffectStatus {
    NONE,
    ACCEPTED,
    REJECTED,
}

export class TouchRippleEffect {
    private _status = TouchRippleEffectStatus.NONE;
    private _statusListeners: TouchRippleEffectStatusListener[] = [];

    constructor(
        public position: PointerPosition,
        public callback: Function,
        public isRejectable: boolean,
    ) { }

    set status(newValue: TouchRippleEffectStatus) {
        if (this._status != newValue) {
            this._statusListeners.forEach(l => l(this._status = newValue));
        }
    }

    set statusListener(callback: TouchRippleEffectStatusListener) {
        this._statusListeners.push(callback);
    }
    
    createElement(
        parent: TouchRippleElement,
        target: HTMLElement,
    ) {
        const targetRact = parent.getBoundingClientRect();
        const targetX = this.position.x - targetRact.left;
        const targetY = this.position.y - targetRact.top;
        const centerX = parent.clientWidth / 2;
        const centerY = parent.clientHeight / 2;

        // Initializes setting values.
        {
            var blurRadius = parent.getPropertyByName("--ripple-blur-radius") || "10px";
            var blurRadiusValue = Number(blurRadius.replace("px", ""));
            
            var rippleColor = parent.getPropertyByName("--ripple") || "rgba(255, 255, 255, 0.2)";
            var rippleFadeInDuration  = parent.getPropertyByName("--ripple-fadein-duration")  || "0.2s";
            var rippleFadeOutDuration = parent.getPropertyByName("--ripple-fadeout-duration") || "0.3s";

            parent.getAttribute("attribute");
        }

        let rippleSize = new Point(centerX, centerY).distance(0, 0) * 2;
           rippleSize += new Point(centerX, centerY).distance(targetX, targetY) * 2;
           rippleSize += blurRadiusValue * 2;

        const ripple = document.createElement("div");
        ripple.classList.add("ripple");
        ripple.style.position = "absolute";
        ripple.style.left = `${targetX}px`;
        ripple.style.top = `${targetY}px`;
        ripple.style.width = `${rippleSize}px`;
        ripple.style.height = `${rippleSize}px`;
        ripple.style.pointerEvents = "none";
        ripple.style.translate = "-50% -50%";
        ripple.style.borderRadius = "50%";
        ripple.style.backgroundColor = `${rippleColor}`;
        ripple.style.animation = `ripple-fadein ${rippleFadeInDuration}`;
        ripple.style.animationFillMode = "forwards";
        ripple.style.filter = `blur(${blurRadius})`;

        // TODO: Rejectable 상태를 고려하여 적절하게 이벤트를 관리해야 함.
        ripple.onanimationend = () => {
            ripple.style.animation = `ripple-fadeout ${rippleFadeOutDuration}`;
            if (this.callback != null) {
                this.callback();
            }
            ripple.onanimationend = () => target.removeChild(ripple);
        };

        return ripple;
    }
}