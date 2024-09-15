!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).TouchRipple={})}(this,(function(t){"use strict";class e{constructor(){}static get instance(){var t;return null!==(t=this._instance)&&void 0!==t?t:this._instance=new e}initialize(){const t=new CSSStyleSheet;t.insertRule("\n            touch-ripple, touch-ripple-connection {\n                /* \n                * Defines the element to avoid having a separate stylesheet, thereby\n                * addressing style issues caused by touch ripple wrapping.\n                * For example, if the parent element has its own stylesheet,\n                * the size of the child element might be affected as a result.\n                */\n                display: contents;\n\n                /*\n                * Needs to remove effects that interfere with touch ripple on\n                * touch-based devices, such as in mobile environments.\n                */\n                -webkit-tap-highlight-color: transparent;\n            }\n        "),t.insertRule("\n            touch-ripple *:has(> touch-ripple-effect),\n            touch-ripple *:has(> touch-ripple-effect-hover) {\n                position: relative;\n                overflow: hidden;\n                user-select: none;\n                touch-action: manipulation;\n            }\n        "),document.adoptedStyleSheets=[...document.adoptedStyleSheets,t]}}var i,n,s;!function(t){t.DOWN="down",t.MOVE="move",t.UP="up",t.CANCEL="cancel"}(i||(i={})),function(t){t[t.ACCEPT=0]="ACCEPT",t[t.REJECT=1]="REJECT",t[t.UPDATE=2]="UPDATE"}(n||(n={}));class r{constructor(){this.listeners=[],this.isHold=!1}accept(){this.perform(n.ACCEPT),this.onAccept()}reject(){this.perform(n.REJECT),this.onReject()}hold(){this.isHold=!0,this.listeners.forEach((t=>t(n.UPDATE)))}release(){this.isHold=!1,this.listeners.forEach((t=>t(n.UPDATE)))}onAccept(){}onReject(){}dispose(){}perform(t){this.dispose(),this.listeners.forEach((e=>e(t)))}}class o extends r{constructor(){super()}createPosition(t){return{x:t.clientX,y:t.clientY}}handlePointer(t,e){const n=this.position=this.createPosition(t);if(t.button>0)return this.reject();e==i.DOWN&&this.pointerDown(n),e==i.MOVE&&this.pointerMove(n),e==i.UP&&this.pointerUp(n),e==i.CANCEL&&(this.reject(),this.pointerCancel(n))}pointerDown(t){}pointerMove(t){}pointerUp(t){}pointerCancel(t){}}class a{constructor(t){this.option=t,this.builders=[],this.recognizers=[],this.option=Object.assign({isKeepAliveLastPointerUp:!0},this.option)}registerBuilder(t){this.builders.push(t)}attach(t){this.recognizers.push(t)}detach(t){this.recognizers=this.recognizers.filter((e=>e!=t))}rejectBy(t){this.detach(t),this.checkCycle()}acceptBy(t){this.recognizers.forEach((e=>e!=t?e.reject():void 0)),this.recognizers=[]}reset(){this.builders=[],this.recognizers=[]}createRecognizer(t){const e=t();return e.listeners.push((t=>{switch(t){case n.REJECT:this.rejectBy(e);break;case n.ACCEPT:this.acceptBy(e);break;case n.UPDATE:this.checkCycle()}})),e}checkCycle(t){if(this.option.isKeepAliveLastPointerUp&&(t==i.UP||null==t)&&1==this.recognizers.length){const t=this.recognizers[0];t.isHold||t.accept()}}handlePointer(t,e){e==i.DOWN&&0==this.recognizers.length&&(this.recognizers=this.builders.map((t=>this.createRecognizer(t)))),this.recognizers.forEach((i=>i.handlePointer(t,e))),this.checkCycle(e)}}class l extends o{constructor(t,e,i,n,s,r){super(),this.onTap=t,this.onTapRejectable=e,this.onTapAccept=i,this.onTapReject=n,this.rejectableDuration=s,this.tappableDuration=r,this.timerIds=[],this.isRejectable=!1}pointerDown(t){const e=()=>{this.isRejectable=!0,this.onTapRejectable(t)};this.rejectableDuration!=1/0&&this.timerIds.push(setTimeout(e,this.rejectableDuration)),0!=this.tappableDuration&&this.timerIds.push(setTimeout(this.reject.bind(this),this.tappableDuration))}dispose(){this.timerIds.forEach((t=>clearTimeout(t))),this.timerIds=null}onAccept(){this.isRejectable?this.onTapAccept(this.position):this.onTap(this.position)}onReject(){this.isRejectable&&this.onTapReject(this.position)}toString(){return"[Object TapGestureRecognizer]"}}class h extends o{constructor(t,e){super(),this.onDoubleTap=t,this.doubleTappableDuration=e,this.tapCount=0}pointerDown(t){2==++this.tapCount?this.accept():(this.hold(),setTimeout((()=>this.reject()),this.doubleTappableDuration))}onAccept(){this.onDoubleTap(this.position)}dispose(){null!=this.timeId&&clearTimeout(this.timeId)}toString(){return"[Object DoubleTapGestureRecognizer]"}}class p extends o{constructor(t,e,i,n,s){super(),this.onLongTapStart=t,this.onLongTapEnd=e,this.onLongTap=i,this.tappableDuration=n,this.longtappableDuration=s,this.isStartCalled=!1}pointerDown(t){this.isHold=!0,this.timerId=setTimeout((()=>{this.isStartCalled=!0,this.onLongTapStart(t),this.timerId=setTimeout((()=>{this.accept(),this.onLongTap()}),this.longtappableDuration)}),this.tappableDuration)}pointerUp(t){this.reject()}onReject(){this.isStartCalled&&this.onLongTapEnd()}dispose(){null!=this.timerId&&clearTimeout(this.timerId)}toString(){return"[Object LongTapGestureRecognizer]"}}Object.defineProperty(Element.prototype,"intrinsicSize",{get:function(){return c.intrinsicSizeOf(this)}}),Object.defineProperty(Element.prototype,"intrinsicWidth",{get:function(){return c.intrinsicSizeOf(this).width}}),Object.defineProperty(Element.prototype,"intrinsicHeight",{get:function(){return c.intrinsicSizeOf(this).height}}),Object.defineProperty(Element.prototype,"reflow",{get:function(){return c.reflow(this)}});class c{static reflow(t){t.getBoundingClientRect()}static intrinsicSizeOf(t,e){for(;t;){const i=null!=e?e:getComputedStyle(t),n=parseFloat(i.width),s=parseFloat(i.height),r=parseFloat(i.paddingLeft),o=parseFloat(i.paddingRight),a=parseFloat(i.paddingTop),l=parseFloat(i.paddingBottom),h=parseFloat(i.borderLeftWidth),p=parseFloat(i.borderRightWidth),c=parseFloat(i.borderTopWidth),u=parseFloat(i.borderBottomWidth),d=parseFloat(i.marginLeft),f=parseFloat(i.marginRight),g=parseFloat(i.marginTop),m=parseFloat(i.marginBottom),E=i.boxSizing,y=i.position;if("contents"===i.display){let e=Array.from(t.children).filter((t=>"STYLE"!==t.tagName&&"SCRIPT"!==t.tagName));if(1!==e.length)throw new Error("An element with a display property of 'contents' must have only one child to define its intrinsic size.");t=e[0];continue}let b=n,v=s;return"content-box"===E&&(b+=r+o+h+p,v+=a+l+c+u),"absolute"!==y&&"fixed"!==y&&(b+=d+f,v+=g+m),{width:b,height:v}}}}Object.defineProperty(Element.prototype,"intrinsicRect",{get:function(){return u.intrinsicOf(this)}});class u{static intrinsicOf(t,e){const i=null!=e?e:getComputedStyle(t),n=c.intrinsicSizeOf(t,i),s=t.getBoundingClientRect();return new DOMRect(s.x,s.y,n.width,n.height)}}class d{constructor(t,e){this.x=t,this.y=e}distance(t,e){let i=this.x-t,n=this.y-e;return Math.sqrt(i*i+n*n)}}!function(t){t[t.NONE=0]="NONE",t[t.ACCEPTED=1]="ACCEPTED",t[t.REJECTED=2]="REJECTED",t[t.DISPOSED=3]="DISPOSED"}(s||(s={}));class f extends HTMLElement{constructor(t,e,i,n,s,r,o){var a;super(),this.position=t,this.callback=e,this.isRejectable=i,this.isWait=n,this.option=s,this.parent=r,this.target=o,this._statusListeners=[],null!==(a=this.target)&&void 0!==a||(this.target=this.parent.firstElementChild)}get status(){return this._status}set status(t){this._status!=t&&(this._status=t,this._statusListeners.forEach((e=>e(t))))}set statusListener(t){this._statusListeners.push(t)}notify(){this.callback&&this.callback()}fadeout(t=this.parent){null!=t&&(this.style.transitionProperty="opacity",this.style.transitionDuration=this.option.fadeOutDuration,this.style.transitionTimingFunction=this.option.fadeOutCurve,this.style.opacity="0",requestAnimationFrame((()=>{this.ontransitionend=()=>this.dispose()})))}cancel(t=this.parent){null!=t&&(this.style.transitionProperty="opacity",this.style.transitionDuration="var(--ripple-cancel-duration, 0s)",this.style.transitionTimingFunction="var(--ripple-cancel-curve)",this.style.opacity="0",requestAnimationFrame((()=>{this.ontransitionend=()=>this.dispose()})))}connectedCallback(){const t=this.target,e=this.parent,i=getComputedStyle(t),n=u.intrinsicOf(t,i),r={width:n.width,height:n.height},o=parseFloat(i.marginLeft),a=parseFloat(i.marginTop),l=Math.max(r.width,r.height),h=this.position.x-n.left-o,p=this.position.y-n.top-a,c=r.width/2,f=r.height/2;let g=0,m=0;const E=()=>{++m==g&&(this.fadeout(t),this.isWait&&this.notify(),this.ontransitionend=null)};var y=e.getPropertyByName("--ripple-blur-radius")||"6%";if(y.endsWith("%")){const t=Number(y.replace("%",""))/100;var b=Number(l*t)}else b=Number(y.replace("px",""));let v=2*new d(c,f).distance(0,0);v+=2*new d(c,f).distance(h,p),v+=2*b,this.style.position="absolute",this.style.left=`${h}px`,this.style.top=`${p}px`,this.style.width=`${v}px`,this.style.height=`${v}px`,this.style.pointerEvents="none",this.style.translate="-50% -50%",this.style.borderRadius="50%",this.style.backgroundColor="var(--ripple, rgba(0, 0, 0, 0.2))",this.style.filter=`blur(${b}px)`,this.style.opacity="0",this.style.transform="scale(var(--ripple-lower-scale, 0.3))",this.style.transformOrigin="center",requestAnimationFrame((()=>{this.style.transitionProperty="opacity, transform",this.style.transitionDuration=`${this.option.fadeInDuration}, ${this.option.spreadDuration}`,this.style.transitionTimingFunction=`${this.option.fadeInCurve}, ${this.option.spreadCurve}`,this.style.opacity="1",this.style.transform="scale(var(--ripple-upper-scale, 1))"})),this.addEventListener("transitionstart",(()=>{g+=1}));let C=!1;this.addEventListener("transitionend",(()=>{C=!0})),this.isRejectable?this.statusListener=e=>{if(e==s.REJECTED&&this.fadeout(t),e==s.ACCEPTED){if(C)return this.notify(),this.fadeout(t);0==this.isWait&&this.notify(),this.ontransitionend=E}}:(0==this.isWait&&this.notify(),this.ontransitionend=E)}dispose(){this.status=s.DISPOSED,this._statusListeners=null,this.remove()}}customElements.define("touch-ripple-effect",f);class g extends HTMLElement{static ancestorOf(t){let e=t.parentElement;for(;e;){if(e instanceof g)return e;e=e.parentElement}}}customElements.define("touch-ripple-connection",g);class m extends HTMLElement{constructor(){super(...arguments),this.arena=new a({isKeepAliveLastPointerUp:!0})}set ontap(t){this._ontap=t,this.initBuiler()}set ondoubletap(t){this._ondoubletap=t,this.initBuiler()}set onlongtap(t){this._onlongtap=t,this.initBuiler()}get child(){var t;const e=this.getAttribute("selector");return e&&null!==(t=this.querySelector(e))&&void 0!==t?t:this.firstElementChild}getPropertyByName(t,e=this){return getComputedStyle(e).getPropertyValue(t)}getDurationByName(t,e=this){const i=this.getPropertyByName(t,e);return""==i||"none"==i?null:i.endsWith("ms")?Number(i.replace("ms","")):1e3*Number(i.replace("s",""))}getBooleanByName(t,e=this){const i=this.getPropertyByName(t,e);if(""!=i)return"1"==i}initBuiler(){var t,e,i,n;this.arena.reset();const r=null!==(t=this.getDurationByName("--ripple-tap-preview-duration"))&&void 0!==t?t:150;if(null!=this._ontap){const t=null!==(e=this.getDurationByName("--ripple-tappable-duration"))&&void 0!==e?e:0,i=null!=this._onlongtap?0:r;this.arena.registerBuilder((()=>{let e=null;return new l((t=>e=this.createEffect(t,this._ontap,!1)),(t=>e=this.createEffect(t,this._ontap,!0)),(()=>e.status=s.ACCEPTED),(()=>e.status=s.REJECTED),i,t)}))}if(null!=this._ondoubletap){const t=null!==(i=this.getDurationByName("--ripple-double-tappable-duration"))&&void 0!==i?i:300;this.arena.registerBuilder((()=>new h((t=>this.createEffect(t,this._ondoubletap,!1)),t)))}if(null!=this._onlongtap){const t=null!==(n=this.getDurationByName("--ripple-long-tappable-duration"))&&void 0!==n?n:1e3;this.arena.registerBuilder((()=>{let e=null;return new p((t=>e=this.createEffect(t,this._onlongtap,!0,{spreadDuration:"var(--ripple-long-tappable-duration, 1s)",fadeInDuration:"var(--ripple-long-tappable-duration, 1s)",spreadCurve:"var(--ripple-long-tappable-curve, linear(0, 1))",fadeInCurve:"var(--ripple-long-tappable-curve, linear(0, 1))"})),(()=>e.status=s.REJECTED),(()=>e.status=s.ACCEPTED),r,t)}))}}initPointerEvent(t){var e;const n=null===(e=this.getBooleanByName("--ripple-use-hover"))||void 0===e||e;t.onpointerdown=t=>this.arena.handlePointer(t,i.DOWN),t.onpointermove=t=>this.arena.handlePointer(t,i.MOVE),t.onpointerup=t=>this.arena.handlePointer(t,i.UP),t.onpointercancel=t=>this.arena.handlePointer(t,i.CANCEL),t.onpointerleave=t=>this.arena.handlePointer(t,i.CANCEL),t.onmouseleave=t=>this.arena.handlePointer(t,i.CANCEL),!("ontouchstart"in window)&&n&&(t.onmouseenter=()=>this.onHoverStart(),t.onmouseleave=()=>this.onHoverEnd())}connectedCallback(){requestAnimationFrame((()=>{let t=this.child;if(null==t)throw"This element must be exists child element.";let e=g.ancestorOf(this);e?this.initPointerEvent(e):this.initPointerEvent(t)}))}createHoverElement(){return document.createElement("touch-ripple-effect-hover")}onHoverStart(){const t=this.child;null==this.hoverEffectElement&&t.appendChild(this.hoverEffectElement=this.createHoverElement()),this.hoverEffectElement.ontransitionend=null,this.hoverEffectElement.getBoundingClientRect(),this.hoverEffectElement.style.opacity="1"}onHoverEnd(){if(this.hoverEffectElement){const t=this.hoverEffectElement;t.style.opacity="0",t.ontransitionend=()=>{this.child.removeChild(t),this.hoverEffectElement=null}}}createEffect(t,e,i,n){var s,r;const o=null!==(s=this.getPropertyByName("--ripple-overlap-behavior"))&&void 0!==s?s:"overlappable";if('"cancel"'==o)null===(r=this.activeEffect)||void 0===r||r.cancel(this.child);else if('"ignoring"'==o&&null!=this.activeEffect)return;const a=Object.assign({spreadDuration:"var(--ripple-spread-duration, 0.3s)",spreadCurve:"var(--ripple-spread-curve, cubic-bezier(.2,.3,.4,1))",fadeInDuration:"var(--ripple-fadein-duration, 0.15s)",fadeInCurve:"var(--ripple-fadein-curve)",fadeOutDuration:"var(--ripple-fadeout-duration, 0.3s)",fadeOutCurve:"var(--ripple-fadeout-curve, cubic-bezier(.15,.5,.5,1))"},n),l=this.hasAttribute("wait"),h=new f(t,e,i,l,a,this,this.child);return this.child.appendChild(h),h}static get observedAttributes(){return["ontap","ondoubletap","onlongtap"]}attributeChangedCallback(t,e,i){if(null!=i){const e=new Function(i);"ontap"==t&&(this.ontap=e),"ondoubletap"==t&&(this.ondoubletap=e),"onlongtap"==t&&(this.onlongtap=e)}}}customElements.define("touch-ripple",m);class E extends HTMLElement{connectedCallback(){this.style.position="absolute",this.style.top="0px",this.style.left="0px",this.style.width="100%",this.style.height="100%",this.style.backgroundColor="var(--ripple-hover, rgba(0, 0, 0, 0.1))",this.style.opacity="0",this.style.transitionProperty="opacity",this.style.transitionDuration="var(--ripple-hover-duration, 0.25s)",this.style.pointerEvents="none"}}customElements.define("touch-ripple-effect-hover",E),addEventListener("DOMContentLoaded",(()=>e.instance.initialize())),t.GestureArena=a,t.GestureRecognizer=r,t.TouchRippleBinding=e,t.TouchRippleConnectionElement=g,t.TouchRippleEffectElement=f,t.TouchRippleEffectHoverElement=E,t.TouchRippleElement=m}));
//# sourceMappingURL=index.umd.js.map
