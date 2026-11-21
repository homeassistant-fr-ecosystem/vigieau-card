function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;class n{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,f=g?g.emptyScript:"",m=_.reactiveElementPolyfillSupport,v=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const n=this.constructor;if(!1===s&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??y)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[v("elementProperties")]=new Map,A[v("finalized")]=new Map,m?.({ReactiveElement:A}),(_.reactiveElementVersions??=[]).push("2.1.2");const b=globalThis,x=t=>t,E=b.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+P,U=`<${k}>`,R=document,N=()=>R.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,T="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,z=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,D=/"/g,q=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),F=new WeakMap,J=R.createTreeWalker(R,129);function G(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(o.lastIndex=h,l=o.exec(i),null!==l);)h=o.lastIndex,o===H?"!--"===l[1]?o=L:void 0!==l[1]?o=z:void 0!==l[2]?(q.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=j):void 0!==l[3]&&(o=j):o===j?">"===l[0]?(o=r??H,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?j:'"'===l[3]?D:I):o===D||o===I?o=j:o===L||o===z?o=H:(o=j,r=void 0);const d=o===j&&t[e+1].startsWith("/>")?" ":"";n+=o===H?i+U:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+P+d):i+P+(-2===c?e:d)}return[G(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=Z.createElement(l,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[n++],i=s.getAttribute(t).split(P),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(q.test(s.tagName)){const t=s.textContent.split(P),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),J.nextNode(),a.push({type:2,index:++r});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===k)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(P,t+1));)a.push({type:7,index:r}),t+=P.length-1}r++}}static createElement(t,e){const i=R.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===V)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=O(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Y(t,r._$AS(t,e.values),r,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??R).importNode(e,!0);J.currentNode=s;let r=J.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new X(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=J.nextNode(),n++)}return J.currentNode=R,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(R.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Z(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new X(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=Y(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==V,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Y(this,s[i+o],e,o),a===V&&(a=this._$AH[o]),n||=!O(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===V)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const nt=b.litHtmlPolyfillSupport;nt?.(Z,X),(b.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;class at extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new X(e.insertBefore(N(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const lt=ot.litElementPolyfillSupport;lt?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:y},dt=(t=ht,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}const ut={en:{unknown:"Unknown",no_data:"No data",configure_entities:"Please configure entities in the card editor",currently_restricted:"Currently restricted",yes:"Yes",no:"No",next_restriction:"Next restriction",fountains:"Fountains",gardens:"Gardens",lawns:"Lawns",vehicle_wash:"Vehicle Wash",pools:"Pools",roads:"Roads",roofs:"Roofs",ponds:"Ponds"},fr:{city_code:"Code ville / slug",unknown:"Inconnu",no_data:"Aucune donnée",configure_entities:"Veuillez configurer les entités dans l'éditeur de carte",currently_restricted:"Restriction actuelle",yes:"Oui",no:"Non",next_restriction:"Prochaine restriction",fountains:"Fontaines",gardens:"Jardins",lawns:"Pelouses",vehicle_wash:"Lavage de véhicules",pools:"Piscines",roads:"Routes",roofs:"Toits",ponds:"Étangs"}};function _t(t,e="en"){return ut[e.startsWith("fr")?"fr":"en"][t]||t}const gt=["alimentation_des_fontaines","jardins_potagers","pelouses","lavage_des_vehicules","piscines","voiries_trottoirs","toitures_facades","plans_deau"],ft={"aucune restriction":"green",vigilance:"green",alerte:"yellow","alerte renforcée":"orange",crise:"red","interdiction sauf exception":"orange",interdiction:"red","interdiction sur plage horaire":"orange",sensibilisation:"yellow","réduction":"orange"};let mt=class extends at{constructor(){super(...arguments),this._entities={alert_level:null,alert_level_numeric:null,restrictions:new Map}}static getStubConfig(){return{type:"custom:vigieau-card",city_code:"",alert_level_entity:"",alert_level_numeric_entity:"",restriction_entities:[],show_alert_level:!0,show_restrictions:!0,show_progress:!1}}_buildEntityIdsFromCityCode(t){const e=t.toLowerCase().trim();return{alert_level_entity:`sensor.alert_level_in_${e}`,alert_level_numeric_entity:`sensor.alert_level_numeric_${e}`,restriction_entities:gt.map(t=>`sensor.${t}_restrictions_${e}`)}}static async getConfigElement(){return await Promise.resolve().then(function(){return yt}),document.createElement("vigieau-card-editor")}setConfig(t){let e={...t};if(t.city_code&&t.city_code.trim()){const i=this._buildEntityIdsFromCityCode(t.city_code);t.alert_level_entity||(e.alert_level_entity=i.alert_level_entity),t.alert_level_numeric_entity||(e.alert_level_numeric_entity=i.alert_level_numeric_entity),t.restriction_entities&&0!==t.restriction_entities.length||(e.restriction_entities=i.restriction_entities)}this._config={show_alert_level:!0,show_restrictions:!0,show_progress:!1,...e},this._updateEntities()}getCardSize(){return 6}shouldUpdate(t){if(t.has("_config"))return!0;if(t.has("hass")){const e=t.get("hass");if(!e||!this._entities)return!0;if(this._config.alert_level_entity){const t=e.states[this._config.alert_level_entity],i=this.hass.states[this._config.alert_level_entity];if(t?.state!==i?.state)return!0}if(this._config.alert_level_numeric_entity){const t=e.states[this._config.alert_level_numeric_entity],i=this.hass.states[this._config.alert_level_numeric_entity];if(t?.state!==i?.state)return!0}return this._getRestrictionEntities().some(t=>e.states[t]?.state!==this.hass.states[t]?.state)}return!0}updated(t){super.updated(t),(t.has("hass")||t.has("_config"))&&this._updateEntities()}_getRestrictionEntities(){return this._config.restriction_entities||[]}_getState(t){if(t&&this.hass)return this.hass.states[t]}_getRestrictionColor(t){if(!t)return"grey";const e=t.toLowerCase().trim();return ft[e]||"grey"}_getColorFromAttributes(t){const e=t.Couleur;return e&&"string"==typeof e?e:null}_updateEntities(){if(!this.hass||!this._config)return;this._entities.alert_level=this._getState(this._config.alert_level_entity??null)?.state||null,this._entities.alert_level_numeric=this._getState(this._config.alert_level_numeric_entity??null)?.state||null,this._entities.restrictions.clear();const t=this._getRestrictionEntities();for(const e of t){const t=this._getState(e);if(t){let i="";const s=e.match(/^sensor\.(.+)_restrictions_/);if(s)i=s[1];else{const t=e.match(/^binary_sensor\.vigieau-(.+)-/);if(t)i=t[1];else{const t=e.split(".");t.length>1&&(i=t[1].replace(/_restrictions.*$/,""))}}this._entities.restrictions.set(i,{state:t.state,entity_id:t.entity_id,attributes:t.attributes})}}this.requestUpdate()}_getDisplayLevel(t){return t?t.charAt(0).toUpperCase()+t.slice(1):"Inconnu"}_getCategoryDisplayName(t,e){const i={en:{fountains:"Fountains",gardens:"Gardens",lawns:"Lawns",vehicle_wash:"Vehicle Wash",pools:"Pools",roads:"Roads",roofs:"Roofs",ponds:"Ponds",alimentation_des_fontaines:"Fountains",jardins_potagers:"Vegetable gardens",pelouses:"Lawns",lavage_des_vehicules:"Vehicle Wash",piscines:"Pools",voiries_trottoirs:"Roads and sidewalks",toitures_facades:"Roofs and facades",plans_deau:"Ponds"},fr:{fountains:"Fontaines",gardens:"Jardins",lawns:"Pelouses",vehicle_wash:"Lavage véhicules",pools:"Piscines",roads:"Routes",roofs:"Toits",ponds:"Étangs",alimentation_des_fontaines:"Alimentation des fontaines",jardins_potagers:"Jardins potagers",pelouses:"Pelouses",lavage_des_vehicules:"Lavage des véhicules",piscines:"Piscines",voiries_trottoirs:"Voiries et trottoirs",toitures_facades:"Toitures et façades",plans_deau:"Plans d'eau"}};return(i[e]||i.fr)[t]||t.replace(/_/g," ")}_getCategoryIcon(t){return{alimentation_des_fontaines:"mdi:fountain",jardins_potagers:"mdi:flower",pelouses:"mdi:grass",lavage_des_vehicules:"mdi:car-wash",piscines:"mdi:pool",voiries_trottoirs:"mdi:road",toitures_facades:"mdi:roof",plans_deau:"mdi:water",fountains:"mdi:fountain",gardens:"mdi:flower",lawns:"mdi:grass",vehicle_wash:"mdi:car-wash",pools:"mdi:pool",roads:"mdi:road",roofs:"mdi:roof",ponds:"mdi:water"}[t]||"mdi:water"}_isBinarySensor(t){return t.startsWith("binary_sensor.")}_renderHeader(){const t=this._entities.alert_level,e=this._entities.alert_level_numeric,i=this.hass?.locale?.language||this.hass?.language||"fr",s=this._getRestrictionColor(t);let r=_t("unknown",i);t&&(r=this._getDisplayLevel(t));let n=B``;if(this._config.show_progress&&null!==e&&!isNaN(Number(e))){const t=Math.round(Number(e)/4*100);n=B`
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${t}%"></div>
        </div>
        <span class="progress-percent">${t}%</span>
      `}const o=this._config.alert_level_entity;return B`
      <div class="card-header">
        <div class="alert-level ${s}" @click=${()=>this._showMoreInfo(o??null)}>
          <ha-icon icon="mdi:alert-circle" style="color: ${s};"></ha-icon>
          <span>${r}</span>
        </div>
        ${n}
      </div>
    `}_renderRestrictions(){const t=this._entities.restrictions,e=this.hass?.locale?.language||this.hass?.language||"fr";if(0===t.size)return B`
        <div class="restrictions-grid">
          <span>${_t("no_data",e)}</span>
        </div>
      `;const i=Array.from(t.entries()).map(([t,i])=>{const{state:s,entity_id:r,attributes:n}=i,o=this._getColorFromAttributes(n)||this._getRestrictionColor(s),a=this._getCategoryDisplayName(t,e),l=this._isBinarySensor(r);let c=a;const h=n.currently_restricted;void 0!==h&&(c+=` - ${_t("currently_restricted",e)}: ${_t(h?"yes":"no",e)}`);const d=n.next_restriction_start,p=n.next_restriction_end;d&&p&&(c+=` - ${_t("next_restriction",e)}: ${d} / ${p}`);const u=l?"on"===s?"mdi:water-off":"mdi:water-check":this._getCategoryIcon(t),_=this._getDisplayLevel(s);return B`
        <div class="restriction-item ${l?"binary":""}" title="${c}" @click=${()=>this._showMoreInfo(r)} style="border-color: ${o};">
          <ha-icon icon="${u}" style="color: ${o};"></ha-icon>
          <div class="restriction-content">
            <span class="restriction-name">${a}</span>
            <span class="restriction-level" style="color: ${o};">${_}</span>
          </div>
        </div>
      `});return B`
      <div class="restrictions-grid">
        ${i}
      </div>
    `}_renderConfigMissing(){const t=this.hass?.locale?.language||this.hass?.language||"fr";return B`
      <div class="config-missing">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${_t("configure_entities",t)}</span>
      </div>
    `}_showMoreInfo(t){if(!t)return;const e=new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0});this.dispatchEvent(e)}render(){if(!this._config||!this.hass)return B``;const t=Boolean(this._config.alert_level_entity),e=(this._config.restriction_entities??[]).length>0;return t||e?B`
      <ha-card>
        ${this._config.show_alert_level&&t?this._renderHeader():""}
        ${this._config.show_restrictions&&e?this._renderRestrictions():""}
      </ha-card>
    `:B`
        <ha-card>
          ${this._renderConfigMissing()}
        </ha-card>
      `}static get styles(){return o`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
        --ha-card-box-shadow: none;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .alert-level {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: color 0.2s ease;
      }

      .alert-level:hover {
        color: var(--primary-color);
      }

      .alert-level ha-icon {
        width: 24px;
        height: 24px;
        color: var(--secondary-text-color);
      }

      .alert-level span {
        font-weight: bold;
        font-size: 1.2em;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--secondary-background-color);
        border-radius: 4px;
        overflow: hidden;
        margin-top: 8px;
      }

      .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .progress-percent {
        margin-top: 4px;
        text-align: right;
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }

      .restrictions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }

      .restriction-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 10px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 2px solid var(--divider-color);
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 80px;
      }

      .restriction-item:hover {
        border-color: var(--primary-color);
        background: var(--secondary-background-color);
      }

      .restriction-item:active {
        transform: scale(0.98);
        border-color: var(--primary-color);
        background: var(--secondary-background-color);
      }

      .restriction-item ha-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .restriction-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      .restriction-name {
        font-size: 0.85em;
        color: var(--primary-text-color);
        font-weight: 500;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
        line-height: 1.2;
      }

      .restriction-level {
        font-size: 0.75em;
        color: var(--secondary-text-color);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .config-missing {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 20px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      .config-missing ha-icon {
        width: 24px;
        height: 24px;
        color: var(--primary-color);
      }

      @media (max-width: 600px) {
        .restrictions-grid {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }

        .restriction-item {
          padding: 8px;
        }

        .restriction-item span {
          max-width: 150px;
          font-size: 0.8em;
        }

        .card-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .alert-level {
          width: 100%;
        }
      }
    `}};var vt;t([pt({attribute:!1})],mt.prototype,"hass",void 0),t([pt()],mt.prototype,"_config",void 0),t([function(t){return pt({...t,state:!0,attribute:!1})}()],mt.prototype,"_entities",void 0),mt=t([ct("vigieau-card")],mt),window.customCards=window.customCards||[],window.customCards.push({type:"vigieau-card",name:"Vigieau Eau",description:"French drought water restrictions card",preview:!1,documentationURL:"https://github.com/kamaradclimber/vigieau"});let $t=vt=class extends at{constructor(){super(...arguments),this._config={type:"custom:vigieau-card",city_code:"",alert_level_entity:"",alert_level_numeric_entity:"",restriction_entities:[],show_alert_level:!0,show_restrictions:!0,show_progress:!1}}static getStubConfig(){return{type:"custom:vigieau-card",city_code:"",alert_level_entity:"",alert_level_numeric_entity:"",restriction_entities:[],show_alert_level:!0,show_restrictions:!0,show_progress:!1}}setConfig(t){this._config={...vt.getStubConfig(),...t}}getCardSize(){return 6}render(){const t="fr"===this.hass?.locale?.language;return B`
      <ha-settings>
        <!-- City code or slug -->
        <div style="margin-bottom: 16px;">
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${t?"Code ville / slug":"City code or slug"}
          </div>
          <ha-textfield
            .hass=${this.hass}
            .label=${t?"Code ville / slug":"City code or slug"}
            .value=${this._config.city_code||""}
            .helper=${t?"Ex: 35322 (code INSEE) ou thorigne_fouillard (slug). Génère automatiquement les entités si elles ne sont pas saisies.":"Ex: 35322 (INSEE code) or thorigne_fouillard (slug). Auto-generates entities when not set manually."}
            @value-changed=${t=>{this._config.city_code=t.target.value,this.requestUpdate()}}
          ></ha-textfield>
          <div style="font-size: 0.8em; color: var(--secondary-text-color); margin-top: 4px;">
            ${t?"Laissez vide pour sélectionner les entités manuellement.":"Leave empty to select entities manually."}
          </div>
        </div>

        <!-- Alert level entity -->
        <div>
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${t?"Entité niveau d'alerte":"Alert level entity"}
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.alert_level_entity||""}
            .domain=${["sensor"]}
            @value-changed=${t=>{this._config.alert_level_entity=t.detail.value,this.requestUpdate()}}
            .placeholder=${"Ex: sensor.alert_level_in_thorigne_fouillard"}
          ></ha-entity-picker>
        </div>

        <!-- Numeric alert level entity (optional) -->
        <div style="margin-top: 16px;">
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${t?"Entité niveau numérique (optionnel)":"Numeric alert level entity (optional)"}
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.alert_level_numeric_entity||""}
            .domain=${["sensor"]}
            @value-changed=${t=>{this._config.alert_level_numeric_entity=t.detail.value,this.requestUpdate()}}
            .placeholder=${"Ex: sensor.alert_level_numeric_thorigne_fouillard"}
          ></ha-entity-picker>
        </div>

        <!-- Restriction entities (multiple) -->
        <div style="margin-top: 16px;">
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${t?"Entités de restrictions":"Restriction entities"}
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.restriction_entities||[]}
            .domain=${["sensor"]}
            .multiple=${!0}
            @value-changed=${t=>{this._config.restriction_entities=t.detail.value,this.requestUpdate()}}
            .placeholder=${"Ex: sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard"}
          ></ha-entity-picker>
        </div>

        <ha-switch
          .checked=${this._config.show_alert_level}
          @change=${t=>{this._config.show_alert_level=t.target.checked}}
        >
          ${t?"Afficher le niveau d'alerte":"Show alert level"}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_restrictions}
          @change=${t=>{this._config.show_restrictions=t.target.checked}}
        >
          ${t?"Afficher les restrictions":"Show restrictions"}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_progress}
          @change=${t=>{this._config.show_progress=t.target.checked}}
        >
          ${t?"Afficher la barre de progression":"Show progress bar"}
        </ha-switch>
      </ha-settings>
    `}static get styles(){return o`
      ha-textfield,
      ha-entity-picker {
        margin-bottom: 16px;
        display: block;
      }

      ha-switch {
        margin-right: 16px;
        margin-bottom: 16px;
        display: block;
      }
    `}};t([pt()],$t.prototype,"hass",void 0),t([pt()],$t.prototype,"_config",void 0),$t=vt=t([ct("vigieau-card-editor")],$t);var yt=Object.freeze({__proto__:null,get VigieauCardEditor(){return $t}});export{mt as VigieauCard};
//# sourceMappingURL=vigieau-card.js.map
