import{d as p,a,i as f,T as r,R as b,M as g,b as u}from"./wallet-other-DeBqkjrb.js";import{n as m,r as v}from"./index-CMXM9Vs9.js";const w=p`
  :host {
    width: 100%;
    display: block;
  }
`;var c=function(l,e,t,i){var n=arguments.length,o=n<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(l,e,t,i);else for(var h=l.length-1;h>=0;h--)(d=l[h])&&(o=(n<3?d(o):n>3?d(e,t,o):d(e,t))||o);return n>3&&o&&Object.defineProperty(e,t,o),o};let s=class extends f{constructor(){super(),this.unsubscribe=[],this.text="",this.open=r.state.open,this.unsubscribe.push(b.subscribeKey("view",()=>{r.hide()}),g.subscribeKey("open",e=>{e||r.hide()}),r.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),r.hide()}render(){return u`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return u`<slot></slot> `}onMouseEnter(){const e=this.getBoundingClientRect();if(!this.open){const t=document.querySelector("w3m-modal"),i={width:e.width,height:e.height,left:e.left,top:e.top};if(t){const n=t.getBoundingClientRect();i.left=e.left-(window.innerWidth-n.width)/2,i.top=e.top-(window.innerHeight-n.height)/2}r.showTooltip({message:this.text,triggerRect:i,variant:"shade"})}}onMouseLeave(e){this.contains(e.relatedTarget)||r.hide()}};s.styles=[w];c([m()],s.prototype,"text",void 0);c([v()],s.prototype,"open",void 0);s=c([a("w3m-tooltip-trigger")],s);
