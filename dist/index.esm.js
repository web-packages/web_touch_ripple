class t{static initialize(){const t=new CSSStyleSheet;t.insertRule("\n            touch-ripple, touch-ripple-connection {\n                /* \n                * Defines the element to avoid having a separate stylesheet, thereby\n                * addressing style issues caused by touch ripple wrapping.\n                * For example, if the parent element has its own stylesheet,\n                * the size of the child element might be affected as a result.\n                */\n                display: contents;\n\n                /*\n                * Needs to remove effects that interfere with touch ripple on\n                * touch-based devices, such as in mobile environments.\n                */\n                -webkit-tap-highlight-color: transparent;\n            }\n        "),document.adoptedStyleSheets=[...document.adoptedStyleSheets,t]}}var e,i,s;!function(t){t.DOWN="down",t.MOVE="move",t.UP="up",t.CANCEL="cancel"}(e||(e={})),function(t){t[t.ACCEPT=0]="ACCEPT",t[t.REJECT=1]="REJECT",t[t.UPDATE=2]="UPDATE"}(i||(i={}));class n{constructor(){this.listeners=[],this.isHold=!1}accept(){this.perform(i.ACCEPT),this.onAccept()}reject(){this.perform(i.REJECT),this.onReject()}hold(){this.isHold=!0,this.listeners.forEach((t=>t(i.UPDATE)))}release(){this.isHold=!1,this.listeners.forEach((t=>t(i.UPDATE)))}onAccept(){}onReject(){}dispose(){}perform(t){this.dispose(),this.listeners.forEach((e=>e(t)))}}class r extends n{constructor(){super()}createPosition(t){return{x:t.clientX,y:t.clientY}}handlePointer(t,i){const s=this.position=this.createPosition(t);if(t.button>0)return this.reject();i==e.DOWN&&this.pointerDown(s),i==e.MOVE&&this.pointerMove(s),i==e.UP&&this.pointerUp(s),i==e.CANCEL&&(this.reject(),this.pointerCancel(s))}pointerDown(t){}pointerMove(t){}pointerUp(t){}pointerCancel(t){}}class o{constructor(t){this.option=t,this.builders=[],this.recognizers=[],this.option=Object.assign({isKeepAliveLastPointerUp:!0},this.option)}registerBuilder(t){this.builders.push(t)}attach(t){this.recognizers.push(t)}detach(t){this.recognizers=this.recognizers.filter((e=>e!=t))}rejectBy(t){this.detach(t),this.checkCycle()}acceptBy(t){this.recognizers.forEach((e=>e!=t?e.reject():void 0)),this.recognizers=[]}reset(){this.builders=[],this.recognizers=[]}createRecognizer(t){const e=t();return e.listeners.push((t=>{switch(t){case i.REJECT:this.rejectBy(e);break;case i.ACCEPT:this.acceptBy(e);break;case i.UPDATE:this.checkCycle()}})),e}checkCycle(t){if(this.option.isKeepAliveLastPointerUp&&(t==e.UP||null==t)&&1==this.recognizers.length){const t=this.recognizers[0];t.isHold||t.accept()}}handlePointer(t,i){i==e.DOWN&&0==this.recognizers.length&&(this.recognizers=this.builders.map((t=>this.createRecognizer(t)))),this.recognizers.forEach((e=>e.handlePointer(t,i))),this.checkCycle(i)}}class a extends r{constructor(t,e,i,s,n,r){super(),this.onTap=t,this.onTapRejectable=e,this.onTapAccept=i,this.onTapReject=s,this.rejectableDuration=n,this.tappableDuration=r,this.timerIds=[],this.isRejectable=!1}pointerDown(t){const e=()=>{this.isRejectable=!0,this.onTapRejectable(t)};this.rejectableDuration!=1/0&&this.timerIds.push(setTimeout(e,this.rejectableDuration)),0!=this.tappableDuration&&this.timerIds.push(setTimeout(this.reject.bind(this),this.tappableDuration))}dispose(){this.timerIds.forEach((t=>clearTimeout(t))),this.timerIds=null}onAccept(){this.isRejectable?this.onTapAccept(this.position):this.onTap(this.position)}onReject(){this.isRejectable&&this.onTapReject(this.position)}toString(){return"[Object TapGestureRecognizer]"}}class l extends r{constructor(t,e){super(),this.onDoubleTap=t,this.doubleTappableDuration=e,this.tapCount=0}pointerDown(t){2==++this.tapCount?this.accept():(this.hold(),setTimeout((()=>this.reject()),this.doubleTappableDuration))}onAccept(){this.onDoubleTap(this.position)}dispose(){null!=this.timeId&&clearTimeout(this.timeId)}toString(){return"[Object DoubleTapGestureRecognizer]"}}class h extends r{constructor(t,e,i,s,n){super(),this.onLongTapStart=t,this.onLongTapEnd=e,this.onLongTap=i,this.tappableDuration=s,this.longtappableDuration=n,this.isStartCalled=!1}pointerDown(t){this.isHold=!0,this.timerId=setTimeout((()=>{this.isStartCalled=!0,this.onLongTapStart(t),this.timerId=setTimeout((()=>{this.accept(),this.onLongTap()}),this.longtappableDuration)}),this.tappableDuration)}pointerUp(t){this.reject()}onReject(){this.isStartCalled&&this.onLongTapEnd()}dispose(){null!=this.timerId&&clearTimeout(this.timerId)}toString(){return"[Object LongTapGestureRecognizer]"}}class p{constructor(t,e){this.x=t,this.y=e}distance(t,e){let i=this.x-t,s=this.y-e;return Math.sqrt(i*i+s*s)}}class c{static sizeOf(t){const e=parseFloat(t.width),i=parseFloat(t.height);return{width:e+parseFloat(t.paddingLeft)+parseFloat(t.paddingRight),height:i+parseFloat(t.paddingTop)+parseFloat(t.paddingBottom)}}}!function(t){t[t.NONE=0]="NONE",t[t.ACCEPTED=1]="ACCEPTED",t[t.REJECTED=2]="REJECTED",t[t.DISPOSED=3]="DISPOSED"}(s||(s={}));class u extends HTMLElement{constructor(t,e,i,s,n,r,o){var a;super(),this.position=t,this.callback=e,this.isRejectable=i,this.isWait=s,this.option=n,this.parent=r,this.target=o,this._statusListeners=[],null!==(a=this.target)&&void 0!==a||(this.target=this.parent.firstElementChild)}get status(){return this._status}set status(t){this._status!=t&&(this._status=t,this._statusListeners.forEach((e=>e(t))))}set statusListener(t){this._statusListeners.push(t)}notify(){this.callback&&this.callback()}fadeout(t,e=this._ripple){null!=t&&null!=e&&(e.style.transitionProperty="opacity",e.style.transitionDuration=this.option.fadeOutDuration,e.style.transitionTimingFunction=this.option.fadeOutCurve,e.style.opacity="0",requestAnimationFrame((()=>{e.ontransitionend=()=>t.removeChild(e)})),this.dispose())}cancel(t,e=this._ripple){null!=t&&null!=e&&(e.style.transitionProperty="opacity",e.style.transitionDuration="var(--ripple-cancel-duration, 0s)",e.style.transitionTimingFunction="var(--ripple-cancel-curve)",e.style.opacity="0",requestAnimationFrame((()=>{e.ontransitionend=()=>t.removeChild(e)})),this.dispose())}createElement(t,e){const i=e.getBoundingClientRect(),n=getComputedStyle(e),r=c.sizeOf(n),o=parseFloat(n.marginLeft),a=parseFloat(n.marginTop),l=Math.max(r.width,r.height),h=this.position.x-i.left-o,u=this.position.y-i.top-a,d=r.width/2,f=r.height/2;let m=0,E=0;const g=()=>{++E==m&&(this.fadeout(e),this.isWait&&this.notify(),C.ontransitionend=null)};var v=t.getPropertyByName("--ripple-blur-radius")||"6%";if(v.endsWith("%")){const t=Number(v.replace("%",""))/100;var y=Number(l*t)}else y=Number(v.replace("px",""));let b=2*new p(d,f).distance(0,0);b+=2*new p(d,f).distance(h,u),b+=2*y,this._ripple=document.createElement("div");const C=this._ripple;C.classList.add("ripple"),C.style.position="absolute",C.style.left=`${h}px`,C.style.top=`${u}px`,C.style.width=`${b}px`,C.style.height=`${b}px`,C.style.pointerEvents="none",C.style.translate="-50% -50%",C.style.borderRadius="50%",C.style.backgroundColor="var(--ripple, rgba(0, 0, 0, 0.2))",C.style.filter=`blur(${y}px)`,C.style.opacity="0",C.style.transform="scale(var(--ripple-lower-scale, 0.3))",C.style.transformOrigin="center",C.style.transitionProperty="opacity, transform",C.style.transitionDuration=`${this.option.fadeInDuration}, ${this.option.spreadDuration}`,C.style.transitionTimingFunction=`${this.option.fadeInCurve}, ${this.option.spreadCurve}`,queueMicrotask((()=>{C.getBoundingClientRect(),C.style.opacity="1",C.style.transform="scale(var(--ripple-upper-scale, 1))"})),C.addEventListener("transitionstart",(()=>{m+=1}));let D=!1;return C.addEventListener("transitionend",(()=>{D=!0})),this.isRejectable?this.statusListener=t=>{if(t==s.REJECTED&&this.fadeout(e),t==s.ACCEPTED){if(D)return this.notify(),this.fadeout(e);0==this.isWait&&this.notify(),C.ontransitionend=g}}:(0==this.isWait&&this.notify(),C.ontransitionend=g),C}dispose(){this.status=s.DISPOSED,this._statusListeners=null,this._ripple=null}}customElements.define("touch-ripple-effect",u);class d extends HTMLElement{static ancestorOf(t){let e=t.parentElement;for(;e;){if(e instanceof d)return e;e=e.parentElement}}}customElements.define("touch-ripple-connection",d);class f extends HTMLElement{constructor(){super(...arguments),this.arena=new o({isKeepAliveLastPointerUp:!0})}set ontap(t){this._ontap=t,this.initBuiler()}set ondoubletap(t){this._ondoubletap=t,this.initBuiler()}set onlongtap(t){this._onlongtap=t,this.initBuiler()}get child(){var t;const e=this.getAttribute("selector");return e&&null!==(t=this.querySelector(e))&&void 0!==t?t:this.firstElementChild}getPropertyByName(t,e=this){return getComputedStyle(e).getPropertyValue(t)}getDurationByName(t,e=this){const i=this.getPropertyByName(t,e);return""==i||"none"==i?null:i.endsWith("ms")?Number(i.replace("ms","")):1e3*Number(i.replace("s",""))}getBooleanByName(t,e=this){const i=this.getPropertyByName(t,e);if(""!=i)return"1"==i}initBuiler(){var t,e,i,n;this.arena.reset();const r=null!==(t=this.getDurationByName("--ripple-tap-preview-duration"))&&void 0!==t?t:150;if(null!=this._ontap){const t=null!==(e=this.getDurationByName("--ripple-tappable-duration"))&&void 0!==e?e:0,i=null!=this._onlongtap?0:r;this.arena.registerBuilder((()=>{let e=null;return new a((t=>e=this.createEffect(t,this._ontap,!1)),(t=>e=this.createEffect(t,this._ontap,!0)),(()=>e.status=s.ACCEPTED),(()=>e.status=s.REJECTED),i,t)}))}if(null!=this._ondoubletap){const t=null!==(i=this.getDurationByName("--ripple-double-tappable-duration"))&&void 0!==i?i:300;this.arena.registerBuilder((()=>new l((t=>this.createEffect(t,this._ondoubletap,!1)),t)))}if(null!=this._onlongtap){const t=null!==(n=this.getDurationByName("--ripple-long-tappable-duration"))&&void 0!==n?n:1e3;this.arena.registerBuilder((()=>{let e=null;return new h((t=>e=this.createEffect(t,this._onlongtap,!0,{spreadDuration:"var(--ripple-long-tappable-duration, 1s)",fadeInDuration:"var(--ripple-long-tappable-duration, 1s)",spreadCurve:"var(--ripple-long-tappable-curve, linear(0, 1))",fadeInCurve:"var(--ripple-long-tappable-curve, linear(0, 1))"})),(()=>e.status=s.REJECTED),(()=>e.status=s.ACCEPTED),r,t)}))}}initPointerEvent(t){var i;const s=null===(i=this.getBooleanByName("--ripple-use-hover"))||void 0===i||i;t.onpointerdown=t=>this.arena.handlePointer(t,e.DOWN),t.onpointermove=t=>this.arena.handlePointer(t,e.MOVE),t.onpointerup=t=>this.arena.handlePointer(t,e.UP),t.onpointercancel=t=>this.arena.handlePointer(t,e.CANCEL),t.onpointerleave=t=>this.arena.handlePointer(t,e.CANCEL),t.onmouseleave=t=>this.arena.handlePointer(t,e.CANCEL),!("ontouchstart"in window)&&s&&(t.onmouseenter=()=>this.onHoverStart(),t.onmouseleave=()=>this.onHoverEnd())}connectedCallback(){requestAnimationFrame((()=>{let t=this.child;if(null==t)throw"This element must be exists child element.";t.style.position="relative",t.style.overflow="hidden",t.style.userSelect="none",t.style.touchAction="manipulation";let e=d.ancestorOf(this);e?this.initPointerEvent(e):this.initPointerEvent(t)}))}createHoverElement(){return document.createElement("touch-ripple-effect-hover")}onHoverStart(){const t=this.child;null==this.hoverEffectElement&&t.appendChild(this.hoverEffectElement=this.createHoverElement()),this.hoverEffectElement.ontransitionend=null,this.hoverEffectElement.getBoundingClientRect(),this.hoverEffectElement.style.opacity="1"}onHoverEnd(){if(this.hoverEffectElement){const t=this.hoverEffectElement;t.style.opacity="0",t.ontransitionend=()=>{this.child.removeChild(t),this.hoverEffectElement=null}}}createEffect(t,e,i,s){var n,r;const o=null!==(n=this.getPropertyByName("--ripple-overlap-behavior"))&&void 0!==n?n:"overlappable";if('"cancel"'==o)null===(r=this.activeEffect)||void 0===r||r.cancel(this.child);else if('"ignoring"'==o&&null!=this.activeEffect)return;const a=Object.assign({spreadDuration:"var(--ripple-spread-duration, 0.3s)",spreadCurve:"var(--ripple-spread-curve, cubic-bezier(.2,.3,.4,1))",fadeInDuration:"var(--ripple-fadein-duration, 0.15s)",fadeInCurve:"var(--ripple-fadein-curve)",fadeOutDuration:"var(--ripple-fadeout-duration, 0.3s)",fadeOutCurve:"var(--ripple-fadeout-curve, cubic-bezier(.15,.5,.5,1))"},s),l=new u(t,e,i,this.hasAttribute("wait"),a,this);return this.child.appendChild(l.createElement(this,this.child)),l}static get observedAttributes(){return["ontap","ondoubletap","onlongtap"]}attributeChangedCallback(t,e,i){if(null!=i){const e=new Function(i);"ontap"==t&&(this.ontap=e),"ondoubletap"==t&&(this.ondoubletap=e),"onlongtap"==t&&(this.onlongtap=e)}}}customElements.define("touch-ripple",f);class m extends HTMLElement{connectedCallback(){this.style.position="absolute",this.style.top="0px",this.style.left="0px",this.style.width="100%",this.style.height="100%",this.style.backgroundColor="var(--ripple-hover, rgba(0, 0, 0, 0.1))",this.style.opacity="0",this.style.transitionProperty="opacity",this.style.transitionDuration="var(--ripple-hover-duration, 0.25s)",this.style.pointerEvents="none"}}customElements.define("touch-ripple-effect-hover",m),addEventListener("DOMContentLoaded",(()=>t.initialize()));export{o as GestureArena,n as GestureRecognizer,t as TouchRippleBinding,d as TouchRippleConnectionElement,u as TouchRippleEffectElement,m as TouchRippleEffectHoverElement,f as TouchRippleElement};
//# sourceMappingURL=index.esm.js.map
