!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).TouchRipple={})}(this,(function(t){"use strict";class e{constructor(){}static get instance(){var t;return null!==(t=this._instance)&&void 0!==t?t:this._instance=new e}initialize(){const t=new CSSStyleSheet;t.insertRule("\n            touch-ripple, touch-ripple-connection {\n                /* \n                * Defines the element to avoid having a separate stylesheet, thereby\n                * addressing style issues caused by touch ripple wrapping.\n                * For example, if the parent element has its own stylesheet,\n                * the size of the child element might be affected as a result.\n                */\n                display: contents;\n\n                /*\n                * Needs to remove effects that interfere with touch ripple on\n                * touch-based devices, such as in mobile environments.\n                */\n                -webkit-tap-highlight-color: transparent;\n            }\n        "),t.insertRule("\n            touch-ripple *:has(> touch-ripple-effect),\n            touch-ripple *:has(> touch-ripple-effect-hover) {\n                position: relative;\n                overflow: hidden;\n                user-select: none;\n                touch-action: manipulation;\n            }\n        "),document.adoptedStyleSheets=[...document.adoptedStyleSheets,t]}}var i,s,n;!function(t){t.DOWN="down",t.MOVE="move",t.UP="up",t.CANCEL="cancel"}(i||(i={})),function(t){t[t.ACCEPT=0]="ACCEPT",t[t.REJECT=1]="REJECT",t[t.UPDATE=2]="UPDATE"}(s||(s={}));class r{constructor(){this.listeners=[],this.isHold=!1}accept(){this.perform(s.ACCEPT),this.onAccept()}reject(){this.perform(s.REJECT),this.onReject()}hold(){this.isHold=!0,this.listeners.forEach((t=>t(s.UPDATE)))}release(){this.isHold=!1,this.listeners.forEach((t=>t(s.UPDATE)))}onAccept(){}onReject(){}dispose(){}perform(t){this.dispose(),this.listeners.forEach((e=>e(t)))}}class o extends r{constructor(){super()}createPosition(t){return{x:t.clientX,y:t.clientY}}handlePointer(t,e){const s=this.position=this.createPosition(t);if(t.button>0)return this.reject();e==i.DOWN&&this.pointerDown(s),e==i.MOVE&&this.pointerMove(s),e==i.UP&&this.pointerUp(s),e==i.CANCEL&&(this.reject(),this.pointerCancel(s))}pointerDown(t){}pointerMove(t){}pointerUp(t){}pointerCancel(t){}}class a{constructor(t){this.option=t,this.builders=[],this.recognizers=[],this.option=Object.assign({isKeepAliveLastPointerUp:!0},this.option)}registerBuilder(t){this.builders.push(t)}attach(t){this.recognizers.push(t)}detach(t){this.recognizers=this.recognizers.filter((e=>e!=t))}rejectBy(t){this.detach(t),this.checkCycle()}acceptBy(t){this.recognizers.forEach((e=>e!=t?e.reject():void 0)),this.recognizers=[]}reset(){this.builders=[],this.recognizers=[]}createRecognizer(t){const e=t();return e.listeners.push((t=>{switch(t){case s.REJECT:this.rejectBy(e);break;case s.ACCEPT:this.acceptBy(e);break;case s.UPDATE:this.checkCycle()}})),e}checkCycle(t){if(this.option.isKeepAliveLastPointerUp&&(t==i.UP||!t)&&1==this.recognizers.length){const t=this.recognizers[0];t.isHold||t.accept()}}handlePointer(t,e){e==i.DOWN&&0==this.recognizers.length&&(this.recognizers=this.builders.map((t=>this.createRecognizer(t)))),this.recognizers.forEach((i=>i.handlePointer(t,e))),this.checkCycle(e)}}class l extends o{constructor(t,e,i,s,n,r){super(),this.onTap=t,this.onTapRejectable=e,this.onTapAccept=i,this.onTapReject=s,this.rejectableDuration=n,this.tappableDuration=r,this.timerIds=[],this.isRejectable=!1}pointerDown(t){const e=()=>{this.isRejectable=!0,this.onTapRejectable(t)};this.hold(),this.rejectableDuration!=1/0&&this.timerIds.push(setTimeout(e,this.rejectableDuration)),0!=this.tappableDuration&&this.timerIds.push(setTimeout(this.reject.bind(this),this.tappableDuration))}pointerUp(t){this.release()}dispose(){this.timerIds.forEach((t=>clearTimeout(t))),this.timerIds=null}onAccept(){this.isRejectable?this.onTapAccept(this.position):this.onTap(this.position)}onReject(){this.isRejectable&&this.onTapReject(this.position)}toString(){return"[Object TapGestureRecognizer]"}}class h extends o{constructor(t,e){super(),this.onDoubleTap=t,this.doubleTappableDuration=e,this.tapCount=0}pointerDown(t){2==++this.tapCount?this.accept():(this.hold(),setTimeout((()=>this.reject()),this.doubleTappableDuration))}onAccept(){this.onDoubleTap(this.position)}dispose(){null!=this.timeId&&clearTimeout(this.timeId)}toString(){return"[Object DoubleTapGestureRecognizer]"}}class p extends o{constructor(t,e,i,s,n){super(),this.onLongTapStart=t,this.onLongTapEnd=e,this.onLongTap=i,this.tappableDuration=s,this.longtappableDuration=n,this.isStartCalled=!1}pointerDown(t){this.isHold=!0,this.timerId=setTimeout((()=>{this.isStartCalled=!0,this.onLongTapStart(t),this.timerId=setTimeout((()=>{this.accept(),this.onLongTap()}),this.longtappableDuration)}),this.tappableDuration)}pointerUp(t){this.reject()}onReject(){this.isStartCalled&&this.onLongTapEnd()}dispose(){null!=this.timerId&&clearTimeout(this.timerId)}toString(){return"[Object LongTapGestureRecognizer]"}}class c{static reflow(t){t.getBoundingClientRect()}static intrinsicSizeOf(t,e){for(;t;){const i=null!=e?e:getComputedStyle(t),s=parseFloat(i.width),n=parseFloat(i.height),r=parseFloat(i.paddingLeft),o=parseFloat(i.paddingRight),a=parseFloat(i.paddingTop),l=parseFloat(i.paddingBottom),h=parseFloat(i.borderLeftWidth),p=parseFloat(i.borderRightWidth),c=parseFloat(i.borderTopWidth),u=parseFloat(i.borderBottomWidth),d=parseFloat(i.marginLeft),f=parseFloat(i.marginRight),m=parseFloat(i.marginTop),g=parseFloat(i.marginBottom),y=i.boxSizing,E=i.position;if("contents"===i.display){let e=Array.from(t.children).filter((t=>"STYLE"!==t.tagName&&"SCRIPT"!==t.tagName));if(1!==e.length)throw new Error("An element with a display property of 'contents' must have only one child to define its intrinsic size.");t=e[0];continue}let b=s,v=n;return"content-box"===y&&(b+=r+o+h+p,v+=a+l+c+u),"absolute"!==E&&"fixed"!==E&&(b+=d+f,v+=m+g),{width:b,height:v}}}}null==Object.getOwnPropertyDescriptor(Element.prototype,"intrinsicSize")&&Object.defineProperty(Element.prototype,"intrinsicSize",{get:function(){return c.intrinsicSizeOf(this)}}),null==Object.getOwnPropertyDescriptor(Element.prototype,"intrinsicWidth")&&Object.defineProperty(Element.prototype,"intrinsicWidth",{get:function(){return c.intrinsicSizeOf(this).width}}),null==Object.getOwnPropertyDescriptor(Element.prototype,"intrinsicHeight")&&Object.defineProperty(Element.prototype,"intrinsicHeight",{get:function(){return c.intrinsicSizeOf(this).width}}),null==Object.getOwnPropertyDescriptor(Element.prototype,"reflow")&&Object.defineProperty(Element.prototype,"reflow",{get:function(){return c.reflow(this)}});class u{static intrinsicOf(t,e){const i=null!=e?e:getComputedStyle(t),s=c.intrinsicSizeOf(t,i),n=t.getBoundingClientRect();return new DOMRect(n.x,n.y,s.width,s.height)}}null==Object.getOwnPropertyDescriptor(Element.prototype,"intrinsicRect")&&Object.defineProperty(Element.prototype,"intrinsicRect",{get:function(){return u.intrinsicOf(this)}});class d{constructor(t,e){this.x=t,this.y=e}distance(t,e){let i=this.x-t,s=this.y-e;return Math.sqrt(i*i+s*s)}}!function(t){t[t.NONE=0]="NONE",t[t.ACCEPTED=1]="ACCEPTED",t[t.REJECTED=2]="REJECTED",t[t.DISPOSED=3]="DISPOSED"}(n||(n={}));class f extends HTMLElement{constructor(t,e,i,s,n,r,o){var a;super(),this.position=t,this.callback=e,this.isRejectable=i,this.isWait=s,this.option=n,this.parent=r,this.target=o,this._statusListeners=[],this._markNeedsLayout=!1,null!==(a=this.target)&&void 0!==a||(this.target=this.parent.firstElementChild)}get status(){return this._status}set status(t){this._status!=t&&(this._status=t,this._statusListeners.forEach((e=>e(t))))}set statusListener(t){this._statusListeners.push(t)}notify(){this.callback&&this.callback()}fadeout(t=this.parent){null!=t&&(this.style.transitionProperty="opacity",this.style.transitionDuration=this.option.fadeOutDuration,this.style.transitionTimingFunction=this.option.fadeOutCurve,this.style.opacity="0",requestAnimationFrame((()=>{this.ontransitionend=()=>this.dispose()})))}cancel(t=this.parent){null!=t&&(this.style.transitionProperty="opacity",this.style.transitionDuration="var(--ripple-cancel-duration, 0s)",this.style.transitionTimingFunction="var(--ripple-cancel-curve)",this.style.opacity="0",requestAnimationFrame((()=>{this.ontransitionend=()=>this.dispose()})))}performLayout(){const t=this.target,e=this.parent,i=getComputedStyle(t),s=u.intrinsicOf(t,i),n={width:s.width,height:s.height},r=parseFloat(i.marginLeft),o=parseFloat(i.marginTop),a=Math.max(n.width,n.height),l=this.position.x-s.left-r,h=this.position.y-s.top-o,p=n.width/2,c=n.height/2,f=function(){var t=e.getPropertyByName("--ripple-blur-radius")||"6%";if(t.endsWith("%")){const e=Number(t.replace("%",""))/100;return Number(a*e)}return Number(t.replace("px",""))}(),m=function(t){let e=2*new d(p,c).distance(0,0);return e+=2*new d(p,c).distance(l,h),e+=2*t,e}(f);this.style.position="absolute",this.style.left=`${l}px`,this.style.top=`${h}px`,this.style.width=`${m}px`,this.style.height=`${m}px`,this.style.pointerEvents="none",this.style.translate="-50% -50%",this.style.borderRadius="50%",this.style.backgroundColor="var(--ripple, rgba(0, 0, 0, 0.2))",this.style.willChange="transform",this.style.filter=`blur(${f}px)`}disconnectedCallback(){this._resizeObserver.disconnect(),this._resizeObserver=null}connectedCallback(){const t=this.target;let e=0,i=0;const s=()=>{++i==e&&(this.fadeout(t),this.isWait&&this.notify(),this.ontransitionend=null)};this.performLayout(),requestAnimationFrame((()=>{this._resizeObserver=new ResizeObserver((()=>{0!=this._markNeedsLayout?this.performLayout():this._markNeedsLayout=!0})),this._resizeObserver.observe(t)})),this.style.opacity="0",this.style.transform="scale(var(--ripple-lower-scale, 0.3))",this.style.transformOrigin="center",c.reflow(t),this.style.transitionProperty="opacity, transform",this.style.transitionDuration=`${this.option.fadeInDuration}, ${this.option.spreadDuration}`,this.style.transitionTimingFunction=`${this.option.fadeInCurve}, ${this.option.spreadCurve}`,this.style.opacity="1",this.style.transform="scale(var(--ripple-upper-scale, 1))",this.addEventListener("transitionstart",(()=>{e+=1}));let r=!1;this.addEventListener("transitionend",(()=>{r=!0})),this.isRejectable?this.statusListener=e=>{if(e==n.REJECTED&&this.fadeout(t),e==n.ACCEPTED){if(r)return this.notify(),this.fadeout(t);0==this.isWait&&this.notify(),this.ontransitionend=s}}:(0==this.isWait&&this.notify(),this.ontransitionend=s)}dispose(){this.status=n.DISPOSED,this._statusListeners=null,this.remove()}}customElements.define("touch-ripple-effect",f);class m extends HTMLElement{static ancestorOf(t){let e=t.parentElement;for(;e;){if(e instanceof m)return e;e=e.parentElement}}}customElements.define("touch-ripple-connection",m);class g extends HTMLElement{constructor(){super(...arguments),this.arena=new a({isKeepAliveLastPointerUp:!0})}set ontap(t){this._ontap=t,this.initBuiler()}set ondoubletap(t){this._ondoubletap=t,this.initBuiler()}set onlongtap(t){this._onlongtap=t,this.initBuiler()}get child(){var t;const e=this.getAttribute("selector");return e&&null!==(t=this.querySelector(e))&&void 0!==t?t:this.firstElementChild}getPropertyByName(t,e=this){return getComputedStyle(e).getPropertyValue(t)}getDurationByName(t,e=this){const i=this.getPropertyByName(t,e);return""==i||"none"==i?null:i.endsWith("ms")?Number(i.replace("ms","")):1e3*Number(i.replace("s",""))}getBooleanByName(t,e=this){const i=this.getPropertyByName(t,e);if(""!=i)return"1"==i}initBuiler(){var t,e,i,s;this.arena.reset();const r=null!==(t=this.getDurationByName("--ripple-tap-preview-duration"))&&void 0!==t?t:150;if(null!=this._ontap){const t=null!==(e=this.getDurationByName("--ripple-tappable-duration"))&&void 0!==e?e:0,i=this._onlongtap||this._ondoubletap?1/0:r;this.arena.registerBuilder((()=>{let e=null;return new l((t=>e=this.createEffect(t,this._ontap,!1)),(t=>e=this.createEffect(t,this._ontap,!0)),(()=>e.status=n.ACCEPTED),(()=>e.status=n.REJECTED),i,t)}))}if(null!=this._ondoubletap){const t=null!==(i=this.getDurationByName("--ripple-double-tappable-duration"))&&void 0!==i?i:300;this.arena.registerBuilder((()=>new h((t=>this.createEffect(t,this._ondoubletap,!1)),t)))}if(null!=this._onlongtap){const t=null!==(s=this.getDurationByName("--ripple-long-tappable-duration"))&&void 0!==s?s:1e3;this.arena.registerBuilder((()=>{let e=null;return new p((t=>e=this.createEffect(t,this._onlongtap,!0,{spreadDuration:"var(--ripple-long-tappable-duration, 1s)",fadeInDuration:"var(--ripple-long-tappable-duration, 1s)",spreadCurve:"var(--ripple-long-tappable-curve, linear(0, 1))",fadeInCurve:"var(--ripple-long-tappable-curve, linear(0, 1))"})),(()=>e.status=n.REJECTED),(()=>e.status=n.ACCEPTED),r,t)}))}}initPointerEvent(t){var e;const s=null===(e=this.getBooleanByName("--ripple-use-hover"))||void 0===e||e;t.onpointerdown=t=>this.arena.handlePointer(t,i.DOWN),t.onpointermove=t=>this.arena.handlePointer(t,i.MOVE),t.onpointerup=t=>this.arena.handlePointer(t,i.UP),t.onpointercancel=t=>this.arena.handlePointer(t,i.CANCEL),t.onpointerleave=t=>this.arena.handlePointer(t,i.CANCEL),t.onmouseleave=t=>this.arena.handlePointer(t,i.CANCEL),!("ontouchstart"in window)&&s&&(t.onmouseenter=()=>this.onHoverStart(),t.onmouseleave=()=>this.onHoverEnd())}connectedCallback(){requestAnimationFrame((()=>{let t=this.child;if(null==t)throw"This element must be exists child element.";let e=m.ancestorOf(this);e?this.initPointerEvent(e):this.initPointerEvent(t)}))}createHoverElement(){return document.createElement("touch-ripple-effect-hover")}onHoverStart(){const t=this.child;null==this.hoverEffectElement&&t.appendChild(this.hoverEffectElement=this.createHoverElement()),this.hoverEffectElement.ontransitionend=null,this.hoverEffectElement.getBoundingClientRect(),this.hoverEffectElement.style.opacity="1"}onHoverEnd(){if(this.hoverEffectElement){const t=this.hoverEffectElement;t.style.opacity="0",t.ontransitionend=()=>{this.child.removeChild(t),this.hoverEffectElement=null}}}createEffect(t,e,i,s){var n,r;const o=null!==(n=this.getPropertyByName("--ripple-overlap-behavior"))&&void 0!==n?n:"overlappable";if('"cancel"'==o)null===(r=this.activeEffect)||void 0===r||r.cancel(this.child);else if('"ignoring"'==o&&null!=this.activeEffect)return;const a=Object.assign({spreadDuration:"var(--ripple-spread-duration, 0.3s)",spreadCurve:"var(--ripple-spread-curve, cubic-bezier(.2,.3,.4,1))",fadeInDuration:"var(--ripple-fadein-duration, 0.15s)",fadeInCurve:"var(--ripple-fadein-curve)",fadeOutDuration:"var(--ripple-fadeout-duration, 0.3s)",fadeOutCurve:"var(--ripple-fadeout-curve, cubic-bezier(.15,.5,.5,1))"},s),l=this.hasAttribute("wait"),h=new f(t,e,i,l,a,this,this.child);return this.child.appendChild(h),h}static get observedAttributes(){return["ontap","ondoubletap","onlongtap"]}attributeChangedCallback(t,e,i){if(null!=i){const e=new Function(i);"ontap"==t&&(this.ontap=e),"ondoubletap"==t&&(this.ondoubletap=e),"onlongtap"==t&&(this.onlongtap=e)}}}customElements.define("touch-ripple",g);class y extends HTMLElement{connectedCallback(){this.style.position="absolute",this.style.top="0px",this.style.left="0px",this.style.width="100%",this.style.height="100%",this.style.backgroundColor="var(--ripple-hover, rgba(0, 0, 0, 0.1))",this.style.opacity="0",this.style.transitionProperty="opacity",this.style.transitionDuration="var(--ripple-hover-duration, 0.25s)",this.style.pointerEvents="none"}}customElements.define("touch-ripple-effect-hover",y),addEventListener("DOMContentLoaded",(()=>e.instance.initialize())),t.GestureArena=a,t.GestureRecognizer=r,t.TouchRippleBinding=e,t.TouchRippleConnectionElement=m,t.TouchRippleEffectElement=f,t.TouchRippleEffectHoverElement=y,t.TouchRippleElement=g}));
//# sourceMappingURL=index.umd.js.map
