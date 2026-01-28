import{d as p,i as f,b as m,a}from"./wallet-other-DeBqkjrb.js";import"./index-CMXM9Vs9.js";import"./index-CNz_FYUX.js";import"./injective-utils-C9MYzl-J.js";import"./icons-Dj0zHVqu.js";import"./injective-sdk-yGcRIHv8.js";import"./wallet-core-CdETWVBX.js";import"./injective-networks-BywkriB7.js";import"./index-B8FWWaSE.js";import"./if-defined-pKzrT_vf.js";import"./index-D5wH_mwz.js";import"./index-cH30WZ-q.js";import"./index-DCr1WvI9.js";const d=p`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`;var u=function(o,i,e,r){var n=arguments.length,t=n<3?i:r===null?r=Object.getOwnPropertyDescriptor(i,e):r,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,i,e,r);else for(var s=o.length-1;s>=0;s--)(l=o[s])&&(t=(n<3?l(t):n>3?l(i,e,t):l(i,e))||t);return n>3&&t&&Object.defineProperty(i,e,t),t};let c=class extends f{render(){return m`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="3">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};c.styles=d;c=u([a("w3m-transactions-view")],c);export{c as W3mTransactionsView};
