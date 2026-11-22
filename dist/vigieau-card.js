function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:_}=Object,p=globalThis,g=p.trustedTypes,f=g?g.emptyScript:"",m=p.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=_(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const n=this.constructor;if(!1===s&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[v("elementProperties")]=new Map,b[v("finalized")]=new Map,m?.({ReactiveElement:b}),(p.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,E=x.trustedTypes,C=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+k,R=`<${P}>`,U=document,N=()=>U.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,z="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,L=/>/g,j=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,B=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),W=new WeakMap,K=U.createTreeWalker(U,129);function J(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=T;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(o.lastIndex=h,c=o.exec(i),null!==c);)h=o.lastIndex,o===T?"!--"===c[1]?o=H:void 0!==c[1]?o=L:void 0!==c[2]?(B.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=j):void 0!==c[3]&&(o=j):o===j?">"===c[0]?(o=r??T,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?j:'"'===c[3]?I:D):o===I||o===D?o=j:o===H||o===L?o=T:(o=j,r=void 0);const d=o===j&&t[e+1].startsWith("/>")?" ":"";n+=o===T?i+R:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+k+d):i+k+(-2===l?e:d)}return[J(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[c,l]=G(t,e);if(this.el=Z.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[n++],i=s.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),K.nextNode(),a.push({type:2,index:++r});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:r}),t+=k.length-1}r++}}static createElement(t,e){const i=U.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===V)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=M(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Y(t,r._$AS(t,e.values),r,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??U).importNode(e,!0);K.currentNode=s;let r=K.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new X(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=K.nextNode(),n++)}return K.currentNode=U,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),M(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Z(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new X(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=Y(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==V,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Y(this,s[i+o],e,o),a===V&&(a=this._$AH[o]),n||=!M(a)||a!==this._$AH[o],a===F?t=F:t!==F&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??F)===V)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(Z,X),(x.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;class at extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new X(e.insertBefore(N(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const ct=ot.litElementPolyfillSupport;ct?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},dt=(t=ht,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ut(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}const _t={en:{city_code:"City code or slug",city_code_helper:"Ex: 35322 (INSEE code) or thorigne_fouillard (slug). Auto-generates entities when not set manually.",city_code_empty:"Leave empty to select entities manually.",alert_level_entity:"Alert level entity",alert_level_numeric_entity:"Numeric alert level entity (optional)",restriction_entities:"Restriction entities",show_alert_level:"Show alert level",show_restrictions:"Show restrictions",compact:"Compact size",hide_no_restriction:"Hide no restriction",show_city:"Show city",show_timestamp:"Show last update time",last_updated:"Last updated",active_restrictions:"active restriction(s)",unknown:"Unknown",no_data:"No data",configure_entities:"Please configure entities in the card editor",currently_restricted:"Currently restricted",yes:"Yes",no:"No",next_restriction:"Next restriction",entity_unavailable:"Entity unavailable",entity_not_found:"Entity not found",entity_unknown:"Unknown state",no_active_restrictions:"No active restrictions",refresh:"Refresh",fountains:"Fountains",gardens:"Gardens",lawns:"Lawns",vehicle_wash:"Vehicle Wash",pools:"Pools",roads:"Roads",roofs:"Roofs",ponds:"Ponds","categorie.alimentation_des_fontaines":"Fountains","categorie.jardins_potagers":"Vegetable gardens","categorie.pelouses":"Lawns","categorie.lavage_des_vehicules":"Vehicle Wash","categorie.piscines":"Pools","categorie.voiries_trottoirs":"Roads and sidewalks","categorie.toitures_facades":"Roofs and facades","categorie.plans_deau":"Ponds"},fr:{city_code:"Code ville / slug",city_code_helper:"Ex: 35322 (code INSEE) ou thorigne_fouillard (slug). Génère automatiquement les entités si elles ne sont pas saisies.",city_code_empty:"Laissez vide pour sélectionner les entités manuellement.",alert_level_entity:"Entité niveau d'alerte",alert_level_numeric_entity:"Entité niveau numérique (optionnel)",restriction_entities:"Entités de restrictions",show_alert_level:"Afficher le niveau d'alerte",show_restrictions:"Afficher les restrictions",compact:"Taille compacte",hide_no_restriction:"Masquer sans restriction",show_city:"Afficher la ville",show_timestamp:"Afficher l'heure de mise à jour",last_updated:"Mis à jour",active_restrictions:"restriction(s) active(s)",unknown:"Inconnu",no_data:"Aucune donnée",configure_entities:"Veuillez configurer les entités dans l'éditeur de carte",currently_restricted:"Restriction actuelle",yes:"Oui",no:"Non",next_restriction:"Prochaine restriction",entity_unavailable:"Entité indisponible",entity_not_found:"Entité introuvable",entity_unknown:"État inconnu",no_active_restrictions:"Aucune restriction active",refresh:"Rafraîchir",fountains:"Fontaines",gardens:"Jardins",lawns:"Pelouses",vehicle_wash:"Lavage de véhicules",pools:"Piscines",roads:"Routes",roofs:"Toits",ponds:"Étangs","categorie.alimentation_des_fontaines":"Alimentation des fontaines","categorie.jardins_potagers":"Jardins potagers","categorie.pelouses":"Pelouses","categorie.lavage_des_vehicules":"Lavage des véhicules","categorie.piscines":"Piscines","categorie.voiries_trottoirs":"Voiries et trottoirs","categorie.toitures_facades":"Toitures et façades","categorie.plans_deau":"Plans d'eau"}};function pt(t,e="en"){return _t[e.startsWith("fr")?"fr":"en"][t]||t}const gt=["alimentation_des_fontaines","jardins_potagers","pelouses","lavage_des_vehicules","piscines","voiries_trottoirs","toitures_facades","plans_deau"],ft={type:"custom:vigieau-card",city_code:"",alert_level_entity:"",alert_level_numeric_entity:"",restriction_entities:[],show_alert_level:!0,show_restrictions:!0,show_progress:!1,compact:!1,hide_no_restriction:!1,show_city:!0,show_timestamp:!0,sort:"severity"};function mt(t){const e=t.toLowerCase().trim();return{alert_level_entity:`sensor.alert_level_in_${e}`,alert_level_numeric_entity:`sensor.alert_level_in_${e}_numeric`,restriction_entities:gt.map(t=>`sensor.${t}_restrictions_${e}`)}}function vt(t,e){const i={...t};if(e&&e.trim()){const s=mt(e);t.alert_level_entity||(i.alert_level_entity=s.alert_level_entity),t.alert_level_numeric_entity||(i.alert_level_numeric_entity=s.alert_level_numeric_entity),t.restriction_entities&&0!==t.restriction_entities.length||(i.restriction_entities=s.restriction_entities)}return i}function yt(t){if(!t)return 0;return{"aucune restriction":0,vigilance:0,aucune:0,normale:0,aucun:0,rien:0,sensibilisation:1,alerte:2,"alerte renforcée":3,"réduction":3,"interdiction sauf exception":4,"interdiction sur plage horaire":4,crise:5,interdiction:5}[t.toLowerCase().trim()]??0}console.info("Vigieau Card v1.0.0-B1");const $t={"aucune restriction":"green",vigilance:"green",alerte:"yellow","alerte renforcée":"orange",crise:"red","interdiction sauf exception":"orange",interdiction:"red","interdiction sur plage horaire":"orange",sensibilisation:"yellow","réduction":"orange"};function wt(t){if(!t)return"grey";const e=t.toLowerCase().trim();return"unavailable"===e||"unknown"===e?"grey":$t[e]||"grey"}function bt(t,e){const i=pt(`categorie.${t}`,e);return i!==`categorie.${t}`?i:t.replace(/_/g," ")}function xt(t){return{alimentation_des_fontaines:"mdi:fountain",jardins_potagers:"mdi:flower",pelouses:"mdi:grass",lavage_des_vehicules:"mdi:car-wash",piscines:"mdi:pool",voiries_trottoirs:"mdi:road",toitures_facades:"mdi:roof",plans_deau:"mdi:water",fountains:"mdi:fountain",gardens:"mdi:flower",lawns:"mdi:grass",vehicle_wash:"mdi:car-wash",pools:"mdi:pool",roads:"mdi:road",roofs:"mdi:roof",ponds:"mdi:water"}[t]||"mdi:water"}let At=class extends at{constructor(){super(...arguments),this._entities={alert_level:null,alert_level_numeric:null,last_updated:null,restrictions:new Map}}static getStubConfig(){return{type:"custom:vigieau-card",city_code:"",alert_level_entity:"",alert_level_numeric_entity:"",restriction_entities:[],show_alert_level:!0,show_restrictions:!0,show_progress:!1,compact:!1,hide_no_restriction:!1}}static async getConfigElement(){return await Promise.resolve().then(function(){return St}),document.createElement("vigieau-card-editor")}setConfig(t){const e=vt(t,t.city_code??"");this._config={...ft,...e},this._updateEntities()}getCardSize(){return 6}shouldUpdate(t){if(t.has("_config"))return!0;if(t.has("hass")){const e=t.get("hass");if(!e||!this._entities||!this._config)return!0;if(this._config.alert_level_entity){const t=e.states[this._config.alert_level_entity],i=this.hass.states[this._config.alert_level_entity];if(t?.state!==i?.state)return!0}if(this._config.alert_level_numeric_entity){const t=e.states[this._config.alert_level_numeric_entity],i=this.hass.states[this._config.alert_level_numeric_entity];if(t?.state!==i?.state)return!0}return this._getRestrictionEntities().some(t=>e.states[t]?.state!==this.hass.states[t]?.state)}return!0}updated(t){super.updated(t),(t.has("hass")||t.has("_config"))&&this._updateEntities()}_getRestrictionEntities(){return this._config.restriction_entities||[]}_getState(t){if(t&&this.hass)return this.hass.states[t]}_getColorFromAttributes(t){const e=t.Couleur??t.couleur;return e&&"string"==typeof e?e:null}_extractCategoryFromEntityId(t){const e=t.match(/^sensor\.(.+)_restrictions_/);if(e)return e[1];const i=t.match(/^binary_sensor\.vigieau-(.+)-/);if(i)return i[1];const s=t.split(".");return s.length>1?s[1].replace(/_restrictions.*$/,""):""}_updateEntities(){if(!this.hass||!this._config)return;const t=this._getState(this._config.alert_level_entity??null);this._entities.alert_level=t?.state||null,this._entities.alert_level_numeric=this._getState(this._config.alert_level_numeric_entity??null)?.state||null,this._entities.last_updated=t?.last_updated??null,this._entities.restrictions.clear();const e=this._getRestrictionEntities();for(const t of e){const e=this._getState(t);let i="";if(e){const t=e.attributes;t&&void 0!==t.categorie?i=t.categorie:t&&void 0!==t.category&&(i=t.category)}i||(i=this._extractCategoryFromEntityId(t)),this._entities.restrictions.set(t,{state:e?.state??"",entity_id:e?.entity_id??t,attributes:e?.attributes??{},category:i,entityFound:Boolean(e)})}this.requestUpdate()}_getDisplayLevel(t){return t?t.charAt(0).toUpperCase()+t.slice(1):"Inconnu"}_isBinarySensor(t){return t.startsWith("binary_sensor.")}_renderHeader(){const t=this._entities.alert_level,e=this._entities.alert_level_numeric,i=this._entities.last_updated,s=this.hass?.locale?.language||this.hass?.language||"fr",r=wt(t),n=this._getState(this._config.alert_level_entity??null),o=Boolean(this._config.alert_level_entity)&&!n;let a;a=o?pt("entity_not_found",s):t?"unavailable"===t?pt("entity_unavailable",s):"unknown"===t?pt("entity_unknown",s):this._getDisplayLevel(t):pt("unknown",s);let c=q``;this._config.show_city&&this._config.city_code&&(c=q`<span class="card-city">${this._config.city_code}</span>`);let l=q``;if(this._config.show_timestamp&&i){const t=new Date(i);isNaN(t.getTime())||(l=q`<span class="last-updated">${pt("last_updated",s)}: ${t.toLocaleString(s,{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>`)}let h=q``;if(this._config.show_restrictions){const t=(this._config.restriction_entities??[]).filter(t=>{const e=this._entities.restrictions.get(t);return e&&!this._isNoRestriction(e.state)}).length;t>0&&(h=q`<span class="active-count">${t} ${pt("active_restrictions",s)}</span>`)}let d=q``;if(this._config.show_progress&&null!==e&&!isNaN(Number(e))){const t=Math.round(Number(e)/4*100);d=q`
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${t}%"></div>
        </div>
        <span class="progress-percent">${t}%</span>
      `}const u=this._config.alert_level_entity;return q`
      <div class="card-header">
        <div class="header-main">
          <div class="card-title">
            <h3>Vigieau</h3>
            ${c}
          </div>
          <div class="header-meta">
            ${l}
            ${h}
          </div>
          <div
            class="alert-level ${r} ${o?"entity-not-found":""}"
            role="button"
            tabindex="0"
            aria-label="${a}"
            aria-live="polite"
            @click=${()=>this._showMoreInfo(u??null)}
            @keydown=${t=>this._handleCardKeyDown(t,u??null)}
          >
            <ha-icon icon="mdi:alert-circle-outline" style="color: ${r};" aria-hidden="true"></ha-icon>
            <span>${a}</span>
          </div>
          ${d}
        </div>
        <ha-icon
          icon="mdi:refresh"
          class="refresh-button"
          role="button"
          tabindex="0"
          aria-label="${pt("refresh",s)}"
          @click=${()=>this._refresh()}
          @keydown=${t=>this._handleRefreshKeyDown(t)}
        ></ha-icon>
      </div>
    `}_renderRestrictions(){const t=this._entities.restrictions,e=this.hass?.locale?.language||this.hass?.language||"fr";if(0===t.size)return q`
        <div class="restrictions-grid">
          <span>${pt("no_data",e)}</span>
        </div>
      `;let i=Array.from(t.entries());if(this._config.hide_no_restriction&&(i=i.filter(t=>{const e=t[1];return!this._isNoRestriction(e.state)})),i=i.filter(t=>t[1].entityFound),"alpha"===this._config.sort?i.sort((t,i)=>{const s=bt(t[1].category,e),r=bt(i[1].category,e);return s.localeCompare(r,e)}):"severity"===this._config.sort&&i.sort((t,e)=>yt(e[1].state)-yt(t[1].state)),0===i.length)return q`
        <div class="restrictions-grid">
          <span>${pt("no_active_restrictions",e)}</span>
        </div>
      `;const s=i.map(([,t])=>{const{state:i,entity_id:s,attributes:r,category:n,entityFound:o}=t,a=!o,c=this._getColorFromAttributes(r)||(a?"grey":wt(i)),l=bt(n,e),h=this._isBinarySensor(s);let d=l;if(a)d+=` - ${pt("entity_not_found",e)}`;else{const t=r.currently_restricted;void 0!==t&&(d+=` - ${pt("currently_restricted",e)}: ${pt(t?"yes":"no",e)}`);const i=r.next_restriction_start,s=r.next_restriction_end;i&&s&&(d+=` - ${pt("next_restriction",e)}: ${i} / ${s}`)}const u=h?"on"===i?"mdi:water-off":"mdi:water-check":xt(n);let _;_=a?pt("entity_not_found",e):i?"unavailable"===i?pt("entity_unavailable",e):"unknown"===i?pt("entity_unknown",e):this._getDisplayLevel(i):pt("unknown",e);const p=`${l}: ${_}`;return q`
        <div
          class="restriction-item ${this._config.compact?"compact":""} ${h?"binary":""} ${a?"entity-not-found":""}"
          role="button"
          tabindex="0"
          aria-label="${p}"
          title="${d}"
          @click=${()=>this._showMoreInfo(s)}
          @keydown=${t=>this._handleCardKeyDown(t,s)}
          style="border-color: ${c};"
        >
          <ha-icon icon="${u}" style="color: ${c};" aria-hidden="true"></ha-icon>
          <div class="restriction-content">
            <span class="restriction-name">${l}</span>
            <span class="restriction-level" style="color: ${c};">${_}</span>
          </div>
        </div>
      `});return q`
      <div class="restrictions-grid ${this._config.compact?"compact":""}">
        ${s}
      </div>
    `}_renderConfigMissing(){const t=this.hass?.locale?.language||this.hass?.language||"fr";return q`
      <div class="config-missing">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${pt("configure_entities",t)}</span>
      </div>
    `}_showMoreInfo(t){if(!t)return;const e=new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0});this.dispatchEvent(e)}_isNoRestriction(t){if(!t)return!1;const e=t.toLowerCase().trim();return"aucune restriction"===e||"vigilance"===e||"aucune"===e||"normale"===e||"aucun"===e||"rien"===e}_handleCardKeyDown(t,e){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showMoreInfo(e))}_refresh(){this._updateEntities()}_handleRefreshKeyDown(t){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._refresh())}render(){if(!this._config||!this.hass)return q``;const t=Boolean(this._config.alert_level_entity),e=(this._config.restriction_entities??[]).length>0;return t||e?q`
      <ha-card class="${this._config.compact?"compact":""}">
        ${this._config.show_alert_level&&t?this._renderHeader():""}
        ${this._config.show_restrictions&&e?this._renderRestrictions():""}
      </ha-card>
    `:q`
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
        gap: 16px;
      }

      .header-main {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .card-title {
        font-weight: 700;
        font-size: 1.25em;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
      }

      .card-title h3 {
        margin: 0;
        font-size: inherit;
        font-weight: inherit;
      }

      .card-city {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        white-space: nowrap;
      }

      .header-meta {
        display: flex;
        gap: 12px;
        font-size: 0.8em;
        color: var(--secondary-text-color);
        flex-wrap: wrap;
      }

      .last-updated,
      .active-count {
        white-space: nowrap;
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

      .alert-level.entity-not-found {
        color: var(--warning-color, var(--primary-color));
      }

      .alert-level.entity-not-found ha-icon {
        color: var(--warning-color, var(--primary-color));
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

      .restriction-item.entity-not-found {
        border-color: var(--disabled-text-color, #aaa);
        opacity: 0.6;
      }

      .restriction-item.entity-not-found ha-icon {
        color: var(--disabled-text-color, #aaa);
      }

      .restriction-item.entity-not-found .restriction-level {
        color: var(--disabled-text-color, #aaa);
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
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.3;
      }

      .restriction-level {
        font-size: 0.75em;
        color: var(--secondary-text-color);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Accessibility: focus visible for keyboard navigation */
      .alert-level[role="button"]:focus-visible,
      .restriction-item[role="button"]:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .alert-level[role="button"],
      .restriction-item[role="button"] {
        outline: none;
      }

      /* Compact mode */
      ha-card.compact {
        padding: 8px;
      }

      ha-card.compact .card-header {
        margin-bottom: 8px;
        padding-bottom: 6px;
      }

      ha-card.compact .alert-level span {
        font-size: 1em;
      }

      ha-card.compact .card-title {
        font-size: 1.1em;
      }

      .restrictions-grid.compact {
        gap: 6px;
        margin-top: 8px;
      }

      .restriction-item.compact {
        padding: 6px;
        min-height: 60px;
        gap: 6px;
      }

      .restriction-item.compact ha-icon {
        width: 16px;
        height: 16px;
      }

      .restriction-item.compact .restriction-name {
        font-size: 0.75em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.2;
      }

      .restriction-item.compact .restriction-level {
        font-size: 0.65em;
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

      .refresh-button {
        width: 24px;
        height: 24px;
        color: var(--primary-color);
        cursor: pointer;
        margin-left: auto;
        transition: transform 0.2s ease;
      }

      .refresh-button:hover {
        color: var(--primary-text-color);
        transform: rotate(90deg);
      }

      .refresh-button:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
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
    `}};var Et;t([ut({attribute:!1})],At.prototype,"hass",void 0),t([ut()],At.prototype,"_config",void 0),t([function(t){return ut({...t,state:!0,attribute:!1})}()],At.prototype,"_entities",void 0),At=t([lt("vigieau-card")],At),window.customCards=window.customCards||[],window.customCards.push({type:"vigieau-card",name:"Vigieau Eau",description:"French drought water restrictions card",preview:!1,documentationURL:"https://github.com/kamaradclimber/vigieau"});let Ct=Et=class extends at{constructor(){super(...arguments),this._config={type:"custom:vigieau-card",city_code:"",alert_level_entity:"",alert_level_numeric_entity:"",restriction_entities:[],show_alert_level:!0,show_restrictions:!0,compact:!1,hide_no_restriction:!1,show_city:!0,show_timestamp:!0}}get config(){return this._config}set config(t){this._config={...Et.getStubConfig(),...t},this.requestUpdate()}static getStubConfig(){return{...ft}}setConfig(t){this.config=t}_notifyConfigChanged(){this.requestUpdate(),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:!0,composed:!0}))}_handleCityCodeChanged(t){const e=t.detail?.value??t.target.value;this._config=vt({...this._config,city_code:e},e),this._notifyConfigChanged()}getCardSize(){return 6}render(){const t="fr"===this.hass?.locale?.language;return q`
      <ha-settings>
        <!-- City code or slug -->
        <div style="margin-bottom: 16px;">
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${t?"Code ville / slug":"City code or slug"}
          </div>
          <input
            type="text"
            .value=${this._config.city_code||""}
            .placeholder=${t?"Ex: 35322 ou thorigne_fouillard":"Ex: 35322 or thorigne_fouillard"}
            @input=${t=>this._handleCityCodeChanged(t)}
            style="width: 100%; padding: 8px; font-size: 1rem; border: 1px solid var(--divider-color); border-radius: 4px; background: var(--input-background-color, var(--card-background-color)); color: var(--primary-text-color); box-sizing: border-box;"
          ></input>
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
            @value-changed=${t=>{this._config.alert_level_entity=t.detail.value,this._notifyConfigChanged()}}
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
            @value-changed=${t=>{this._config.alert_level_numeric_entity=t.detail.value,this._notifyConfigChanged()}}
            .placeholder=${"Ex: sensor.alert_level_in_thorigne_fouillard_numeric"}
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
            .domain=${["sensor","binary_sensor"]}
            .multiple=${!0}
            @value-changed=${t=>{this._config.restriction_entities=t.detail.value,this._notifyConfigChanged()}}
            .placeholder=${t?"Ex: sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard ou binary_sensor.vigieau_...":"Ex: sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard or binary_sensor.vigieau_..."}
          ></ha-entity-picker>
        </div>

        <ha-switch
          .checked=${this._config.show_alert_level}
          @change=${t=>{this._config.show_alert_level=t.target.checked,this._notifyConfigChanged()}}
        >
          ${t?"Afficher le niveau d'alerte":"Show alert level"}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_restrictions}
          @change=${t=>{this._config.show_restrictions=t.target.checked,this._notifyConfigChanged()}}
        >
          ${t?"Afficher les restrictions":"Show restrictions"}
        </ha-switch>

        <ha-switch
          .checked=${this._config.compact}
          @change=${t=>{this._config.compact=t.target.checked,this._notifyConfigChanged()}}
        >
          ${t?"Taille compacte":"Compact size"}
        </ha-switch>

        <ha-switch
          .checked=${this._config.hide_no_restriction}
          @change=${t=>{this._config.hide_no_restriction=t.target.checked,this._notifyConfigChanged()}}
        >
          ${t?"Masquer sans restriction":"Hide no restriction"}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_city}
          @change=${t=>{this._config.show_city=t.target.checked,this._notifyConfigChanged()}}
        >
          ${t?"Afficher la ville":"Show city"}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_timestamp}
          @change=${t=>{this._config.show_timestamp=t.target.checked,this._notifyConfigChanged()}}
        >
          ${t?"Afficher l'heure de mise à jour":"Show last update time"}
        </ha-switch>
      </ha-settings>
    `}static get styles(){return o`
      input[type="text"],
      ha-entity-picker {
        margin-bottom: 16px;
        display: block;
        width: 100%;
      }

      ha-switch {
        margin-right: 16px;
        margin-bottom: 16px;
        display: block;
      }
    `}};t([ut()],Ct.prototype,"hass",void 0),t([ut({attribute:!1})],Ct.prototype,"config",null),Ct=Et=t([lt("vigieau-card-editor")],Ct);var St=Object.freeze({__proto__:null,get VigieauCardEditor(){return Ct}});export{At as VigieauCard,mt as buildEntityIdsFromCityCode,bt as getCategoryDisplayName,xt as getCategoryIcon,wt as getRestrictionColor};
//# sourceMappingURL=vigieau-card.js.map
