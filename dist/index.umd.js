!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).TouchRipple={})}(this,(function(t){"use strict";class e{constructor(t,e){this.x=t,this.y=e}distance(t,e){let i=this.x-t,s=this.y-e;return Math.sqrt(i*i+s*s)}}var i,s,n;!function(t){t[t.NONE=0]="NONE",t[t.ACCEPTED=1]="ACCEPTED",t[t.REJECTED=2]="REJECTED",t[t.DISPOSED=3]="DISPOSED"}(i||(i={}));class o{constructor(t,e,s,n,o){this.position=t,this.callback=e,this.isRejectable=s,this.isWait=n,this.option=o,this._statusListeners=[],this._status=s?i.NONE:i.ACCEPTED}get status(){return this._status}set status(t){this._status!=t&&(this._status=t,this._statusListeners.forEach((e=>e(t))))}set statusListener(t){this._statusListeners.push(t)}notify(){this.callback&&this.callback()}fadeout(t,e=this._ripple){null!=t&&null!=e&&(e.style.transitionDuration="var(--ripple-fadeout-duration, 0.4s)",e.style.transitionTimingFunction="var(--ripple-fadeout-curve, cubic-bezier(.15,.5,.5,1))",e.style.opacity="0",requestAnimationFrame((()=>{e.ontransitionend=()=>t.removeChild(e)})),this.dispose())}cancel(t,e=this._ripple){null!=t&&null!=e&&(e.style.transitionDuration="var(--ripple-cancel-duration, 0s)",e.style.transitionTimingFunction="var(--ripple-cancel-curve)",e.style.opacity="0",requestAnimationFrame((()=>{e.ontransitionend=()=>t.removeChild(e)})),this.dispose())}createElement(t,s){const n=t.getBoundingClientRect(),o=this.position.x-n.left,r=this.position.y-n.top,a=t.offsetWidth/2,l=t.offsetHeight/2,h=()=>{this.isWait&&this.notify(),this.fadeout(s)};var c=t.getPropertyByName("--ripple-blur-radius")||"15px",p=Number(c.replace("px",""));let u=2*new e(a,l).distance(0,0);u+=2*new e(a,l).distance(o,r),u+=2*p,this._ripple=document.createElement("div");const d=this._ripple;d.classList.add("ripple"),d.style.position="absolute",d.style.left=`${o}px`,d.style.top=`${r}px`,d.style.width=`${u}px`,d.style.height=`${u}px`,d.style.pointerEvents="none",d.style.translate="-50% -50%",d.style.borderRadius="50%",d.style.backgroundColor="var(--ripple, rgba(0, 0, 0, 0.2))",d.style.filter=`blur(${c})`,d.style.opacity="0",d.style.transform="scale(var(--ripple-lower-scale, 0.3))",d.style.transformOrigin="center",d.style.transitionProperty="opacity, transform",d.style.transitionDuration=this.option.fadeInDuration,d.style.transitionTimingFunction=this.option.fadeInCurve,queueMicrotask((()=>{d.getBoundingClientRect(),d.style.opacity="1",d.style.transform="scale(var(--ripple-upper-scale, 1))"}));let f=!1;return d.addEventListener("transitionend",(()=>{f=!0})),this.isRejectable?this.statusListener=t=>{if(t==i.REJECTED&&this.fadeout(s),t==i.ACCEPTED){if(f)return this.notify(),this.fadeout(s);0==this.isWait&&this.notify(),d.ontransitionend=h}}:(0==this.isWait&&this.notify(),d.ontransitionend=h),d}dispose(){this.status=i.DISPOSED,this._statusListeners=null,this._ripple=null}}!function(t){t.DOWN="down",t.MOVE="move",t.UP="up",t.CANCEL="cancel"}(s||(s={})),function(t){t[t.ACCEPT=0]="ACCEPT",t[t.REJECT=1]="REJECT",t[t.UPDATE=2]="UPDATE"}(n||(n={}));class r{constructor(){this.listeners=[],this.isHold=!1}accept(){this.perform(n.ACCEPT),this.onAccept()}reject(){this.perform(n.REJECT),this.onReject()}hold(){this.isHold=!0,this.listeners.forEach((t=>t(n.UPDATE)))}release(){this.isHold=!1,this.listeners.forEach((t=>t(n.UPDATE)))}onAccept(){}onReject(){}dispose(){}perform(t){this.dispose(),this.listeners.forEach((e=>e(t)))}}class a extends r{constructor(){super()}createPosition(t){return{x:t.clientX,y:t.clientY}}handlePointer(t,e){const i=this.position=this.createPosition(t);e==s.DOWN&&this.pointerDown(i),e==s.MOVE&&this.pointerMove(i),e==s.UP&&this.pointerUp(i),e==s.CANCEL&&(this.reject(),this.pointerCancel(i))}pointerDown(t){}pointerMove(t){}pointerUp(t){}pointerCancel(t){}}class l{constructor(t){this.option=t,this.builders=[],this.recognizers=[],this.option=Object.assign({isKeepAliveLastPointerUp:!0},this.option)}registerBuilder(t){this.builders.push(t)}attach(t){this.recognizers.push(t)}detach(t){this.recognizers=this.recognizers.filter((e=>e!=t))}rejectBy(t){this.detach(t),this.checkCycle()}acceptBy(t){this.recognizers.forEach((e=>e!=t?e.reject():void 0)),this.recognizers=[]}reset(){this.builders=[],this.recognizers=[]}createRecognizer(t){const e=t();return e.listeners.push((t=>{switch(t){case n.REJECT:this.rejectBy(e);break;case n.ACCEPT:this.acceptBy(e);break;case n.UPDATE:this.checkCycle()}})),e}checkCycle(t){if(this.option.isKeepAliveLastPointerUp&&(t==s.UP||null==t)&&1==this.recognizers.length){const t=this.recognizers[0];t.isHold||t.accept()}}handlePointer(t,e){e==s.DOWN&&0==this.recognizers.length&&(this.recognizers=this.builders.map((t=>this.createRecognizer(t)))),this.recognizers.forEach((i=>i.handlePointer(t,e))),this.checkCycle(e)}}class h extends a{constructor(t,e,i,s,n,o){super(),this.onTap=t,this.onTapRejectable=e,this.onTapAccept=i,this.onTapReject=s,this.rejectableDuration=n,this.tappableDuration=o,this.timerIds=[],this.isRejectable=!1}pointerDown(t){const e=()=>{this.isRejectable=!0,this.onTapRejectable(t)};0!=this.rejectableDuration&&this.timerIds.push(setTimeout(e,this.rejectableDuration)),0!=this.tappableDuration&&this.timerIds.push(setTimeout(this.reject.bind(this),this.tappableDuration))}dispose(){this.timerIds.forEach((t=>clearTimeout(t))),this.timerIds=null}onAccept(){this.isRejectable?this.onTapAccept(this.position):this.onTap(this.position)}onReject(){this.isRejectable&&this.onTapReject(this.position)}toString(){return"[Object TapGestureRecognizer]"}}class c extends a{constructor(t,e){super(),this.onDoubleTap=t,this.doubleTappableDuration=e,this.tapCount=0}pointerDown(t){2==++this.tapCount?this.accept():(this.hold(),setTimeout((()=>this.reject()),this.doubleTappableDuration))}onAccept(){this.onDoubleTap(this.position)}dispose(){null!=this.timeId&&clearTimeout(this.timeId)}toString(){return"[Object DoubleTapGestureRecognizer]"}}class p extends a{constructor(t,e,i,s,n){super(),this.onLongTapStart=t,this.onLongTapEnd=e,this.onLongTap=i,this.tappableDuration=s,this.longtappableDuration=n,this.isStartCalled=!1}pointerDown(t){this.isHold=!0,this.timerId=setTimeout((()=>{this.isStartCalled=!0,this.onLongTapStart(t),this.timerId=setTimeout((()=>{this.accept(),this.onLongTap()}),this.longtappableDuration)}),this.tappableDuration)}pointerUp(t){this.reject()}onReject(){this.isStartCalled&&this.onLongTapEnd()}dispose(){null!=this.timerId&&clearTimeout(this.timerId)}toString(){return"[Object LongTapGestureRecognizer]"}}class u extends HTMLElement{constructor(){super(...arguments),this.arena=new l({isKeepAliveLastPointerUp:!0}),this.effects=new Map}set ontap(t){this._ontap=t,this.initBuiler()}set ondoubletap(t){this._ondoubletap=t,this.initBuiler()}set onlongtap(t){this._onlongtap=t,this.initBuiler()}get child(){return this.firstElementChild}getPropertyByName(t,e=this){return getComputedStyle(e).getPropertyValue(t)}getDurationByName(t,e=this){const i=this.getPropertyByName(t,e);return""==i||"none"==i?null:i.endsWith("ms")?Number(i.replace("ms","")):1e3*Number(i.replace("s",""))}getBooleanByName(t,e=this){const i=this.getPropertyByName(t,e);if(""!=i)return"1"==i}initBuiler(){var t,e,s,n;this.arena.reset();const o=null!==(t=this.getDurationByName("--ripple-tap-preview-duration"))&&void 0!==t?t:150;if(null!=this._ontap){const t=null!==(e=this.getDurationByName("--ripple-tappable-duration"))&&void 0!==e?e:0,s=null!=this._onlongtap;this.arena.registerBuilder((()=>{let e=null;return new h((t=>e=this.createEffect(t,this._ontap,!1)),(t=>e=this.createEffect(t,this._ontap,!0)),(()=>e.status=i.ACCEPTED),(()=>e.status=i.REJECTED),s?0:o,t)}))}if(null!=this._ondoubletap){const t=null!==(s=this.getDurationByName("--ripple-double-tappable-duration"))&&void 0!==s?s:300;this.arena.registerBuilder((()=>new c((t=>this.createEffect(t,this._ondoubletap,!1)),t)))}if(null!=this._onlongtap){const t=null!==(n=this.getDurationByName("--longtappable-duration"))&&void 0!==n?n:1e3;this.arena.registerBuilder((()=>{let e=null;return new p((t=>e=this.createEffect(t,this._onlongtap,!0,{fadeInDuration:"var(--long-tappable-duration, 1s)",fadeInCurve:"var(--long-tappable-curve, linear(0, 1))"})),(()=>e.status=i.REJECTED),(()=>e.status=i.ACCEPTED),o,t)}))}}connectedCallback(){this.style["-webkit-tap-highlight-color"]="transparent",requestAnimationFrame((()=>{var t;const e=null===(t=this.getBooleanByName("--ripple-use-hover"))||void 0===t||t,i=this.child;if(null==i)throw"This element must be exists child element.";i.style.position="relative",i.style.overflow="hidden",i.style.userSelect="none",i.style.touchAction="manipulation",this.onpointerdown=t=>this.arena.handlePointer(t,s.DOWN),this.onpointermove=t=>this.arena.handlePointer(t,s.MOVE),this.onpointerup=t=>this.arena.handlePointer(t,s.UP),this.onpointercancel=t=>this.arena.handlePointer(t,s.CANCEL),this.onmouseleave=t=>this.arena.handlePointer(t,s.CANCEL),!("ontouchstart"in window)&&e&&(i.onmouseenter=()=>this.onHoverStart(),i.onmouseleave=()=>this.onHoverEnd())}))}createHoverEffectElement(){const t=document.createElement("div");return t.style.position="absolute",t.style.top="0px",t.style.left="0px",t.style.width="100%",t.style.height="100%",t.style.backgroundColor="var(--ripple-hover, rgba(0, 0, 0, 0.1))",t.style.opacity="0",t.style.transitionProperty="opacity",t.style.transitionDuration="var(--ripple-hover-duration, 0.25s)",t.style.pointerEvents="none",t}onHoverStart(){const t=this.child;null==this.hoverEffectElement&&t.appendChild(this.hoverEffectElement=this.createHoverEffectElement()),this.hoverEffectElement.ontransitionend=null,this.hoverEffectElement.getBoundingClientRect(),this.hoverEffectElement.style.opacity="1"}onHoverEnd(){if(this.hoverEffectElement){const t=this.hoverEffectElement;t.style.opacity="0",t.ontransitionend=()=>{this.child.removeChild(t),this.hoverEffectElement=null}}}createEffect(t,e,i,s={fadeInDuration:"var(--ripple-fadein-duration, 0.25s)",fadeInCurve:"var(--ripple-fadein-curve, cubic-bezier(.2,.3,.4,1))"}){var n,r;const a=null!==(n=this.getPropertyByName("--ripple-overlap-behavior"))&&void 0!==n?n:"overlappable";if('"cancel"'==a)null===(r=this.activeEffect)||void 0===r||r.cancel(this.child);else if('"ignoring"'==a&&null!=this.activeEffect)return;const l=new o(t,e,i,this.hasAttribute("wait"),s);return this.child.appendChild(l.createElement(this,this.child)),l}static get observedAttributes(){return["ontap","ondoubletap"]}attributeChangedCallback(t,e,i){null!=i&&("ontap"==t&&(this.ontap=new Function(i)),"ondoubletap"==t&&(this.ondoubletap=new Function(i)))}}customElements.define("touch-ripple",u),t.GestureArena=l,t.GestureRecognizer=r,t.TouchRippleElement=u}));
//# sourceMappingURL=index.umd.js.map
