(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Va="170",kc=0,bo=1,Hc=2,Gl=1,Gc=2,ln=3,Pn=0,Ce=1,cn=2,An=0,yi=1,dn=2,To=3,wo=4,Vc=5,Gn=100,Wc=101,Xc=102,qc=103,Yc=104,$c=200,Kc=201,Jc=202,Zc=203,Zr=204,jr=205,jc=206,Qc=207,th=208,eh=209,nh=210,ih=211,sh=212,rh=213,ah=214,Qr=0,ta=1,ea=2,bi=3,na=4,ia=5,sa=6,ra=7,Vl=0,oh=1,lh=2,Rn=0,ch=1,hh=2,uh=3,Wl=4,fh=5,dh=6,ph=7,Xl=300,Ti=301,wi=302,aa=303,oa=304,er=306,la=1e3,Wn=1001,ca=1002,Ye=1003,mh=1004,os=1005,Ze=1006,ur=1007,Xn=1008,pn=1009,ql=1010,Yl=1011,Qi=1012,Wa=1013,$n=1014,hn=1015,es=1016,Xa=1017,qa=1018,Ai=1020,$l=35902,Kl=1021,Jl=1022,qe=1023,Zl=1024,jl=1025,Mi=1026,Ri=1027,Ql=1028,Ya=1029,tc=1030,$a=1031,Ka=1033,Bs=33776,ks=33777,Hs=33778,Gs=33779,ha=35840,ua=35841,fa=35842,da=35843,pa=36196,ma=37492,ga=37496,_a=37808,va=37809,xa=37810,ya=37811,Ma=37812,Sa=37813,Ea=37814,ba=37815,Ta=37816,wa=37817,Aa=37818,Ra=37819,Ca=37820,Pa=37821,Vs=36492,La=36494,Da=36495,ec=36283,Ia=36284,Ua=36285,Na=36286,gh=3200,_h=3201,nc=0,vh=1,wn="",Te="srgb",Li="srgb-linear",nr="linear",$t="srgb",Qn=7680,Ao=519,xh=512,yh=513,Mh=514,ic=515,Sh=516,Eh=517,bh=518,Th=519,Fa=35044,Ro="300 es",un=2e3,Ks=2001;class Di{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ws=Math.PI/180,Oa=180/Math.PI;function Cn(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[s&255]+ye[s>>8&255]+ye[s>>16&255]+ye[s>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function ve(s,t,e){return Math.max(t,Math.min(e,s))}function wh(s,t){return(s%t+t)%t}function fr(s,t,e){return(1-e)*s+e*t}function Je(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Kt(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class nt{constructor(t=0,e=0){nt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ve(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Lt{constructor(t,e,n,i,r,a,o,l,c){Lt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],p=n[5],g=n[8],_=i[0],m=i[3],d=i[6],E=i[1],b=i[4],M=i[7],N=i[2],A=i[5],R=i[8];return r[0]=a*_+o*E+l*N,r[3]=a*m+o*b+l*A,r[6]=a*d+o*M+l*R,r[1]=c*_+h*E+u*N,r[4]=c*m+h*b+u*A,r[7]=c*d+h*M+u*R,r[2]=f*_+p*E+g*N,r[5]=f*m+p*b+g*A,r[8]=f*d+p*M+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*r,p=c*r-a*l,g=e*u+n*f+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=f*_,t[4]=(h*e-i*l)*_,t[5]=(i*r-o*e)*_,t[6]=p*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(dr.makeScale(t,e)),this}rotate(t){return this.premultiply(dr.makeRotation(-t)),this}translate(t,e){return this.premultiply(dr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const dr=new Lt;function sc(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Js(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Ah(){const s=Js("canvas");return s.style.display="block",s}const Co={};function Yi(s){s in Co||(Co[s]=!0,console.warn(s))}function Rh(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Ch(s){const t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Ph(s){const t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Gt={enabled:!0,workingColorSpace:Li,spaces:{},convert:function(s,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===$t&&(s.r=fn(s.r),s.g=fn(s.g),s.b=fn(s.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(s.applyMatrix3(this.spaces[t].toXYZ),s.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===$t&&(s.r=Si(s.r),s.g=Si(s.g),s.b=Si(s.b))),s},fromWorkingColorSpace:function(s,t){return this.convert(s,this.workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===wn?nr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,t=this.workingColorSpace){return s.fromArray(this.spaces[t].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,t,e){return s.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function fn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Si(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const Po=[.64,.33,.3,.6,.15,.06],Lo=[.2126,.7152,.0722],Do=[.3127,.329],Io=new Lt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Uo=new Lt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Gt.define({[Li]:{primaries:Po,whitePoint:Do,transfer:nr,toXYZ:Io,fromXYZ:Uo,luminanceCoefficients:Lo,workingColorSpaceConfig:{unpackColorSpace:Te},outputColorSpaceConfig:{drawingBufferColorSpace:Te}},[Te]:{primaries:Po,whitePoint:Do,transfer:$t,toXYZ:Io,fromXYZ:Uo,luminanceCoefficients:Lo,outputColorSpaceConfig:{drawingBufferColorSpace:Te}}});let ti;class Lh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ti===void 0&&(ti=Js("canvas")),ti.width=t.width,ti.height=t.height;const n=ti.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ti}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Js("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=fn(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(fn(e[n]/255)*255):e[n]=fn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Dh=0;class rc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Dh++}),this.uuid=Cn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(pr(i[a].image)):r.push(pr(i[a]))}else r=pr(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function pr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Lh.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ih=0;class Ae extends Di{constructor(t=Ae.DEFAULT_IMAGE,e=Ae.DEFAULT_MAPPING,n=Wn,i=Wn,r=Ze,a=Xn,o=qe,l=pn,c=Ae.DEFAULT_ANISOTROPY,h=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ih++}),this.uuid=Cn(),this.name="",this.source=new rc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Lt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Xl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case la:t.x=t.x-Math.floor(t.x);break;case Wn:t.x=t.x<0?0:1;break;case ca:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case la:t.y=t.y-Math.floor(t.y);break;case Wn:t.y=t.y<0?0:1;break;case ca:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ae.DEFAULT_IMAGE=null;Ae.DEFAULT_MAPPING=Xl;Ae.DEFAULT_ANISOTROPY=1;class Jt{constructor(t=0,e=0,n=0,i=1){Jt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],g=l[9],_=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(c+1)/2,M=(p+1)/2,N=(d+1)/2,A=(h+f)/4,R=(u+_)/4,P=(g+m)/4;return b>M&&b>N?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=A/n,r=R/n):M>N?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=A/i,r=P/i):N<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(N),n=R/r,i=P/r),this.set(n,i,r,e),this}let E=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(u-_)/E,this.z=(f-h)/E,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Uh extends Di{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Jt(0,0,t,e),this.scissorTest=!1,this.viewport=new Jt(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ze,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ae(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new rc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Kn extends Uh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ac extends Ae{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ye,this.minFilter=Ye,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nh extends Ae{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ye,this.minFilter=Ye,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ns{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const f=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==f||c!==p||h!==g){let m=1-o;const d=l*f+c*p+h*g+u*_,E=d>=0?1:-1,b=1-d*d;if(b>Number.EPSILON){const N=Math.sqrt(b),A=Math.atan2(N,d*E);m=Math.sin(m*A)/N,o=Math.sin(o*A)/N}const M=o*E;if(l=l*m+f*M,c=c*m+p*M,h=h*m+g*M,u=u*m+_*M,m===1-o){const N=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=N,c*=N,h*=N,u*=N}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],f=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*p-c*f,t[e+1]=l*g+h*f+c*u-o*p,t[e+2]=c*g+h*p+o*f-l*u,t[e+3]=h*g-o*u-l*f-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),f=l(n/2),p=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"YZX":this._x=f*h*u+c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u-f*p*g;break;case"XZY":this._x=f*h*u-c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-i)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(r+c)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-c)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-i)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ve(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+i*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*i+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(t=0,e=0,n=0){w.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(No.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(No.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-r*i),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return mr.copy(this).projectOnVector(t),this.sub(mr)}reflect(t){return this.sub(mr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ve(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const mr=new w,No=new ns;class is{constructor(t=new w(1/0,1/0,1/0),e=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ve.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ve.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ve.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ve):Ve.fromBufferAttribute(r,a),Ve.applyMatrix4(t.matrixWorld),this.expandByPoint(Ve);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ls.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ls.copy(n.boundingBox)),ls.applyMatrix4(t.matrixWorld),this.union(ls)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ve),Ve.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Oi),cs.subVectors(this.max,Oi),ei.subVectors(t.a,Oi),ni.subVectors(t.b,Oi),ii.subVectors(t.c,Oi),vn.subVectors(ni,ei),xn.subVectors(ii,ni),Un.subVectors(ei,ii);let e=[0,-vn.z,vn.y,0,-xn.z,xn.y,0,-Un.z,Un.y,vn.z,0,-vn.x,xn.z,0,-xn.x,Un.z,0,-Un.x,-vn.y,vn.x,0,-xn.y,xn.x,0,-Un.y,Un.x,0];return!gr(e,ei,ni,ii,cs)||(e=[1,0,0,0,1,0,0,0,1],!gr(e,ei,ni,ii,cs))?!1:(hs.crossVectors(vn,xn),e=[hs.x,hs.y,hs.z],gr(e,ei,ni,ii,cs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ve).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ve).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(nn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const nn=[new w,new w,new w,new w,new w,new w,new w,new w],Ve=new w,ls=new is,ei=new w,ni=new w,ii=new w,vn=new w,xn=new w,Un=new w,Oi=new w,cs=new w,hs=new w,Nn=new w;function gr(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Nn.fromArray(s,r);const o=i.x*Math.abs(Nn.x)+i.y*Math.abs(Nn.y)+i.z*Math.abs(Nn.z),l=t.dot(Nn),c=e.dot(Nn),h=n.dot(Nn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Fh=new is,zi=new w,_r=new w;class ss{constructor(t=new w,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Fh.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;zi.subVectors(t,this.center);const e=zi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(zi,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(_r.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(zi.copy(t.center).add(_r)),this.expandByPoint(zi.copy(t.center).sub(_r))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const sn=new w,vr=new w,us=new w,yn=new w,xr=new w,fs=new w,yr=new w;class ir{constructor(t=new w,e=new w(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,sn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=sn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(sn.copy(this.origin).addScaledVector(this.direction,e),sn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){vr.copy(t).add(e).multiplyScalar(.5),us.copy(e).sub(t).normalize(),yn.copy(this.origin).sub(vr);const r=t.distanceTo(e)*.5,a=-this.direction.dot(us),o=yn.dot(this.direction),l=-yn.dot(us),c=yn.lengthSq(),h=Math.abs(1-a*a);let u,f,p,g;if(h>0)if(u=a*l-o,f=a*o-l,g=r*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,p=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(vr).addScaledVector(us,f),p}intersectSphere(t,e){sn.subVectors(t.center,this.origin);const n=sn.dot(this.direction),i=sn.dot(sn)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,sn)!==null}intersectTriangle(t,e,n,i,r){xr.subVectors(e,t),fs.subVectors(n,t),yr.crossVectors(xr,fs);let a=this.direction.dot(yr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;yn.subVectors(this.origin,t);const l=o*this.direction.dot(fs.crossVectors(yn,fs));if(l<0)return null;const c=o*this.direction.dot(xr.cross(yn));if(c<0||l+c>a)return null;const h=-o*yn.dot(yr);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Zt{constructor(t,e,n,i,r,a,o,l,c,h,u,f,p,g,_,m){Zt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,h,u,f,p,g,_,m)}set(t,e,n,i,r,a,o,l,c,h,u,f,p,g,_,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=i,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Zt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/si.setFromMatrixColumn(t,0).length(),r=1/si.setFromMatrixColumn(t,1).length(),a=1/si.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,p=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=f-_*c,e[9]=-o*l,e[2]=_-f*c,e[6]=g+p*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,p=l*u,g=c*h,_=c*u;e[0]=f+_*o,e[4]=g*o-p,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=_+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,p=l*u,g=c*h,_=c*u;e[0]=f-_*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=_-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,p=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=g*c-p,e[8]=f*c+_,e[1]=l*u,e[5]=_*c+f,e[9]=p*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-f*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=p*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+_,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Oh,t,zh)}lookAt(t,e,n){const i=this.elements;return Le.subVectors(t,e),Le.lengthSq()===0&&(Le.z=1),Le.normalize(),Mn.crossVectors(n,Le),Mn.lengthSq()===0&&(Math.abs(n.z)===1?Le.x+=1e-4:Le.z+=1e-4,Le.normalize(),Mn.crossVectors(n,Le)),Mn.normalize(),ds.crossVectors(Le,Mn),i[0]=Mn.x,i[4]=ds.x,i[8]=Le.x,i[1]=Mn.y,i[5]=ds.y,i[9]=Le.y,i[2]=Mn.z,i[6]=ds.z,i[10]=Le.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],p=n[13],g=n[2],_=n[6],m=n[10],d=n[14],E=n[3],b=n[7],M=n[11],N=n[15],A=i[0],R=i[4],P=i[8],S=i[12],x=i[1],C=i[5],k=i[9],B=i[13],W=i[2],K=i[6],V=i[10],Z=i[14],G=i[3],st=i[7],ht=i[11],yt=i[15];return r[0]=a*A+o*x+l*W+c*G,r[4]=a*R+o*C+l*K+c*st,r[8]=a*P+o*k+l*V+c*ht,r[12]=a*S+o*B+l*Z+c*yt,r[1]=h*A+u*x+f*W+p*G,r[5]=h*R+u*C+f*K+p*st,r[9]=h*P+u*k+f*V+p*ht,r[13]=h*S+u*B+f*Z+p*yt,r[2]=g*A+_*x+m*W+d*G,r[6]=g*R+_*C+m*K+d*st,r[10]=g*P+_*k+m*V+d*ht,r[14]=g*S+_*B+m*Z+d*yt,r[3]=E*A+b*x+M*W+N*G,r[7]=E*R+b*C+M*K+N*st,r[11]=E*P+b*k+M*V+N*ht,r[15]=E*S+b*B+M*Z+N*yt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],p=t[14],g=t[3],_=t[7],m=t[11],d=t[15];return g*(+r*l*u-i*c*u-r*o*f+n*c*f+i*o*p-n*l*p)+_*(+e*l*p-e*c*f+r*a*f-i*a*p+i*c*h-r*l*h)+m*(+e*c*u-e*o*p-r*a*u+n*a*p+r*o*h-n*c*h)+d*(-i*o*h-e*l*u+e*o*f+i*a*u-n*a*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],p=t[11],g=t[12],_=t[13],m=t[14],d=t[15],E=u*m*c-_*f*c+_*l*p-o*m*p-u*l*d+o*f*d,b=g*f*c-h*m*c-g*l*p+a*m*p+h*l*d-a*f*d,M=h*_*c-g*u*c+g*o*p-a*_*p-h*o*d+a*u*d,N=g*u*l-h*_*l-g*o*f+a*_*f+h*o*m-a*u*m,A=e*E+n*b+i*M+r*N;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return t[0]=E*R,t[1]=(_*f*r-u*m*r-_*i*p+n*m*p+u*i*d-n*f*d)*R,t[2]=(o*m*r-_*l*r+_*i*c-n*m*c-o*i*d+n*l*d)*R,t[3]=(u*l*r-o*f*r-u*i*c+n*f*c+o*i*p-n*l*p)*R,t[4]=b*R,t[5]=(h*m*r-g*f*r+g*i*p-e*m*p-h*i*d+e*f*d)*R,t[6]=(g*l*r-a*m*r-g*i*c+e*m*c+a*i*d-e*l*d)*R,t[7]=(a*f*r-h*l*r+h*i*c-e*f*c-a*i*p+e*l*p)*R,t[8]=M*R,t[9]=(g*u*r-h*_*r-g*n*p+e*_*p+h*n*d-e*u*d)*R,t[10]=(a*_*r-g*o*r+g*n*c-e*_*c-a*n*d+e*o*d)*R,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*p-e*o*p)*R,t[12]=N*R,t[13]=(h*_*i-g*u*i+g*n*f-e*_*f-h*n*m+e*u*m)*R,t[14]=(g*o*i-a*_*i-g*n*l+e*_*l+a*n*m-e*o*m)*R,t[15]=(a*u*i-h*o*i+h*n*l-e*u*l-a*n*f+e*o*f)*R,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,f=r*c,p=r*h,g=r*u,_=a*h,m=a*u,d=o*u,E=l*c,b=l*h,M=l*u,N=n.x,A=n.y,R=n.z;return i[0]=(1-(_+d))*N,i[1]=(p+M)*N,i[2]=(g-b)*N,i[3]=0,i[4]=(p-M)*A,i[5]=(1-(f+d))*A,i[6]=(m+E)*A,i[7]=0,i[8]=(g+b)*R,i[9]=(m-E)*R,i[10]=(1-(f+_))*R,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=si.set(i[0],i[1],i[2]).length();const a=si.set(i[4],i[5],i[6]).length(),o=si.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],We.copy(this);const c=1/r,h=1/a,u=1/o;return We.elements[0]*=c,We.elements[1]*=c,We.elements[2]*=c,We.elements[4]*=h,We.elements[5]*=h,We.elements[6]*=h,We.elements[8]*=u,We.elements[9]*=u,We.elements[10]*=u,e.setFromRotationMatrix(We),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,i,r,a,o=un){const l=this.elements,c=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let p,g;if(o===un)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Ks)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=un){const l=this.elements,c=1/(e-t),h=1/(n-i),u=1/(a-r),f=(e+t)*c,p=(n+i)*h;let g,_;if(o===un)g=(a+r)*u,_=-2*u;else if(o===Ks)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const si=new w,We=new Zt,Oh=new w(0,0,0),zh=new w(1,1,1),Mn=new w,ds=new w,Le=new w,Fo=new Zt,Oo=new ns;class je{constructor(t=0,e=0,n=0,i=je.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],p=i[10];switch(e){case"XYZ":this._y=Math.asin(ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ve(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ve(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ve(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Fo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Fo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Oo.setFromEuler(this),this.setFromQuaternion(Oo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}je.DEFAULT_ORDER="XYZ";class Ja{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Bh=0;const zo=new w,ri=new ns,rn=new Zt,ps=new w,Bi=new w,kh=new w,Hh=new ns,Bo=new w(1,0,0),ko=new w(0,1,0),Ho=new w(0,0,1),Go={type:"added"},Gh={type:"removed"},ai={type:"childadded",child:null},Mr={type:"childremoved",child:null};class he extends Di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bh++}),this.uuid=Cn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=he.DEFAULT_UP.clone();const t=new w,e=new je,n=new ns,i=new w(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Zt},normalMatrix:{value:new Lt}}),this.matrix=new Zt,this.matrixWorld=new Zt,this.matrixAutoUpdate=he.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ja,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ri.setFromAxisAngle(t,e),this.quaternion.multiply(ri),this}rotateOnWorldAxis(t,e){return ri.setFromAxisAngle(t,e),this.quaternion.premultiply(ri),this}rotateX(t){return this.rotateOnAxis(Bo,t)}rotateY(t){return this.rotateOnAxis(ko,t)}rotateZ(t){return this.rotateOnAxis(Ho,t)}translateOnAxis(t,e){return zo.copy(t).applyQuaternion(this.quaternion),this.position.add(zo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Bo,t)}translateY(t){return this.translateOnAxis(ko,t)}translateZ(t){return this.translateOnAxis(Ho,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ps.copy(t):ps.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Bi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?rn.lookAt(Bi,ps,this.up):rn.lookAt(ps,Bi,this.up),this.quaternion.setFromRotationMatrix(rn),i&&(rn.extractRotation(i.matrixWorld),ri.setFromRotationMatrix(rn),this.quaternion.premultiply(ri.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Go),ai.child=t,this.dispatchEvent(ai),ai.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Gh),Mr.child=t,this.dispatchEvent(Mr),Mr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(rn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Go),ai.child=t,this.dispatchEvent(ai),ai.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bi,t,kh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bi,Hh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}he.DEFAULT_UP=new w(0,1,0);he.DEFAULT_MATRIX_AUTO_UPDATE=!0;he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Xe=new w,an=new w,Sr=new w,on=new w,oi=new w,li=new w,Vo=new w,Er=new w,br=new w,Tr=new w,wr=new Jt,Ar=new Jt,Rr=new Jt;class Ue{constructor(t=new w,e=new w,n=new w){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Xe.subVectors(t,e),i.cross(Xe);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Xe.subVectors(i,e),an.subVectors(n,e),Sr.subVectors(t,e);const a=Xe.dot(Xe),o=Xe.dot(an),l=Xe.dot(Sr),c=an.dot(an),h=an.dot(Sr),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,on)===null?!1:on.x>=0&&on.y>=0&&on.x+on.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,on)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,on.x),l.addScaledVector(a,on.y),l.addScaledVector(o,on.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return wr.setScalar(0),Ar.setScalar(0),Rr.setScalar(0),wr.fromBufferAttribute(t,e),Ar.fromBufferAttribute(t,n),Rr.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(wr,r.x),a.addScaledVector(Ar,r.y),a.addScaledVector(Rr,r.z),a}static isFrontFacing(t,e,n,i){return Xe.subVectors(n,e),an.subVectors(t,e),Xe.cross(an).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Xe.subVectors(this.c,this.b),an.subVectors(this.a,this.b),Xe.cross(an).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ue.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ue.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return Ue.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return Ue.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ue.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;oi.subVectors(i,n),li.subVectors(r,n),Er.subVectors(t,n);const l=oi.dot(Er),c=li.dot(Er);if(l<=0&&c<=0)return e.copy(n);br.subVectors(t,i);const h=oi.dot(br),u=li.dot(br);if(h>=0&&u<=h)return e.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(oi,a);Tr.subVectors(t,r);const p=oi.dot(Tr),g=li.dot(Tr);if(g>=0&&p<=g)return e.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(li,o);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Vo.subVectors(r,i),o=(u-h)/(u-h+(p-g)),e.copy(i).addScaledVector(Vo,o);const d=1/(m+_+f);return a=_*d,o=f*d,e.copy(n).addScaledVector(oi,a).addScaledVector(li,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const oc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Sn={h:0,s:0,l:0},ms={h:0,s:0,l:0};function Cr(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class At{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Te){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Gt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Gt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Gt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Gt.workingColorSpace){if(t=wh(t,1),e=ve(e,0,1),n=ve(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Cr(a,r,t+1/3),this.g=Cr(a,r,t),this.b=Cr(a,r,t-1/3)}return Gt.toWorkingColorSpace(this,i),this}setStyle(t,e=Te){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Te){const n=oc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=fn(t.r),this.g=fn(t.g),this.b=fn(t.b),this}copyLinearToSRGB(t){return this.r=Si(t.r),this.g=Si(t.g),this.b=Si(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Te){return Gt.fromWorkingColorSpace(Me.copy(this),t),Math.round(ve(Me.r*255,0,255))*65536+Math.round(ve(Me.g*255,0,255))*256+Math.round(ve(Me.b*255,0,255))}getHexString(t=Te){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Gt.workingColorSpace){Gt.fromWorkingColorSpace(Me.copy(this),e);const n=Me.r,i=Me.g,r=Me.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Gt.workingColorSpace){return Gt.fromWorkingColorSpace(Me.copy(this),e),t.r=Me.r,t.g=Me.g,t.b=Me.b,t}getStyle(t=Te){Gt.fromWorkingColorSpace(Me.copy(this),t);const e=Me.r,n=Me.g,i=Me.b;return t!==Te?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Sn),this.setHSL(Sn.h+t,Sn.s+e,Sn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Sn),t.getHSL(ms);const n=fr(Sn.h,ms.h,e),i=fr(Sn.s,ms.s,e),r=fr(Sn.l,ms.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Me=new At;At.NAMES=oc;let Vh=0;class Dn extends Di{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vh++}),this.uuid=Cn(),this.name="",this.blending=yi,this.side=Pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Zr,this.blendDst=jr,this.blendEquation=Gn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new At(0,0,0),this.blendAlpha=0,this.depthFunc=bi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ao,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qn,this.stencilZFail=Qn,this.stencilZPass=Qn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==yi&&(n.blending=this.blending),this.side!==Pn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Zr&&(n.blendSrc=this.blendSrc),this.blendDst!==jr&&(n.blendDst=this.blendDst),this.blendEquation!==Gn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==bi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ao&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Qn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Qn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ei extends Dn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new At(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new je,this.combine=Vl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ce=new w,gs=new nt;class ge{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Fa,this.updateRanges=[],this.gpuType=hn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)gs.fromBufferAttribute(this,e),gs.applyMatrix3(t),this.setXY(e,gs.x,gs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyMatrix3(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyMatrix4(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyNormalMatrix(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.transformDirection(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Je(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Kt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Je(e,this.array)),e}setX(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Je(e,this.array)),e}setY(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Je(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Je(e,this.array)),e}setW(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),i=Kt(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),i=Kt(i,this.array),r=Kt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Fa&&(t.usage=this.usage),t}}class lc extends ge{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class cc extends ge{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class jt extends ge{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Wh=0;const Oe=new Zt,Pr=new he,ci=new w,De=new is,ki=new is,me=new w;class le extends Di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=Cn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sc(t)?cc:lc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Lt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Oe.makeRotationFromQuaternion(t),this.applyMatrix4(Oe),this}rotateX(t){return Oe.makeRotationX(t),this.applyMatrix4(Oe),this}rotateY(t){return Oe.makeRotationY(t),this.applyMatrix4(Oe),this}rotateZ(t){return Oe.makeRotationZ(t),this.applyMatrix4(Oe),this}translate(t,e,n){return Oe.makeTranslation(t,e,n),this.applyMatrix4(Oe),this}scale(t,e,n){return Oe.makeScale(t,e,n),this.applyMatrix4(Oe),this}lookAt(t){return Pr.lookAt(t),Pr.updateMatrix(),this.applyMatrix4(Pr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ci).negate(),this.translate(ci.x,ci.y,ci.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new jt(n,3))}else{for(let n=0,i=e.count;n<i;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new is);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];De.setFromBufferAttribute(r),this.morphTargetsRelative?(me.addVectors(this.boundingBox.min,De.min),this.boundingBox.expandByPoint(me),me.addVectors(this.boundingBox.max,De.max),this.boundingBox.expandByPoint(me)):(this.boundingBox.expandByPoint(De.min),this.boundingBox.expandByPoint(De.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ss);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(t){const n=this.boundingSphere.center;if(De.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ki.setFromBufferAttribute(o),this.morphTargetsRelative?(me.addVectors(De.min,ki.min),De.expandByPoint(me),me.addVectors(De.max,ki.max),De.expandByPoint(me)):(De.expandByPoint(ki.min),De.expandByPoint(ki.max))}De.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)me.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(me));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)me.fromBufferAttribute(o,c),l&&(ci.fromBufferAttribute(t,c),me.add(ci)),i=Math.max(i,n.distanceToSquared(me))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ge(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let P=0;P<n.count;P++)o[P]=new w,l[P]=new w;const c=new w,h=new w,u=new w,f=new nt,p=new nt,g=new nt,_=new w,m=new w;function d(P,S,x){c.fromBufferAttribute(n,P),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,x),f.fromBufferAttribute(r,P),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,x),h.sub(c),u.sub(c),p.sub(f),g.sub(f);const C=1/(p.x*g.y-g.x*p.y);isFinite(C)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(C),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(C),o[P].add(_),o[S].add(_),o[x].add(_),l[P].add(m),l[S].add(m),l[x].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let P=0,S=E.length;P<S;++P){const x=E[P],C=x.start,k=x.count;for(let B=C,W=C+k;B<W;B+=3)d(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const b=new w,M=new w,N=new w,A=new w;function R(P){N.fromBufferAttribute(i,P),A.copy(N);const S=o[P];b.copy(S),b.sub(N.multiplyScalar(N.dot(S))).normalize(),M.crossVectors(A,S);const C=M.dot(l[P])<0?-1:1;a.setXYZW(P,b.x,b.y,b.z,C)}for(let P=0,S=E.length;P<S;++P){const x=E[P],C=x.start,k=x.count;for(let B=C,W=C+k;B<W;B+=3)R(t.getX(B+0)),R(t.getX(B+1)),R(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ge(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const i=new w,r=new w,a=new w,o=new w,l=new w,c=new w,h=new w,u=new w;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=e.count;f<p;f+=3)i.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)me.fromBufferAttribute(t,e),me.normalize(),t.setXYZ(e,me.x,me.y,me.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*h;for(let d=0;d<h;d++)f[g++]=c[p++]}return new ge(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new le,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],p=t(f,n);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Wo=new Zt,Fn=new ir,_s=new ss,Xo=new w,vs=new w,xs=new w,ys=new w,Lr=new w,Ms=new w,qo=new w,Ss=new w;class ue extends he{constructor(t=new le,e=new Ei){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){Ms.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Lr.fromBufferAttribute(u,t),a?Ms.addScaledVector(Lr,h):Ms.addScaledVector(Lr.sub(e),h))}e.add(Ms)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),_s.copy(n.boundingSphere),_s.applyMatrix4(r),Fn.copy(t.ray).recast(t.near),!(_s.containsPoint(Fn.origin)===!1&&(Fn.intersectSphere(_s,Xo)===null||Fn.origin.distanceToSquared(Xo)>(t.far-t.near)**2))&&(Wo.copy(r).invert(),Fn.copy(t.ray).applyMatrix4(Wo),!(n.boundingBox!==null&&Fn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Fn)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=a[m.materialIndex],E=Math.max(m.start,p.start),b=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=E,N=b;M<N;M+=3){const A=o.getX(M),R=o.getX(M+1),P=o.getX(M+2);i=Es(this,d,t,n,c,h,u,A,R,P),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const E=o.getX(m),b=o.getX(m+1),M=o.getX(m+2);i=Es(this,a,t,n,c,h,u,E,b,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=a[m.materialIndex],E=Math.max(m.start,p.start),b=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=E,N=b;M<N;M+=3){const A=M,R=M+1,P=M+2;i=Es(this,d,t,n,c,h,u,A,R,P),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const E=m,b=m+1,M=m+2;i=Es(this,a,t,n,c,h,u,E,b,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Xh(s,t,e,n,i,r,a,o){let l;if(t.side===Ce?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===Pn,o),l===null)return null;Ss.copy(o),Ss.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ss);return c<e.near||c>e.far?null:{distance:c,point:Ss.clone(),object:s}}function Es(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,vs),s.getVertexPosition(l,xs),s.getVertexPosition(c,ys);const h=Xh(s,t,e,n,vs,xs,ys,qo);if(h){const u=new w;Ue.getBarycoord(qo,vs,xs,ys,u),i&&(h.uv=Ue.getInterpolatedAttribute(i,o,l,c,u,new nt)),r&&(h.uv1=Ue.getInterpolatedAttribute(r,o,l,c,u,new nt)),a&&(h.normal=Ue.getInterpolatedAttribute(a,o,l,c,u,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new w,materialIndex:0};Ue.getNormal(vs,xs,ys,f.normal),h.face=f,h.barycoord=u}return h}class Ln extends le{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new jt(c,3)),this.setAttribute("normal",new jt(h,3)),this.setAttribute("uv",new jt(u,2));function g(_,m,d,E,b,M,N,A,R,P,S){const x=M/R,C=N/P,k=M/2,B=N/2,W=A/2,K=R+1,V=P+1;let Z=0,G=0;const st=new w;for(let ht=0;ht<V;ht++){const yt=ht*C-B;for(let Ut=0;Ut<K;Ut++){const Qt=Ut*x-k;st[_]=Qt*E,st[m]=yt*b,st[d]=W,c.push(st.x,st.y,st.z),st[_]=0,st[m]=0,st[d]=A>0?1:-1,h.push(st.x,st.y,st.z),u.push(Ut/R),u.push(1-ht/P),Z+=1}}for(let ht=0;ht<P;ht++)for(let yt=0;yt<R;yt++){const Ut=f+yt+K*ht,Qt=f+yt+K*(ht+1),q=f+(yt+1)+K*(ht+1),tt=f+(yt+1)+K*ht;l.push(Ut,Qt,tt),l.push(Qt,q,tt),G+=6}o.addGroup(p,G,S),p+=G,f+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ln(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ci(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function be(s){const t={};for(let e=0;e<s.length;e++){const n=Ci(s[e]);for(const i in n)t[i]=n[i]}return t}function qh(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function hc(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Gt.workingColorSpace}const Yh={clone:Ci,merge:be};var $h=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class mn extends Dn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$h,this.fragmentShader=Kh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ci(t.uniforms),this.uniformsGroups=qh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class uc extends he{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Zt,this.projectionMatrix=new Zt,this.projectionMatrixInverse=new Zt,this.coordinateSystem=un}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const En=new w,Yo=new nt,$o=new nt;class Ie extends uc{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Oa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Oa*2*Math.atan(Math.tan(Ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){En.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(En.x,En.y).multiplyScalar(-t/En.z),En.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(En.x,En.y).multiplyScalar(-t/En.z)}getViewSize(t,e){return this.getViewBounds(t,Yo,$o),e.subVectors($o,Yo)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ws*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const hi=-90,ui=1;class Jh extends he{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ie(hi,ui,t,e);i.layers=this.layers,this.add(i);const r=new Ie(hi,ui,t,e);r.layers=this.layers,this.add(r);const a=new Ie(hi,ui,t,e);a.layers=this.layers,this.add(a);const o=new Ie(hi,ui,t,e);o.layers=this.layers,this.add(o);const l=new Ie(hi,ui,t,e);l.layers=this.layers,this.add(l);const c=new Ie(hi,ui,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===un)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class fc extends Ae{constructor(t,e,n,i,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ti,super(t,e,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Zh extends Kn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new fc(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ze}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ln(5,5,5),r=new mn({name:"CubemapFromEquirect",uniforms:Ci(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ce,blending:An});r.uniforms.tEquirect.value=e;const a=new ue(i,r),o=e.minFilter;return e.minFilter===Xn&&(e.minFilter=Ze),new Jh(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}const Dr=new w,jh=new w,Qh=new Lt;class Tn{constructor(t=new w(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Dr.subVectors(n,e).cross(jh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Dr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Qh.getNormalMatrix(t),i=this.coplanarPoint(Dr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const On=new ss,bs=new w;class Za{constructor(t=new Tn,e=new Tn,n=new Tn,i=new Tn,r=new Tn,a=new Tn){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=un){const n=this.planes,i=t.elements,r=i[0],a=i[1],o=i[2],l=i[3],c=i[4],h=i[5],u=i[6],f=i[7],p=i[8],g=i[9],_=i[10],m=i[11],d=i[12],E=i[13],b=i[14],M=i[15];if(n[0].setComponents(l-r,f-c,m-p,M-d).normalize(),n[1].setComponents(l+r,f+c,m+p,M+d).normalize(),n[2].setComponents(l+a,f+h,m+g,M+E).normalize(),n[3].setComponents(l-a,f-h,m-g,M-E).normalize(),n[4].setComponents(l-o,f-u,m-_,M-b).normalize(),e===un)n[5].setComponents(l+o,f+u,m+_,M+b).normalize();else if(e===Ks)n[5].setComponents(o,u,_,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),On.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),On.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(On)}intersectsSprite(t){return On.center.set(0,0,0),On.radius=.7071067811865476,On.applyMatrix4(t.matrixWorld),this.intersectsSphere(On)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(bs.x=i.normal.x>0?t.max.x:t.min.x,bs.y=i.normal.y>0?t.max.y:t.min.y,bs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(bs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function dc(){let s=null,t=!1,e=null,n=null;function i(r,a){e(r,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function tu(s){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=s.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=s.HALF_FLOAT:p=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=s.SHORT;else if(c instanceof Uint32Array)p=s.UNSIGNED_INT;else if(c instanceof Int32Array)p=s.INT;else if(c instanceof Int8Array)p=s.BYTE;else if(c instanceof Uint8Array)p=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){const g=u[f],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){const _=u[p];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}class sr extends le{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=t/o,f=e/l,p=[],g=[],_=[],m=[];for(let d=0;d<h;d++){const E=d*f-a;for(let b=0;b<c;b++){const M=b*u-r;g.push(M,-E,0),_.push(0,0,1),m.push(b/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let E=0;E<o;E++){const b=E+c*d,M=E+c*(d+1),N=E+1+c*(d+1),A=E+1+c*d;p.push(b,M,A),p.push(M,N,A)}this.setIndex(p),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(_,3)),this.setAttribute("uv",new jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sr(t.width,t.height,t.widthSegments,t.heightSegments)}}var eu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,iu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,su=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ru=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,au=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ou=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,lu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,hu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,uu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,du=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,pu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,mu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,gu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,_u=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Su=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Eu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,bu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Tu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,wu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Au=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ru=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Cu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Lu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Du=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Iu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Uu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Nu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Fu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ou=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ku=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Gu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Vu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Wu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Yu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,$u=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ku=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ju=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ju=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Qu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,tf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ef=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,nf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,af=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,of=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,uf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ff=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,df=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_f=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,vf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,yf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Mf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ef=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Tf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,wf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Af=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Lf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Df=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,If=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Uf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ff=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Of=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,zf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Bf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,kf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Hf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Vf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Xf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$f=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Kf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,td=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ed=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nd=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,id=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ad=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,od=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ld=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,cd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,hd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ud=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,md=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,gd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_d=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vd=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,yd=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Md=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Sd=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ed=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bd=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Td=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,wd=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ad=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cd=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Pd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ld=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dd=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Id=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ud=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,It={alphahash_fragment:eu,alphahash_pars_fragment:nu,alphamap_fragment:iu,alphamap_pars_fragment:su,alphatest_fragment:ru,alphatest_pars_fragment:au,aomap_fragment:ou,aomap_pars_fragment:lu,batching_pars_vertex:cu,batching_vertex:hu,begin_vertex:uu,beginnormal_vertex:fu,bsdfs:du,iridescence_fragment:pu,bumpmap_pars_fragment:mu,clipping_planes_fragment:gu,clipping_planes_pars_fragment:_u,clipping_planes_pars_vertex:vu,clipping_planes_vertex:xu,color_fragment:yu,color_pars_fragment:Mu,color_pars_vertex:Su,color_vertex:Eu,common:bu,cube_uv_reflection_fragment:Tu,defaultnormal_vertex:wu,displacementmap_pars_vertex:Au,displacementmap_vertex:Ru,emissivemap_fragment:Cu,emissivemap_pars_fragment:Pu,colorspace_fragment:Lu,colorspace_pars_fragment:Du,envmap_fragment:Iu,envmap_common_pars_fragment:Uu,envmap_pars_fragment:Nu,envmap_pars_vertex:Fu,envmap_physical_pars_fragment:Yu,envmap_vertex:Ou,fog_vertex:zu,fog_pars_vertex:Bu,fog_fragment:ku,fog_pars_fragment:Hu,gradientmap_pars_fragment:Gu,lightmap_pars_fragment:Vu,lights_lambert_fragment:Wu,lights_lambert_pars_fragment:Xu,lights_pars_begin:qu,lights_toon_fragment:$u,lights_toon_pars_fragment:Ku,lights_phong_fragment:Ju,lights_phong_pars_fragment:Zu,lights_physical_fragment:ju,lights_physical_pars_fragment:Qu,lights_fragment_begin:tf,lights_fragment_maps:ef,lights_fragment_end:nf,logdepthbuf_fragment:sf,logdepthbuf_pars_fragment:rf,logdepthbuf_pars_vertex:af,logdepthbuf_vertex:of,map_fragment:lf,map_pars_fragment:cf,map_particle_fragment:hf,map_particle_pars_fragment:uf,metalnessmap_fragment:ff,metalnessmap_pars_fragment:df,morphinstance_vertex:pf,morphcolor_vertex:mf,morphnormal_vertex:gf,morphtarget_pars_vertex:_f,morphtarget_vertex:vf,normal_fragment_begin:xf,normal_fragment_maps:yf,normal_pars_fragment:Mf,normal_pars_vertex:Sf,normal_vertex:Ef,normalmap_pars_fragment:bf,clearcoat_normal_fragment_begin:Tf,clearcoat_normal_fragment_maps:wf,clearcoat_pars_fragment:Af,iridescence_pars_fragment:Rf,opaque_fragment:Cf,packing:Pf,premultiplied_alpha_fragment:Lf,project_vertex:Df,dithering_fragment:If,dithering_pars_fragment:Uf,roughnessmap_fragment:Nf,roughnessmap_pars_fragment:Ff,shadowmap_pars_fragment:Of,shadowmap_pars_vertex:zf,shadowmap_vertex:Bf,shadowmask_pars_fragment:kf,skinbase_vertex:Hf,skinning_pars_vertex:Gf,skinning_vertex:Vf,skinnormal_vertex:Wf,specularmap_fragment:Xf,specularmap_pars_fragment:qf,tonemapping_fragment:Yf,tonemapping_pars_fragment:$f,transmission_fragment:Kf,transmission_pars_fragment:Jf,uv_pars_fragment:Zf,uv_pars_vertex:jf,uv_vertex:Qf,worldpos_vertex:td,background_vert:ed,background_frag:nd,backgroundCube_vert:id,backgroundCube_frag:sd,cube_vert:rd,cube_frag:ad,depth_vert:od,depth_frag:ld,distanceRGBA_vert:cd,distanceRGBA_frag:hd,equirect_vert:ud,equirect_frag:fd,linedashed_vert:dd,linedashed_frag:pd,meshbasic_vert:md,meshbasic_frag:gd,meshlambert_vert:_d,meshlambert_frag:vd,meshmatcap_vert:xd,meshmatcap_frag:yd,meshnormal_vert:Md,meshnormal_frag:Sd,meshphong_vert:Ed,meshphong_frag:bd,meshphysical_vert:Td,meshphysical_frag:wd,meshtoon_vert:Ad,meshtoon_frag:Rd,points_vert:Cd,points_frag:Pd,shadow_vert:Ld,shadow_frag:Dd,sprite_vert:Id,sprite_frag:Ud},et={common:{diffuse:{value:new At(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Lt},alphaMap:{value:null},alphaMapTransform:{value:new Lt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Lt}},envmap:{envMap:{value:null},envMapRotation:{value:new Lt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Lt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Lt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Lt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Lt},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Lt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Lt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Lt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Lt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new At(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new At(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Lt},alphaTest:{value:0},uvTransform:{value:new Lt}},sprite:{diffuse:{value:new At(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Lt},alphaMap:{value:null},alphaMapTransform:{value:new Lt},alphaTest:{value:0}}},Ke={basic:{uniforms:be([et.common,et.specularmap,et.envmap,et.aomap,et.lightmap,et.fog]),vertexShader:It.meshbasic_vert,fragmentShader:It.meshbasic_frag},lambert:{uniforms:be([et.common,et.specularmap,et.envmap,et.aomap,et.lightmap,et.emissivemap,et.bumpmap,et.normalmap,et.displacementmap,et.fog,et.lights,{emissive:{value:new At(0)}}]),vertexShader:It.meshlambert_vert,fragmentShader:It.meshlambert_frag},phong:{uniforms:be([et.common,et.specularmap,et.envmap,et.aomap,et.lightmap,et.emissivemap,et.bumpmap,et.normalmap,et.displacementmap,et.fog,et.lights,{emissive:{value:new At(0)},specular:{value:new At(1118481)},shininess:{value:30}}]),vertexShader:It.meshphong_vert,fragmentShader:It.meshphong_frag},standard:{uniforms:be([et.common,et.envmap,et.aomap,et.lightmap,et.emissivemap,et.bumpmap,et.normalmap,et.displacementmap,et.roughnessmap,et.metalnessmap,et.fog,et.lights,{emissive:{value:new At(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:It.meshphysical_vert,fragmentShader:It.meshphysical_frag},toon:{uniforms:be([et.common,et.aomap,et.lightmap,et.emissivemap,et.bumpmap,et.normalmap,et.displacementmap,et.gradientmap,et.fog,et.lights,{emissive:{value:new At(0)}}]),vertexShader:It.meshtoon_vert,fragmentShader:It.meshtoon_frag},matcap:{uniforms:be([et.common,et.bumpmap,et.normalmap,et.displacementmap,et.fog,{matcap:{value:null}}]),vertexShader:It.meshmatcap_vert,fragmentShader:It.meshmatcap_frag},points:{uniforms:be([et.points,et.fog]),vertexShader:It.points_vert,fragmentShader:It.points_frag},dashed:{uniforms:be([et.common,et.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:It.linedashed_vert,fragmentShader:It.linedashed_frag},depth:{uniforms:be([et.common,et.displacementmap]),vertexShader:It.depth_vert,fragmentShader:It.depth_frag},normal:{uniforms:be([et.common,et.bumpmap,et.normalmap,et.displacementmap,{opacity:{value:1}}]),vertexShader:It.meshnormal_vert,fragmentShader:It.meshnormal_frag},sprite:{uniforms:be([et.sprite,et.fog]),vertexShader:It.sprite_vert,fragmentShader:It.sprite_frag},background:{uniforms:{uvTransform:{value:new Lt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:It.background_vert,fragmentShader:It.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Lt}},vertexShader:It.backgroundCube_vert,fragmentShader:It.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:It.cube_vert,fragmentShader:It.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:It.equirect_vert,fragmentShader:It.equirect_frag},distanceRGBA:{uniforms:be([et.common,et.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:It.distanceRGBA_vert,fragmentShader:It.distanceRGBA_frag},shadow:{uniforms:be([et.lights,et.fog,{color:{value:new At(0)},opacity:{value:1}}]),vertexShader:It.shadow_vert,fragmentShader:It.shadow_frag}};Ke.physical={uniforms:be([Ke.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Lt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Lt},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Lt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Lt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Lt},sheen:{value:0},sheenColor:{value:new At(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Lt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Lt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Lt},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Lt},attenuationDistance:{value:0},attenuationColor:{value:new At(0)},specularColor:{value:new At(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Lt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Lt},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Lt}}]),vertexShader:It.meshphysical_vert,fragmentShader:It.meshphysical_frag};const Ts={r:0,b:0,g:0},zn=new je,Nd=new Zt;function Fd(s,t,e,n,i,r,a){const o=new At(0);let l=r===!0?0:1,c,h,u=null,f=0,p=null;function g(E){let b=E.isScene===!0?E.background:null;return b&&b.isTexture&&(b=(E.backgroundBlurriness>0?e:t).get(b)),b}function _(E){let b=!1;const M=g(E);M===null?d(o,l):M&&M.isColor&&(d(M,1),b=!0);const N=s.xr.getEnvironmentBlendMode();N==="additive"?n.buffers.color.setClear(0,0,0,1,a):N==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(E,b){const M=g(b);M&&(M.isCubeTexture||M.mapping===er)?(h===void 0&&(h=new ue(new Ln(1,1,1),new mn({name:"BackgroundCubeMaterial",uniforms:Ci(Ke.backgroundCube.uniforms),vertexShader:Ke.backgroundCube.vertexShader,fragmentShader:Ke.backgroundCube.fragmentShader,side:Ce,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(N,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),zn.copy(b.backgroundRotation),zn.x*=-1,zn.y*=-1,zn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(zn.y*=-1,zn.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Nd.makeRotationFromEuler(zn)),h.material.toneMapped=Gt.getTransfer(M.colorSpace)!==$t,(u!==M||f!==M.version||p!==s.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,p=s.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new ue(new sr(2,2),new mn({name:"BackgroundMaterial",uniforms:Ci(Ke.background.uniforms),vertexShader:Ke.background.vertexShader,fragmentShader:Ke.background.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Gt.getTransfer(M.colorSpace)!==$t,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||p!==s.toneMapping)&&(c.material.needsUpdate=!0,u=M,f=M.version,p=s.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function d(E,b){E.getRGB(Ts,hc(s)),n.buffers.color.setClear(Ts.r,Ts.g,Ts.b,b,a)}return{getClearColor:function(){return o},setClearColor:function(E,b=1){o.set(E),l=b,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,d(o,l)},render:_,addToRenderList:m}}function Od(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,a=!1;function o(x,C,k,B,W){let K=!1;const V=u(B,k,C);r!==V&&(r=V,c(r.object)),K=p(x,B,k,W),K&&g(x,B,k,W),W!==null&&t.update(W,s.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,M(x,C,k,B),W!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function l(){return s.createVertexArray()}function c(x){return s.bindVertexArray(x)}function h(x){return s.deleteVertexArray(x)}function u(x,C,k){const B=k.wireframe===!0;let W=n[x.id];W===void 0&&(W={},n[x.id]=W);let K=W[C.id];K===void 0&&(K={},W[C.id]=K);let V=K[B];return V===void 0&&(V=f(l()),K[B]=V),V}function f(x){const C=[],k=[],B=[];for(let W=0;W<e;W++)C[W]=0,k[W]=0,B[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:k,attributeDivisors:B,object:x,attributes:{},index:null}}function p(x,C,k,B){const W=r.attributes,K=C.attributes;let V=0;const Z=k.getAttributes();for(const G in Z)if(Z[G].location>=0){const ht=W[G];let yt=K[G];if(yt===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(yt=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(yt=x.instanceColor)),ht===void 0||ht.attribute!==yt||yt&&ht.data!==yt.data)return!0;V++}return r.attributesNum!==V||r.index!==B}function g(x,C,k,B){const W={},K=C.attributes;let V=0;const Z=k.getAttributes();for(const G in Z)if(Z[G].location>=0){let ht=K[G];ht===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(ht=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(ht=x.instanceColor));const yt={};yt.attribute=ht,ht&&ht.data&&(yt.data=ht.data),W[G]=yt,V++}r.attributes=W,r.attributesNum=V,r.index=B}function _(){const x=r.newAttributes;for(let C=0,k=x.length;C<k;C++)x[C]=0}function m(x){d(x,0)}function d(x,C){const k=r.newAttributes,B=r.enabledAttributes,W=r.attributeDivisors;k[x]=1,B[x]===0&&(s.enableVertexAttribArray(x),B[x]=1),W[x]!==C&&(s.vertexAttribDivisor(x,C),W[x]=C)}function E(){const x=r.newAttributes,C=r.enabledAttributes;for(let k=0,B=C.length;k<B;k++)C[k]!==x[k]&&(s.disableVertexAttribArray(k),C[k]=0)}function b(x,C,k,B,W,K,V){V===!0?s.vertexAttribIPointer(x,C,k,W,K):s.vertexAttribPointer(x,C,k,B,W,K)}function M(x,C,k,B){_();const W=B.attributes,K=k.getAttributes(),V=C.defaultAttributeValues;for(const Z in K){const G=K[Z];if(G.location>=0){let st=W[Z];if(st===void 0&&(Z==="instanceMatrix"&&x.instanceMatrix&&(st=x.instanceMatrix),Z==="instanceColor"&&x.instanceColor&&(st=x.instanceColor)),st!==void 0){const ht=st.normalized,yt=st.itemSize,Ut=t.get(st);if(Ut===void 0)continue;const Qt=Ut.buffer,q=Ut.type,tt=Ut.bytesPerElement,_t=q===s.INT||q===s.UNSIGNED_INT||st.gpuType===Wa;if(st.isInterleavedBufferAttribute){const rt=st.data,bt=rt.stride,Rt=st.offset;if(rt.isInstancedInterleavedBuffer){for(let Nt=0;Nt<G.locationSize;Nt++)d(G.location+Nt,rt.meshPerAttribute);x.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Nt=0;Nt<G.locationSize;Nt++)m(G.location+Nt);s.bindBuffer(s.ARRAY_BUFFER,Qt);for(let Nt=0;Nt<G.locationSize;Nt++)b(G.location+Nt,yt/G.locationSize,q,ht,bt*tt,(Rt+yt/G.locationSize*Nt)*tt,_t)}else{if(st.isInstancedBufferAttribute){for(let rt=0;rt<G.locationSize;rt++)d(G.location+rt,st.meshPerAttribute);x.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let rt=0;rt<G.locationSize;rt++)m(G.location+rt);s.bindBuffer(s.ARRAY_BUFFER,Qt);for(let rt=0;rt<G.locationSize;rt++)b(G.location+rt,yt/G.locationSize,q,ht,yt*tt,yt/G.locationSize*rt*tt,_t)}}else if(V!==void 0){const ht=V[Z];if(ht!==void 0)switch(ht.length){case 2:s.vertexAttrib2fv(G.location,ht);break;case 3:s.vertexAttrib3fv(G.location,ht);break;case 4:s.vertexAttrib4fv(G.location,ht);break;default:s.vertexAttrib1fv(G.location,ht)}}}}E()}function N(){P();for(const x in n){const C=n[x];for(const k in C){const B=C[k];for(const W in B)h(B[W].object),delete B[W];delete C[k]}delete n[x]}}function A(x){if(n[x.id]===void 0)return;const C=n[x.id];for(const k in C){const B=C[k];for(const W in B)h(B[W].object),delete B[W];delete C[k]}delete n[x.id]}function R(x){for(const C in n){const k=n[C];if(k[x.id]===void 0)continue;const B=k[x.id];for(const W in B)h(B[W].object),delete B[W];delete k[x.id]}}function P(){S(),a=!0,r!==i&&(r=i,c(r.object))}function S(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:P,resetDefaultState:S,dispose:N,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function zd(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}function l(c,h,u,f){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],h[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*f[_];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Bd(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==qe&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const P=R===es&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==pn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==hn&&!P)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),d=s.getParameter(s.MAX_VERTEX_ATTRIBS),E=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),N=g>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:E,maxVaryings:b,maxFragmentUniforms:M,vertexTextures:N,maxSamples:A}}function kd(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new Tn,o=new Lt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||i;return i=f,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const E=r?0:n,b=E*4;let M=d.clippingState||null;l.value=M,M=h(g,f,b,p);for(let N=0;N!==b;++N)M[N]=e[N];d.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,p,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const d=p+_*4,E=f.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<d)&&(m=new Float32Array(d));for(let b=0,M=p;b!==_;++b,M+=4)a.copy(u[b]).applyMatrix4(E,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Hd(s){let t=new WeakMap;function e(a,o){return o===aa?a.mapping=Ti:o===oa&&(a.mapping=wi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===aa||o===oa)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Zh(l.height);return c.fromEquirectangularTexture(s,a),t.set(a,c),a.addEventListener("dispose",i),e(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class pc extends uc{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const xi=4,Ko=[.125,.215,.35,.446,.526,.582],Vn=20,Ir=new pc,Jo=new At;let Ur=null,Nr=0,Fr=0,Or=!1;const Hn=(1+Math.sqrt(5))/2,fi=1/Hn,Zo=[new w(-Hn,fi,0),new w(Hn,fi,0),new w(-fi,0,Hn),new w(fi,0,Hn),new w(0,Hn,-fi),new w(0,Hn,fi),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)];class jo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Ur=this._renderer.getRenderTarget(),Nr=this._renderer.getActiveCubeFace(),Fr=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=el(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=tl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ur,Nr,Fr),this._renderer.xr.enabled=Or,t.scissorTest=!1,ws(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ti||t.mapping===wi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ur=this._renderer.getRenderTarget(),Nr=this._renderer.getActiveCubeFace(),Fr=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ze,minFilter:Ze,generateMipmaps:!1,type:es,format:qe,colorSpace:Li,depthBuffer:!1},i=Qo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Qo(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gd(r)),this._blurMaterial=Vd(r,t,e)}return i}_compileMaterial(t){const e=new ue(this._lodPlanes[0],t);this._renderer.compile(e,Ir)}_sceneToCubeUV(t,e,n,i){const o=new Ie(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Jo),h.toneMapping=Rn,h.autoClear=!1;const p=new Ei({name:"PMREM.Background",side:Ce,depthWrite:!1,depthTest:!1}),g=new ue(new Ln,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(Jo),_=!0);for(let d=0;d<6;d++){const E=d%3;E===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):E===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const b=this._cubeSize;ws(i,E*b,d>2?b:0,b,b),h.setRenderTarget(i),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Ti||t.mapping===wi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=el()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=tl());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new ue(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;ws(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Ir)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Zo[(i-r-1)%Zo.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",r),this._halfBlur(a,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ue(this._lodPlanes[i],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Vn-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Vn;m>Vn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Vn}`);const d=[];let E=0;for(let R=0;R<Vn;++R){const P=R/_,S=Math.exp(-P*P/2);d.push(S),R===0?E+=S:R<m&&(E+=2*S)}for(let R=0;R<d.length;R++)d[R]=d[R]/E;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:b}=this;f.dTheta.value=g,f.mipInt.value=b-n;const M=this._sizeLods[i],N=3*M*(i>b-xi?i-b+xi:0),A=4*(this._cubeSize-M);ws(e,N,A,3*M,2*M),l.setRenderTarget(e),l.render(u,Ir)}}function Gd(s){const t=[],e=[],n=[];let i=s;const r=s-xi+1+Ko.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>s-xi?l=Ko[a-s+xi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,d=1,E=new Float32Array(_*g*p),b=new Float32Array(m*g*p),M=new Float32Array(d*g*p);for(let A=0;A<p;A++){const R=A%3*2/3-1,P=A>2?0:-1,S=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];E.set(S,_*g*A),b.set(f,m*g*A);const x=[A,A,A,A,A,A];M.set(x,d*g*A)}const N=new le;N.setAttribute("position",new ge(E,_)),N.setAttribute("uv",new ge(b,m)),N.setAttribute("faceIndex",new ge(M,d)),t.push(N),i>xi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Qo(s,t,e){const n=new Kn(s,t,e);return n.texture.mapping=er,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ws(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Vd(s,t,e){const n=new Float32Array(Vn),i=new w(0,1,0);return new mn({name:"SphericalGaussianBlur",defines:{n:Vn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function tl(){return new mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function el(){return new mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function ja(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Wd(s){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===aa||l===oa,h=l===Ti||l===wi;if(c||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new jo(s)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return c&&p&&p.height>0||h&&p&&i(p)?(e===null&&(e=new jo(s)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Xd(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Yi("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function qd(s,t,e,n){const i={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,d=_.length;m<d;m++)t.remove(_[m])}f.removeEventListener("dispose",a),delete i[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)t.update(f[g],s.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const _=p[g];for(let m=0,d=_.length;m<d;m++)t.update(_[m],s.ARRAY_BUFFER)}}function c(u){const f=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const E=p.array;_=p.version;for(let b=0,M=E.length;b<M;b+=3){const N=E[b+0],A=E[b+1],R=E[b+2];f.push(N,A,A,R,R,N)}}else if(g!==void 0){const E=g.array;_=g.version;for(let b=0,M=E.length/3-1;b<M;b+=3){const N=b+0,A=b+1,R=b+2;f.push(N,A,A,R,R,N)}}else return;const m=new(sc(f)?cc:lc)(f,1);m.version=_;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function h(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Yd(s,t,e){let n;function i(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,p){s.drawElements(n,p,r,f*a),e.update(p,n,1)}function c(f,p,g){g!==0&&(s.drawElementsInstanced(n,p,r,f*a,g),e.update(p,n,g))}function h(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];e.update(m,n,1)}function u(f,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/a,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,_,0,g);let d=0;for(let E=0;E<g;E++)d+=p[E]*_[E];e.update(d,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function $d(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Kd(s,t,e){const n=new WeakMap,i=new Jt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let x=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",x)};var p=x;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let N=o.attributes.position.count*M,A=1;N>t.maxTextureSize&&(A=Math.ceil(N/t.maxTextureSize),N=t.maxTextureSize);const R=new Float32Array(N*A*4*u),P=new ac(R,N,A,u);P.type=hn,P.needsUpdate=!0;const S=M*4;for(let C=0;C<u;C++){const k=d[C],B=E[C],W=b[C],K=N*A*4*C;for(let V=0;V<k.count;V++){const Z=V*S;g===!0&&(i.fromBufferAttribute(k,V),R[K+Z+0]=i.x,R[K+Z+1]=i.y,R[K+Z+2]=i.z,R[K+Z+3]=0),_===!0&&(i.fromBufferAttribute(B,V),R[K+Z+4]=i.x,R[K+Z+5]=i.y,R[K+Z+6]=i.z,R[K+Z+7]=0),m===!0&&(i.fromBufferAttribute(W,V),R[K+Z+8]=i.x,R[K+Z+9]=i.y,R[K+Z+10]=i.z,R[K+Z+11]=W.itemSize===4?i.w:1)}}f={count:u,texture:P,size:new nt(N,A)},n.set(o,f),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",_),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function Jd(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class mc extends Ae{constructor(t,e,n,i,r,a,o,l,c,h=Mi){if(h!==Mi&&h!==Ri)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Mi&&(n=$n),n===void 0&&h===Ri&&(n=Ai),super(null,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ye,this.minFilter=l!==void 0?l:Ye,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const gc=new Ae,nl=new mc(1,1),_c=new ac,vc=new Nh,xc=new fc,il=[],sl=[],rl=new Float32Array(16),al=new Float32Array(9),ol=new Float32Array(4);function Ii(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=il[i];if(r===void 0&&(r=new Float32Array(i),il[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function de(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function pe(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function rr(s,t){let e=sl[t];e===void 0&&(e=new Int32Array(t),sl[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Zd(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function jd(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;s.uniform2fv(this.addr,t),pe(e,t)}}function Qd(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(de(e,t))return;s.uniform3fv(this.addr,t),pe(e,t)}}function tp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;s.uniform4fv(this.addr,t),pe(e,t)}}function ep(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;ol.set(n),s.uniformMatrix2fv(this.addr,!1,ol),pe(e,n)}}function np(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;al.set(n),s.uniformMatrix3fv(this.addr,!1,al),pe(e,n)}}function ip(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;rl.set(n),s.uniformMatrix4fv(this.addr,!1,rl),pe(e,n)}}function sp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function rp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;s.uniform2iv(this.addr,t),pe(e,t)}}function ap(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(de(e,t))return;s.uniform3iv(this.addr,t),pe(e,t)}}function op(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;s.uniform4iv(this.addr,t),pe(e,t)}}function lp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function cp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;s.uniform2uiv(this.addr,t),pe(e,t)}}function hp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(de(e,t))return;s.uniform3uiv(this.addr,t),pe(e,t)}}function up(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;s.uniform4uiv(this.addr,t),pe(e,t)}}function fp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(nl.compareFunction=ic,r=nl):r=gc,e.setTexture2D(t||r,i)}function dp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||vc,i)}function pp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||xc,i)}function mp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||_c,i)}function gp(s){switch(s){case 5126:return Zd;case 35664:return jd;case 35665:return Qd;case 35666:return tp;case 35674:return ep;case 35675:return np;case 35676:return ip;case 5124:case 35670:return sp;case 35667:case 35671:return rp;case 35668:case 35672:return ap;case 35669:case 35673:return op;case 5125:return lp;case 36294:return cp;case 36295:return hp;case 36296:return up;case 35678:case 36198:case 36298:case 36306:case 35682:return fp;case 35679:case 36299:case 36307:return dp;case 35680:case 36300:case 36308:case 36293:return pp;case 36289:case 36303:case 36311:case 36292:return mp}}function _p(s,t){s.uniform1fv(this.addr,t)}function vp(s,t){const e=Ii(t,this.size,2);s.uniform2fv(this.addr,e)}function xp(s,t){const e=Ii(t,this.size,3);s.uniform3fv(this.addr,e)}function yp(s,t){const e=Ii(t,this.size,4);s.uniform4fv(this.addr,e)}function Mp(s,t){const e=Ii(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Sp(s,t){const e=Ii(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Ep(s,t){const e=Ii(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function bp(s,t){s.uniform1iv(this.addr,t)}function Tp(s,t){s.uniform2iv(this.addr,t)}function wp(s,t){s.uniform3iv(this.addr,t)}function Ap(s,t){s.uniform4iv(this.addr,t)}function Rp(s,t){s.uniform1uiv(this.addr,t)}function Cp(s,t){s.uniform2uiv(this.addr,t)}function Pp(s,t){s.uniform3uiv(this.addr,t)}function Lp(s,t){s.uniform4uiv(this.addr,t)}function Dp(s,t,e){const n=this.cache,i=t.length,r=rr(e,i);de(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||gc,r[a])}function Ip(s,t,e){const n=this.cache,i=t.length,r=rr(e,i);de(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||vc,r[a])}function Up(s,t,e){const n=this.cache,i=t.length,r=rr(e,i);de(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||xc,r[a])}function Np(s,t,e){const n=this.cache,i=t.length,r=rr(e,i);de(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||_c,r[a])}function Fp(s){switch(s){case 5126:return _p;case 35664:return vp;case 35665:return xp;case 35666:return yp;case 35674:return Mp;case 35675:return Sp;case 35676:return Ep;case 5124:case 35670:return bp;case 35667:case 35671:return Tp;case 35668:case 35672:return wp;case 35669:case 35673:return Ap;case 5125:return Rp;case 36294:return Cp;case 36295:return Pp;case 36296:return Lp;case 35678:case 36198:case 36298:case 36306:case 35682:return Dp;case 35679:case 36299:case 36307:return Ip;case 35680:case 36300:case 36308:case 36293:return Up;case 36289:case 36303:case 36311:case 36292:return Np}}class Op{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=gp(e.type)}}class zp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Fp(e.type)}}class Bp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const zr=/(\w+)(\])?(\[|\.)?/g;function ll(s,t){s.seq.push(t),s.map[t.id]=t}function kp(s,t,e){const n=s.name,i=n.length;for(zr.lastIndex=0;;){const r=zr.exec(n),a=zr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){ll(e,c===void 0?new Op(o,s,t):new zp(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new Bp(o),ll(e,u)),e=u}}}class Xs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),a=t.getUniformLocation(e,r.name);kp(r,a,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function cl(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Hp=37297;let Gp=0;function Vp(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const hl=new Lt;function Wp(s){Gt._getMatrix(hl,Gt.workingColorSpace,s);const t=`mat3( ${hl.elements.map(e=>e.toFixed(4))} )`;switch(Gt.getTransfer(s)){case nr:return[t,"LinearTransferOETF"];case $t:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function ul(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+Vp(s.getShaderSource(t),a)}else return i}function Xp(s,t){const e=Wp(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function qp(s,t){let e;switch(t){case ch:e="Linear";break;case hh:e="Reinhard";break;case uh:e="Cineon";break;case Wl:e="ACESFilmic";break;case dh:e="AgX";break;case ph:e="Neutral";break;case fh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const As=new w;function Yp(){Gt.getLuminanceCoefficients(As);const s=As.x.toFixed(4),t=As.y.toFixed(4),e=As.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $p(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($i).join(`
`)}function Kp(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Jp(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function $i(s){return s!==""}function fl(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function dl(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Zp=/^[ \t]*#include +<([\w\d./]+)>/gm;function za(s){return s.replace(Zp,Qp)}const jp=new Map;function Qp(s,t){let e=It[t];if(e===void 0){const n=jp.get(t);if(n!==void 0)e=It[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return za(e)}const tm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pl(s){return s.replace(tm,em)}function em(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function ml(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function nm(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Gl?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Gc?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===ln&&(t="SHADOWMAP_TYPE_VSM"),t}function im(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ti:case wi:t="ENVMAP_TYPE_CUBE";break;case er:t="ENVMAP_TYPE_CUBE_UV";break}return t}function sm(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case wi:t="ENVMAP_MODE_REFRACTION";break}return t}function rm(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Vl:t="ENVMAP_BLENDING_MULTIPLY";break;case oh:t="ENVMAP_BLENDING_MIX";break;case lh:t="ENVMAP_BLENDING_ADD";break}return t}function am(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function om(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=nm(e),c=im(e),h=sm(e),u=rm(e),f=am(e),p=$p(e),g=Kp(r),_=i.createProgram();let m,d,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter($i).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter($i).join(`
`),d.length>0&&(d+=`
`)):(m=[ml(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($i).join(`
`),d=[ml(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Rn?"#define TONE_MAPPING":"",e.toneMapping!==Rn?It.tonemapping_pars_fragment:"",e.toneMapping!==Rn?qp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",It.colorspace_pars_fragment,Xp("linearToOutputTexel",e.outputColorSpace),Yp(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter($i).join(`
`)),a=za(a),a=fl(a,e),a=dl(a,e),o=za(o),o=fl(o,e),o=dl(o,e),a=pl(a),o=pl(o),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",e.glslVersion===Ro?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ro?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const b=E+m+a,M=E+d+o,N=cl(i,i.VERTEX_SHADER,b),A=cl(i,i.FRAGMENT_SHADER,M);i.attachShader(_,N),i.attachShader(_,A),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function R(C){if(s.debug.checkShaderErrors){const k=i.getProgramInfoLog(_).trim(),B=i.getShaderInfoLog(N).trim(),W=i.getShaderInfoLog(A).trim();let K=!0,V=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(K=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,N,A);else{const Z=ul(i,N,"vertex"),G=ul(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+k+`
`+Z+`
`+G)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(B===""||W==="")&&(V=!1);V&&(C.diagnostics={runnable:K,programLog:k,vertexShader:{log:B,prefix:m},fragmentShader:{log:W,prefix:d}})}i.deleteShader(N),i.deleteShader(A),P=new Xs(i,_),S=Jp(i,_)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let S;this.getAttributes=function(){return S===void 0&&R(this),S};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=i.getProgramParameter(_,Hp)),x},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gp++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=N,this.fragmentShader=A,this}let lm=0;class cm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new hm(t),e.set(t,n)),n}}class hm{constructor(t){this.id=lm++,this.code=t,this.usedTimes=0}}function um(s,t,e,n,i,r,a){const o=new Ja,l=new cm,c=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,x,C,k,B){const W=k.fog,K=B.geometry,V=S.isMeshStandardMaterial?k.environment:null,Z=(S.isMeshStandardMaterial?e:t).get(S.envMap||V),G=Z&&Z.mapping===er?Z.image.height:null,st=g[S.type];S.precision!==null&&(p=i.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const ht=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,yt=ht!==void 0?ht.length:0;let Ut=0;K.morphAttributes.position!==void 0&&(Ut=1),K.morphAttributes.normal!==void 0&&(Ut=2),K.morphAttributes.color!==void 0&&(Ut=3);let Qt,q,tt,_t;if(st){const Yt=Ke[st];Qt=Yt.vertexShader,q=Yt.fragmentShader}else Qt=S.vertexShader,q=S.fragmentShader,l.update(S),tt=l.getVertexShaderID(S),_t=l.getFragmentShaderID(S);const rt=s.getRenderTarget(),bt=s.state.buffers.depth.getReversed(),Rt=B.isInstancedMesh===!0,Nt=B.isBatchedMesh===!0,re=!!S.map,kt=!!S.matcap,oe=!!Z,U=!!S.aoMap,Ne=!!S.lightMap,Ot=!!S.bumpMap,zt=!!S.normalMap,St=!!S.displacementMap,ne=!!S.emissiveMap,Mt=!!S.metalnessMap,T=!!S.roughnessMap,v=S.anisotropy>0,F=S.clearcoat>0,Y=S.dispersion>0,J=S.iridescence>0,X=S.sheen>0,vt=S.transmission>0,at=v&&!!S.anisotropyMap,ut=F&&!!S.clearcoatMap,Ht=F&&!!S.clearcoatNormalMap,j=F&&!!S.clearcoatRoughnessMap,ft=J&&!!S.iridescenceMap,Et=J&&!!S.iridescenceThicknessMap,Tt=X&&!!S.sheenColorMap,dt=X&&!!S.sheenRoughnessMap,Bt=!!S.specularMap,Dt=!!S.specularColorMap,te=!!S.specularIntensityMap,L=vt&&!!S.transmissionMap,it=vt&&!!S.thicknessMap,H=!!S.gradientMap,$=!!S.alphaMap,ct=S.alphaTest>0,ot=!!S.alphaHash,Ct=!!S.extensions;let ae=Rn;S.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(ae=s.toneMapping);const xe={shaderID:st,shaderType:S.type,shaderName:S.name,vertexShader:Qt,fragmentShader:q,defines:S.defines,customVertexShaderID:tt,customFragmentShaderID:_t,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Nt,batchingColor:Nt&&B._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&B.instanceColor!==null,instancingMorph:Rt&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:rt===null?s.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Li,alphaToCoverage:!!S.alphaToCoverage,map:re,matcap:kt,envMap:oe,envMapMode:oe&&Z.mapping,envMapCubeUVHeight:G,aoMap:U,lightMap:Ne,bumpMap:Ot,normalMap:zt,displacementMap:f&&St,emissiveMap:ne,normalMapObjectSpace:zt&&S.normalMapType===vh,normalMapTangentSpace:zt&&S.normalMapType===nc,metalnessMap:Mt,roughnessMap:T,anisotropy:v,anisotropyMap:at,clearcoat:F,clearcoatMap:ut,clearcoatNormalMap:Ht,clearcoatRoughnessMap:j,dispersion:Y,iridescence:J,iridescenceMap:ft,iridescenceThicknessMap:Et,sheen:X,sheenColorMap:Tt,sheenRoughnessMap:dt,specularMap:Bt,specularColorMap:Dt,specularIntensityMap:te,transmission:vt,transmissionMap:L,thicknessMap:it,gradientMap:H,opaque:S.transparent===!1&&S.blending===yi&&S.alphaToCoverage===!1,alphaMap:$,alphaTest:ct,alphaHash:ot,combine:S.combine,mapUv:re&&_(S.map.channel),aoMapUv:U&&_(S.aoMap.channel),lightMapUv:Ne&&_(S.lightMap.channel),bumpMapUv:Ot&&_(S.bumpMap.channel),normalMapUv:zt&&_(S.normalMap.channel),displacementMapUv:St&&_(S.displacementMap.channel),emissiveMapUv:ne&&_(S.emissiveMap.channel),metalnessMapUv:Mt&&_(S.metalnessMap.channel),roughnessMapUv:T&&_(S.roughnessMap.channel),anisotropyMapUv:at&&_(S.anisotropyMap.channel),clearcoatMapUv:ut&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:Ht&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ft&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Et&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Tt&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:dt&&_(S.sheenRoughnessMap.channel),specularMapUv:Bt&&_(S.specularMap.channel),specularColorMapUv:Dt&&_(S.specularColorMap.channel),specularIntensityMapUv:te&&_(S.specularIntensityMap.channel),transmissionMapUv:L&&_(S.transmissionMap.channel),thicknessMapUv:it&&_(S.thicknessMap.channel),alphaMapUv:$&&_(S.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(zt||v),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!K.attributes.uv&&(re||$),fog:!!W,useFog:S.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:bt,skinning:B.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Ut,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:ae,decodeVideoTexture:re&&S.map.isVideoTexture===!0&&Gt.getTransfer(S.map.colorSpace)===$t,decodeVideoTextureEmissive:ne&&S.emissiveMap.isVideoTexture===!0&&Gt.getTransfer(S.emissiveMap.colorSpace)===$t,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===cn,flipSided:S.side===Ce,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ct&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ct&&S.extensions.multiDraw===!0||Nt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return xe.vertexUv1s=c.has(1),xe.vertexUv2s=c.has(2),xe.vertexUv3s=c.has(3),c.clear(),xe}function d(S){const x=[];if(S.shaderID?x.push(S.shaderID):(x.push(S.customVertexShaderID),x.push(S.customFragmentShaderID)),S.defines!==void 0)for(const C in S.defines)x.push(C),x.push(S.defines[C]);return S.isRawShaderMaterial===!1&&(E(x,S),b(x,S),x.push(s.outputColorSpace)),x.push(S.customProgramCacheKey),x.join()}function E(S,x){S.push(x.precision),S.push(x.outputColorSpace),S.push(x.envMapMode),S.push(x.envMapCubeUVHeight),S.push(x.mapUv),S.push(x.alphaMapUv),S.push(x.lightMapUv),S.push(x.aoMapUv),S.push(x.bumpMapUv),S.push(x.normalMapUv),S.push(x.displacementMapUv),S.push(x.emissiveMapUv),S.push(x.metalnessMapUv),S.push(x.roughnessMapUv),S.push(x.anisotropyMapUv),S.push(x.clearcoatMapUv),S.push(x.clearcoatNormalMapUv),S.push(x.clearcoatRoughnessMapUv),S.push(x.iridescenceMapUv),S.push(x.iridescenceThicknessMapUv),S.push(x.sheenColorMapUv),S.push(x.sheenRoughnessMapUv),S.push(x.specularMapUv),S.push(x.specularColorMapUv),S.push(x.specularIntensityMapUv),S.push(x.transmissionMapUv),S.push(x.thicknessMapUv),S.push(x.combine),S.push(x.fogExp2),S.push(x.sizeAttenuation),S.push(x.morphTargetsCount),S.push(x.morphAttributeCount),S.push(x.numDirLights),S.push(x.numPointLights),S.push(x.numSpotLights),S.push(x.numSpotLightMaps),S.push(x.numHemiLights),S.push(x.numRectAreaLights),S.push(x.numDirLightShadows),S.push(x.numPointLightShadows),S.push(x.numSpotLightShadows),S.push(x.numSpotLightShadowsWithMaps),S.push(x.numLightProbes),S.push(x.shadowMapType),S.push(x.toneMapping),S.push(x.numClippingPlanes),S.push(x.numClipIntersection),S.push(x.depthPacking)}function b(S,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),S.push(o.mask)}function M(S){const x=g[S.type];let C;if(x){const k=Ke[x];C=Yh.clone(k.uniforms)}else C=S.uniforms;return C}function N(S,x){let C;for(let k=0,B=h.length;k<B;k++){const W=h[k];if(W.cacheKey===x){C=W,++C.usedTimes;break}}return C===void 0&&(C=new om(s,x,S,r),h.push(C)),C}function A(S){if(--S.usedTimes===0){const x=h.indexOf(S);h[x]=h[h.length-1],h.pop(),S.destroy()}}function R(S){l.remove(S)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:M,acquireProgram:N,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:P}}function fm(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function dm(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function gl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function _l(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u,f,p,g,_,m){let d=s[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),t++,d}function o(u,f,p,g,_,m){const d=a(u,f,p,g,_,m);p.transmission>0?n.push(d):p.transparent===!0?i.push(d):e.push(d)}function l(u,f,p,g,_,m){const d=a(u,f,p,g,_,m);p.transmission>0?n.unshift(d):p.transparent===!0?i.unshift(d):e.unshift(d)}function c(u,f){e.length>1&&e.sort(u||dm),n.length>1&&n.sort(f||gl),i.length>1&&i.sort(f||gl)}function h(){for(let u=t,f=s.length;u<f;u++){const p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function pm(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new _l,s.set(n,[a])):i>=r.length?(a=new _l,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function mm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new w,color:new At};break;case"SpotLight":e={position:new w,direction:new w,color:new At,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new w,color:new At,distance:0,decay:0};break;case"HemisphereLight":e={direction:new w,skyColor:new At,groundColor:new At};break;case"RectAreaLight":e={color:new At,position:new w,halfWidth:new w,halfHeight:new w};break}return s[t.id]=e,e}}}function gm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let _m=0;function vm(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function xm(s){const t=new mm,e=gm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new w);const i=new w,r=new Zt,a=new Zt;function o(c){let h=0,u=0,f=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,E=0,b=0,M=0,N=0,A=0,R=0;c.sort(vm);for(let S=0,x=c.length;S<x;S++){const C=c[S],k=C.color,B=C.intensity,W=C.distance,K=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=k.r*B,u+=k.g*B,f+=k.b*B;else if(C.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(C.sh.coefficients[V],B);R++}else if(C.isDirectionalLight){const V=t.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const Z=C.shadow,G=e.get(C);G.shadowIntensity=Z.intensity,G.shadowBias=Z.bias,G.shadowNormalBias=Z.normalBias,G.shadowRadius=Z.radius,G.shadowMapSize=Z.mapSize,n.directionalShadow[p]=G,n.directionalShadowMap[p]=K,n.directionalShadowMatrix[p]=C.shadow.matrix,E++}n.directional[p]=V,p++}else if(C.isSpotLight){const V=t.get(C);V.position.setFromMatrixPosition(C.matrixWorld),V.color.copy(k).multiplyScalar(B),V.distance=W,V.coneCos=Math.cos(C.angle),V.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),V.decay=C.decay,n.spot[_]=V;const Z=C.shadow;if(C.map&&(n.spotLightMap[N]=C.map,N++,Z.updateMatrices(C),C.castShadow&&A++),n.spotLightMatrix[_]=Z.matrix,C.castShadow){const G=e.get(C);G.shadowIntensity=Z.intensity,G.shadowBias=Z.bias,G.shadowNormalBias=Z.normalBias,G.shadowRadius=Z.radius,G.shadowMapSize=Z.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=K,M++}_++}else if(C.isRectAreaLight){const V=t.get(C);V.color.copy(k).multiplyScalar(B),V.halfWidth.set(C.width*.5,0,0),V.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=V,m++}else if(C.isPointLight){const V=t.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),V.distance=C.distance,V.decay=C.decay,C.castShadow){const Z=C.shadow,G=e.get(C);G.shadowIntensity=Z.intensity,G.shadowBias=Z.bias,G.shadowNormalBias=Z.normalBias,G.shadowRadius=Z.radius,G.shadowMapSize=Z.mapSize,G.shadowCameraNear=Z.camera.near,G.shadowCameraFar=Z.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=C.shadow.matrix,b++}n.point[g]=V,g++}else if(C.isHemisphereLight){const V=t.get(C);V.skyColor.copy(C.color).multiplyScalar(B),V.groundColor.copy(C.groundColor).multiplyScalar(B),n.hemi[d]=V,d++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=et.LTC_FLOAT_1,n.rectAreaLTC2=et.LTC_FLOAT_2):(n.rectAreaLTC1=et.LTC_HALF_1,n.rectAreaLTC2=et.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const P=n.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==d||P.numDirectionalShadows!==E||P.numPointShadows!==b||P.numSpotShadows!==M||P.numSpotMaps!==N||P.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=M+N-A,n.spotLightMap.length=N,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,P.directionalLength=p,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=d,P.numDirectionalShadows=E,P.numPointShadows=b,P.numSpotShadows=M,P.numSpotMaps=N,P.numLightProbes=R,n.version=_m++)}function l(c,h){let u=0,f=0,p=0,g=0,_=0;const m=h.matrixWorldInverse;for(let d=0,E=c.length;d<E;d++){const b=c[d];if(b.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),u++}else if(b.isSpotLight){const M=n.spot[p];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),p++}else if(b.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),M.halfWidth.set(b.width*.5,0,0),M.halfHeight.set(0,b.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const M=n.point[f];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),f++}else if(b.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(b.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function vl(s){const t=new xm(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function ym(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new vl(s),t.set(i,[o])):r>=a.length?(o=new vl(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class Mm extends Dn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=gh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Sm extends Dn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Em=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Tm(s,t,e){let n=new Za;const i=new nt,r=new nt,a=new Jt,o=new Mm({depthPacking:_h}),l=new Sm,c={},h=e.maxTextureSize,u={[Pn]:Ce,[Ce]:Pn,[cn]:cn},f=new mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:Em,fragmentShader:bm}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new le;g.setAttribute("position",new ge(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ue(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gl;let d=this.type;this.render=function(A,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const S=s.getRenderTarget(),x=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),k=s.state;k.setBlending(An),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const B=d!==ln&&this.type===ln,W=d===ln&&this.type!==ln;for(let K=0,V=A.length;K<V;K++){const Z=A[K],G=Z.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);const st=G.getFrameExtents();if(i.multiply(st),r.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/st.x),i.x=r.x*st.x,G.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/st.y),i.y=r.y*st.y,G.mapSize.y=r.y)),G.map===null||B===!0||W===!0){const yt=this.type!==ln?{minFilter:Ye,magFilter:Ye}:{};G.map!==null&&G.map.dispose(),G.map=new Kn(i.x,i.y,yt),G.map.texture.name=Z.name+".shadowMap",G.camera.updateProjectionMatrix()}s.setRenderTarget(G.map),s.clear();const ht=G.getViewportCount();for(let yt=0;yt<ht;yt++){const Ut=G.getViewport(yt);a.set(r.x*Ut.x,r.y*Ut.y,r.x*Ut.z,r.y*Ut.w),k.viewport(a),G.updateMatrices(Z,yt),n=G.getFrustum(),M(R,P,G.camera,Z,this.type)}G.isPointLightShadow!==!0&&this.type===ln&&E(G,P),G.needsUpdate=!1}d=this.type,m.needsUpdate=!1,s.setRenderTarget(S,x,C)};function E(A,R){const P=t.update(_);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Kn(i.x,i.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(R,null,P,f,_,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(R,null,P,p,_,null)}function b(A,R,P,S){let x=null;const C=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(C!==void 0)x=C;else if(x=P.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const k=x.uuid,B=R.uuid;let W=c[k];W===void 0&&(W={},c[k]=W);let K=W[B];K===void 0&&(K=x.clone(),W[B]=K,R.addEventListener("dispose",N)),x=K}if(x.visible=R.visible,x.wireframe=R.wireframe,S===ln?x.side=R.shadowSide!==null?R.shadowSide:R.side:x.side=R.shadowSide!==null?R.shadowSide:u[R.side],x.alphaMap=R.alphaMap,x.alphaTest=R.alphaTest,x.map=R.map,x.clipShadows=R.clipShadows,x.clippingPlanes=R.clippingPlanes,x.clipIntersection=R.clipIntersection,x.displacementMap=R.displacementMap,x.displacementScale=R.displacementScale,x.displacementBias=R.displacementBias,x.wireframeLinewidth=R.wireframeLinewidth,x.linewidth=R.linewidth,P.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const k=s.properties.get(x);k.light=P}return x}function M(A,R,P,S,x){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&x===ln)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const B=t.update(A),W=A.material;if(Array.isArray(W)){const K=B.groups;for(let V=0,Z=K.length;V<Z;V++){const G=K[V],st=W[G.materialIndex];if(st&&st.visible){const ht=b(A,st,S,x);A.onBeforeShadow(s,A,R,P,B,ht,G),s.renderBufferDirect(P,null,B,ht,A,G),A.onAfterShadow(s,A,R,P,B,ht,G)}}}else if(W.visible){const K=b(A,W,S,x);A.onBeforeShadow(s,A,R,P,B,K,null),s.renderBufferDirect(P,null,B,K,A,null),A.onAfterShadow(s,A,R,P,B,K,null)}}const k=A.children;for(let B=0,W=k.length;B<W;B++)M(k[B],R,P,S,x)}function N(A){A.target.removeEventListener("dispose",N);for(const P in c){const S=c[P],x=A.target.uuid;x in S&&(S[x].dispose(),delete S[x])}}}const wm={[Qr]:ta,[ea]:sa,[na]:ra,[bi]:ia,[ta]:Qr,[sa]:ea,[ra]:na,[ia]:bi};function Am(s,t){function e(){let L=!1;const it=new Jt;let H=null;const $=new Jt(0,0,0,0);return{setMask:function(ct){H!==ct&&!L&&(s.colorMask(ct,ct,ct,ct),H=ct)},setLocked:function(ct){L=ct},setClear:function(ct,ot,Ct,ae,xe){xe===!0&&(ct*=ae,ot*=ae,Ct*=ae),it.set(ct,ot,Ct,ae),$.equals(it)===!1&&(s.clearColor(ct,ot,Ct,ae),$.copy(it))},reset:function(){L=!1,H=null,$.set(-1,0,0,0)}}}function n(){let L=!1,it=!1,H=null,$=null,ct=null;return{setReversed:function(ot){if(it!==ot){const Ct=t.get("EXT_clip_control");it?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT);const ae=ct;ct=null,this.setClear(ae)}it=ot},getReversed:function(){return it},setTest:function(ot){ot?rt(s.DEPTH_TEST):bt(s.DEPTH_TEST)},setMask:function(ot){H!==ot&&!L&&(s.depthMask(ot),H=ot)},setFunc:function(ot){if(it&&(ot=wm[ot]),$!==ot){switch(ot){case Qr:s.depthFunc(s.NEVER);break;case ta:s.depthFunc(s.ALWAYS);break;case ea:s.depthFunc(s.LESS);break;case bi:s.depthFunc(s.LEQUAL);break;case na:s.depthFunc(s.EQUAL);break;case ia:s.depthFunc(s.GEQUAL);break;case sa:s.depthFunc(s.GREATER);break;case ra:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}$=ot}},setLocked:function(ot){L=ot},setClear:function(ot){ct!==ot&&(it&&(ot=1-ot),s.clearDepth(ot),ct=ot)},reset:function(){L=!1,H=null,$=null,ct=null,it=!1}}}function i(){let L=!1,it=null,H=null,$=null,ct=null,ot=null,Ct=null,ae=null,xe=null;return{setTest:function(Yt){L||(Yt?rt(s.STENCIL_TEST):bt(s.STENCIL_TEST))},setMask:function(Yt){it!==Yt&&!L&&(s.stencilMask(Yt),it=Yt)},setFunc:function(Yt,He,tn){(H!==Yt||$!==He||ct!==tn)&&(s.stencilFunc(Yt,He,tn),H=Yt,$=He,ct=tn)},setOp:function(Yt,He,tn){(ot!==Yt||Ct!==He||ae!==tn)&&(s.stencilOp(Yt,He,tn),ot=Yt,Ct=He,ae=tn)},setLocked:function(Yt){L=Yt},setClear:function(Yt){xe!==Yt&&(s.clearStencil(Yt),xe=Yt)},reset:function(){L=!1,it=null,H=null,$=null,ct=null,ot=null,Ct=null,ae=null,xe=null}}}const r=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,E=null,b=null,M=null,N=null,A=null,R=new At(0,0,0),P=0,S=!1,x=null,C=null,k=null,B=null,W=null;const K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,Z=0;const G=s.getParameter(s.VERSION);G.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(G)[1]),V=Z>=1):G.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),V=Z>=2);let st=null,ht={};const yt=s.getParameter(s.SCISSOR_BOX),Ut=s.getParameter(s.VIEWPORT),Qt=new Jt().fromArray(yt),q=new Jt().fromArray(Ut);function tt(L,it,H,$){const ct=new Uint8Array(4),ot=s.createTexture();s.bindTexture(L,ot),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ct=0;Ct<H;Ct++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(it,0,s.RGBA,1,1,$,0,s.RGBA,s.UNSIGNED_BYTE,ct):s.texImage2D(it+Ct,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ct);return ot}const _t={};_t[s.TEXTURE_2D]=tt(s.TEXTURE_2D,s.TEXTURE_2D,1),_t[s.TEXTURE_CUBE_MAP]=tt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),_t[s.TEXTURE_2D_ARRAY]=tt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),_t[s.TEXTURE_3D]=tt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),rt(s.DEPTH_TEST),a.setFunc(bi),Ot(!1),zt(bo),rt(s.CULL_FACE),U(An);function rt(L){h[L]!==!0&&(s.enable(L),h[L]=!0)}function bt(L){h[L]!==!1&&(s.disable(L),h[L]=!1)}function Rt(L,it){return u[L]!==it?(s.bindFramebuffer(L,it),u[L]=it,L===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=it),L===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=it),!0):!1}function Nt(L,it){let H=p,$=!1;if(L){H=f.get(it),H===void 0&&(H=[],f.set(it,H));const ct=L.textures;if(H.length!==ct.length||H[0]!==s.COLOR_ATTACHMENT0){for(let ot=0,Ct=ct.length;ot<Ct;ot++)H[ot]=s.COLOR_ATTACHMENT0+ot;H.length=ct.length,$=!0}}else H[0]!==s.BACK&&(H[0]=s.BACK,$=!0);$&&s.drawBuffers(H)}function re(L){return g!==L?(s.useProgram(L),g=L,!0):!1}const kt={[Gn]:s.FUNC_ADD,[Wc]:s.FUNC_SUBTRACT,[Xc]:s.FUNC_REVERSE_SUBTRACT};kt[qc]=s.MIN,kt[Yc]=s.MAX;const oe={[$c]:s.ZERO,[Kc]:s.ONE,[Jc]:s.SRC_COLOR,[Zr]:s.SRC_ALPHA,[nh]:s.SRC_ALPHA_SATURATE,[th]:s.DST_COLOR,[jc]:s.DST_ALPHA,[Zc]:s.ONE_MINUS_SRC_COLOR,[jr]:s.ONE_MINUS_SRC_ALPHA,[eh]:s.ONE_MINUS_DST_COLOR,[Qc]:s.ONE_MINUS_DST_ALPHA,[ih]:s.CONSTANT_COLOR,[sh]:s.ONE_MINUS_CONSTANT_COLOR,[rh]:s.CONSTANT_ALPHA,[ah]:s.ONE_MINUS_CONSTANT_ALPHA};function U(L,it,H,$,ct,ot,Ct,ae,xe,Yt){if(L===An){_===!0&&(bt(s.BLEND),_=!1);return}if(_===!1&&(rt(s.BLEND),_=!0),L!==Vc){if(L!==m||Yt!==S){if((d!==Gn||M!==Gn)&&(s.blendEquation(s.FUNC_ADD),d=Gn,M=Gn),Yt)switch(L){case yi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case dn:s.blendFunc(s.ONE,s.ONE);break;case To:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case wo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case yi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case dn:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case To:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case wo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}E=null,b=null,N=null,A=null,R.set(0,0,0),P=0,m=L,S=Yt}return}ct=ct||it,ot=ot||H,Ct=Ct||$,(it!==d||ct!==M)&&(s.blendEquationSeparate(kt[it],kt[ct]),d=it,M=ct),(H!==E||$!==b||ot!==N||Ct!==A)&&(s.blendFuncSeparate(oe[H],oe[$],oe[ot],oe[Ct]),E=H,b=$,N=ot,A=Ct),(ae.equals(R)===!1||xe!==P)&&(s.blendColor(ae.r,ae.g,ae.b,xe),R.copy(ae),P=xe),m=L,S=!1}function Ne(L,it){L.side===cn?bt(s.CULL_FACE):rt(s.CULL_FACE);let H=L.side===Ce;it&&(H=!H),Ot(H),L.blending===yi&&L.transparent===!1?U(An):U(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const $=L.stencilWrite;o.setTest($),$&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ne(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?rt(s.SAMPLE_ALPHA_TO_COVERAGE):bt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ot(L){x!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),x=L)}function zt(L){L!==kc?(rt(s.CULL_FACE),L!==C&&(L===bo?s.cullFace(s.BACK):L===Hc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):bt(s.CULL_FACE),C=L}function St(L){L!==k&&(V&&s.lineWidth(L),k=L)}function ne(L,it,H){L?(rt(s.POLYGON_OFFSET_FILL),(B!==it||W!==H)&&(s.polygonOffset(it,H),B=it,W=H)):bt(s.POLYGON_OFFSET_FILL)}function Mt(L){L?rt(s.SCISSOR_TEST):bt(s.SCISSOR_TEST)}function T(L){L===void 0&&(L=s.TEXTURE0+K-1),st!==L&&(s.activeTexture(L),st=L)}function v(L,it,H){H===void 0&&(st===null?H=s.TEXTURE0+K-1:H=st);let $=ht[H];$===void 0&&($={type:void 0,texture:void 0},ht[H]=$),($.type!==L||$.texture!==it)&&(st!==H&&(s.activeTexture(H),st=H),s.bindTexture(L,it||_t[L]),$.type=L,$.texture=it)}function F(){const L=ht[st];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Y(){try{s.compressedTexImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{s.compressedTexImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function X(){try{s.texSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function vt(){try{s.texSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function at(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ut(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ht(){try{s.texStorage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{s.texStorage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ft(){try{s.texImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Et(){try{s.texImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Tt(L){Qt.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),Qt.copy(L))}function dt(L){q.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),q.copy(L))}function Bt(L,it){let H=c.get(it);H===void 0&&(H=new WeakMap,c.set(it,H));let $=H.get(L);$===void 0&&($=s.getUniformBlockIndex(it,L.name),H.set(L,$))}function Dt(L,it){const $=c.get(it).get(L);l.get(it)!==$&&(s.uniformBlockBinding(it,$,L.__bindingPointIndex),l.set(it,$))}function te(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},st=null,ht={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,E=null,b=null,M=null,N=null,A=null,R=new At(0,0,0),P=0,S=!1,x=null,C=null,k=null,B=null,W=null,Qt.set(0,0,s.canvas.width,s.canvas.height),q.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:rt,disable:bt,bindFramebuffer:Rt,drawBuffers:Nt,useProgram:re,setBlending:U,setMaterial:Ne,setFlipSided:Ot,setCullFace:zt,setLineWidth:St,setPolygonOffset:ne,setScissorTest:Mt,activeTexture:T,bindTexture:v,unbindTexture:F,compressedTexImage2D:Y,compressedTexImage3D:J,texImage2D:ft,texImage3D:Et,updateUBOMapping:Bt,uniformBlockBinding:Dt,texStorage2D:Ht,texStorage3D:j,texSubImage2D:X,texSubImage3D:vt,compressedTexSubImage2D:at,compressedTexSubImage3D:ut,scissor:Tt,viewport:dt,reset:te}}function xl(s,t,e,n){const i=Rm(n);switch(e){case Kl:return s*t;case Zl:return s*t;case jl:return s*t*2;case Ql:return s*t/i.components*i.byteLength;case Ya:return s*t/i.components*i.byteLength;case tc:return s*t*2/i.components*i.byteLength;case $a:return s*t*2/i.components*i.byteLength;case Jl:return s*t*3/i.components*i.byteLength;case qe:return s*t*4/i.components*i.byteLength;case Ka:return s*t*4/i.components*i.byteLength;case Bs:case ks:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Hs:case Gs:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ua:case da:return Math.max(s,16)*Math.max(t,8)/4;case ha:case fa:return Math.max(s,8)*Math.max(t,8)/2;case pa:case ma:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ga:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case _a:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case va:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case xa:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case ya:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Ma:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Sa:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Ea:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case ba:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Ta:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case wa:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Aa:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Ra:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Ca:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Pa:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Vs:case La:case Da:return Math.ceil(s/4)*Math.ceil(t/4)*16;case ec:case Ia:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Ua:case Na:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Rm(s){switch(s){case pn:case ql:return{byteLength:1,components:1};case Qi:case Yl:case es:return{byteLength:2,components:1};case Xa:case qa:return{byteLength:2,components:4};case $n:case Wa:case hn:return{byteLength:4,components:1};case $l:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function Cm(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return p?new OffscreenCanvas(T,v):Js("canvas")}function _(T,v,F){let Y=1;const J=Mt(T);if((J.width>F||J.height>F)&&(Y=F/Math.max(J.width,J.height)),Y<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const X=Math.floor(Y*J.width),vt=Math.floor(Y*J.height);u===void 0&&(u=g(X,vt));const at=v?g(X,vt):u;return at.width=X,at.height=vt,at.getContext("2d").drawImage(T,0,0,X,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+X+"x"+vt+")."),at}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),T;return T}function m(T){return T.generateMipmaps}function d(T){s.generateMipmap(T)}function E(T){return T.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?s.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function b(T,v,F,Y,J=!1){if(T!==null){if(s[T]!==void 0)return s[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let X=v;if(v===s.RED&&(F===s.FLOAT&&(X=s.R32F),F===s.HALF_FLOAT&&(X=s.R16F),F===s.UNSIGNED_BYTE&&(X=s.R8)),v===s.RED_INTEGER&&(F===s.UNSIGNED_BYTE&&(X=s.R8UI),F===s.UNSIGNED_SHORT&&(X=s.R16UI),F===s.UNSIGNED_INT&&(X=s.R32UI),F===s.BYTE&&(X=s.R8I),F===s.SHORT&&(X=s.R16I),F===s.INT&&(X=s.R32I)),v===s.RG&&(F===s.FLOAT&&(X=s.RG32F),F===s.HALF_FLOAT&&(X=s.RG16F),F===s.UNSIGNED_BYTE&&(X=s.RG8)),v===s.RG_INTEGER&&(F===s.UNSIGNED_BYTE&&(X=s.RG8UI),F===s.UNSIGNED_SHORT&&(X=s.RG16UI),F===s.UNSIGNED_INT&&(X=s.RG32UI),F===s.BYTE&&(X=s.RG8I),F===s.SHORT&&(X=s.RG16I),F===s.INT&&(X=s.RG32I)),v===s.RGB_INTEGER&&(F===s.UNSIGNED_BYTE&&(X=s.RGB8UI),F===s.UNSIGNED_SHORT&&(X=s.RGB16UI),F===s.UNSIGNED_INT&&(X=s.RGB32UI),F===s.BYTE&&(X=s.RGB8I),F===s.SHORT&&(X=s.RGB16I),F===s.INT&&(X=s.RGB32I)),v===s.RGBA_INTEGER&&(F===s.UNSIGNED_BYTE&&(X=s.RGBA8UI),F===s.UNSIGNED_SHORT&&(X=s.RGBA16UI),F===s.UNSIGNED_INT&&(X=s.RGBA32UI),F===s.BYTE&&(X=s.RGBA8I),F===s.SHORT&&(X=s.RGBA16I),F===s.INT&&(X=s.RGBA32I)),v===s.RGB&&F===s.UNSIGNED_INT_5_9_9_9_REV&&(X=s.RGB9_E5),v===s.RGBA){const vt=J?nr:Gt.getTransfer(Y);F===s.FLOAT&&(X=s.RGBA32F),F===s.HALF_FLOAT&&(X=s.RGBA16F),F===s.UNSIGNED_BYTE&&(X=vt===$t?s.SRGB8_ALPHA8:s.RGBA8),F===s.UNSIGNED_SHORT_4_4_4_4&&(X=s.RGBA4),F===s.UNSIGNED_SHORT_5_5_5_1&&(X=s.RGB5_A1)}return(X===s.R16F||X===s.R32F||X===s.RG16F||X===s.RG32F||X===s.RGBA16F||X===s.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function M(T,v){let F;return T?v===null||v===$n||v===Ai?F=s.DEPTH24_STENCIL8:v===hn?F=s.DEPTH32F_STENCIL8:v===Qi&&(F=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===$n||v===Ai?F=s.DEPTH_COMPONENT24:v===hn?F=s.DEPTH_COMPONENT32F:v===Qi&&(F=s.DEPTH_COMPONENT16),F}function N(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ye&&T.minFilter!==Ze?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function A(T){const v=T.target;v.removeEventListener("dispose",A),P(v),v.isVideoTexture&&h.delete(v)}function R(T){const v=T.target;v.removeEventListener("dispose",R),x(v)}function P(T){const v=n.get(T);if(v.__webglInit===void 0)return;const F=T.source,Y=f.get(F);if(Y){const J=Y[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&S(T),Object.keys(Y).length===0&&f.delete(F)}n.remove(T)}function S(T){const v=n.get(T);s.deleteTexture(v.__webglTexture);const F=T.source,Y=f.get(F);delete Y[v.__cacheKey],a.memory.textures--}function x(T){const v=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(v.__webglFramebuffer[Y]))for(let J=0;J<v.__webglFramebuffer[Y].length;J++)s.deleteFramebuffer(v.__webglFramebuffer[Y][J]);else s.deleteFramebuffer(v.__webglFramebuffer[Y]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[Y])}else{if(Array.isArray(v.__webglFramebuffer))for(let Y=0;Y<v.__webglFramebuffer.length;Y++)s.deleteFramebuffer(v.__webglFramebuffer[Y]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Y=0;Y<v.__webglColorRenderbuffer.length;Y++)v.__webglColorRenderbuffer[Y]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const F=T.textures;for(let Y=0,J=F.length;Y<J;Y++){const X=n.get(F[Y]);X.__webglTexture&&(s.deleteTexture(X.__webglTexture),a.memory.textures--),n.remove(F[Y])}n.remove(T)}let C=0;function k(){C=0}function B(){const T=C;return T>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+i.maxTextures),C+=1,T}function W(T){const v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function K(T,v){const F=n.get(T);if(T.isVideoTexture&&St(T),T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){const Y=T.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(F,T,v);return}}e.bindTexture(s.TEXTURE_2D,F.__webglTexture,s.TEXTURE0+v)}function V(T,v){const F=n.get(T);if(T.version>0&&F.__version!==T.version){q(F,T,v);return}e.bindTexture(s.TEXTURE_2D_ARRAY,F.__webglTexture,s.TEXTURE0+v)}function Z(T,v){const F=n.get(T);if(T.version>0&&F.__version!==T.version){q(F,T,v);return}e.bindTexture(s.TEXTURE_3D,F.__webglTexture,s.TEXTURE0+v)}function G(T,v){const F=n.get(T);if(T.version>0&&F.__version!==T.version){tt(F,T,v);return}e.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+v)}const st={[la]:s.REPEAT,[Wn]:s.CLAMP_TO_EDGE,[ca]:s.MIRRORED_REPEAT},ht={[Ye]:s.NEAREST,[mh]:s.NEAREST_MIPMAP_NEAREST,[os]:s.NEAREST_MIPMAP_LINEAR,[Ze]:s.LINEAR,[ur]:s.LINEAR_MIPMAP_NEAREST,[Xn]:s.LINEAR_MIPMAP_LINEAR},yt={[xh]:s.NEVER,[Th]:s.ALWAYS,[yh]:s.LESS,[ic]:s.LEQUAL,[Mh]:s.EQUAL,[bh]:s.GEQUAL,[Sh]:s.GREATER,[Eh]:s.NOTEQUAL};function Ut(T,v){if(v.type===hn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===Ze||v.magFilter===ur||v.magFilter===os||v.magFilter===Xn||v.minFilter===Ze||v.minFilter===ur||v.minFilter===os||v.minFilter===Xn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(T,s.TEXTURE_WRAP_S,st[v.wrapS]),s.texParameteri(T,s.TEXTURE_WRAP_T,st[v.wrapT]),(T===s.TEXTURE_3D||T===s.TEXTURE_2D_ARRAY)&&s.texParameteri(T,s.TEXTURE_WRAP_R,st[v.wrapR]),s.texParameteri(T,s.TEXTURE_MAG_FILTER,ht[v.magFilter]),s.texParameteri(T,s.TEXTURE_MIN_FILTER,ht[v.minFilter]),v.compareFunction&&(s.texParameteri(T,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(T,s.TEXTURE_COMPARE_FUNC,yt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Ye||v.minFilter!==os&&v.minFilter!==Xn||v.type===hn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");s.texParameterf(T,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Qt(T,v){let F=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",A));const Y=v.source;let J=f.get(Y);J===void 0&&(J={},f.set(Y,J));const X=W(v);if(X!==T.__cacheKey){J[X]===void 0&&(J[X]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,F=!0),J[X].usedTimes++;const vt=J[T.__cacheKey];vt!==void 0&&(J[T.__cacheKey].usedTimes--,vt.usedTimes===0&&S(v)),T.__cacheKey=X,T.__webglTexture=J[X].texture}return F}function q(T,v,F){let Y=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Y=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Y=s.TEXTURE_3D);const J=Qt(T,v),X=v.source;e.bindTexture(Y,T.__webglTexture,s.TEXTURE0+F);const vt=n.get(X);if(X.version!==vt.__version||J===!0){e.activeTexture(s.TEXTURE0+F);const at=Gt.getPrimaries(Gt.workingColorSpace),ut=v.colorSpace===wn?null:Gt.getPrimaries(v.colorSpace),Ht=v.colorSpace===wn||at===ut?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);let j=_(v.image,!1,i.maxTextureSize);j=ne(v,j);const ft=r.convert(v.format,v.colorSpace),Et=r.convert(v.type);let Tt=b(v.internalFormat,ft,Et,v.colorSpace,v.isVideoTexture);Ut(Y,v);let dt;const Bt=v.mipmaps,Dt=v.isVideoTexture!==!0,te=vt.__version===void 0||J===!0,L=X.dataReady,it=N(v,j);if(v.isDepthTexture)Tt=M(v.format===Ri,v.type),te&&(Dt?e.texStorage2D(s.TEXTURE_2D,1,Tt,j.width,j.height):e.texImage2D(s.TEXTURE_2D,0,Tt,j.width,j.height,0,ft,Et,null));else if(v.isDataTexture)if(Bt.length>0){Dt&&te&&e.texStorage2D(s.TEXTURE_2D,it,Tt,Bt[0].width,Bt[0].height);for(let H=0,$=Bt.length;H<$;H++)dt=Bt[H],Dt?L&&e.texSubImage2D(s.TEXTURE_2D,H,0,0,dt.width,dt.height,ft,Et,dt.data):e.texImage2D(s.TEXTURE_2D,H,Tt,dt.width,dt.height,0,ft,Et,dt.data);v.generateMipmaps=!1}else Dt?(te&&e.texStorage2D(s.TEXTURE_2D,it,Tt,j.width,j.height),L&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,j.width,j.height,ft,Et,j.data)):e.texImage2D(s.TEXTURE_2D,0,Tt,j.width,j.height,0,ft,Et,j.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Dt&&te&&e.texStorage3D(s.TEXTURE_2D_ARRAY,it,Tt,Bt[0].width,Bt[0].height,j.depth);for(let H=0,$=Bt.length;H<$;H++)if(dt=Bt[H],v.format!==qe)if(ft!==null)if(Dt){if(L)if(v.layerUpdates.size>0){const ct=xl(dt.width,dt.height,v.format,v.type);for(const ot of v.layerUpdates){const Ct=dt.data.subarray(ot*ct/dt.data.BYTES_PER_ELEMENT,(ot+1)*ct/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,H,0,0,ot,dt.width,dt.height,1,ft,Ct)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,H,0,0,0,dt.width,dt.height,j.depth,ft,dt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,H,Tt,dt.width,dt.height,j.depth,0,dt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Dt?L&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,H,0,0,0,dt.width,dt.height,j.depth,ft,Et,dt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,H,Tt,dt.width,dt.height,j.depth,0,ft,Et,dt.data)}else{Dt&&te&&e.texStorage2D(s.TEXTURE_2D,it,Tt,Bt[0].width,Bt[0].height);for(let H=0,$=Bt.length;H<$;H++)dt=Bt[H],v.format!==qe?ft!==null?Dt?L&&e.compressedTexSubImage2D(s.TEXTURE_2D,H,0,0,dt.width,dt.height,ft,dt.data):e.compressedTexImage2D(s.TEXTURE_2D,H,Tt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Dt?L&&e.texSubImage2D(s.TEXTURE_2D,H,0,0,dt.width,dt.height,ft,Et,dt.data):e.texImage2D(s.TEXTURE_2D,H,Tt,dt.width,dt.height,0,ft,Et,dt.data)}else if(v.isDataArrayTexture)if(Dt){if(te&&e.texStorage3D(s.TEXTURE_2D_ARRAY,it,Tt,j.width,j.height,j.depth),L)if(v.layerUpdates.size>0){const H=xl(j.width,j.height,v.format,v.type);for(const $ of v.layerUpdates){const ct=j.data.subarray($*H/j.data.BYTES_PER_ELEMENT,($+1)*H/j.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,$,j.width,j.height,1,ft,Et,ct)}v.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ft,Et,j.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Tt,j.width,j.height,j.depth,0,ft,Et,j.data);else if(v.isData3DTexture)Dt?(te&&e.texStorage3D(s.TEXTURE_3D,it,Tt,j.width,j.height,j.depth),L&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ft,Et,j.data)):e.texImage3D(s.TEXTURE_3D,0,Tt,j.width,j.height,j.depth,0,ft,Et,j.data);else if(v.isFramebufferTexture){if(te)if(Dt)e.texStorage2D(s.TEXTURE_2D,it,Tt,j.width,j.height);else{let H=j.width,$=j.height;for(let ct=0;ct<it;ct++)e.texImage2D(s.TEXTURE_2D,ct,Tt,H,$,0,ft,Et,null),H>>=1,$>>=1}}else if(Bt.length>0){if(Dt&&te){const H=Mt(Bt[0]);e.texStorage2D(s.TEXTURE_2D,it,Tt,H.width,H.height)}for(let H=0,$=Bt.length;H<$;H++)dt=Bt[H],Dt?L&&e.texSubImage2D(s.TEXTURE_2D,H,0,0,ft,Et,dt):e.texImage2D(s.TEXTURE_2D,H,Tt,ft,Et,dt);v.generateMipmaps=!1}else if(Dt){if(te){const H=Mt(j);e.texStorage2D(s.TEXTURE_2D,it,Tt,H.width,H.height)}L&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ft,Et,j)}else e.texImage2D(s.TEXTURE_2D,0,Tt,ft,Et,j);m(v)&&d(Y),vt.__version=X.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function tt(T,v,F){if(v.image.length!==6)return;const Y=Qt(T,v),J=v.source;e.bindTexture(s.TEXTURE_CUBE_MAP,T.__webglTexture,s.TEXTURE0+F);const X=n.get(J);if(J.version!==X.__version||Y===!0){e.activeTexture(s.TEXTURE0+F);const vt=Gt.getPrimaries(Gt.workingColorSpace),at=v.colorSpace===wn?null:Gt.getPrimaries(v.colorSpace),ut=v.colorSpace===wn||vt===at?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const Ht=v.isCompressedTexture||v.image[0].isCompressedTexture,j=v.image[0]&&v.image[0].isDataTexture,ft=[];for(let $=0;$<6;$++)!Ht&&!j?ft[$]=_(v.image[$],!0,i.maxCubemapSize):ft[$]=j?v.image[$].image:v.image[$],ft[$]=ne(v,ft[$]);const Et=ft[0],Tt=r.convert(v.format,v.colorSpace),dt=r.convert(v.type),Bt=b(v.internalFormat,Tt,dt,v.colorSpace),Dt=v.isVideoTexture!==!0,te=X.__version===void 0||Y===!0,L=J.dataReady;let it=N(v,Et);Ut(s.TEXTURE_CUBE_MAP,v);let H;if(Ht){Dt&&te&&e.texStorage2D(s.TEXTURE_CUBE_MAP,it,Bt,Et.width,Et.height);for(let $=0;$<6;$++){H=ft[$].mipmaps;for(let ct=0;ct<H.length;ct++){const ot=H[ct];v.format!==qe?Tt!==null?Dt?L&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,0,0,ot.width,ot.height,Tt,ot.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,Bt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Dt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,0,0,ot.width,ot.height,Tt,dt,ot.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct,Bt,ot.width,ot.height,0,Tt,dt,ot.data)}}}else{if(H=v.mipmaps,Dt&&te){H.length>0&&it++;const $=Mt(ft[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,it,Bt,$.width,$.height)}for(let $=0;$<6;$++)if(j){Dt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ft[$].width,ft[$].height,Tt,dt,ft[$].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Bt,ft[$].width,ft[$].height,0,Tt,dt,ft[$].data);for(let ct=0;ct<H.length;ct++){const Ct=H[ct].image[$].image;Dt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,0,0,Ct.width,Ct.height,Tt,dt,Ct.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,Bt,Ct.width,Ct.height,0,Tt,dt,Ct.data)}}else{Dt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Tt,dt,ft[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Bt,Tt,dt,ft[$]);for(let ct=0;ct<H.length;ct++){const ot=H[ct];Dt?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,0,0,Tt,dt,ot.image[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ct+1,Bt,Tt,dt,ot.image[$])}}}m(v)&&d(s.TEXTURE_CUBE_MAP),X.__version=J.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function _t(T,v,F,Y,J,X){const vt=r.convert(F.format,F.colorSpace),at=r.convert(F.type),ut=b(F.internalFormat,vt,at,F.colorSpace),Ht=n.get(v),j=n.get(F);if(j.__renderTarget=v,!Ht.__hasExternalTextures){const ft=Math.max(1,v.width>>X),Et=Math.max(1,v.height>>X);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,X,ut,ft,Et,v.depth,0,vt,at,null):e.texImage2D(J,X,ut,ft,Et,0,vt,at,null)}e.bindFramebuffer(s.FRAMEBUFFER,T),zt(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Y,J,j.__webglTexture,0,Ot(v)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Y,J,j.__webglTexture,X),e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(T,v,F){if(s.bindRenderbuffer(s.RENDERBUFFER,T),v.depthBuffer){const Y=v.depthTexture,J=Y&&Y.isDepthTexture?Y.type:null,X=M(v.stencilBuffer,J),vt=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,at=Ot(v);zt(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,at,X,v.width,v.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,at,X,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,X,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,vt,s.RENDERBUFFER,T)}else{const Y=v.textures;for(let J=0;J<Y.length;J++){const X=Y[J],vt=r.convert(X.format,X.colorSpace),at=r.convert(X.type),ut=b(X.internalFormat,vt,at,X.colorSpace),Ht=Ot(v);F&&zt(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ht,ut,v.width,v.height):zt(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ht,ut,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ut,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function bt(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(v.depthTexture);Y.__renderTarget=v,(!Y.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),K(v.depthTexture,0);const J=Y.__webglTexture,X=Ot(v);if(v.depthTexture.format===Mi)zt(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0,X):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0);else if(v.depthTexture.format===Ri)zt(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0,X):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Rt(T){const v=n.get(T),F=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){const Y=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Y){const J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Y.removeEventListener("dispose",J)};Y.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=Y}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");bt(v.__webglFramebuffer,T)}else if(F){v.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[Y]),v.__webglDepthbuffer[Y]===void 0)v.__webglDepthbuffer[Y]=s.createRenderbuffer(),rt(v.__webglDepthbuffer[Y],T,!1);else{const J=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,X=v.__webglDepthbuffer[Y];s.bindRenderbuffer(s.RENDERBUFFER,X),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,X)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),rt(v.__webglDepthbuffer,T,!1);else{const Y=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,J),s.framebufferRenderbuffer(s.FRAMEBUFFER,Y,s.RENDERBUFFER,J)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Nt(T,v,F){const Y=n.get(T);v!==void 0&&_t(Y.__webglFramebuffer,T,T.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),F!==void 0&&Rt(T)}function re(T){const v=T.texture,F=n.get(T),Y=n.get(v);T.addEventListener("dispose",R);const J=T.textures,X=T.isWebGLCubeRenderTarget===!0,vt=J.length>1;if(vt||(Y.__webglTexture===void 0&&(Y.__webglTexture=s.createTexture()),Y.__version=v.version,a.memory.textures++),X){F.__webglFramebuffer=[];for(let at=0;at<6;at++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[at]=[];for(let ut=0;ut<v.mipmaps.length;ut++)F.__webglFramebuffer[at][ut]=s.createFramebuffer()}else F.__webglFramebuffer[at]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let at=0;at<v.mipmaps.length;at++)F.__webglFramebuffer[at]=s.createFramebuffer()}else F.__webglFramebuffer=s.createFramebuffer();if(vt)for(let at=0,ut=J.length;at<ut;at++){const Ht=n.get(J[at]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=s.createTexture(),a.memory.textures++)}if(T.samples>0&&zt(T)===!1){F.__webglMultisampledFramebuffer=s.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let at=0;at<J.length;at++){const ut=J[at];F.__webglColorRenderbuffer[at]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,F.__webglColorRenderbuffer[at]);const Ht=r.convert(ut.format,ut.colorSpace),j=r.convert(ut.type),ft=b(ut.internalFormat,Ht,j,ut.colorSpace,T.isXRRenderTarget===!0),Et=Ot(T);s.renderbufferStorageMultisample(s.RENDERBUFFER,Et,ft,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.RENDERBUFFER,F.__webglColorRenderbuffer[at])}s.bindRenderbuffer(s.RENDERBUFFER,null),T.depthBuffer&&(F.__webglDepthRenderbuffer=s.createRenderbuffer(),rt(F.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(X){e.bindTexture(s.TEXTURE_CUBE_MAP,Y.__webglTexture),Ut(s.TEXTURE_CUBE_MAP,v);for(let at=0;at<6;at++)if(v.mipmaps&&v.mipmaps.length>0)for(let ut=0;ut<v.mipmaps.length;ut++)_t(F.__webglFramebuffer[at][ut],T,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+at,ut);else _t(F.__webglFramebuffer[at],T,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);m(v)&&d(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(vt){for(let at=0,ut=J.length;at<ut;at++){const Ht=J[at],j=n.get(Ht);e.bindTexture(s.TEXTURE_2D,j.__webglTexture),Ut(s.TEXTURE_2D,Ht),_t(F.__webglFramebuffer,T,Ht,s.COLOR_ATTACHMENT0+at,s.TEXTURE_2D,0),m(Ht)&&d(s.TEXTURE_2D)}e.unbindTexture()}else{let at=s.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(at=T.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(at,Y.__webglTexture),Ut(at,v),v.mipmaps&&v.mipmaps.length>0)for(let ut=0;ut<v.mipmaps.length;ut++)_t(F.__webglFramebuffer[ut],T,v,s.COLOR_ATTACHMENT0,at,ut);else _t(F.__webglFramebuffer,T,v,s.COLOR_ATTACHMENT0,at,0);m(v)&&d(at),e.unbindTexture()}T.depthBuffer&&Rt(T)}function kt(T){const v=T.textures;for(let F=0,Y=v.length;F<Y;F++){const J=v[F];if(m(J)){const X=E(T),vt=n.get(J).__webglTexture;e.bindTexture(X,vt),d(X),e.unbindTexture()}}}const oe=[],U=[];function Ne(T){if(T.samples>0){if(zt(T)===!1){const v=T.textures,F=T.width,Y=T.height;let J=s.COLOR_BUFFER_BIT;const X=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,vt=n.get(T),at=v.length>1;if(at)for(let ut=0;ut<v.length;ut++)e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let ut=0;ut<v.length;ut++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),at){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,vt.__webglColorRenderbuffer[ut]);const Ht=n.get(v[ut]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ht,0)}s.blitFramebuffer(0,0,F,Y,0,0,F,Y,J,s.NEAREST),l===!0&&(oe.length=0,U.length=0,oe.push(s.COLOR_ATTACHMENT0+ut),T.depthBuffer&&T.resolveDepthBuffer===!1&&(oe.push(X),U.push(X),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,U)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,oe))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),at)for(let ut=0;ut<v.length;ut++){e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,vt.__webglColorRenderbuffer[ut]);const Ht=n.get(v[ut]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,Ht,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const v=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function Ot(T){return Math.min(i.maxSamples,T.samples)}function zt(T){const v=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function St(T){const v=a.render.frame;h.get(T)!==v&&(h.set(T,v),T.update())}function ne(T,v){const F=T.colorSpace,Y=T.format,J=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||F!==Li&&F!==wn&&(Gt.getTransfer(F)===$t?(Y!==qe||J!==pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),v}function Mt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=k,this.setTexture2D=K,this.setTexture2DArray=V,this.setTexture3D=Z,this.setTextureCube=G,this.rebindTextures=Nt,this.setupRenderTarget=re,this.updateRenderTargetMipmap=kt,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=zt}function Pm(s,t){function e(n,i=wn){let r;const a=Gt.getTransfer(i);if(n===pn)return s.UNSIGNED_BYTE;if(n===Xa)return s.UNSIGNED_SHORT_4_4_4_4;if(n===qa)return s.UNSIGNED_SHORT_5_5_5_1;if(n===$l)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===ql)return s.BYTE;if(n===Yl)return s.SHORT;if(n===Qi)return s.UNSIGNED_SHORT;if(n===Wa)return s.INT;if(n===$n)return s.UNSIGNED_INT;if(n===hn)return s.FLOAT;if(n===es)return s.HALF_FLOAT;if(n===Kl)return s.ALPHA;if(n===Jl)return s.RGB;if(n===qe)return s.RGBA;if(n===Zl)return s.LUMINANCE;if(n===jl)return s.LUMINANCE_ALPHA;if(n===Mi)return s.DEPTH_COMPONENT;if(n===Ri)return s.DEPTH_STENCIL;if(n===Ql)return s.RED;if(n===Ya)return s.RED_INTEGER;if(n===tc)return s.RG;if(n===$a)return s.RG_INTEGER;if(n===Ka)return s.RGBA_INTEGER;if(n===Bs||n===ks||n===Hs||n===Gs)if(a===$t)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Bs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Bs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ks)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ha||n===ua||n===fa||n===da)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ha)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ua)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===fa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===da)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===pa||n===ma||n===ga)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===pa||n===ma)return a===$t?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ga)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===_a||n===va||n===xa||n===ya||n===Ma||n===Sa||n===Ea||n===ba||n===Ta||n===wa||n===Aa||n===Ra||n===Ca||n===Pa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===_a)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===va)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===xa)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ya)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ma)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Sa)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ea)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ba)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ta)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===wa)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Aa)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ra)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ca)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pa)return a===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Vs||n===La||n===Da)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Vs)return a===$t?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===La)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Da)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ec||n===Ia||n===Ua||n===Na)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Vs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ia)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ua)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Na)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ai?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}class Lm extends Ie{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class qn extends he{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Dm={type:"move"};class Br{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),d=this._getHandJoint(c,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Dm)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new qn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Im=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Um=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Nm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Ae,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new mn({vertexShader:Im,fragmentShader:Um,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ue(new sr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fm extends Di{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,g=null;const _=new Nm,m=e.getContextAttributes();let d=null,E=null;const b=[],M=[],N=new nt;let A=null;const R=new Ie;R.viewport=new Jt;const P=new Ie;P.viewport=new Jt;const S=[R,P],x=new Lm;let C=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let tt=b[q];return tt===void 0&&(tt=new Br,b[q]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(q){let tt=b[q];return tt===void 0&&(tt=new Br,b[q]=tt),tt.getGripSpace()},this.getHand=function(q){let tt=b[q];return tt===void 0&&(tt=new Br,b[q]=tt),tt.getHandSpace()};function B(q){const tt=M.indexOf(q.inputSource);if(tt===-1)return;const _t=b[tt];_t!==void 0&&(_t.update(q.inputSource,q.frame,c||a),_t.dispatchEvent({type:q.type,data:q.inputSource}))}function W(){i.removeEventListener("select",B),i.removeEventListener("selectstart",B),i.removeEventListener("selectend",B),i.removeEventListener("squeeze",B),i.removeEventListener("squeezestart",B),i.removeEventListener("squeezeend",B),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",K);for(let q=0;q<b.length;q++){const tt=M[q];tt!==null&&(M[q]=null,b[q].disconnect(tt))}C=null,k=null,_.reset(),t.setRenderTarget(d),p=null,f=null,u=null,i=null,E=null,Qt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(N.width,N.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(d=t.getRenderTarget(),i.addEventListener("select",B),i.addEventListener("selectstart",B),i.addEventListener("selectend",B),i.addEventListener("squeeze",B),i.addEventListener("squeezestart",B),i.addEventListener("squeezeend",B),i.addEventListener("end",W),i.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(N),i.renderState.layers===void 0){const tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(i,e,tt),i.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),E=new Kn(p.framebufferWidth,p.framebufferHeight,{format:qe,type:pn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,_t=null,rt=null;m.depth&&(rt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?Ri:Mi,_t=m.stencil?Ai:$n);const bt={colorFormat:e.RGBA8,depthFormat:rt,scaleFactor:r};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(bt),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),E=new Kn(f.textureWidth,f.textureHeight,{format:qe,type:pn,depthTexture:new mc(f.textureWidth,f.textureHeight,_t,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Qt.setContext(i),Qt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(q){for(let tt=0;tt<q.removed.length;tt++){const _t=q.removed[tt],rt=M.indexOf(_t);rt>=0&&(M[rt]=null,b[rt].disconnect(_t))}for(let tt=0;tt<q.added.length;tt++){const _t=q.added[tt];let rt=M.indexOf(_t);if(rt===-1){for(let Rt=0;Rt<b.length;Rt++)if(Rt>=M.length){M.push(_t),rt=Rt;break}else if(M[Rt]===null){M[Rt]=_t,rt=Rt;break}if(rt===-1)break}const bt=b[rt];bt&&bt.connect(_t)}}const V=new w,Z=new w;function G(q,tt,_t){V.setFromMatrixPosition(tt.matrixWorld),Z.setFromMatrixPosition(_t.matrixWorld);const rt=V.distanceTo(Z),bt=tt.projectionMatrix.elements,Rt=_t.projectionMatrix.elements,Nt=bt[14]/(bt[10]-1),re=bt[14]/(bt[10]+1),kt=(bt[9]+1)/bt[5],oe=(bt[9]-1)/bt[5],U=(bt[8]-1)/bt[0],Ne=(Rt[8]+1)/Rt[0],Ot=Nt*U,zt=Nt*Ne,St=rt/(-U+Ne),ne=St*-U;if(tt.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(ne),q.translateZ(St),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),bt[10]===-1)q.projectionMatrix.copy(tt.projectionMatrix),q.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const Mt=Nt+St,T=re+St,v=Ot-ne,F=zt+(rt-ne),Y=kt*re/T*Mt,J=oe*re/T*Mt;q.projectionMatrix.makePerspective(v,F,Y,J,Mt,T),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function st(q,tt){tt===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(tt.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;let tt=q.near,_t=q.far;_.texture!==null&&(_.depthNear>0&&(tt=_.depthNear),_.depthFar>0&&(_t=_.depthFar)),x.near=P.near=R.near=tt,x.far=P.far=R.far=_t,(C!==x.near||k!==x.far)&&(i.updateRenderState({depthNear:x.near,depthFar:x.far}),C=x.near,k=x.far),R.layers.mask=q.layers.mask|2,P.layers.mask=q.layers.mask|4,x.layers.mask=R.layers.mask|P.layers.mask;const rt=q.parent,bt=x.cameras;st(x,rt);for(let Rt=0;Rt<bt.length;Rt++)st(bt[Rt],rt);bt.length===2?G(x,R,P):x.projectionMatrix.copy(R.projectionMatrix),ht(q,x,rt)};function ht(q,tt,_t){_t===null?q.matrix.copy(tt.matrixWorld):(q.matrix.copy(_t.matrixWorld),q.matrix.invert(),q.matrix.multiply(tt.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(tt.projectionMatrix),q.projectionMatrixInverse.copy(tt.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Oa*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(q){l=q,f!==null&&(f.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(x)};let yt=null;function Ut(q,tt){if(h=tt.getViewerPose(c||a),g=tt,h!==null){const _t=h.views;p!==null&&(t.setRenderTargetFramebuffer(E,p.framebuffer),t.setRenderTarget(E));let rt=!1;_t.length!==x.cameras.length&&(x.cameras.length=0,rt=!0);for(let Rt=0;Rt<_t.length;Rt++){const Nt=_t[Rt];let re=null;if(p!==null)re=p.getViewport(Nt);else{const oe=u.getViewSubImage(f,Nt);re=oe.viewport,Rt===0&&(t.setRenderTargetTextures(E,oe.colorTexture,f.ignoreDepthValues?void 0:oe.depthStencilTexture),t.setRenderTarget(E))}let kt=S[Rt];kt===void 0&&(kt=new Ie,kt.layers.enable(Rt),kt.viewport=new Jt,S[Rt]=kt),kt.matrix.fromArray(Nt.transform.matrix),kt.matrix.decompose(kt.position,kt.quaternion,kt.scale),kt.projectionMatrix.fromArray(Nt.projectionMatrix),kt.projectionMatrixInverse.copy(kt.projectionMatrix).invert(),kt.viewport.set(re.x,re.y,re.width,re.height),Rt===0&&(x.matrix.copy(kt.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),rt===!0&&x.cameras.push(kt)}const bt=i.enabledFeatures;if(bt&&bt.includes("depth-sensing")){const Rt=u.getDepthInformation(_t[0]);Rt&&Rt.isValid&&Rt.texture&&_.init(t,Rt,i.renderState)}}for(let _t=0;_t<b.length;_t++){const rt=M[_t],bt=b[_t];rt!==null&&bt!==void 0&&bt.update(rt,tt,c||a)}yt&&yt(q,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),g=null}const Qt=new dc;Qt.setAnimationLoop(Ut),this.setAnimationLoop=function(q){yt=q},this.dispose=function(){}}}const Bn=new je,Om=new Zt;function zm(s,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,hc(s)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function i(m,d,E,b,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,M)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,E,b):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ce&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ce&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const E=t.get(d),b=E.envMap,M=E.envMapRotation;b&&(m.envMap.value=b,Bn.copy(M),Bn.x*=-1,Bn.y*=-1,Bn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Bn.y*=-1,Bn.z*=-1),m.envMapRotation.value.setFromMatrix4(Om.makeRotationFromEuler(Bn)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,E,b){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*E,m.scale.value=b*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,E){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ce&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){const E=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Bm(s,t,e,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,b){const M=b.program;n.uniformBlockBinding(E,M)}function c(E,b){let M=i[E.id];M===void 0&&(g(E),M=h(E),i[E.id]=M,E.addEventListener("dispose",m));const N=b.program;n.updateUBOMapping(E,N);const A=t.render.frame;r[E.id]!==A&&(f(E),r[E.id]=A)}function h(E){const b=u();E.__bindingPointIndex=b;const M=s.createBuffer(),N=E.__size,A=E.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,N,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,M),M}function u(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){const b=i[E.id],M=E.uniforms,N=E.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let A=0,R=M.length;A<R;A++){const P=Array.isArray(M[A])?M[A]:[M[A]];for(let S=0,x=P.length;S<x;S++){const C=P[S];if(p(C,A,S,N)===!0){const k=C.__offset,B=Array.isArray(C.value)?C.value:[C.value];let W=0;for(let K=0;K<B.length;K++){const V=B[K],Z=_(V);typeof V=="number"||typeof V=="boolean"?(C.__data[0]=V,s.bufferSubData(s.UNIFORM_BUFFER,k+W,C.__data)):V.isMatrix3?(C.__data[0]=V.elements[0],C.__data[1]=V.elements[1],C.__data[2]=V.elements[2],C.__data[3]=0,C.__data[4]=V.elements[3],C.__data[5]=V.elements[4],C.__data[6]=V.elements[5],C.__data[7]=0,C.__data[8]=V.elements[6],C.__data[9]=V.elements[7],C.__data[10]=V.elements[8],C.__data[11]=0):(V.toArray(C.__data,W),W+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,k,C.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function p(E,b,M,N){const A=E.value,R=b+"_"+M;if(N[R]===void 0)return typeof A=="number"||typeof A=="boolean"?N[R]=A:N[R]=A.clone(),!0;{const P=N[R];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return N[R]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function g(E){const b=E.uniforms;let M=0;const N=16;for(let R=0,P=b.length;R<P;R++){const S=Array.isArray(b[R])?b[R]:[b[R]];for(let x=0,C=S.length;x<C;x++){const k=S[x],B=Array.isArray(k.value)?k.value:[k.value];for(let W=0,K=B.length;W<K;W++){const V=B[W],Z=_(V),G=M%N,st=G%Z.boundary,ht=G+st;M+=st,ht!==0&&N-ht<Z.storage&&(M+=N-ht),k.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=M,M+=Z.storage}}}const A=M%N;return A>0&&(M+=N-A),E.__size=M,E.__cache={},this}function _(E){const b={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(b.boundary=4,b.storage=4):E.isVector2?(b.boundary=8,b.storage=8):E.isVector3||E.isColor?(b.boundary=16,b.storage=12):E.isVector4?(b.boundary=16,b.storage=16):E.isMatrix3?(b.boundary=48,b.storage=48):E.isMatrix4?(b.boundary=64,b.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),b}function m(E){const b=E.target;b.removeEventListener("dispose",m);const M=a.indexOf(b.__bindingPointIndex);a.splice(M,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function d(){for(const E in i)s.deleteBuffer(i[E]);a=[],i={},r={}}return{bind:l,update:c,dispose:d}}class km{constructor(t={}){const{canvas:e=Ah(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,d=null;const E=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Te,this.toneMapping=Rn,this.toneMappingExposure=1;const M=this;let N=!1,A=0,R=0,P=null,S=-1,x=null;const C=new Jt,k=new Jt;let B=null;const W=new At(0);let K=0,V=e.width,Z=e.height,G=1,st=null,ht=null;const yt=new Jt(0,0,V,Z),Ut=new Jt(0,0,V,Z);let Qt=!1;const q=new Za;let tt=!1,_t=!1;const rt=new Zt,bt=new Zt,Rt=new w,Nt=new Jt,re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let kt=!1;function oe(){return P===null?G:1}let U=n;function Ne(y,D){return e.getContext(y,D)}try{const y={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Va}`),e.addEventListener("webglcontextlost",$,!1),e.addEventListener("webglcontextrestored",ct,!1),e.addEventListener("webglcontextcreationerror",ot,!1),U===null){const D="webgl2";if(U=Ne(D,y),U===null)throw Ne(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Ot,zt,St,ne,Mt,T,v,F,Y,J,X,vt,at,ut,Ht,j,ft,Et,Tt,dt,Bt,Dt,te,L;function it(){Ot=new Xd(U),Ot.init(),Dt=new Pm(U,Ot),zt=new Bd(U,Ot,t,Dt),St=new Am(U,Ot),zt.reverseDepthBuffer&&f&&St.buffers.depth.setReversed(!0),ne=new $d(U),Mt=new fm,T=new Cm(U,Ot,St,Mt,zt,Dt,ne),v=new Hd(M),F=new Wd(M),Y=new tu(U),te=new Od(U,Y),J=new qd(U,Y,ne,te),X=new Jd(U,J,Y,ne),Tt=new Kd(U,zt,T),j=new kd(Mt),vt=new um(M,v,F,Ot,zt,te,j),at=new zm(M,Mt),ut=new pm,Ht=new ym(Ot),Et=new Fd(M,v,F,St,X,p,l),ft=new Tm(M,X,zt),L=new Bm(U,ne,zt,St),dt=new zd(U,Ot,ne),Bt=new Yd(U,Ot,ne),ne.programs=vt.programs,M.capabilities=zt,M.extensions=Ot,M.properties=Mt,M.renderLists=ut,M.shadowMap=ft,M.state=St,M.info=ne}it();const H=new Fm(M,U);this.xr=H,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const y=Ot.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Ot.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(y){y!==void 0&&(G=y,this.setSize(V,Z,!1))},this.getSize=function(y){return y.set(V,Z)},this.setSize=function(y,D,O=!0){if(H.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=y,Z=D,e.width=Math.floor(y*G),e.height=Math.floor(D*G),O===!0&&(e.style.width=y+"px",e.style.height=D+"px"),this.setViewport(0,0,y,D)},this.getDrawingBufferSize=function(y){return y.set(V*G,Z*G).floor()},this.setDrawingBufferSize=function(y,D,O){V=y,Z=D,G=O,e.width=Math.floor(y*O),e.height=Math.floor(D*O),this.setViewport(0,0,y,D)},this.getCurrentViewport=function(y){return y.copy(C)},this.getViewport=function(y){return y.copy(yt)},this.setViewport=function(y,D,O,z){y.isVector4?yt.set(y.x,y.y,y.z,y.w):yt.set(y,D,O,z),St.viewport(C.copy(yt).multiplyScalar(G).round())},this.getScissor=function(y){return y.copy(Ut)},this.setScissor=function(y,D,O,z){y.isVector4?Ut.set(y.x,y.y,y.z,y.w):Ut.set(y,D,O,z),St.scissor(k.copy(Ut).multiplyScalar(G).round())},this.getScissorTest=function(){return Qt},this.setScissorTest=function(y){St.setScissorTest(Qt=y)},this.setOpaqueSort=function(y){st=y},this.setTransparentSort=function(y){ht=y},this.getClearColor=function(y){return y.copy(Et.getClearColor())},this.setClearColor=function(){Et.setClearColor.apply(Et,arguments)},this.getClearAlpha=function(){return Et.getClearAlpha()},this.setClearAlpha=function(){Et.setClearAlpha.apply(Et,arguments)},this.clear=function(y=!0,D=!0,O=!0){let z=0;if(y){let I=!1;if(P!==null){const Q=P.texture.format;I=Q===Ka||Q===$a||Q===Ya}if(I){const Q=P.texture.type,lt=Q===pn||Q===$n||Q===Qi||Q===Ai||Q===Xa||Q===qa,pt=Et.getClearColor(),mt=Et.getClearAlpha(),wt=pt.r,Pt=pt.g,gt=pt.b;lt?(g[0]=wt,g[1]=Pt,g[2]=gt,g[3]=mt,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=wt,_[1]=Pt,_[2]=gt,_[3]=mt,U.clearBufferiv(U.COLOR,0,_))}else z|=U.COLOR_BUFFER_BIT}D&&(z|=U.DEPTH_BUFFER_BIT),O&&(z|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$,!1),e.removeEventListener("webglcontextrestored",ct,!1),e.removeEventListener("webglcontextcreationerror",ot,!1),ut.dispose(),Ht.dispose(),Mt.dispose(),v.dispose(),F.dispose(),X.dispose(),te.dispose(),L.dispose(),vt.dispose(),H.dispose(),H.removeEventListener("sessionstart",go),H.removeEventListener("sessionend",_o),In.stop()};function $(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function ct(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const y=ne.autoReset,D=ft.enabled,O=ft.autoUpdate,z=ft.needsUpdate,I=ft.type;it(),ne.autoReset=y,ft.enabled=D,ft.autoUpdate=O,ft.needsUpdate=z,ft.type=I}function ot(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ct(y){const D=y.target;D.removeEventListener("dispose",Ct),ae(D)}function ae(y){xe(y),Mt.remove(y)}function xe(y){const D=Mt.get(y).programs;D!==void 0&&(D.forEach(function(O){vt.releaseProgram(O)}),y.isShaderMaterial&&vt.releaseShaderCache(y))}this.renderBufferDirect=function(y,D,O,z,I,Q){D===null&&(D=re);const lt=I.isMesh&&I.matrixWorld.determinant()<0,pt=Oc(y,D,O,z,I);St.setMaterial(z,lt);let mt=O.index,wt=1;if(z.wireframe===!0){if(mt=J.getWireframeAttribute(O),mt===void 0)return;wt=2}const Pt=O.drawRange,gt=O.attributes.position;let Vt=Pt.start*wt,ee=(Pt.start+Pt.count)*wt;Q!==null&&(Vt=Math.max(Vt,Q.start*wt),ee=Math.min(ee,(Q.start+Q.count)*wt)),mt!==null?(Vt=Math.max(Vt,0),ee=Math.min(ee,mt.count)):gt!=null&&(Vt=Math.max(Vt,0),ee=Math.min(ee,gt.count));const ie=ee-Vt;if(ie<0||ie===1/0)return;te.setup(I,z,pt,O,mt);let Re,Wt=dt;if(mt!==null&&(Re=Y.get(mt),Wt=Bt,Wt.setIndex(Re)),I.isMesh)z.wireframe===!0?(St.setLineWidth(z.wireframeLinewidth*oe()),Wt.setMode(U.LINES)):Wt.setMode(U.TRIANGLES);else if(I.isLine){let xt=z.linewidth;xt===void 0&&(xt=1),St.setLineWidth(xt*oe()),I.isLineSegments?Wt.setMode(U.LINES):I.isLineLoop?Wt.setMode(U.LINE_LOOP):Wt.setMode(U.LINE_STRIP)}else I.isPoints?Wt.setMode(U.POINTS):I.isSprite&&Wt.setMode(U.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)Wt.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(Ot.get("WEBGL_multi_draw"))Wt.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{const xt=I._multiDrawStarts,en=I._multiDrawCounts,Xt=I._multiDrawCount,Ge=mt?Y.get(mt).bytesPerElement:1,jn=Mt.get(z).currentProgram.getUniforms();for(let Pe=0;Pe<Xt;Pe++)jn.setValue(U,"_gl_DrawID",Pe),Wt.render(xt[Pe]/Ge,en[Pe])}else if(I.isInstancedMesh)Wt.renderInstances(Vt,ie,I.count);else if(O.isInstancedBufferGeometry){const xt=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,en=Math.min(O.instanceCount,xt);Wt.renderInstances(Vt,ie,en)}else Wt.render(Vt,ie)};function Yt(y,D,O){y.transparent===!0&&y.side===cn&&y.forceSinglePass===!1?(y.side=Ce,y.needsUpdate=!0,as(y,D,O),y.side=Pn,y.needsUpdate=!0,as(y,D,O),y.side=cn):as(y,D,O)}this.compile=function(y,D,O=null){O===null&&(O=y),d=Ht.get(O),d.init(D),b.push(d),O.traverseVisible(function(I){I.isLight&&I.layers.test(D.layers)&&(d.pushLight(I),I.castShadow&&d.pushShadow(I))}),y!==O&&y.traverseVisible(function(I){I.isLight&&I.layers.test(D.layers)&&(d.pushLight(I),I.castShadow&&d.pushShadow(I))}),d.setupLights();const z=new Set;return y.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;const Q=I.material;if(Q)if(Array.isArray(Q))for(let lt=0;lt<Q.length;lt++){const pt=Q[lt];Yt(pt,O,I),z.add(pt)}else Yt(Q,O,I),z.add(Q)}),b.pop(),d=null,z},this.compileAsync=function(y,D,O=null){const z=this.compile(y,D,O);return new Promise(I=>{function Q(){if(z.forEach(function(lt){Mt.get(lt).currentProgram.isReady()&&z.delete(lt)}),z.size===0){I(y);return}setTimeout(Q,10)}Ot.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let He=null;function tn(y){He&&He(y)}function go(){In.stop()}function _o(){In.start()}const In=new dc;In.setAnimationLoop(tn),typeof self<"u"&&In.setContext(self),this.setAnimationLoop=function(y){He=y,H.setAnimationLoop(y),y===null?In.stop():In.start()},H.addEventListener("sessionstart",go),H.addEventListener("sessionend",_o),this.render=function(y,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),H.enabled===!0&&H.isPresenting===!0&&(H.cameraAutoUpdate===!0&&H.updateCamera(D),D=H.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,D,P),d=Ht.get(y,b.length),d.init(D),b.push(d),bt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),q.setFromProjectionMatrix(bt),_t=this.localClippingEnabled,tt=j.init(this.clippingPlanes,_t),m=ut.get(y,E.length),m.init(),E.push(m),H.enabled===!0&&H.isPresenting===!0){const Q=M.xr.getDepthSensingMesh();Q!==null&&hr(Q,D,-1/0,M.sortObjects)}hr(y,D,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(st,ht),kt=H.enabled===!1||H.isPresenting===!1||H.hasDepthSensing()===!1,kt&&Et.addToRenderList(m,y),this.info.render.frame++,tt===!0&&j.beginShadows();const O=d.state.shadowsArray;ft.render(O,y,D),tt===!0&&j.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=m.opaque,I=m.transmissive;if(d.setupLights(),D.isArrayCamera){const Q=D.cameras;if(I.length>0)for(let lt=0,pt=Q.length;lt<pt;lt++){const mt=Q[lt];xo(z,I,y,mt)}kt&&Et.render(y);for(let lt=0,pt=Q.length;lt<pt;lt++){const mt=Q[lt];vo(m,y,mt,mt.viewport)}}else I.length>0&&xo(z,I,y,D),kt&&Et.render(y),vo(m,y,D);P!==null&&(T.updateMultisampleRenderTarget(P),T.updateRenderTargetMipmap(P)),y.isScene===!0&&y.onAfterRender(M,y,D),te.resetDefaultState(),S=-1,x=null,b.pop(),b.length>0?(d=b[b.length-1],tt===!0&&j.setGlobalState(M.clippingPlanes,d.state.camera)):d=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function hr(y,D,O,z){if(y.visible===!1)return;if(y.layers.test(D.layers)){if(y.isGroup)O=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(D);else if(y.isLight)d.pushLight(y),y.castShadow&&d.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||q.intersectsSprite(y)){z&&Nt.setFromMatrixPosition(y.matrixWorld).applyMatrix4(bt);const lt=X.update(y),pt=y.material;pt.visible&&m.push(y,lt,pt,O,Nt.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||q.intersectsObject(y))){const lt=X.update(y),pt=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Nt.copy(y.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),Nt.copy(lt.boundingSphere.center)),Nt.applyMatrix4(y.matrixWorld).applyMatrix4(bt)),Array.isArray(pt)){const mt=lt.groups;for(let wt=0,Pt=mt.length;wt<Pt;wt++){const gt=mt[wt],Vt=pt[gt.materialIndex];Vt&&Vt.visible&&m.push(y,lt,Vt,O,Nt.z,gt)}}else pt.visible&&m.push(y,lt,pt,O,Nt.z,null)}}const Q=y.children;for(let lt=0,pt=Q.length;lt<pt;lt++)hr(Q[lt],D,O,z)}function vo(y,D,O,z){const I=y.opaque,Q=y.transmissive,lt=y.transparent;d.setupLightsView(O),tt===!0&&j.setGlobalState(M.clippingPlanes,O),z&&St.viewport(C.copy(z)),I.length>0&&rs(I,D,O),Q.length>0&&rs(Q,D,O),lt.length>0&&rs(lt,D,O),St.buffers.depth.setTest(!0),St.buffers.depth.setMask(!0),St.buffers.color.setMask(!0),St.setPolygonOffset(!1)}function xo(y,D,O,z){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[z.id]===void 0&&(d.state.transmissionRenderTarget[z.id]=new Kn(1,1,{generateMipmaps:!0,type:Ot.has("EXT_color_buffer_half_float")||Ot.has("EXT_color_buffer_float")?es:pn,minFilter:Xn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Gt.workingColorSpace}));const Q=d.state.transmissionRenderTarget[z.id],lt=z.viewport||C;Q.setSize(lt.z,lt.w);const pt=M.getRenderTarget();M.setRenderTarget(Q),M.getClearColor(W),K=M.getClearAlpha(),K<1&&M.setClearColor(16777215,.5),M.clear(),kt&&Et.render(O);const mt=M.toneMapping;M.toneMapping=Rn;const wt=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),d.setupLightsView(z),tt===!0&&j.setGlobalState(M.clippingPlanes,z),rs(y,O,z),T.updateMultisampleRenderTarget(Q),T.updateRenderTargetMipmap(Q),Ot.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let gt=0,Vt=D.length;gt<Vt;gt++){const ee=D[gt],ie=ee.object,Re=ee.geometry,Wt=ee.material,xt=ee.group;if(Wt.side===cn&&ie.layers.test(z.layers)){const en=Wt.side;Wt.side=Ce,Wt.needsUpdate=!0,yo(ie,O,z,Re,Wt,xt),Wt.side=en,Wt.needsUpdate=!0,Pt=!0}}Pt===!0&&(T.updateMultisampleRenderTarget(Q),T.updateRenderTargetMipmap(Q))}M.setRenderTarget(pt),M.setClearColor(W,K),wt!==void 0&&(z.viewport=wt),M.toneMapping=mt}function rs(y,D,O){const z=D.isScene===!0?D.overrideMaterial:null;for(let I=0,Q=y.length;I<Q;I++){const lt=y[I],pt=lt.object,mt=lt.geometry,wt=z===null?lt.material:z,Pt=lt.group;pt.layers.test(O.layers)&&yo(pt,D,O,mt,wt,Pt)}}function yo(y,D,O,z,I,Q){y.onBeforeRender(M,D,O,z,I,Q),y.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),I.onBeforeRender(M,D,O,z,y,Q),I.transparent===!0&&I.side===cn&&I.forceSinglePass===!1?(I.side=Ce,I.needsUpdate=!0,M.renderBufferDirect(O,D,z,I,y,Q),I.side=Pn,I.needsUpdate=!0,M.renderBufferDirect(O,D,z,I,y,Q),I.side=cn):M.renderBufferDirect(O,D,z,I,y,Q),y.onAfterRender(M,D,O,z,I,Q)}function as(y,D,O){D.isScene!==!0&&(D=re);const z=Mt.get(y),I=d.state.lights,Q=d.state.shadowsArray,lt=I.state.version,pt=vt.getParameters(y,I.state,Q,D,O),mt=vt.getProgramCacheKey(pt);let wt=z.programs;z.environment=y.isMeshStandardMaterial?D.environment:null,z.fog=D.fog,z.envMap=(y.isMeshStandardMaterial?F:v).get(y.envMap||z.environment),z.envMapRotation=z.environment!==null&&y.envMap===null?D.environmentRotation:y.envMapRotation,wt===void 0&&(y.addEventListener("dispose",Ct),wt=new Map,z.programs=wt);let Pt=wt.get(mt);if(Pt!==void 0){if(z.currentProgram===Pt&&z.lightsStateVersion===lt)return So(y,pt),Pt}else pt.uniforms=vt.getUniforms(y),y.onBeforeCompile(pt,M),Pt=vt.acquireProgram(pt,mt),wt.set(mt,Pt),z.uniforms=pt.uniforms;const gt=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(gt.clippingPlanes=j.uniform),So(y,pt),z.needsLights=Bc(y),z.lightsStateVersion=lt,z.needsLights&&(gt.ambientLightColor.value=I.state.ambient,gt.lightProbe.value=I.state.probe,gt.directionalLights.value=I.state.directional,gt.directionalLightShadows.value=I.state.directionalShadow,gt.spotLights.value=I.state.spot,gt.spotLightShadows.value=I.state.spotShadow,gt.rectAreaLights.value=I.state.rectArea,gt.ltc_1.value=I.state.rectAreaLTC1,gt.ltc_2.value=I.state.rectAreaLTC2,gt.pointLights.value=I.state.point,gt.pointLightShadows.value=I.state.pointShadow,gt.hemisphereLights.value=I.state.hemi,gt.directionalShadowMap.value=I.state.directionalShadowMap,gt.directionalShadowMatrix.value=I.state.directionalShadowMatrix,gt.spotShadowMap.value=I.state.spotShadowMap,gt.spotLightMatrix.value=I.state.spotLightMatrix,gt.spotLightMap.value=I.state.spotLightMap,gt.pointShadowMap.value=I.state.pointShadowMap,gt.pointShadowMatrix.value=I.state.pointShadowMatrix),z.currentProgram=Pt,z.uniformsList=null,Pt}function Mo(y){if(y.uniformsList===null){const D=y.currentProgram.getUniforms();y.uniformsList=Xs.seqWithValue(D.seq,y.uniforms)}return y.uniformsList}function So(y,D){const O=Mt.get(y);O.outputColorSpace=D.outputColorSpace,O.batching=D.batching,O.batchingColor=D.batchingColor,O.instancing=D.instancing,O.instancingColor=D.instancingColor,O.instancingMorph=D.instancingMorph,O.skinning=D.skinning,O.morphTargets=D.morphTargets,O.morphNormals=D.morphNormals,O.morphColors=D.morphColors,O.morphTargetsCount=D.morphTargetsCount,O.numClippingPlanes=D.numClippingPlanes,O.numIntersection=D.numClipIntersection,O.vertexAlphas=D.vertexAlphas,O.vertexTangents=D.vertexTangents,O.toneMapping=D.toneMapping}function Oc(y,D,O,z,I){D.isScene!==!0&&(D=re),T.resetTextureUnits();const Q=D.fog,lt=z.isMeshStandardMaterial?D.environment:null,pt=P===null?M.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Li,mt=(z.isMeshStandardMaterial?F:v).get(z.envMap||lt),wt=z.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Pt=!!O.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),gt=!!O.morphAttributes.position,Vt=!!O.morphAttributes.normal,ee=!!O.morphAttributes.color;let ie=Rn;z.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(ie=M.toneMapping);const Re=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,Wt=Re!==void 0?Re.length:0,xt=Mt.get(z),en=d.state.lights;if(tt===!0&&(_t===!0||y!==x)){const Fe=y===x&&z.id===S;j.setState(z,y,Fe)}let Xt=!1;z.version===xt.__version?(xt.needsLights&&xt.lightsStateVersion!==en.state.version||xt.outputColorSpace!==pt||I.isBatchedMesh&&xt.batching===!1||!I.isBatchedMesh&&xt.batching===!0||I.isBatchedMesh&&xt.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&xt.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&xt.instancing===!1||!I.isInstancedMesh&&xt.instancing===!0||I.isSkinnedMesh&&xt.skinning===!1||!I.isSkinnedMesh&&xt.skinning===!0||I.isInstancedMesh&&xt.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&xt.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&xt.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&xt.instancingMorph===!1&&I.morphTexture!==null||xt.envMap!==mt||z.fog===!0&&xt.fog!==Q||xt.numClippingPlanes!==void 0&&(xt.numClippingPlanes!==j.numPlanes||xt.numIntersection!==j.numIntersection)||xt.vertexAlphas!==wt||xt.vertexTangents!==Pt||xt.morphTargets!==gt||xt.morphNormals!==Vt||xt.morphColors!==ee||xt.toneMapping!==ie||xt.morphTargetsCount!==Wt)&&(Xt=!0):(Xt=!0,xt.__version=z.version);let Ge=xt.currentProgram;Xt===!0&&(Ge=as(z,D,I));let jn=!1,Pe=!1,Ni=!1;const se=Ge.getUniforms(),$e=xt.uniforms;if(St.useProgram(Ge.program)&&(jn=!0,Pe=!0,Ni=!0),z.id!==S&&(S=z.id,Pe=!0),jn||x!==y){St.buffers.depth.getReversed()?(rt.copy(y.projectionMatrix),Ch(rt),Ph(rt),se.setValue(U,"projectionMatrix",rt)):se.setValue(U,"projectionMatrix",y.projectionMatrix),se.setValue(U,"viewMatrix",y.matrixWorldInverse);const gn=se.map.cameraPosition;gn!==void 0&&gn.setValue(U,Rt.setFromMatrixPosition(y.matrixWorld)),zt.logarithmicDepthBuffer&&se.setValue(U,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&se.setValue(U,"isOrthographic",y.isOrthographicCamera===!0),x!==y&&(x=y,Pe=!0,Ni=!0)}if(I.isSkinnedMesh){se.setOptional(U,I,"bindMatrix"),se.setOptional(U,I,"bindMatrixInverse");const Fe=I.skeleton;Fe&&(Fe.boneTexture===null&&Fe.computeBoneTexture(),se.setValue(U,"boneTexture",Fe.boneTexture,T))}I.isBatchedMesh&&(se.setOptional(U,I,"batchingTexture"),se.setValue(U,"batchingTexture",I._matricesTexture,T),se.setOptional(U,I,"batchingIdTexture"),se.setValue(U,"batchingIdTexture",I._indirectTexture,T),se.setOptional(U,I,"batchingColorTexture"),I._colorsTexture!==null&&se.setValue(U,"batchingColorTexture",I._colorsTexture,T));const Fi=O.morphAttributes;if((Fi.position!==void 0||Fi.normal!==void 0||Fi.color!==void 0)&&Tt.update(I,O,Ge),(Pe||xt.receiveShadow!==I.receiveShadow)&&(xt.receiveShadow=I.receiveShadow,se.setValue(U,"receiveShadow",I.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&($e.envMap.value=mt,$e.flipEnvMap.value=mt.isCubeTexture&&mt.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&D.environment!==null&&($e.envMapIntensity.value=D.environmentIntensity),Pe&&(se.setValue(U,"toneMappingExposure",M.toneMappingExposure),xt.needsLights&&zc($e,Ni),Q&&z.fog===!0&&at.refreshFogUniforms($e,Q),at.refreshMaterialUniforms($e,z,G,Z,d.state.transmissionRenderTarget[y.id]),Xs.upload(U,Mo(xt),$e,T)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Xs.upload(U,Mo(xt),$e,T),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&se.setValue(U,"center",I.center),se.setValue(U,"modelViewMatrix",I.modelViewMatrix),se.setValue(U,"normalMatrix",I.normalMatrix),se.setValue(U,"modelMatrix",I.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const Fe=z.uniformsGroups;for(let gn=0,_n=Fe.length;gn<_n;gn++){const Eo=Fe[gn];L.update(Eo,Ge),L.bind(Eo,Ge)}}return Ge}function zc(y,D){y.ambientLightColor.needsUpdate=D,y.lightProbe.needsUpdate=D,y.directionalLights.needsUpdate=D,y.directionalLightShadows.needsUpdate=D,y.pointLights.needsUpdate=D,y.pointLightShadows.needsUpdate=D,y.spotLights.needsUpdate=D,y.spotLightShadows.needsUpdate=D,y.rectAreaLights.needsUpdate=D,y.hemisphereLights.needsUpdate=D}function Bc(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(y,D,O){Mt.get(y.texture).__webglTexture=D,Mt.get(y.depthTexture).__webglTexture=O;const z=Mt.get(y);z.__hasExternalTextures=!0,z.__autoAllocateDepthBuffer=O===void 0,z.__autoAllocateDepthBuffer||Ot.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,D){const O=Mt.get(y);O.__webglFramebuffer=D,O.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(y,D=0,O=0){P=y,A=D,R=O;let z=!0,I=null,Q=!1,lt=!1;if(y){const mt=Mt.get(y);if(mt.__useDefaultFramebuffer!==void 0)St.bindFramebuffer(U.FRAMEBUFFER,null),z=!1;else if(mt.__webglFramebuffer===void 0)T.setupRenderTarget(y);else if(mt.__hasExternalTextures)T.rebindTextures(y,Mt.get(y.texture).__webglTexture,Mt.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const gt=y.depthTexture;if(mt.__boundDepthTexture!==gt){if(gt!==null&&Mt.has(gt)&&(y.width!==gt.image.width||y.height!==gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(y)}}const wt=y.texture;(wt.isData3DTexture||wt.isDataArrayTexture||wt.isCompressedArrayTexture)&&(lt=!0);const Pt=Mt.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Pt[D])?I=Pt[D][O]:I=Pt[D],Q=!0):y.samples>0&&T.useMultisampledRTT(y)===!1?I=Mt.get(y).__webglMultisampledFramebuffer:Array.isArray(Pt)?I=Pt[O]:I=Pt,C.copy(y.viewport),k.copy(y.scissor),B=y.scissorTest}else C.copy(yt).multiplyScalar(G).floor(),k.copy(Ut).multiplyScalar(G).floor(),B=Qt;if(St.bindFramebuffer(U.FRAMEBUFFER,I)&&z&&St.drawBuffers(y,I),St.viewport(C),St.scissor(k),St.setScissorTest(B),Q){const mt=Mt.get(y.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+D,mt.__webglTexture,O)}else if(lt){const mt=Mt.get(y.texture),wt=D||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,mt.__webglTexture,O||0,wt)}S=-1},this.readRenderTargetPixels=function(y,D,O,z,I,Q,lt){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pt=Mt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&lt!==void 0&&(pt=pt[lt]),pt){St.bindFramebuffer(U.FRAMEBUFFER,pt);try{const mt=y.texture,wt=mt.format,Pt=mt.type;if(!zt.textureFormatReadable(wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!zt.textureTypeReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=y.width-z&&O>=0&&O<=y.height-I&&U.readPixels(D,O,z,I,Dt.convert(wt),Dt.convert(Pt),Q)}finally{const mt=P!==null?Mt.get(P).__webglFramebuffer:null;St.bindFramebuffer(U.FRAMEBUFFER,mt)}}},this.readRenderTargetPixelsAsync=async function(y,D,O,z,I,Q,lt){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pt=Mt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&lt!==void 0&&(pt=pt[lt]),pt){const mt=y.texture,wt=mt.format,Pt=mt.type;if(!zt.textureFormatReadable(wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!zt.textureTypeReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=y.width-z&&O>=0&&O<=y.height-I){St.bindFramebuffer(U.FRAMEBUFFER,pt);const gt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,gt),U.bufferData(U.PIXEL_PACK_BUFFER,Q.byteLength,U.STREAM_READ),U.readPixels(D,O,z,I,Dt.convert(wt),Dt.convert(Pt),0);const Vt=P!==null?Mt.get(P).__webglFramebuffer:null;St.bindFramebuffer(U.FRAMEBUFFER,Vt);const ee=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Rh(U,ee,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,gt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Q),U.deleteBuffer(gt),U.deleteSync(ee),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,D=null,O=0){y.isTexture!==!0&&(Yi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,y=arguments[1]);const z=Math.pow(2,-O),I=Math.floor(y.image.width*z),Q=Math.floor(y.image.height*z),lt=D!==null?D.x:0,pt=D!==null?D.y:0;T.setTexture2D(y,0),U.copyTexSubImage2D(U.TEXTURE_2D,O,0,0,lt,pt,I,Q),St.unbindTexture()},this.copyTextureToTexture=function(y,D,O=null,z=null,I=0){y.isTexture!==!0&&(Yi("WebGLRenderer: copyTextureToTexture function signature has changed."),z=arguments[0]||null,y=arguments[1],D=arguments[2],I=arguments[3]||0,O=null);let Q,lt,pt,mt,wt,Pt,gt,Vt,ee;const ie=y.isCompressedTexture?y.mipmaps[I]:y.image;O!==null?(Q=O.max.x-O.min.x,lt=O.max.y-O.min.y,pt=O.isBox3?O.max.z-O.min.z:1,mt=O.min.x,wt=O.min.y,Pt=O.isBox3?O.min.z:0):(Q=ie.width,lt=ie.height,pt=ie.depth||1,mt=0,wt=0,Pt=0),z!==null?(gt=z.x,Vt=z.y,ee=z.z):(gt=0,Vt=0,ee=0);const Re=Dt.convert(D.format),Wt=Dt.convert(D.type);let xt;D.isData3DTexture?(T.setTexture3D(D,0),xt=U.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(T.setTexture2DArray(D,0),xt=U.TEXTURE_2D_ARRAY):(T.setTexture2D(D,0),xt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,D.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,D.unpackAlignment);const en=U.getParameter(U.UNPACK_ROW_LENGTH),Xt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ge=U.getParameter(U.UNPACK_SKIP_PIXELS),jn=U.getParameter(U.UNPACK_SKIP_ROWS),Pe=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,ie.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ie.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,mt),U.pixelStorei(U.UNPACK_SKIP_ROWS,wt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Pt);const Ni=y.isDataArrayTexture||y.isData3DTexture,se=D.isDataArrayTexture||D.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const $e=Mt.get(y),Fi=Mt.get(D),Fe=Mt.get($e.__renderTarget),gn=Mt.get(Fi.__renderTarget);St.bindFramebuffer(U.READ_FRAMEBUFFER,Fe.__webglFramebuffer),St.bindFramebuffer(U.DRAW_FRAMEBUFFER,gn.__webglFramebuffer);for(let _n=0;_n<pt;_n++)Ni&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Mt.get(y).__webglTexture,I,Pt+_n),y.isDepthTexture?(se&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Mt.get(D).__webglTexture,I,ee+_n),U.blitFramebuffer(mt,wt,Q,lt,gt,Vt,Q,lt,U.DEPTH_BUFFER_BIT,U.NEAREST)):se?U.copyTexSubImage3D(xt,I,gt,Vt,ee+_n,mt,wt,Q,lt):U.copyTexSubImage2D(xt,I,gt,Vt,ee+_n,mt,wt,Q,lt);St.bindFramebuffer(U.READ_FRAMEBUFFER,null),St.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else se?y.isDataTexture||y.isData3DTexture?U.texSubImage3D(xt,I,gt,Vt,ee,Q,lt,pt,Re,Wt,ie.data):D.isCompressedArrayTexture?U.compressedTexSubImage3D(xt,I,gt,Vt,ee,Q,lt,pt,Re,ie.data):U.texSubImage3D(xt,I,gt,Vt,ee,Q,lt,pt,Re,Wt,ie):y.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,I,gt,Vt,Q,lt,Re,Wt,ie.data):y.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,I,gt,Vt,ie.width,ie.height,Re,ie.data):U.texSubImage2D(U.TEXTURE_2D,I,gt,Vt,Q,lt,Re,Wt,ie);U.pixelStorei(U.UNPACK_ROW_LENGTH,en),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Xt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ge),U.pixelStorei(U.UNPACK_SKIP_ROWS,jn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Pe),I===0&&D.generateMipmaps&&U.generateMipmap(xt),St.unbindTexture()},this.copyTextureToTexture3D=function(y,D,O=null,z=null,I=0){return y.isTexture!==!0&&(Yi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),O=arguments[0]||null,z=arguments[1]||null,y=arguments[2],D=arguments[3],I=arguments[4]||0),Yi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,D,O,z,I)},this.initRenderTarget=function(y){Mt.get(y).__webglFramebuffer===void 0&&T.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?T.setTextureCube(y,0):y.isData3DTexture?T.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?T.setTexture2DArray(y,0):T.setTexture2D(y,0),St.unbindTexture()},this.resetState=function(){A=0,R=0,P=null,St.reset(),te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Gt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Gt._getUnpackColorSpace()}}class Qa{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new At(t),this.density=e}clone(){return new Qa(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Hm extends he{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new je,this.environmentIntensity=1,this.environmentRotation=new je,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Gm{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Fa,this.updateRanges=[],this.version=0,this.uuid=Cn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Cn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Cn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ee=new w;class Zs{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Je(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Kt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Je(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Je(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Je(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Je(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),i=Kt(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),i=Kt(i,this.array),r=Kt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new ge(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Zs(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class to extends Dn{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new At(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let di;const Hi=new w,pi=new w,mi=new w,gi=new nt,Gi=new nt,yc=new Zt,Rs=new w,Vi=new w,Cs=new w,yl=new nt,kr=new nt,Ml=new nt;class Mc extends he{constructor(t=new to){if(super(),this.isSprite=!0,this.type="Sprite",di===void 0){di=new le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Gm(e,5);di.setIndex([0,1,2,0,2,3]),di.setAttribute("position",new Zs(n,3,0,!1)),di.setAttribute("uv",new Zs(n,2,3,!1))}this.geometry=di,this.material=t,this.center=new nt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),pi.setFromMatrixScale(this.matrixWorld),yc.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),mi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&pi.multiplyScalar(-mi.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;Ps(Rs.set(-.5,-.5,0),mi,a,pi,i,r),Ps(Vi.set(.5,-.5,0),mi,a,pi,i,r),Ps(Cs.set(.5,.5,0),mi,a,pi,i,r),yl.set(0,0),kr.set(1,0),Ml.set(1,1);let o=t.ray.intersectTriangle(Rs,Vi,Cs,!1,Hi);if(o===null&&(Ps(Vi.set(-.5,.5,0),mi,a,pi,i,r),kr.set(0,1),o=t.ray.intersectTriangle(Rs,Cs,Vi,!1,Hi),o===null))return;const l=t.ray.origin.distanceTo(Hi);l<t.near||l>t.far||e.push({distance:l,point:Hi.clone(),uv:Ue.getInterpolation(Hi,Rs,Vi,Cs,yl,kr,Ml,new nt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ps(s,t,e,n,i,r){gi.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Gi.x=r*gi.x-i*gi.y,Gi.y=i*gi.x+r*gi.y):Gi.copy(gi),s.copy(t),s.x+=Gi.x,s.y+=Gi.y,s.applyMatrix4(yc)}class ar extends Dn{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new At(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const js=new w,Qs=new w,Sl=new Zt,Wi=new ir,Ls=new ss,Hr=new w,El=new w;class eo extends he{constructor(t=new le,e=new ar){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)js.fromBufferAttribute(e,i-1),Qs.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=js.distanceTo(Qs);t.setAttribute("lineDistance",new jt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ls.copy(n.boundingSphere),Ls.applyMatrix4(i),Ls.radius+=r,t.ray.intersectsSphere(Ls)===!1)return;Sl.copy(i).invert(),Wi.copy(t.ray).applyMatrix4(Sl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const d=h.getX(_),E=h.getX(_+1),b=Ds(this,t,Wi,l,d,E);b&&e.push(b)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(p),d=Ds(this,t,Wi,l,_,m);d&&e.push(d)}}else{const p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const d=Ds(this,t,Wi,l,_,_+1);d&&e.push(d)}if(this.isLineLoop){const _=Ds(this,t,Wi,l,g-1,p);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ds(s,t,e,n,i,r){const a=s.geometry.attributes.position;if(js.fromBufferAttribute(a,i),Qs.fromBufferAttribute(a,r),e.distanceSqToSegment(js,Qs,Hr,El)>n)return;Hr.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Hr);if(!(l<t.near||l>t.far))return{distance:l,point:El.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}const bl=new w,Tl=new w;class Vm extends eo{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)bl.fromBufferAttribute(e,i),Tl.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+bl.distanceTo(Tl);t.setAttribute("lineDistance",new jt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class no extends Dn{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new At(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const wl=new Zt,Ba=new ir,Is=new ss,Us=new w;class Sc extends he{constructor(t=new le,e=new no){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Is.copy(n.boundingSphere),Is.applyMatrix4(i),Is.radius+=r,t.ray.intersectsSphere(Is)===!1)return;wl.copy(i).invert(),Ba.copy(t.ray).applyMatrix4(wl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=f,_=p;g<_;g++){const m=c.getX(g);Us.fromBufferAttribute(u,m),Al(Us,m,l,i,t,e,this)}}else{const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=f,_=p;g<_;g++)Us.fromBufferAttribute(u,g),Al(Us,g,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Al(s,t,e,n,i,r,a){const o=Ba.distanceSqToPoint(s);if(o<e){const l=new w;Ba.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Ec extends Ae{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Qe{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let i=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],f=n[i+1]-h,p=(a-h)/f;return(i+p)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new nt:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new w,i=[],r=[],a=[],o=new w,l=new Zt;for(let p=0;p<=t;p++){const g=p/t;i[p]=this.getTangentAt(g,new w)}r[0]=new w,a[0]=new w;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(i[p-1],i[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ve(i[p-1].dot(i[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(i[p],r[p])}if(e===!0){let p=Math.acos(ve(r[0].dot(r[t]),-1,1));p/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],p*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class io extends Qe{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new nt){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*h-p*u+this.aX,c=f*u+p*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Wm extends io{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function so(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,p*=h,i(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+n*o}}}const Ns=new w,Gr=new so,Vr=new so,Wr=new so;class Xm extends Qe{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new w){const n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(Ns.subVectors(i[0],i[1]).add(i[0]),c=Ns);const u=i[o%r],f=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Ns.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Ns),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Gr.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,_,m),Vr.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,_,m),Wr.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Gr.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Vr.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Wr.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(Gr.calc(l),Vr.calc(l),Wr.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new w().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Rl(s,t,e,n,i){const r=(n-t)*.5,a=(i-e)*.5,o=s*s,l=s*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*s+e}function qm(s,t){const e=1-s;return e*e*t}function Ym(s,t){return 2*(1-s)*s*t}function $m(s,t){return s*s*t}function Zi(s,t,e,n){return qm(s,t)+Ym(s,e)+$m(s,n)}function Km(s,t){const e=1-s;return e*e*e*t}function Jm(s,t){const e=1-s;return 3*e*e*s*t}function Zm(s,t){return 3*(1-s)*s*s*t}function jm(s,t){return s*s*s*t}function ji(s,t,e,n,i){return Km(s,t)+Jm(s,e)+Zm(s,n)+jm(s,i)}class bc extends Qe{constructor(t=new nt,e=new nt,n=new nt,i=new nt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new nt){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ji(t,i.x,r.x,a.x,o.x),ji(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Qm extends Qe{constructor(t=new w,e=new w,n=new w,i=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new w){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ji(t,i.x,r.x,a.x,o.x),ji(t,i.y,r.y,a.y,o.y),ji(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Tc extends Qe{constructor(t=new nt,e=new nt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new nt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new nt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class tg extends Qe{constructor(t=new w,e=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new w){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new w){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class wc extends Qe{constructor(t=new nt,e=new nt,n=new nt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new nt){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Zi(t,i.x,r.x,a.x),Zi(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class eg extends Qe{constructor(t=new w,e=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new w){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Zi(t,i.x,r.x,a.x),Zi(t,i.y,r.y,a.y),Zi(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ac extends Qe{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new nt){const n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Rl(o,l.x,c.x,h.x,u.x),Rl(o,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new nt().fromArray(i))}return this}}var Cl=Object.freeze({__proto__:null,ArcCurve:Wm,CatmullRomCurve3:Xm,CubicBezierCurve:bc,CubicBezierCurve3:Qm,EllipseCurve:io,LineCurve:Tc,LineCurve3:tg,QuadraticBezierCurve:wc,QuadraticBezierCurve3:eg,SplineCurve:Ac});class ng extends Qe{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Cl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new Cl[i.type]().fromJSON(i))}return this}}class ig extends ng{constructor(t){super(),this.type="Path",this.currentPoint=new nt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Tc(this.currentPoint.clone(),new nt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new wc(this.currentPoint.clone(),new nt(t,e),new nt(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){const o=new bc(this.currentPoint.clone(),new nt(t,e),new nt(n,i),new nt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Ac(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,a,o,l),this}absellipse(t,e,n,i,r,a,o,l){const c=new io(t,e,n,i,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ro extends le{constructor(t=[new nt(0,-.5),new nt(.5,0),new nt(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=ve(i,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,u=new w,f=new nt,p=new w,g=new w,_=new w;let m=0,d=0;for(let E=0;E<=t.length-1;E++)switch(E){case 0:m=t[E+1].x-t[E].x,d=t[E+1].y-t[E].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[E+1].x-t[E].x,d=t[E+1].y-t[E].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),l.push(p.x,p.y,p.z),_.copy(g)}for(let E=0;E<=e;E++){const b=n+E*h*i,M=Math.sin(b),N=Math.cos(b);for(let A=0;A<=t.length-1;A++){u.x=t[A].x*M,u.y=t[A].y,u.z=t[A].x*N,a.push(u.x,u.y,u.z),f.x=E/e,f.y=A/(t.length-1),o.push(f.x,f.y);const R=l[3*A+0]*M,P=l[3*A+1],S=l[3*A+0]*N;c.push(R,P,S)}}for(let E=0;E<e;E++)for(let b=0;b<t.length-1;b++){const M=b+E*t.length,N=M,A=M+t.length,R=M+t.length+1,P=M+1;r.push(N,A,P),r.push(R,P,A)}this.setIndex(r),this.setAttribute("position",new jt(a,3)),this.setAttribute("uv",new jt(o,2)),this.setAttribute("normal",new jt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ro(t.points,t.segments,t.phiStart,t.phiLength)}}class ao extends ro{constructor(t=1,e=1,n=4,i=8){const r=new ig;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:i}}static fromJSON(t){return new ao(t.radius,t.length,t.capSegments,t.radialSegments)}}class oo extends le{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new w,h=new nt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*i;c.x=t*Math.cos(p),c.y=t*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[f]/t+1)/2,h.y=(a[f+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new jt(a,3)),this.setAttribute("normal",new jt(o,3)),this.setAttribute("uv",new jt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class lo extends le{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],f=[],p=[];let g=0;const _=[],m=n/2;let d=0;E(),a===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new jt(u,3)),this.setAttribute("normal",new jt(f,3)),this.setAttribute("uv",new jt(p,2));function E(){const M=new w,N=new w;let A=0;const R=(e-t)/n;for(let P=0;P<=r;P++){const S=[],x=P/r,C=x*(e-t)+t;for(let k=0;k<=i;k++){const B=k/i,W=B*l+o,K=Math.sin(W),V=Math.cos(W);N.x=C*K,N.y=-x*n+m,N.z=C*V,u.push(N.x,N.y,N.z),M.set(K,R,V).normalize(),f.push(M.x,M.y,M.z),p.push(B,1-x),S.push(g++)}_.push(S)}for(let P=0;P<i;P++)for(let S=0;S<r;S++){const x=_[S][P],C=_[S+1][P],k=_[S+1][P+1],B=_[S][P+1];(t>0||S!==0)&&(h.push(x,C,B),A+=3),(e>0||S!==r-1)&&(h.push(C,k,B),A+=3)}c.addGroup(d,A,0),d+=A}function b(M){const N=g,A=new nt,R=new w;let P=0;const S=M===!0?t:e,x=M===!0?1:-1;for(let k=1;k<=i;k++)u.push(0,m*x,0),f.push(0,x,0),p.push(.5,.5),g++;const C=g;for(let k=0;k<=i;k++){const W=k/i*l+o,K=Math.cos(W),V=Math.sin(W);R.x=S*V,R.y=m*x,R.z=S*K,u.push(R.x,R.y,R.z),f.push(0,x,0),A.x=K*.5+.5,A.y=V*.5*x+.5,p.push(A.x,A.y),g++}for(let k=0;k<i;k++){const B=N+k,W=C+k;M===!0?h.push(W,W+1,B):h.push(W+1,W,B),P+=3}c.addGroup(d,P,M===!0?1:2),d+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lo(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class co extends lo{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new co(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ui extends le{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new jt(r,3)),this.setAttribute("normal",new jt(r.slice(),3)),this.setAttribute("uv",new jt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(E){const b=new w,M=new w,N=new w;for(let A=0;A<e.length;A+=3)p(e[A+0],b),p(e[A+1],M),p(e[A+2],N),l(b,M,N,E)}function l(E,b,M,N){const A=N+1,R=[];for(let P=0;P<=A;P++){R[P]=[];const S=E.clone().lerp(M,P/A),x=b.clone().lerp(M,P/A),C=A-P;for(let k=0;k<=C;k++)k===0&&P===A?R[P][k]=S:R[P][k]=S.clone().lerp(x,k/C)}for(let P=0;P<A;P++)for(let S=0;S<2*(A-P)-1;S++){const x=Math.floor(S/2);S%2===0?(f(R[P][x+1]),f(R[P+1][x]),f(R[P][x])):(f(R[P][x+1]),f(R[P+1][x+1]),f(R[P+1][x]))}}function c(E){const b=new w;for(let M=0;M<r.length;M+=3)b.x=r[M+0],b.y=r[M+1],b.z=r[M+2],b.normalize().multiplyScalar(E),r[M+0]=b.x,r[M+1]=b.y,r[M+2]=b.z}function h(){const E=new w;for(let b=0;b<r.length;b+=3){E.x=r[b+0],E.y=r[b+1],E.z=r[b+2];const M=m(E)/2/Math.PI+.5,N=d(E)/Math.PI+.5;a.push(M,1-N)}g(),u()}function u(){for(let E=0;E<a.length;E+=6){const b=a[E+0],M=a[E+2],N=a[E+4],A=Math.max(b,M,N),R=Math.min(b,M,N);A>.9&&R<.1&&(b<.2&&(a[E+0]+=1),M<.2&&(a[E+2]+=1),N<.2&&(a[E+4]+=1))}}function f(E){r.push(E.x,E.y,E.z)}function p(E,b){const M=E*3;b.x=t[M+0],b.y=t[M+1],b.z=t[M+2]}function g(){const E=new w,b=new w,M=new w,N=new w,A=new nt,R=new nt,P=new nt;for(let S=0,x=0;S<r.length;S+=9,x+=6){E.set(r[S+0],r[S+1],r[S+2]),b.set(r[S+3],r[S+4],r[S+5]),M.set(r[S+6],r[S+7],r[S+8]),A.set(a[x+0],a[x+1]),R.set(a[x+2],a[x+3]),P.set(a[x+4],a[x+5]),N.copy(E).add(b).add(M).divideScalar(3);const C=m(N);_(A,x+0,E,C),_(R,x+2,b,C),_(P,x+4,M,C)}}function _(E,b,M,N){N<0&&E.x===1&&(a[b]=E.x-1),M.x===0&&M.z===0&&(a[b]=N/2/Math.PI+.5)}function m(E){return Math.atan2(E.z,-E.x)}function d(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ui(t.vertices,t.indices,t.radius,t.details)}}class ho extends Ui{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ho(t.radius,t.detail)}}const Fs=new w,Os=new w,Xr=new w,zs=new Ue;class sg extends le{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const i=Math.pow(10,4),r=Math.cos(Ws*e),a=t.getIndex(),o=t.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),f={},p=[];for(let g=0;g<l;g+=3){a?(c[0]=a.getX(g),c[1]=a.getX(g+1),c[2]=a.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:d}=zs;if(_.fromBufferAttribute(o,c[0]),m.fromBufferAttribute(o,c[1]),d.fromBufferAttribute(o,c[2]),zs.getNormal(Xr),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,u[2]=`${Math.round(d.x*i)},${Math.round(d.y*i)},${Math.round(d.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let E=0;E<3;E++){const b=(E+1)%3,M=u[E],N=u[b],A=zs[h[E]],R=zs[h[b]],P=`${M}_${N}`,S=`${N}_${M}`;S in f&&f[S]?(Xr.dot(f[S].normal)<=r&&(p.push(A.x,A.y,A.z),p.push(R.x,R.y,R.z)),f[S]=null):P in f||(f[P]={index0:c[E],index1:c[b],normal:Xr.clone()})}}for(const g in f)if(f[g]){const{index0:_,index1:m}=f[g];Fs.fromBufferAttribute(o,_),Os.fromBufferAttribute(o,m),p.push(Fs.x,Fs.y,Fs.z),p.push(Os.x,Os.y,Os.z)}this.setAttribute("position",new jt(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class ts extends Ui{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ts(t.radius,t.detail)}}class or extends Ui{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new or(t.radius,t.detail)}}class lr extends le{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new w,f=new w,p=[],g=[],_=[],m=[];for(let d=0;d<=n;d++){const E=[],b=d/n;let M=0;d===0&&a===0?M=.5/e:d===n&&l===Math.PI&&(M=-.5/e);for(let N=0;N<=e;N++){const A=N/e;u.x=-t*Math.cos(i+A*r)*Math.sin(a+b*o),u.y=t*Math.cos(a+b*o),u.z=t*Math.sin(i+A*r)*Math.sin(a+b*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(A+M,1-b),E.push(c++)}h.push(E)}for(let d=0;d<n;d++)for(let E=0;E<e;E++){const b=h[d][E+1],M=h[d][E],N=h[d+1][E],A=h[d+1][E+1];(d!==0||a>0)&&p.push(b,M,A),(d!==n-1||l<Math.PI)&&p.push(M,N,A)}this.setIndex(p),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(_,3)),this.setAttribute("uv",new jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class uo extends Ui{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new uo(t.radius,t.detail)}}class Pi extends le{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new w,u=new w,f=new w;for(let p=0;p<=n;p++)for(let g=0;g<=i;g++){const _=g/i*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/i),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=i;g++){const _=(i+1)*p+g-1,m=(i+1)*(p-1)+g-1,d=(i+1)*(p-1)+g,E=(i+1)*p+g;a.push(_,m,E),a.push(m,d,E)}this.setIndex(a),this.setAttribute("position",new jt(o,3)),this.setAttribute("normal",new jt(l,3)),this.setAttribute("uv",new jt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pi(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ki extends Dn{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new At(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new At(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nc,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new je,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class cr extends he{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new At(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class rg extends cr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.groundColor=new At(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const qr=new Zt,Pl=new w,Ll=new w;class Rc{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new nt(512,512),this.map=null,this.mapPass=null,this.matrix=new Zt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Za,this._frameExtents=new nt(1,1),this._viewportCount=1,this._viewports=[new Jt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Pl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Pl),Ll.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ll),e.updateMatrixWorld(),qr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(qr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Dl=new Zt,Xi=new w,Yr=new w;class ag extends Rc{constructor(){super(new Ie(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new nt(4,2),this._viewportCount=6,this._viewports=[new Jt(2,1,1,1),new Jt(0,1,1,1),new Jt(3,1,1,1),new Jt(1,1,1,1),new Jt(3,0,1,1),new Jt(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Xi.setFromMatrixPosition(t.matrixWorld),n.position.copy(Xi),Yr.copy(n.position),Yr.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Yr),n.updateMatrixWorld(),i.makeTranslation(-Xi.x,-Xi.y,-Xi.z),Dl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dl)}}class og extends cr{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ag}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class lg extends Rc{constructor(){super(new pc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class cg extends cr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.shadow=new lg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class hg extends cr{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class ug{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Il(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Il();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Il(){return performance.now()}const Ul=new Zt;class fg{constructor(t,e,n=0,i=1/0){this.ray=new ir(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Ja,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Ul.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ul),this}intersectObject(t,e=!0,n=[]){return ka(t,this,n,e),n.sort(Nl),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)ka(t[i],this,n,e);return n.sort(Nl),n}}function Nl(s,t){return s.distance-t.distance}function ka(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)ka(r[a],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Va}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Va);class dg{constructor(){this.ctx=null,this.master=null,this.sfx=null,this.music=null,this.volume=.7,this.enabled=!0,this._drone=null}resume(){if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;if(!t){this.enabled=!1;return}this.ctx=new t,this.master=this.ctx.createGain(),this.sfx=this.ctx.createGain(),this.music=this.ctx.createGain(),this.sfx.gain.value=.9,this.music.gain.value=.22,this.sfx.connect(this.master),this.music.connect(this.master),this.master.connect(this.ctx.destination),this.setVolume(this.volume)}this.ctx.state==="suspended"&&this.ctx.resume(),this._drone||this._startDrone()}setVolume(t){this.volume=t,this.master&&this.master.gain.setTargetAtTime(t,this.now,.05)}get now(){return this.ctx?this.ctx.currentTime:0}_osc(t,e,n,i,r,a,o){if(!this.ctx||!this.enabled)return;const l=this.ctx.createOscillator(),c=this.ctx.createGain();l.type=t,l.frequency.setValueAtTime(e,n),o&&l.frequency.exponentialRampToValueAtTime(Math.max(20,o),n+i),c.gain.setValueAtTime(1e-4,n),c.gain.exponentialRampToValueAtTime(r,n+.012),c.gain.exponentialRampToValueAtTime(1e-4,n+i),l.connect(c),c.connect(a||this.sfx),l.start(n),l.stop(n+i+.02)}_noise(t,e,n,i,r=4){if(!this.ctx||!this.enabled)return;const a=Math.ceil(this.ctx.sampleRate*e),o=this.ctx.createBuffer(1,a,this.ctx.sampleRate),l=o.getChannelData(0);for(let f=0;f<a;f++)l[f]=Math.random()*2-1;const c=this.ctx.createBufferSource();c.buffer=o;const h=this.ctx.createBiquadFilter();h.type="bandpass",h.frequency.value=i,h.Q.value=r;const u=this.ctx.createGain();u.gain.setValueAtTime(n,t),u.gain.exponentialRampToValueAtTime(1e-4,t+e),c.connect(h),h.connect(u),u.connect(this.sfx),c.start(t),c.stop(t+e+.02)}_startDrone(){if(!this.ctx)return;const t=this.now,e=(n,i,r)=>{const a=this.ctx.createOscillator(),o=this.ctx.createGain(),l=this.ctx.createBiquadFilter();a.type=i,a.frequency.value=n,l.type="lowpass",l.frequency.value=420,o.gain.value=r,a.connect(l),l.connect(o),o.connect(this.music),a.start(t);const c=this.ctx.createOscillator(),h=this.ctx.createGain();return c.frequency.value=.07+Math.random()*.05,h.gain.value=80,c.connect(h),h.connect(l.frequency),c.start(t),{o:a,g:o,f:l}};this._drone=[e(55,"sine",.35),e(82.5,"triangle",.12),e(110.5,"sine",.08)]}setTension(t){if(!this._drone||!this.ctx)return;const e=380+t*520;this._drone[0].f.frequency.setTargetAtTime(e,this.now,.4)}ui(){this._osc("sine",880,this.now,.08,.04)}dash(){this._noise(this.now,.14,.18,900,1.2),this._osc("sine",240,this.now,.16,.08,this.sfx,90)}fling(){this._noise(this.now,.12,.16,1400,.8),this._osc("triangle",520,this.now,.18,.07,this.sfx,180)}pulse(){this._osc("sine",140,this.now,.4,.16,this.sfx,40),this._noise(this.now,.22,.12,300,.6)}hit(t=!1){this._noise(this.now,t?.16:.08,t?.2:.1,t?220:600,2),this._osc("square",t?90:210,this.now,.1,.05,this.sfx,50)}playerHit(){this._osc("sawtooth",180,this.now,.28,.12,this.sfx,50),this._noise(this.now,.25,.22,180,.8)}pickup(){const t=this.now;this._osc("sine",660,t,.12,.07),this._osc("sine",990,t+.06,.16,.06)}syzygy(){const t=this.now;this._osc("sine",330,t,.55,.09),this._osc("sine",495,t+.02,.6,.07),this._osc("sine",660,t+.04,.65,.05)}nova(){this._osc("sine",90,this.now,.7,.22,this.sfx,28),this._noise(this.now,.4,.2,200,.5),this.syzygy()}relic(){const t=this.now;[523,659,784,1046].forEach((e,n)=>this._osc("sine",e,t+n*.05,.28,.06))}reverse(){this._osc("triangle",200,this.now,.2,.06,this.sfx,600)}room(){this._osc("sine",196,this.now,.4,.08),this._osc("sine",247,this.now+.08,.45,.05)}death(){this._osc("sawtooth",220,this.now,.9,.12,this.sfx,40),this._noise(this.now,.7,.18,140,.7)}win(){const t=this.now;[262,330,392,523,659].forEach((e,n)=>this._osc("sine",e,t+n*.09,.5,.08))}card(){this._osc("sine",392,this.now,.15,.05)}}const Ha=[{id:0,name:"First Heaven",kicker:"THE SHATTERED ORRERY"},{id:1,name:"Second Heaven",kicker:"THE NULL MERIDIAN"},{id:2,name:"Third Heaven",kicker:"THE STILL POINT"}],kn={ember:{id:"ember",name:"Ember",color:16738858,glow:"#ff6a2a",shape:"sphere",radius:.32,orbit:3.4,spin:2.15,dmg:7,mass:1,desc:"A restless coal. Fast orbit, burning touch."},glacier:{id:"glacier",name:"Glacier",color:8316927,glow:"#7ee7ff",shape:"octa",radius:.4,orbit:4.6,spin:1.15,dmg:9,mass:1.4,slow:.45,desc:"A chip of the first winter. Slows what it kisses."},shard:{id:"shard",name:"Shard",color:15262962,glow:"#e8e4f2",shape:"tetra",radius:.3,orbit:3.9,spin:1.75,dmg:13,mass:.9,crit:.18,desc:"Honored glass. Cuts deep, sometimes twice."},lodestone:{id:"lodestone",name:"Lodestone",color:11832575,glow:"#b48cff",shape:"dodeca",radius:.42,orbit:5.2,spin:.95,dmg:8,mass:1.6,pull:7,desc:"A hungry magnet. Drags prey onto the wheel."},prism:{id:"prism",name:"Prism",color:16765802,glow:"#ffe08a",shape:"ico",radius:.34,orbit:4.2,spin:1.55,dmg:8,mass:1,fork:!0,desc:"Splits a wound into two lesser lights."},heartwood:{id:"heartwood",name:"Heartwood",color:10354608,glow:"#9dffb0",shape:"cube",radius:.36,orbit:4.8,spin:1.05,dmg:6,mass:1.2,mend:.08,desc:"A living knot. Completing an orbit knits you."},nullseed:{id:"nullseed",name:"Nullseed",color:16723306,glow:"#ff2d6a",shape:"torus",radius:.34,orbit:3.6,spin:1.85,dmg:10,mass:1,execute:.18,desc:"Stolen void. Finishes anything already breaking."},comet:{id:"comet",name:"Comet",color:11064575,glow:"#c8e6ff",shape:"capsule",radius:.3,orbit:6.1,spin:1.35,dmg:11,mass:.8,ecc:.46,desc:"Elliptical hunger. Devastating at periapsis."}},pg=[{id:"kepler",name:"Kepler's Gift",rarity:"common",tag:"Motion",desc:"All relics orbit 28% faster. Alignments come more often — and leave sooner.",apply:s=>{s.orbitMul*=1.28}},{id:"wide",name:"Wide Heaven",rarity:"common",tag:"Motion",desc:"Orbital radii swell by 30%. The wheel covers more of the chamber.",apply:s=>{s.radiusMul*=1.3}},{id:"close",name:"Close Dance",rarity:"common",tag:"Violence",desc:"Orbits tighten by 22%. Contact damage rises 40%.",apply:s=>{s.radiusMul*=.78,s.contactMul*=1.4}},{id:"driver",name:"Mass Driver",rarity:"common",tag:"Fling",desc:"Flung relics deal 60% more and pierce one extra body.",apply:s=>{s.flingMul*=1.6,s.flingPierce+=1}},{id:"pulsewide",name:"Heart of the Pulse",rarity:"common",tag:"Pulse",desc:"Pulse radius +45%. Cooldown −20%.",apply:s=>{s.pulseRad*=1.45,s.pulseCd*=.8}},{id:"skin",name:"Second Skin",rarity:"common",tag:"Survive",desc:"Gain +1 Integrity. A thin shell of old starlight.",apply:(s,t)=>{t.player.maxHp+=1,t.player.hp+=1}},{id:"meteor",name:"Meteoric",rarity:"common",tag:"Dash",desc:"Dash leaves a burning wake that wounds for a breath.",apply:s=>{s.dashTrail=!0}},{id:"aphelion",name:"Reckless Aphelion",rarity:"common",tag:"Fling",desc:"Fling travel +50% and return faster, as if the sky were smaller.",apply:s=>{s.flingTime*=1.5,s.returnMul*=1.25}},{id:"crowded",name:"Crowded Sky",rarity:"rare",tag:"Build",desc:"+1 relic slot. The orrery accepts another law.",apply:s=>{s.slots+=1},once:!0},{id:"syengine",name:"Syzygy Engine",rarity:"rare",tag:"Alignment",desc:"Alignment window is wider. Beams linger and bite harder.",apply:s=>{s.syzygyWindow*=1.55,s.beamMul*=1.4,s.beamTime*=1.3}},{id:"wind",name:"Solar Wind",rarity:"rare",tag:"Violence",desc:"Orbiting relics shed motes of light that fly outward and sting.",apply:s=>{s.solarWind=!0}},{id:"horizon",name:"Event Horizon",rarity:"rare",tag:"Violence",desc:"Enemies below 18% integrity are unmade if they enter your inner orbit.",apply:s=>{s.horizon=.18},unlock:"horizon"},{id:"lodecore",name:"Lodestone Core",rarity:"rare",tag:"Control",desc:"Your core constantly draws small prey and pickups inward.",apply:s=>{s.corePull=9}},{id:"refract",name:"Refractor",rarity:"rare",tag:"Violence",desc:"Hits have a 25% chance to fork a shard of damage to a nearby enemy.",apply:s=>{s.fork+=.25}},{id:"iron",name:"Iron Hymn",rarity:"rare",tag:"Survive",desc:"The first wound each chamber is ignored. After that, incoming damage −1 (min 1).",apply:s=>{s.ironHymn=!0,s.flatReduce+=1}},{id:"harvest",name:"Harvest Moon",rarity:"rare",tag:"Survive",desc:"Every 7th kill restores half an Integrity.",apply:s=>{s.harvestEvery=7}},{id:"twin",name:"Twin Birth",rarity:"legendary",tag:"Build",desc:"Duplicate your smallest relic as a dimmer twin sharing its law.",apply:(s,t)=>{t.duplicateSmallest()},unlock:"twin",once:!0},{id:"constellation",name:"Constellation",rarity:"legendary",tag:"Alignment",desc:"Beams form between every aligned pair, not only opposites through the core.",apply:s=>{s.constellation=!0},unlock:"constellation"},{id:"afterimage",name:"Afterimage",rarity:"legendary",tag:"Dash",desc:"Dash leaves a decoy spark that detonates after a beat.",apply:s=>{s.afterimage=!0}},{id:"seconddash",name:"Folded Step",rarity:"rare",tag:"Dash",desc:"+1 dash charge. The fold in space remembers you.",apply:s=>{s.dashes+=1}},{id:"chrono",name:"Chronal Ember",rarity:"rare",tag:"Pulse",desc:"Pulse also freezes enemy time for a short breath.",apply:s=>{s.chronoPulse=.7}},{id:"spearlaw",name:"Law of Spears",rarity:"legendary",tag:"Alignment",desc:"Any fling during residual alignment glow becomes a Spear of Heaven.",apply:s=>{s.easySpear=!0}},{id:"stardust",name:"Stardust Converter",rarity:"common",tag:"Pulse",desc:"Kills refund 8% of pulse cooldown.",apply:s=>{s.killRefund=.08}},{id:"drift",name:"Generous Drift",rarity:"common",tag:"Motion",desc:"+18% move speed. Attract range grows.",apply:s=>{s.moveMul*=1.18,s.attractRad*=1.35}},{id:"periapsis",name:"Periapsis Blade",rarity:"rare",tag:"Violence",desc:"Relics deal +70% damage at their closest point to you.",apply:s=>{s.periapsis=1.7}},{id:"nulltongue",name:"Null Tongue",rarity:"legendary",tag:"Pulse",desc:"Pulse snuffs nearby enemy projectiles and silences shooters briefly.",apply:s=>{s.nullTongue=!0},unlock:"nulltongue"}],mg=[{id:"start-glacier",name:"Cold Birth",desc:"Begin runs with a Glacier already in orbit.",cost:40,kind:"start",relic:"glacier"},{id:"start-shard",name:"Glass Birth",desc:"Begin runs with a Shard already in orbit.",cost:55,kind:"start",relic:"shard"},{id:"start-lode",name:"Iron Birth",desc:"Begin runs with a Lodestone already in orbit.",cost:70,kind:"start",relic:"lodestone"},{id:"slot",name:"Spare Socket",desc:"Start with +1 relic slot.",cost:80,kind:"slot"},{id:"ashen",name:"Ashen Memory",desc:"+25% Ash earned from every run.",cost:50,kind:"ash"},{id:"skin0",name:"Kindling Shell",desc:"Start with +1 Integrity.",cost:60,kind:"hp"},{id:"twin",name:"Unseal Twin Birth",desc:"Adds the legendary edict Twin Birth to the pool.",cost:90,kind:"edict"},{id:"horizon",name:"Unseal Event Horizon",desc:"Adds Event Horizon to the edict pool.",cost:75,kind:"edict"},{id:"constellation",name:"Unseal Constellation",desc:"Adds Constellation to the edict pool.",cost:110,kind:"edict"},{id:"nulltongue",name:"Unseal Null Tongue",desc:"Adds Null Tongue to the edict pool.",cost:95,kind:"edict"}],Fl={husk:{name:"Husk",hp:22,speed:3.2,radius:.55,touch:1,color:2761272,edge:16738954,shape:"box",score:1,ash:1},splinter:{name:"Splinter",hp:18,speed:5.4,radius:.4,touch:1,color:2365480,edge:16751162,shape:"cone",score:1,ash:1,dash:!0},seer:{name:"Seer",hp:22,speed:2.2,radius:.48,touch:1,color:1841200,edge:8316927,shape:"octa",score:2,ash:2,shoot:1.8},ballast:{name:"Ballast",hp:70,speed:1.7,radius:.9,touch:1,color:1709092,edge:11832575,shape:"dodeca",score:3,ash:3,slam:!0,heavy:!0},mite:{name:"Mite",hp:8,speed:6.2,radius:.26,touch:1,color:2758688,edge:16723306,shape:"tetra",score:1,ash:0},ravel:{name:"Ravel",hp:36,speed:2,radius:.62,touch:1,color:2234412,edge:10354608,shape:"torus",score:3,ash:3,spawn:3.4},warden:{name:"Warden",hp:110,speed:2.4,radius:.85,touch:1,color:1445916,edge:14725200,shape:"ico",score:8,ash:8,elite:!0,shoot:2.2,shields:3},eclipse:{name:"Eclipse",hp:95,speed:2.6,radius:.72,touch:1,color:1313814,edge:16723306,shape:"octa",score:8,ash:8,elite:!0,beam:!0}},gg={meridian:{id:"meridian",name:"The Hollow Meridian",hp:420,radius:1.6,speed:2.1,title:"SOVEREIGN OF THE FIRST HEAVEN"},choir:{id:"choir",name:"The Null Choir",hp:260,radius:.85,speed:2.4,title:"SOVEREIGN OF THE SECOND HEAVEN",count:3},still:{id:"still",name:"The Still Point",hp:720,radius:1.9,speed:1.6,title:"THE LAST LAW"}},_g=[{id:"mend",name:"Mend",desc:"Restore 2 Integrity.",cost:18,kind:"heal",n:2},{id:"full",name:"Kindle",desc:"Restore all Integrity.",cost:36,kind:"heal",n:99},{id:"relic",name:"Claim Relic",desc:"Draw a random relic into orbit if a slot remains.",cost:28,kind:"relic"},{id:"reroll",name:"Gamble Edict",desc:"Immediately choose a bonus edict.",cost:32,kind:"edict"},{id:"slot",name:"Open Socket",desc:"+1 relic slot this run.",cost:40,kind:"slot"},{id:"blood",name:"Ash Bargain",desc:"Spend 1 Integrity. Gain 24 stardust.",cost:0,kind:"blood"}];function Ol(){return{orbitMul:1,radiusMul:1,contactMul:1,flingMul:1,flingPierce:0,flingTime:.42,returnMul:1,pulseRad:5.2,pulseCd:3.4,pulseDmg:16,syzygyWindow:.14,beamMul:1,beamTime:.55,beamDmg:22,moveMul:1,attractRad:5.5,slots:3,dashes:1,dashTrail:!1,afterimage:!1,solarWind:!1,horizon:0,corePull:0,fork:0,ironHymn:!1,hymnReady:!1,flatReduce:0,harvestEvery:0,harvestCount:0,constellation:!1,chronoPulse:0,easySpear:!1,killRefund:0,periapsis:1,nullTongue:!1,spearLock:0}}function vg(){try{const s=localStorage.getItem("syzygy-meta-v1");if(s)return JSON.parse(s)}catch{}return{ash:0,unlocks:{},best:0,runs:0,wins:0,seenHow:!1}}function fo(s){try{localStorage.setItem("syzygy-meta-v1",JSON.stringify(s))}catch{}}const $r=new Map;function tr(s="#ffffff",t=128){const e=s+t;if($r.has(e))return $r.get(e);const n=document.createElement("canvas");n.width=n.height=t;const i=n.getContext("2d"),r=i.createRadialGradient(t/2,t/2,0,t/2,t/2,t/2);r.addColorStop(0,s),r.addColorStop(.22,s),r.addColorStop(.55,s+"88"),r.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=r,i.fillRect(0,0,t,t);const a=new Ec(n);return a.colorSpace=Te,$r.set(e,a),a}function xg(){const t=document.createElement("canvas");t.width=t.height=256;const e=t.getContext("2d");e.clearRect(0,0,256,256);for(let i=0;i<8;i++){const r=256*(.2+Math.random()*.6),a=256*(.2+Math.random()*.6),o=256*(.18+Math.random()*.28),l=e.createRadialGradient(r,a,0,r,a,o),c=250+Math.random()*80;l.addColorStop(0,`hsla(${c}, 60%, 55%, 0.28)`),l.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=l,e.fillRect(0,0,256,256)}const n=new Ec(t);return n.colorSpace=Te,n}function _i(s,t=2.4){const e="#"+new At(s).getHexString(),n=new to({map:tr(e),transparent:!0,blending:dn,depthWrite:!1,opacity:.9}),i=new Mc(n);return i.scale.setScalar(t),i}class yg{constructor(t,e,n=48,i=.12){this.max=n,this.pts=[],this.geom=new le;const r=new Float32Array(n*3),a=new Float32Array(n*4);this.geom.setAttribute("position",new ge(r,3)),this.geom.setAttribute("color",new ge(a,4)),this.mat=new ar({vertexColors:!0,transparent:!0,blending:dn,depthWrite:!1}),this.line=new eo(this.geom,this.mat),this.line.frustumCulled=!1,this.color=new At(e),this.width=i,t.add(this.line)}push(t,e,n){this.pts.push(t,e,n),this.pts.length>this.max*3&&this.pts.splice(0,3);const i=this.geom.attributes.position,r=this.geom.attributes.color,a=this.pts.length/3;for(let o=0;o<this.max;o++){const l=Math.min(o,a-1);i.setXYZ(o,this.pts[l*3]||0,this.pts[l*3+1]||0,this.pts[l*3+2]||0);const c=a<2?0:o/Math.max(1,a-1)*.85;r.setXYZW(o,this.color.r,this.color.g,this.color.b,o<a?c:0)}this.geom.setDrawRange(0,Math.max(2,a)),i.needsUpdate=!0,r.needsUpdate=!0}setColor(t){this.color.set(t)}clear(){this.pts.length=0}dispose(t){t.remove(this.line),this.geom.dispose(),this.mat.dispose()}}class Mg{constructor(t,e=500){this.cap=e,this.list=[],this.geom=new le,this.pos=new Float32Array(e*3),this.col=new Float32Array(e*3),this.sizes=new Float32Array(e),this.geom.setAttribute("position",new ge(this.pos,3)),this.geom.setAttribute("color",new ge(this.col,3)),this.geom.setAttribute("size",new ge(this.sizes,1)),this.mat=new no({size:.18,vertexColors:!0,transparent:!0,blending:dn,depthWrite:!1,sizeAttenuation:!0,map:tr("#ffffff",64),alphaMap:tr("#ffffff",64)}),this.points=new Sc(this.geom,this.mat),this.points.frustumCulled=!1,t.add(this.points)}burst(t,e,n,i,r=14,a=6,o=.5,l=.22){const c=new At(i);for(let h=0;h<r;h++){this.list.length>=this.cap&&this.list.shift();const u=Math.random()*Math.PI*2,f=Math.acos(2*Math.random()-1),p=a*(.3+Math.random());this.list.push({x:t,y:e,z:n,vx:Math.sin(f)*Math.cos(u)*p,vy:Math.cos(f)*p*.6+1.4,vz:Math.sin(f)*Math.sin(u)*p,life:o,max:o,r:c.r,g:c.g,b:c.b,size:l})}}ring(t,e,n,i,r=24,a=8){const o=new At(i);for(let l=0;l<r;l++){this.list.length>=this.cap&&this.list.shift();const c=l/r*Math.PI*2;this.list.push({x:t,y:e,z:n,vx:Math.cos(c)*a,vy:.4,vz:Math.sin(c)*a,life:.45,max:.45,r:o.r,g:o.g,b:o.b,size:.2})}}update(t){for(let n=this.list.length-1;n>=0;n--){const i=this.list[n];if(i.life-=t,i.life<=0){this.list.splice(n,1);continue}i.x+=i.vx*t,i.y+=i.vy*t,i.z+=i.vz*t,i.vy-=6*t,i.vx*=.98,i.vz*=.98}for(let n=0;n<this.cap;n++){const i=this.list[n];if(!i){this.pos[n*3]=0,this.pos[n*3+1]=-99,this.pos[n*3+2]=0,this.sizes[n]=0;continue}this.pos[n*3]=i.x,this.pos[n*3+1]=i.y,this.pos[n*3+2]=i.z;const r=i.life/i.max;this.col[n*3]=i.r,this.col[n*3+1]=i.g,this.col[n*3+2]=i.b,this.sizes[n]=i.size*(.4+r)}this.geom.attributes.position.needsUpdate=!0,this.geom.attributes.color.needsUpdate=!0,this.geom.attributes.size.needsUpdate=!0,this.geom.setDrawRange(0,this.cap)}}class Sg{constructor(t){this.camera=t,this.trauma=0,this.look=new w,this.pos=new w(0,26,20),this.kick=new w}shake(t){this.trauma=Math.min(1,this.trauma+t)}update(t,e,n){this.trauma=Math.max(0,this.trauma-t*1.8);const i=this.trauma*this.trauma,r=(Math.random()*2-1)*i*.55,a=(Math.random()*2-1)*i*.35,o=(Math.random()*2-1)*i*.55,l=n?new w(e.x+r,20.2+a,e.z+15.4+o):new w(Math.sin(performance.now()*12e-5)*5.5,20,17.5);this.pos.lerp(l,1-Math.pow(.001,t)),this.camera.position.copy(this.pos),this.look.lerp(n?new w(e.x,.4,e.z):new w(0,.4,0),1-Math.pow(8e-4,t)),this.camera.lookAt(this.look)}}function vi(s,t={}){let e;const n=s.radius;switch(s.shape){case"octa":e=new or(n*1.15,0);break;case"tetra":e=new uo(n*1.35,0);break;case"dodeca":e=new ho(n*1.05,0);break;case"ico":e=new ts(n*1.05,0);break;case"cube":e=new Ln(n*1.5,n*1.5,n*1.5);break;case"torus":e=new Pi(n*.85,n*.28,8,16);break;case"cone":e=new co(n*.9,n*2,5);break;case"capsule":e=new ao(n*.55,n*1.4,4,8);break;case"box":e=new Ln(n*1.6,n*1.6,n*1.6);break;default:e=new lr(n,16,12)}const i=new Ki({color:s.color,emissive:s.color,emissiveIntensity:t.emissive??.55,roughness:.35,metalness:.45,flatShading:!0}),r=new ue(e,i);if(s.edge!=null){const a=new sg(e),o=new Vm(a,new ar({color:s.edge,transparent:!0,opacity:.9}));r.add(o)}return r}function Eg(s,t,e){const n=s.clone().project(t);return{x:(n.x*.5+.5)*e.clientWidth,y:(-n.y*.5+.5)*e.clientHeight}}const Ft=s=>document.getElementById(s);class bg{constructor(){this.els={hud:Ft("hud"),floor:Ft("hud-floor"),chamber:Ft("hud-chamber"),ash:Ft("hud-ash"),align:Ft("hud-align"),integrity:Ft("integrity"),orrery:Ft("orrery"),hint:Ft("hint"),banner:Ft("syzygy-banner"),announce:Ft("announce"),boss:Ft("boss-bar"),bossName:Ft("boss-name"),bossFill:Ft("boss-fill"),cards:Ft("cards"),cardRow:Ft("card-row"),cardSub:Ft("card-sub"),altar:Ft("altar"),altarGrid:Ft("altar-grid"),title:Ft("title"),how:Ft("how"),reliquary:Ft("reliquary"),unlockGrid:Ft("unlock-grid"),ashBank:Ft("ash-bank"),titleMeta:Ft("title-meta"),pause:Ft("pause"),results:Ft("results"),resultsKicker:Ft("results-kicker"),resultsTitle:Ft("results-title"),resultsLead:Ft("results-lead"),resultsStats:Ft("results-stats"),resultsUnlocks:Ft("results-unlocks"),flash:Ft("flash"),cdDash:Ft("cd-dash").querySelector("i"),cdPulse:Ft("cd-pulse").querySelector("i"),cdFling:Ft("cd-fling").querySelector("i")},this._bannerT=0}show(t,e=!0){t.classList.toggle("hidden",!e)}setTitle(t){this.show(this.els.title,!0),this.show(this.els.hud,!1),this.show(this.els.cards,!1),this.show(this.els.altar,!1),this.show(this.els.pause,!1),this.show(this.els.results,!1),this.show(this.els.how,!1),this.show(this.els.reliquary,!1),this.els.titleMeta.textContent=`Ash ${t.ash}   ·   Runs ${t.runs}   ·   Best ${t.best}   ·   Wins ${t.wins}`}hideMenus(){this.show(this.els.title,!1),this.show(this.els.how,!1),this.show(this.els.reliquary,!1),this.show(this.els.results,!1),this.show(this.els.pause,!1)}playHud(){this.hideMenus(),this.show(this.els.hud,!0),this.show(this.els.cards,!1),this.show(this.els.altar,!1)}flash(t="#fff6e0",e=90){const n=this.els.flash;n.style.background=t,n.style.opacity="0.85",clearTimeout(this._ft),this._ft=setTimeout(()=>{n.style.transition="opacity 0.25s",n.style.opacity="0"},e)}announce(t){const e=this.els.announce;e.textContent=t,e.classList.remove("on"),e.offsetWidth,e.classList.add("on")}syzygy(t="SYZYGY"){const e=this.els.banner;e.textContent=t,e.classList.remove("on"),e.offsetWidth,e.classList.add("on")}hint(t){this.els.hint.textContent=t||""}float(t,e,n,i,r=""){const a=document.createElement("div");a.className="floater "+r,a.textContent=i,a.style.left=e+"px",a.style.top=n+"px",t.appendChild(a),setTimeout(()=>a.remove(),720)}renderRun(t){const e=t.player,n=Ha[t.floor]||Ha[2];this.els.floor.textContent=n.kicker,this.els.chamber.textContent=t.roomKind==="boss"?n.name:`Chamber ${t.chamber}`,this.els.ash.textContent=String(t.stardust),this.els.align.textContent="×"+t.alignMul.toFixed(t.alignMul%1?1:0);const i=e.maxHp,r=e.hp,a=this.els.integrity;if(a.childElementCount!==i){a.innerHTML="";for(let f=0;f<i;f++){const p=document.createElement("div");p.className="pip",a.appendChild(p)}}[...a.children].forEach((f,p)=>{f.classList.toggle("on",r>=p+1),f.classList.toggle("half",r>p&&r<p+1)});const o=this.els.orrery,l=t.rules.slots;if(o.childElementCount!==l){o.innerHTML="";for(let f=0;f<l;f++){const p=document.createElement("div");p.className="orb-slot empty",p.innerHTML="<i></i>",o.appendChild(p)}}[...o.children].forEach((f,p)=>{const g=t.orbiters[p];f.classList.toggle("empty",!g),f.classList.toggle("sel",p===t.selected),f.classList.toggle("away",!!(g&&g.mode!=="orbit"));const _=f.querySelector("i");g?(_.style.background=g.def.glow,_.style.color=g.def.glow,_.style.display="block"):_.style.display="none"});const c=t.dashCd<=0&&t.dashCharges>0?1:1-t.dashCd/t.dashMax,h=1-t.pulseCd/t.rules.pulseCd,u=1-t.flingCd/.22;if(this.els.cdDash.style.transform=`scaleX(${Math.max(0,Math.min(1,c))})`,this.els.cdPulse.style.transform=`scaleX(${Math.max(0,Math.min(1,h))})`,this.els.cdFling.style.transform=`scaleX(${Math.max(0,Math.min(1,u))})`,t.boss){this.show(this.els.boss,!0),this.els.bossName.textContent=t.boss.title||t.boss.name;const f=Math.max(0,t.boss.hp/t.boss.maxHp);this.els.bossFill.style.transform=`scaleX(${f})`}else this.show(this.els.boss,!1)}showCards(t,e){this.show(this.els.cards,!0),this.els.cardRow.innerHTML="",t.forEach(n=>{const i=document.createElement("button");i.className="card "+n.rarity,i.innerHTML=`<div class="rarity">${n.rarity}</div><h3>${n.name}</h3><p>${n.desc}</p><div class="tag">${n.tag}</div>`,i.addEventListener("click",()=>e(n)),this.els.cardRow.appendChild(i)})}hideCards(){this.show(this.els.cards,!1)}showAltar(t,e,n,i){this.show(this.els.altar,!0),this.els.altarGrid.innerHTML="",t.forEach(r=>{const a=document.createElement("button");a.className="shop-item";const o=e>=r.cost||r.kind==="blood";a.disabled=!o&&r.kind!=="blood",a.innerHTML=`<h3>${r.name}</h3><p>${r.desc}</p><div class="price">${r.kind==="blood"?"Costs 1 Integrity":r.cost+" stardust"}</div>`,a.addEventListener("click",()=>n(r)),this.els.altarGrid.appendChild(a)}),Ft("altar-leave").onclick=i}hideAltar(){this.show(this.els.altar,!1)}showPause(t){this.show(this.els.pause,t)}showHow(t){this.show(this.els.how,t)}showReliquary(t,e,n){this.show(this.els.reliquary,!0),this.els.ashBank.textContent=String(t.ash),this.els.unlockGrid.innerHTML="",mg.forEach(i=>{const r=!!t.unlocks[i.id],a=document.createElement("button");a.className="unlock-item"+(r?" owned":t.ash<i.cost?" locked-cash":""),a.innerHTML=`<h3>${i.name}</h3><p>${i.desc}</p><div class="price">${r?"Unsealed":i.cost+" Ash"}</div>`,r||a.addEventListener("click",()=>e(i)),this.els.unlockGrid.appendChild(a)}),Ft("reliquary-close").onclick=n}showResults(t){this.show(this.els.results,!0),this.show(this.els.hud,!1),this.els.resultsKicker.textContent=t.win?"The still point yields":"The spark guttered",this.els.resultsTitle.textContent=t.win?"Apotheosis":"Fallen",this.els.resultsLead.textContent=t.lead,this.els.resultsStats.innerHTML=t.stats.map(e=>`<li>${e.k}<b>${e.v}</b></li>`).join(""),this.els.resultsUnlocks.textContent=t.unlockNote||""}}const qs=16.2,Be=Math.PI*2,Tg=new w(1,1,1);class zl{constructor(t){this.s=t>>>0}next(){let t=this.s+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+(e-t)*this.next()}int(t,e){return Math.floor(this.range(t,e+1))}pick(t){return t[Math.floor(this.next()*t.length)]}chance(t){return this.next()<t}}function wg(s){return s=((s+Math.PI)%Be+Be)%Be-Math.PI,s}function Bl(s,t){return Math.abs(wg(s-t))}function qi(s,t,e=0){const n=qs-e,i=Math.hypot(s,t);if(i>n){const r=n/i;return{x:s*r,z:t*r}}return{x:s,z:t}}function _e(s){s&&(s.removeFromParent(),s.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material:[t.material]).forEach(n=>{n.map&&n.map.userData?.owned&&n.map.dispose(),n.dispose()})}))}class Ag{constructor(t){this.scene=t.scene,this.fx=t.fx,this.audio=t.audio,this.ui=t.ui,this.canvas=t.canvas,this.camera=t.camera,this.world=t.world,this.floatLayer=document.getElementById("float-layer"),this.mode="title",this.timeScale=1,this.hitstop=0,this.rng=new zl(1),this.rules=Ol(),this.orbiters=[],this.enemies=[],this.bolts=[],this.pickups=[],this.beams=[],this.pulses=[],this.ghosts=[],this.trailsWake=[],this.player=this._makePlayer(),this.selected=0,this.dashCd=0,this.dashMax=.85,this.dashCharges=1,this.pulseCd=0,this.flingCd=0,this.orbitSign=1,this.orbitFreeze=0,this.syzygyOn=!1,this.syzygyHold=0,this.alignMul=1,this.alignIdle=0,this.stardust=0,this.ashEarned=0,this.kills=0,this.syzygies=0,this.novas=0,this.spears=0,this.floor=0,this.chamber=1,this.roomIndex=0,this.roomKind="fight",this.cleared=!1,this.boss=null,this.plan=[],this.statsTime=0,this.hintI=0,this.hintT=0,this.wave=0,this.waves=1,this.applied=new Set,this.meta=null,this.taken=[],this.demoAngle=0,this.playerGroup=new qn,this.scene.add(this.playerGroup),this._buildPlayerMesh(),this._buildBeams()}_makePlayer(){return{x:0,z:0,vx:0,vz:0,y:.55,r:.42,hp:4,maxHp:4,iframes:0,facing:0,dashT:0,attract:!1}}_buildPlayerMesh(){const t=this.playerGroup;for(;t.children.length;)_e(t.children[0]);const e=new ue(new ts(.38,1),new Ki({color:16774358,emissive:16765562,emissiveIntensity:.9,roughness:.25,metalness:.3})),n=new ue(new or(.62,0),new Ki({color:14725200,emissive:6965776,emissiveIntensity:.3,roughness:.2,metalness:.7,wireframe:!0,transparent:!0,opacity:.7})),i=new og(16770736,3.1,16,2),r=_i(16770736,3.8),a=new le().setFromPoints([new w(.5,0,0),new w(3.4,0,0)]),o=new eo(a,new ar({color:16770736,transparent:!0,opacity:.35,blending:dn,depthWrite:!1}));t.add(e,n,i,r,o),this.playerCore=e,this.playerShell=n,this.playerAim=o}_buildBeams(){this.beamPool=[];for(let t=0;t<8;t++){const e=new Ei({color:16770720,transparent:!0,opacity:0,blending:dn,depthWrite:!1}),n=new ue(new Ln(1,.12,.18),e);n.visible=!1,this.scene.add(n),this.beamPool.push({mesh:n,mat:e,life:0,ang:0})}}setMeta(t){this.meta=t}startDemo(){this.mode="title",this.clearWorld(!1),this.player.x=0,this.player.z=0,["ember","glacier","shard","comet"].forEach((t,e)=>{this.addOrbiter(t,e*1.4)})}startRun(){this.rng=new zl(Math.random()*1e9|0),this.rules=Ol(),this.applied.clear(),this.taken=[],this.lastResult=null,this.kills=0,this.syzygies=0,this.novas=0,this.spears=0,this.stardust=0,this.ashEarned=0,this.alignMul=1,this.floor=0,this.chamber=1,this.roomIndex=0,this.statsTime=0,this.orbitSign=1,this.hintI=0,this.player.hp=4+(this.meta.unlocks.skin0?1:0),this.player.maxHp=this.player.hp,this.player.x=0,this.player.z=0,this.player.vx=0,this.player.vz=0,this.player.iframes=.8,this.meta.unlocks.slot&&(this.rules.slots+=1),this.clearWorld(!0),this.addOrbiter("ember",.2),this.meta.unlocks["start-glacier"]&&this.addOrbiter("glacier",2.1),this.meta.unlocks["start-shard"]&&this.addOrbiter("shard",3.6),this.meta.unlocks["start-lode"]&&(this.rules.slots=Math.max(this.rules.slots,this.orbiters.length+1),this.addOrbiter("lodestone",4.8)),this.plan=this._makePlan(),this.mode="play",this.ui.playHud(),this.beginRoom(),this.audio.room()}_makePlan(){return[["fight","fight","elite","altar","fight","boss"],["fight","fight","elite","altar","fight","boss"],["fight","elite","altar","fight","boss"]]}clearWorld(t){for(const e of this.orbiters)this._freeOrbiter(e);this.orbiters=[];for(const e of this.enemies)_e(e.mesh);this.enemies=[];for(const e of this.bolts)_e(e.mesh);this.bolts=[];for(const e of this.pickups)_e(e.mesh);this.pickups=[];for(const e of this.ghosts)_e(e.mesh);this.ghosts=[],this.pulses=[],this.boss=null,this.beamPool.forEach(e=>{e.life=0,e.mesh.visible=!1}),t||(this.player.x=0,this.player.z=0)}_freeOrbiter(t){t.trail.dispose(this.scene),_e(t.mesh),t.glow&&_e(t.glow)}addOrbiter(t,e=Math.random()*Be){if(this.orbiters.length>=this.rules.slots)return null;const n=kn[t];if(!n)return null;const i=vi({...n,edge:n.color},{emissive:.8}),r=_i(n.color,1.6);this.scene.add(i),this.scene.add(r);const a={id:t,def:n,angle:e,baseR:n.orbit,mode:"orbit",mesh:i,glow:r,trail:new yg(this.scene,n.color,56),hitAt:new Map,windT:0,fx:0,fz:0,life:1,pierce:0,spear:!1,laps:0,lastA:e};return this.orbiters.push(a),this.selected=this.orbiters.length-1,a}duplicateSmallest(){if(!this.orbiters.length)return;this.rules.slots=Math.max(this.rules.slots,this.orbiters.length+1);const t=[...this.orbiters].sort((n,i)=>n.def.radius-i.def.radius)[0],e=this.addOrbiter(t.id,t.angle+Math.PI);e&&(e.baseR=t.baseR+.7)}beginRoom(){const t=this.plan[this.floor];for(this.roomKind=t[this.roomIndex],this.cleared=!1,this.wave=0,this.orbitFreeze=0,this.rules.hymnReady=this.rules.ironHymn,this.ui.hideAltar(),this.ui.hideCards(),this.player.x*=.3,this.player.z*=.3,this.player.vx=0,this.player.vz=0;this.enemies.length;)_e(this.enemies.pop().mesh);for(;this.bolts.length;)_e(this.bolts.pop().mesh);if(this.boss=null,this.ui.hint(""),this.roomKind==="altar"){this.mode="altar";const n=this._altarStock();this.ui.showAltar(n,this.stardust,i=>this.buyAltar(i),()=>this.leaveAltar()),this.ui.announce("Altar of Rest");return}this.mode="play",this.roomKind==="boss"?this._spawnBoss():this._spawnFight();const e=this.roomKind==="boss"?this.boss?.name||"Sovereign":this.roomKind==="elite"?"An elite unbinds":this.floor===0&&this.roomIndex===0?"The orrery remembers you":"The Null gathers";this.ui.announce(e),this.audio.room()}_altarStock(){const t=[..._g],e=[];for(;e.length<4&&t.length;){const n=this.rng.int(0,t.length-1);e.push(t.splice(n,1)[0])}return e}buyAltar(t){if(t.kind==="blood"){if(this.player.hp<=1)return;this.player.hp-=1,this.stardust+=24,this.audio.hit(!0)}else{if(this.stardust<t.cost)return;this.stardust-=t.cost}if(t.kind==="heal"&&(this.player.hp=Math.min(this.player.maxHp,this.player.hp+t.n)),t.kind==="relic"){const e=this.rng.pick(Object.keys(kn));this.orbiters.length>=this.rules.slots&&(this.rules.slots+=1),this.addOrbiter(e),this.audio.relic()}if(t.kind==="edict"){this.ui.hideAltar(),this.offerEdicts(!0);return}t.kind==="slot"&&(this.rules.slots+=1),this.audio.pickup(),this.ui.showAltar(this._altarStock(),this.stardust,e=>this.buyAltar(e),()=>this.leaveAltar())}leaveAltar(){this.ui.hideAltar(),this.advanceRoom()}_spawnFight(){const t=this.floor,e=this.roomKind==="elite",n=4+t*3+this.roomIndex+(e?4:0);if(this.waves=e||t>0?2:1,this.floor===0&&this.roomIndex===0){this.waves=1,this.wave=1,this._pending=[],this._ringSpawn(["husk","husk","husk","mite"],8),this.spawnPickup("relic",4.5,-2.5,{id:"glacier"}),this.ui.hint("WASD drift · mouse aim · Shift to draw the Glacier into orbit");return}const i=["husk","husk","splinter"];t>=0&&i.push("seer"),t>=1&&i.push("ballast","ravel","mite","mite"),t>=2&&i.push("splinter","seer","ballast");const r=[];let a=0;for(;a<n&&r.length<16;){const o=this.rng.pick(i);r.push(o),a+=o==="ballast"||o==="ravel"?2.4:o==="mite"?.45:1}e&&r.push(this.rng.chance(.5)?"warden":"eclipse"),this._pending=r,this._spawnWave()}_spawnWave(){const t=this._pending||[];if(this.wave===0){const e=Math.ceil(t.length/this.waves);this._ringSpawn(t.slice(0,e),9+this.floor),this._rest=t.slice(e)}else this._ringSpawn(this._rest||[],10),this._rest=[];this.wave+=1}_ringSpawn(t,e){t.forEach((n,i)=>{const r=i/Math.max(1,t.length)*Be+this.rng.range(0,.5),a=e+this.rng.range(-1.2,1.4);this.spawnEnemy(n,Math.cos(r)*a,Math.sin(r)*a)})}spawnEnemy(t,e,n,i={}){const r={...Fl[t],...i.def};!r.name&&i.boss;const a=i.boss||r,o=1+this.floor*.28,l=qi(e,n,a.radius||.5),c=i.mesh||vi(a.edge!=null?a:{...a,edge:a.edge??16723306,color:a.color??1708576,shape:a.shape||"box",radius:a.radius||.5});this.scene.add(c);const h=_i(a.edge||16723306,(a.radius||.5)*3.4);h.material.opacity=.55,c.add(h);const u={type:t,def:a,x:l.x,z:l.z,vx:0,vz:0,y:a.radius||.5,r:a.radius||.5,hp:(a.hp||20)*o*(i.hpMul||1),maxHp:0,mesh:c,shootT:this.rng.range(.4,1.4),dashT:this.rng.range(.8,2),slamT:this.rng.range(1.6,3),spawnT:this.rng.range(1.5,3),beamT:2.2,stun:0,slow:1,flash:0,tele:0,teleKind:"",elite:!!a.elite,boss:i.bossId||null,title:i.title||"",phase:1,name:a.name,score:a.score||2,ash:a.ash||1,link:i.link||null};if(u.maxHp=u.hp,a.shields){u.shields=[];for(let f=0;f<a.shields;f++){const p=vi({shape:"sphere",radius:.18,color:14725200,edge:16770720});c.add(p),u.shields.push({mesh:p,a:f/a.shields*Be,hp:12})}}return this.enemies.push(u),i.isBossBar&&(this.boss=u),u}_spawnBoss(){const t=["meridian","choir","still"][this.floor],e=gg[t];if(t==="choir"){const r=[];for(let a=0;a<3;a++){const o=a/3*Be,l=this.spawnEnemy("seer",Math.cos(o)*6,Math.sin(o)*6,{bossId:"choir",title:e.title,hpMul:3.2,def:{...Fl.seer,name:e.name,hp:e.hp,radius:e.radius,color:1312788,edge:16723306,shape:"tetra",speed:e.speed}});r.push(l)}r.forEach(a=>{a.link=r,a.maxHp=e.hp*1.05,a.hp=a.maxHp}),this.boss={name:e.name,title:e.title,get hp(){return r.reduce((a,o)=>a+Math.max(0,o.hp),0)},get maxHp(){return r.reduce((a,o)=>a+o.maxHp,0)},choir:r};return}const n=t==="meridian"?this._meshMeridian():this._meshStill(),i=this.spawnEnemy("ballast",0,-5,{bossId:t,isBossBar:!0,title:e.title,mesh:n,def:{name:e.name,hp:e.hp,radius:e.radius,speed:e.speed,color:788498,edge:t==="still"?8316927:14725200,shape:"ico",touch:1}});i.name=e.name,i.title=e.title,this.boss=i}_meshMeridian(){const t=new qn,e=new ue(new Pi(2.15,.28,12,48),new Ki({color:3809812,emissive:14725200,emissiveIntensity:.85,metalness:.65,roughness:.28}));e.rotation.x=Math.PI/2;const n=vi({shape:"octa",radius:.72,color:4857872,edge:16769162});return t.add(e,n,_i(14725200,5.4)),t}_meshStill(){const t=new qn,e=new ue(new ts(1.65,1),new Ki({color:525844,emissive:2766960,emissiveIntensity:.75,roughness:.15,metalness:.8})),n=new ue(new Pi(2.35,.08,8,48),new Ei({color:8316927,transparent:!0,opacity:.85}));return n.rotation.x=Math.PI/2,t.add(e,n,_i(8316927,6.2)),t}advanceRoom(){this.roomIndex+=1;const t=this.plan[this.floor];if(this.roomIndex>=t.length){if(this.floor+=1,this.roomIndex=0,this.chamber=1,this.floor>=this.plan.length){this.victory();return}this.ui.announce(Ha[this.floor].name)}else this.chamber+=1;this.beginRoom()}update(t,e){if(this.mode==="title"){this._updateDemo(t);return}if(this.mode==="pause"||this.mode==="cards"||this.mode==="results"){this._spinMeshes(t*.2);return}if(this.mode==="altar"){this._updateOrbiters(t*.55,e),this._updateSyzygy(t*.55),this._updatePickups(t),this._spinMeshes(t);return}this.mode==="play"&&(this.hitstop>0&&(this.hitstop-=t,t*=.08),t*=this.timeScale,t=Math.min(t,.05),this.statsTime+=t,this._updatePlayer(t,e),this._updateOrbiters(t,e),this._updateSyzygy(t),this._updateEnemies(t),this._updateBolts(t),this._updatePickups(t),this._updatePulses(t),this._updateGhosts(t),this._checkClear(),this._hints(t),this._spinMeshes(t))}_hints(t){if(this.floor>0||this.roomIndex>1||(this.hintT+=t,this.hintT<5.2))return;this.hintT=0;const e=["WASD drift · mouse aim · Space dash","Relics orbit you and wound on contact","Line two relics through your core — SYZYGY","LMB fling · RMB pulse · R reverse orbits","Pulse in a syzygy for a Nova. Fling for a Spear.","Shift attracts motes and small prey"];this.ui.hint(e[this.hintI%e.length]),this.hintI+=1}_updateDemo(t){this.demoAngle+=t*.15,this.player.x=Math.cos(this.demoAngle)*.4,this.player.z=Math.sin(this.demoAngle*.8)*.4,this.orbitSign=1,this._updateOrbiters(t,{aimx:1,aimz:0,fling:!1,pulse:!1,attract:!1}),this._updateSyzygy(t),this._spinMeshes(t)}_spinMeshes(t){this.playerCore&&(this.playerCore.rotation.y+=t*1.4,this.playerCore.rotation.x+=t*.5),this.playerShell&&(this.playerShell.rotation.y-=t*.7,this.playerShell.rotation.z+=t*.35),this.playerGroup.position.set(this.player.x,this.player.y,this.player.z);const e=1+Math.sin(performance.now()*.006)*.04;this.playerGroup.scale.setScalar(e),this.playerAim&&(this.playerAim.rotation.y=-this.player.facing,this.playerAim.visible=this.mode==="play"),this.orbiters.forEach((n,i)=>{n.mesh.rotation.y+=t*(1.2+i*.2),n.mesh.rotation.x+=t*.8})}_updatePlayer(t,e){const n=this.player,i=this.rules;n.attract=e.attract;const r=78*i.moveMul,a=11.2*i.moveMul;n.vx+=e.x*r*t,n.vz+=e.z*r*t,n.vx*=Math.exp(-6.4*t),n.vz*=Math.exp(-6.4*t);const o=Math.hypot(n.vx,n.vz);o>a&&n.dashT<=0&&(n.vx=n.vx/o*a,n.vz=n.vz/o*a),(e.aimx||e.aimz)&&(n.facing=Math.atan2(e.aimz,e.aimx)),e.dash&&this.tryDash(e),e.fling&&this.tryFling(e),e.pulse&&this.tryPulse(),e.reverse&&this.reverseOrbits(),e.selDelta&&(this.selected=(this.selected+e.selDelta+this.orbiters.length)%Math.max(1,this.orbiters.length)),this.dashCd=Math.max(0,this.dashCd-t),this.dashCd<=0&&this.dashCharges<i.dashes&&(this.dashCharges=i.dashes),this.pulseCd=Math.max(0,this.pulseCd-t),this.flingCd=Math.max(0,this.flingCd-t),n.iframes=Math.max(0,n.iframes-t),n.dashT=Math.max(0,n.dashT-t),this.orbitFreeze=Math.max(0,this.orbitFreeze-t),this.rules.spearLock=Math.max(0,this.rules.spearLock-t),n.dashT>0&&i.dashTrail&&this.rng.chance(.6)&&(this.trailsWake.push({x:n.x,z:n.z,t:.28}),this._hurtCircle(n.x,n.z,.7,6,16738858,!1)),n.x+=n.vx*t,n.z+=n.vz*t;const l=qi(n.x,n.z,n.r);if(n.x=l.x,n.z=l.z,n.attract||i.corePull){const c=n.attract?i.attractRad:3.2,h=n.attract?16:i.corePull;this._attract(n.x,n.z,c,h,t)}}tryDash(t){if(this.dashCharges<=0)return;const e=this.player;let n=t.x,i=t.z;!n&&!i&&(n=Math.cos(e.facing),i=Math.sin(e.facing));const r=Math.hypot(n,i)||1;if(e.vx=n/r*36,e.vz=i/r*36,e.dashT=.13,e.iframes=.2,this.dashCharges-=1,this.dashCd=this.dashMax,this.audio.dash(),this.fx.burst(e.x,e.y,e.z,16770736,16,8,.35,.18),this.world.rig.shake(.18),this.rules.afterimage){const a=vi({shape:"ico",radius:.35,color:16770736,edge:16770736});a.position.set(e.x,e.y,e.z),this.scene.add(a),this.ghosts.push({mesh:a,t:.45,x:e.x,z:e.z})}}tryFling(t){if(this.flingCd>0||!this.orbiters.length)return;const e=Math.atan2(t.aimz,t.aimx);let n=this.orbiters[this.selected],i=99;for(const h of this.orbiters){if(h.mode!=="orbit")continue;const u=Bl(h.angle,e);u<i&&(i=u,n=h)}if(!n||n.mode!=="orbit")return;const r=this.syzygyOn||this.rules.spearLock>0||this.rules.easySpear;n.mode="flung",n.life=this.rules.flingTime*(r?1.25:1);const a=(r?42:30)*(.85+n.def.mass*.1),o=t.aimx,l=t.aimz,c=Math.hypot(o,l)||1;n.fx=o/c*a,n.fz=l/c*a,n.pierce=this.rules.flingPierce+(r?3:0),n.spear=r,n.hitAt.clear(),this.flingCd=.22,this.selected=this.orbiters.indexOf(n),this.audio.fling(),r&&(this.spears+=1,this.ui.syzygy("SPEAR"),this.audio.syzygy(),this.fx.ring(n.mesh.position.x,.6,n.mesh.position.z,n.def.color,18,10))}tryPulse(){if(this.pulseCd>0)return;const t=this.syzygyOn||this.syzygyHold>0,e=this.rules.pulseRad*(t?1.55:1),n=this.rules.pulseDmg*(t?1.8:1)*this.alignMul;if(this.pulses.push({x:this.player.x,z:this.player.z,r:.4,max:e,dmg:n,hit:new Set,nova:t}),this.pulseCd=this.rules.pulseCd*(t?.85:1),this.fx.ring(this.player.x,.4,this.player.z,t?16770720:8316927,t?36:22,t?14:9),this.world.rig.shake(t?.55:.28),this.world.pulse=1,t?(this.novas+=1,this.ui.syzygy("NOVA"),this.audio.nova(),this.ui.flash("#fff3c0",70),this.hitstop=.07):this.audio.pulse(),this.rules.nullTongue)for(let i=this.bolts.length-1;i>=0;i--){const r=this.bolts[i];r.friendly||Math.hypot(r.x-this.player.x,r.z-this.player.z)<e+1.5&&(this.fx.burst(r.x,.5,r.z,8316927,6,4,.25),_e(r.mesh),this.bolts.splice(i,1))}}reverseOrbits(){this.orbitSign*=-1,this.audio.reverse(),this.fx.ring(this.player.x,.5,this.player.z,11832575,16,7)}_orbiterPos(t){const e=t.def.ecc||0;let n=t.baseR*this.rules.radiusMul;return e&&(n*=1+e*Math.cos(t.angle)),{x:this.player.x+Math.cos(t.angle)*n,z:this.player.z+Math.sin(t.angle)*n,y:.62+Math.sin(t.angle*2)*.08,rad:n}}_updateOrbiters(t,e){this.orbitFreeze<=0;for(const n of this.orbiters){const i=this._orbiterPos(n);if(n.mode==="orbit")this.orbitFreeze<=0&&(n.angle+=n.def.spin*this.rules.orbitMul*this.orbitSign*t),n.angle>Be&&(n.angle-=Be,n.laps+=1,n.def.mend&&this.heal(n.def.mend)),n.angle<0&&(n.angle+=Be),n.mesh.position.set(i.x,i.y,i.z);else if(n.mode==="flung"){n.life-=t,n.mesh.position.x+=n.fx*t,n.mesh.position.z+=n.fz*t,n.mesh.position.y=.7;const r=qi(n.mesh.position.x,n.mesh.position.z,.2);(r.x!==n.mesh.position.x||r.z!==n.mesh.position.z)&&(n.fx*=-.4,n.fz*=-.4,n.mesh.position.x=r.x,n.mesh.position.z=r.z),n.life<=0&&(n.mode="return")}else if(n.mode==="return"){const r=i.x-n.mesh.position.x,a=i.z-n.mesh.position.z,o=Math.hypot(r,a),l=26*this.rules.returnMul;o<.35?(n.mode="orbit",n.spear=!1):(n.mesh.position.x+=r/o*l*t,n.mesh.position.z+=a/o*l*t,n.mesh.position.y=.66)}if(n.glow.position.copy(n.mesh.position),n.trail.push(n.mesh.position.x,n.mesh.position.y,n.mesh.position.z),n.def.color===kn.prism.color){const r=(performance.now()*2e-4+n.angle)%1,a=new At().setHSL(r,.75,.6);n.mesh.material.emissive.copy(a),n.trail.setColor(a)}if(this._orbiterHits(n),this.rules.solarWind&&n.mode==="orbit"&&(n.windT-=t,n.windT<=0)){n.windT=.55;const r=n.mesh.position.x-this.player.x,a=n.mesh.position.z-this.player.z,o=Math.hypot(r,a)||1;this.spawnBolt(n.mesh.position.x,n.mesh.position.z,r/o*10,a/o*10,6,!0,n.def.color)}}}_orbiterHits(t){const e=t.def.dmg*this.rules.contactMul*(t.mode==="flung"?this.rules.flingMul*(t.spear?1.8:1):1);let n=1;if(this.rules.periapsis!==1&&t.mode==="orbit"){const a=this._orbiterPos(t),o=t.baseR*this.rules.radiusMul*(1-(t.def.ecc||0));a.rad<o+.55&&(n=this.rules.periapsis)}const i=t.mesh.position.x,r=t.mesh.position.z;for(const a of this.enemies){if(Math.hypot(i-a.x,r-a.z)>t.def.radius+a.r+.08)continue;const l=this.statsTime,c=t.hitAt.get(a)||-9,h=t.mode==="flung"?.12:.28;if(l-c<h)continue;t.hitAt.set(a,l);let u=e*n*this.alignMul;if(t.def.crit&&this.rng.chance(t.def.crit)&&(u*=2),t.def.slow&&(a.slow=Math.min(a.slow,1-t.def.slow)),t.def.pull){const f=Math.atan2(r-a.z,i-a.x);a.vx+=Math.cos(f)*t.def.pull,a.vz+=Math.sin(f)*t.def.pull}t.def.execute&&a.hp/a.maxHp<t.def.execute&&(u=Math.max(u,a.hp+1)),this.hurt(a,u,t.def.color,t.mode==="flung"||t.spear),t.mode==="flung"&&(t.pierce-=1,t.pierce<0&&(t.mode="return")),(t.def.fork||this.rules.fork)&&this.rng.chance(t.def.fork?1:this.rules.fork)&&this._fork(a,u*.45,t.def.color)}if(this.rules.horizon&&t.mode==="orbit"){const a=2.2*this.rules.radiusMul;for(const o of this.enemies)o.hp/o.maxHp<this.rules.horizon&&Math.hypot(o.x-this.player.x,o.z-this.player.z)<a&&this.hurt(o,o.hp+5,2228241,!0)}}_fork(t,e,n){let i=null,r=6.5;for(const a of this.enemies){if(a===t||a.hp<=0)continue;const o=Math.hypot(a.x-t.x,a.z-t.z);o<r&&(r=o,i=a)}i&&this.hurt(i,e,n,!1)}_updateSyzygy(t){const e=this.rules.syzygyWindow,n=[],i=this.orbiters.length;for(let a=0;a<i;a++){const o=this.orbiters[a];if(o.mode==="orbit")for(let l=a+1;l<i;l++){const c=this.orbiters[l];if(c.mode!=="orbit")continue;const h=Bl(o.angle,c.angle),u=Math.abs(h-Math.PI)<e,f=h<e*.85,p=this.rules.constellation&&h<e*1.4;(u||f||p)&&n.push({a:o,b:c,ang:u||f?o.angle:Math.atan2(c.mesh.position.z-o.mesh.position.z,c.mesh.position.x-o.mesh.position.x),through:u||f})}}const r=this.syzygyOn;this.syzygyOn=n.some(a=>a.through),this.syzygyOn?(this.syzygyHold=.28,this.world.syzygy=1,r||(this.syzygies+=1,this.audio.syzygy(),this.ui.syzygy("SYZYGY"),this.rules.spearLock=.45)):this.syzygyHold=Math.max(0,this.syzygyHold-t),this.beamPool.forEach(a=>{a.life-=t,a.life<=0&&(a.mesh.visible=!1,a.mat.opacity=0)}),n.forEach((a,o)=>{const l=this.beamPool[o%this.beamPool.length];l.life=this.rules.beamTime,l.ang=a.ang,l.mesh.visible=!0;const c=qs*2.1;l.mesh.scale.set(c,a.through?1.4:.8,a.through?1.3:.7),l.mesh.position.set(this.player.x,.45,this.player.z),l.mesh.rotation.set(0,-a.ang,0),l.mat.opacity=a.through?.55:.28,l.mat.color.set(a.through?16769162:8316927);const h=this.rules.beamDmg*this.rules.beamMul*this.alignMul*t;for(const u of this.enemies)this._distToAxis(u.x,u.z,this.player.x,this.player.z,a.ang)<u.r+.38&&this.hurt(u,h,16769162,!1,!0)}),this.alignIdle+=t,this.alignIdle>2.2&&(this.alignMul=Math.max(1,this.alignMul-t*.35))}_distToAxis(t,e,n,i,r){const a=Math.cos(r),o=Math.sin(r),l=t-n,c=e-i;return Math.abs(l*o-c*a)}_updateEnemies(t){const e=this.player;for(let n=this.enemies.length-1;n>=0;n--){const i=this.enemies[n];if(i.hp<=0){this._kill(i),this.enemies.splice(n,1);continue}i.stun=Math.max(0,i.stun-t),i.flash=Math.max(0,i.flash-t),i.slow=Math.min(1,i.slow+t*.35);const r=i.stun<=0,a=(i.def.speed||2.4)*i.slow,o=e.x-i.x,l=e.z-i.z,c=Math.hypot(o,l)||.001,h=o/c,u=l/c;r&&i.boss==="meridian"?this._aiMeridian(i,t,h,u,c):r&&i.boss==="choir"?this._aiChoir(i,t,h,u,c):r&&i.boss==="still"?this._aiStill(i,t,h,u,c):r&&this._aiBasic(i,t,h,u,c,a),i.x+=i.vx*t,i.z+=i.vz*t,i.vx*=Math.exp(-3.5*t),i.vz*=Math.exp(-3.5*t);const f=qi(i.x,i.z,i.r);i.x=f.x,i.z=f.z,i.mesh.position.set(i.x,i.y,i.z),i.mesh.scale.lerp(Tg,1-Math.pow(2e-4,t)),i.boss==="meridian"?i.mesh.rotation.z+=t*1.2:i.mesh.rotation.y+=t*1.4,i.shields&&i.shields.forEach(p=>{p.a+=t*2.2,p.mesh.position.set(Math.cos(p.a)*1.4,.1,Math.sin(p.a)*1.4)}),i.flash>0?i.mesh.traverse(p=>{p.material&&p.material.emissive&&(p.material.emissiveIntensity=1.8)}):i.mesh.traverse(p=>{p.material&&p.material.emissive&&p.material.userData.base==null}),e.iframes<=0&&e.dashT<=0&&Math.hypot(e.x-i.x,e.z-i.z)<e.r+i.r*.85&&this.hitPlayer(1,h,u)}}_aiBasic(t,e,n,i,r,a){const o=t.type;if(o==="seer")t.vx+=(r>8?n:-n)*a*3*e,t.vz+=(r>8?i:-i)*a*3*e,t.shootT-=e,t.shootT<=0&&(t.shootT=(t.def.shoot||1.8)*(.8+this.rng.range(0,.4)),this.spawnBolt(t.x,t.z,n*9,i*9,1,!1,8316927));else if(o==="splinter")t.vx+=n*a*4*e,t.vz+=i*a*4*e,t.dashT-=e,t.dashT<=0&&(t.dashT=2.1,t.vx+=n*18,t.vz+=i*18,t.tele=.12);else if(o==="ballast")t.vx+=n*a*2.4*e,t.vz+=i*a*2.4*e,t.slamT-=e,t.slamT<=.7&&t.slamT>0&&(t.tele=t.slamT),t.slamT<=0&&(t.slamT=3.4,this._hurtCircle(t.x,t.z,2.6,1,11832575,!0),this.fx.ring(t.x,.2,t.z,11832575,20,8),t.stun=.25);else if(o==="ravel")t.vx+=(r>7?n:-n)*a*3*e,t.vz+=(r>7?i:-i)*a*3*e,t.spawnT-=e,t.spawnT<=0&&(t.spawnT=3.6,this.spawnEnemy("mite",t.x+n*-1.2,t.z+i*-1.2));else if(o==="eclipse")t.vx+=(r>7?n:-n)*a*2.5*e,t.vz+=(r>7?i:-i)*a*2.5*e,t.beamT-=e,t.beamT<.8&&t.beamT>0&&this._paintBeam(t.x,t.z,Math.atan2(i,n),.15),t.beamT<=0&&(t.beamT=3.2,this._axisBurst(t.x,t.z,Math.atan2(i,n),1),this.audio.hit(!0));else if(o==="warden"){if(t.vx+=n*a*2.6*e,t.vz+=i*a*2.6*e,t.shootT-=e,t.shootT<=0){t.shootT=2.1;for(let l=-1;l<=1;l++){const c=Math.atan2(i,n)+l*.22;this.spawnBolt(t.x,t.z,Math.cos(c)*8,Math.sin(c)*8,1,!1,14725200)}}}else t.vx+=n*a*3.4*e,t.vz+=i*a*3.4*e}_aiMeridian(t,e,n,i,r){t.mesh.children[0]&&(t.mesh.children[0].rotation.z+=e*1.6);const a=this.statsTime;if(t.x+=Math.cos(a*.7)*e*1.4,t.vx+=-i*6*e+n*2*e,t.vz+=n*6*e+i*2*e,t.shootT-=e,t.shootT<=0){t.shootT=t.hp<t.maxHp*.5?1.1:1.7;const o=Math.atan2(i,n),l=t.hp<t.maxHp*.5?10:7;for(let c=0;c<l;c++){const h=o+(c-l/2)*.18;this.spawnBolt(t.x,t.z,Math.cos(h)*8,Math.sin(h)*8,1,!1,14725200)}}t.spawnT=(t.spawnT||4)-e,t.spawnT<=0&&(t.spawnT=5,this.spawnEnemy("husk",t.x+2,t.z)),r<3.2&&(this.player.vx+=n*10*e,this.player.vz+=i*10*e)}_aiChoir(t,e,n,i,r){if(t.vx+=(r>6.2?n:-n)*8*e,t.vz+=(r>6.2?i:-i)*8*e,t.shootT-=e,t.shootT<=0&&(t.shootT=1.5,this.spawnBolt(t.x,t.z,n*9,i*9,1,!1,16723306)),t.link)for(const o of t.link){if(o===t||o.hp<=0)continue;const l=Math.atan2(o.z-t.z,o.x-t.x),c=Math.hypot(o.x-t.x,o.z-t.z);this._paintBeam(t.x,t.z,l,.08,c);const h=this._distToAxis(this.player.x,this.player.z,t.x,t.z,l),u=(this.player.x-t.x)*Math.cos(l)+(this.player.z-t.z)*Math.sin(l);h<.45&&u>0&&u<c&&this.player.iframes<=0&&this.hitPlayer(1,n,i)}}_aiStill(t,e,n,i,r){t.vx+=-n*1.2*e,t.vz+=-i*1.2*e;const a=t.hp<t.maxHp*.4?10:5;if(this.player.vx-=n*a*e,this.player.vz-=i*a*e,t.shootT-=e,t.shootT<=0){t.shootT=1.3;for(let o=0;o<8;o++){const l=o/8*Be+this.statsTime;this.spawnBolt(t.x,t.z,Math.cos(l)*7,Math.sin(l)*7,1,!1,8316927)}}if(t.slamT-=e,t.slamT<1.1&&t.slamT>0&&Math.floor(t.slamT*10)%2===0&&(this.world.syzygy=.6),t.slamT<=0&&(t.slamT=6.5,this.orbitFreeze=2.1,this.ui.announce("STILL"),this.audio.pulse(),this.fx.ring(t.x,.6,t.z,8316927,40,16),this.world.rig.shake(.5)),t.hp<t.maxHp*.35&&t.phase===1){t.phase=2;for(let o=0;o<6;o++){const l=o/6*Be;this.spawnEnemy("splinter",t.x+Math.cos(l)*4,t.z+Math.sin(l)*4)}this.ui.announce("The Point fractures")}}_paintBeam(t,e,n,i,r=qs){const a=this.beamPool[this.beamPool.length-1];a.life=Math.max(a.life,.08),a.mesh.visible=!0,a.mesh.position.set(t+Math.cos(n)*r*.5,.3,e+Math.sin(n)*r*.5),a.mesh.rotation.set(0,-n,0),a.mesh.scale.set(r,.7,.7),a.mat.opacity=i,a.mat.color.set(16723306)}_axisBurst(t,e,n,i){for(const r of[this.player])this._distToAxis(r.x,r.z,t,e,n)<.7&&this.hitPlayer(i,Math.cos(n),Math.sin(n));for(let r=0;r<10;r++){const a=r*1.6;this.fx.burst(t+Math.cos(n)*a,.4,e+Math.sin(n)*a,16723306,4,3,.25)}}spawnBolt(t,e,n,i,r,a,o){const l=new ue(new lr(a?.12:.16,8,8),new Ei({color:o,transparent:!0,opacity:.95})),c=_i(o,a?.7:.95);l.add(c),l.position.set(t,.55,e),this.scene.add(l),this.bolts.push({x:t,z:e,vx:n,vz:i,dmg:r,friendly:a,mesh:l,life:3.2,r:.18,color:o})}_updateBolts(t){for(let e=this.bolts.length-1;e>=0;e--){const n=this.bolts[e];n.life-=t,n.x+=n.vx*t,n.z+=n.vz*t,n.mesh.position.set(n.x,.55,n.z);const i=Math.hypot(n.x,n.z)>qs+1;if(n.life<=0||i){_e(n.mesh),this.bolts.splice(e,1);continue}if(n.friendly){for(const r of this.enemies)if(Math.hypot(n.x-r.x,n.z-r.z)<r.r+n.r){this.hurt(r,n.dmg,n.color,!1),_e(n.mesh),this.bolts.splice(e,1);break}}else if(this.player.iframes<=0&&Math.hypot(n.x-this.player.x,n.z-this.player.z)<this.player.r+n.r){const r=n.x-this.player.x,a=n.z-this.player.z;this.hitPlayer(n.dmg,r,a),_e(n.mesh),this.bolts.splice(e,1)}}}_updatePickups(t){const e=this.player;for(let n=this.pickups.length-1;n>=0;n--){const i=this.pickups[n];i.t+=t,i.mesh.position.y=.45+Math.sin(i.t*3)*.1,i.mesh.rotation.y+=t*2;const r=Math.hypot(i.x-e.x,i.z-e.z),a=e.attract||this.rules.corePull?18:0;if(r<4.5&&a){const o=(4.5-r)/4.5*a*t;i.x+=(e.x-i.x)/(r||1)*o,i.z+=(e.z-i.z)/(r||1)*o,i.mesh.position.x=i.x,i.mesh.position.z=i.z}r<.85&&(this._collect(i),_e(i.mesh),this.pickups.splice(n,1))}}_collect(t){this.audio.pickup(),t.kind==="dust"?(this.stardust+=t.n,this.fx.burst(t.x,.5,t.z,14725200,8,4,.3)):t.kind==="heart"?this.heal(1):t.kind==="relic"&&(this.orbiters.length>=this.rules.slots&&(this.rules.slots+=1),this.addOrbiter(t.id),this.audio.relic(),this.ui.announce(kn[t.id].name))}spawnPickup(t,e,n,i={}){const r=t==="heart"?10354608:t==="relic"?kn[i.id]?.color||16770720:14725200,a=vi({shape:t==="relic"?kn[i.id]?.shape||"sphere":t==="heart"?"octa":"ico",radius:t==="relic"?.28:.18,color:r,edge:r}),o=qi(e,n,.3);a.position.set(o.x,.45,o.z),this.scene.add(a),this.pickups.push({kind:t,x:o.x,z:o.z,mesh:a,t:0,n:i.n||3,id:i.id})}_updatePulses(t){for(let e=this.pulses.length-1;e>=0;e--){const n=this.pulses[e];n.r+=t*22;for(const i of this.enemies){if(n.hit.has(i))continue;const r=Math.hypot(i.x-n.x,i.z-n.z);r<n.r+i.r&&r>n.r-1.2&&(n.hit.add(i),this.hurt(i,n.dmg,n.nova?16769162:8316927,!0),this.rules.chronoPulse&&(i.stun=Math.max(i.stun,this.rules.chronoPulse)))}n.r>=n.max&&this.pulses.splice(e,1)}}_updateGhosts(t){for(let e=this.ghosts.length-1;e>=0;e--){const n=this.ghosts[e];n.t-=t,n.mesh.scale.setScalar(Math.max(.1,n.t*2)),n.t<=0&&(this._hurtCircle(n.x,n.z,2.1,14,16770720,!1),this.fx.ring(n.x,.4,n.z,16770720,18,10),_e(n.mesh),this.ghosts.splice(e,1))}}_attract(t,e,n,i,r){for(const a of this.enemies){if(a.def.heavy||a.boss)continue;const o=Math.hypot(a.x-t,a.z-e);if(o<n&&o>.2){const l=(n-o)/n*i*r*(a.type==="mite"?1.4:.55);a.vx+=(t-a.x)/o*l,a.vz+=(e-a.z)/o*l}}}_hurtCircle(t,e,n,i,r,a){if(a&&Math.hypot(this.player.x-t,this.player.z-e)<n+this.player.r&&this.hitPlayer(i>4?1:i,this.player.x-t,this.player.z-e),!a)for(const o of this.enemies)Math.hypot(o.x-t,o.z-e)<n+o.r&&this.hurt(o,i,r,!0)}hurt(t,e,n,i,r){if(!(t.hp<=0)){if(t.shields&&t.shields.length){const a=t.shields[0];a.hp-=e,a.hp<=0&&(t.shields.shift(),_e(a.mesh));return}t.hp-=e,t.flash=.1,t.mesh.scale.setScalar(1.18),r?this.rng.chance(.08)&&this._float(t.x,t.y+.3,t.z,Math.max(1,Math.round(e)),"sy"):(this.fx.burst(t.x,t.y,t.z,n,i?14:7,i?7:4,.3,.16),this.audio.hit(i),this._float(t.x,t.y,t.z,Math.max(1,Math.round(e)),i?"crit":""),i&&(this.hitstop=Math.max(this.hitstop,.04),this.world.rig.shake(.12)))}}_kill(t){if(this.kills+=1,this.stardust+=t.ash||1,this.ashEarned+=t.ash||1,this.fx.burst(t.x,t.y,t.z,t.def.edge||16723306,22,9,.45,.2),this.fx.ring(t.x,.3,t.z,t.def.edge||16723306,14,7),_e(t.mesh),(this.syzygyOn||this.syzygyHold>0)&&(this.alignMul=Math.min(4,this.alignMul+.5),this.alignIdle=0),this.rules.killRefund&&(this.pulseCd=Math.max(0,this.pulseCd-this.rules.pulseCd*this.rules.killRefund)),this.rules.harvestEvery&&(this.rules.harvestCount+=1,this.rules.harvestCount>=this.rules.harvestEvery&&(this.rules.harvestCount=0,this.heal(.5))),this.rng.chance(.22)&&this.spawnPickup("dust",t.x,t.z,{n:this.rng.int(2,5)}),t.elite&&this.rng.chance(.85)){const e=this.rng.pick(Object.keys(kn));this.spawnPickup("relic",t.x+.4,t.z,{id:e})}if(t.boss&&t.boss!=="choir"){const e=this.rng.pick(["comet","nullseed","prism","heartwood"]);this.spawnPickup("relic",t.x,t.z,{id:e}),this.spawnPickup("heart",t.x+1,t.z)}t.boss==="choir"&&t.link&&t.link.every(e=>e===t||e.hp<=0)&&this.spawnPickup("relic",t.x,t.z,{id:"nullseed"})}hitPlayer(t,e,n){const i=this.player;if(i.iframes>0)return;if(this.rules.hymnReady){this.rules.hymnReady=!1,i.iframes=.6,this.ui.announce("Iron Hymn"),this.fx.ring(i.x,.5,i.z,14725200,18,8);return}let r=Math.max(1,t-this.rules.flatReduce);i.hp-=r,i.iframes=.7;const a=Math.hypot(e,n)||1;i.vx-=e/a*14,i.vz-=n/a*14,this.audio.playerHit(),this.ui.flash("#ff2d6a",80),this.world.rig.shake(.45),this.fx.burst(i.x,i.y,i.z,16723306,18,8,.4),this.hitstop=.08,i.hp<=0&&this.die()}heal(t){const e=this.player.hp;this.player.hp=Math.min(this.player.maxHp,this.player.hp+t),this.player.hp>e&&this._float(this.player.x,1.2,this.player.z,"+"+(t%1?t.toFixed(1):t),"heal")}_float(t,e,n,i,r){const a=Eg(new w(t,e,n),this.camera,this.canvas);this.ui.float(this.floatLayer,a.x,a.y,String(i),r)}_checkClear(){if(!(this.cleared||this.mode!=="play")&&this.roomKind!=="altar"&&!(this.enemies.length>0)){if(this.wave<this.waves&&this.roomKind!=="boss"){this._spawnWave();return}if(!(this.roomKind==="boss"&&this.boss&&this.boss.choir&&this.boss.hp>0)){if(this.cleared=!0,this.stardust+=6+this.floor*3,this.ashEarned+=this.roomKind==="boss"?18:this.roomKind==="elite"?8:3,this.roomKind==="boss"&&this.floor>=2){this.victory();return}setTimeout(()=>{this.mode==="play"&&(this.roomKind==="boss"?(this.heal(1),this.advanceRoom()):this.offerEdicts(!1))},650)}}}offerEdicts(){const t=pg.filter(i=>!(i.unlock&&!this.meta.unlocks[i.unlock]||i.once&&this.applied.has(i.id))),e=()=>{const i=this.rng.next();return i<.08?"legendary":i<.38?"rare":"common"},n=[];for(let i=0;i<3;i++){let r=e(),a=t.filter(o=>o.rarity===r&&!n.includes(o));if(a.length||(a=t.filter(o=>!n.includes(o))),!a.length)break;n.push(this.rng.pick(a))}if(!n.length){this.heal(1),this.advanceRoom();return}this.mode="cards",this.audio.card(),this.ui.showCards(n,i=>this.pickEdict(i))}pickEdict(t){t.apply(this.rules,this),this.applied.add(t.id),this.taken.push(t.name),this.audio.ui(),this.ui.hideCards(),this.ui.announce(t.name),this.advanceRoom()}die(){this.mode!=="results"&&(this.mode="results",this.audio.death(),this.fx.burst(this.player.x,this.player.y,this.player.z,16770736,40,12,.7,.24),this._finish(!1))}victory(){this.mode!=="results"&&(this.mode="results",this.audio.win(),this.ui.flash("#ffe6a0",200),this._finish(!0))}_finish(t){const e=this.meta.unlocks.ashen?1.25:1,n=Math.floor((this.ashEarned+Math.floor(this.stardust*.25)+(t?40:0))*e);if(this.lastResult={win:t,ash:n,kills:this.kills,time:this.statsTime,syzygies:this.syzygies,novas:this.novas,spears:this.spears,floor:this.floor,chamber:this.chamber},this.meta){this.meta.ash+=n,this.meta.runs+=1,t&&(this.meta.wins+=1);const i=this.kills+this.floor*20+(t?100:0);i>this.meta.best&&(this.meta.best=i),fo(this.meta)}this.ui.showResults({win:t,lead:t?"You aligned the last law. The engine of heaven turns once more — for now.":"The Null unspooled your wheel. Ash remains. The Reliquary remembers.",stats:[{k:"Ash gained",v:n},{k:"Kills",v:this.kills},{k:"Syzygies",v:this.syzygies},{k:"Novas / Spears",v:`${this.novas} / ${this.spears}`},{k:"Time",v:Rg(this.statsTime)},{k:"Edicts",v:this.taken.length?this.taken.slice(0,4).join(", "):"—"}]}),this.lastResult=null}}function Rg(s){const t=Math.floor(s/60),e=Math.floor(s%60);return`${t}:${e.toString().padStart(2,"0")}`}const Cc=document.getElementById("c"),Zn=new km({canvas:Cc,antialias:!0,powerPreference:"high-performance"});Zn.setPixelRatio(Math.min(2,window.devicePixelRatio||1));Zn.setSize(window.innerWidth,window.innerHeight,!1);Zn.outputColorSpace=Te;Zn.toneMapping=Wl;Zn.toneMappingExposure=1.02;const ke=new Hm;ke.background=new At(460302);ke.fog=new Qa(460302,.018);const Jn=new Ie(42,window.innerWidth/window.innerHeight,.1,160);Jn.position.set(0,24,20);const bn={rig:new Sg(Jn),pulse:0,syzygy:0};ke.add(new hg(2761792,.7));const Cg=new rg(6975648,1708056,.55);ke.add(Cg);const Pc=new cg(16770752,.55);Pc.position.set(8,18,6);ke.add(Pc);const Ji={uTime:{value:0},uPulse:{value:0},uSyzygy:{value:0},uPlayer:{value:new nt}},Lc=new ue(new oo(18.4,80),new mn({uniforms:Ji,toneMapped:!1,vertexShader:`
      varying vec3 vPos;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,fragmentShader:`
      uniform float uTime, uPulse, uSyzygy;
      uniform vec2 uPlayer;
      varying vec3 vPos;
      void main() {
        float r = length(vPos.xz);
        float a = atan(vPos.z, vPos.x);
        float ring = abs(fract(r * 0.22 - uTime * 0.03) - 0.5);
        float lines = smoothstep(0.04, 0.012, ring);
        float spokes = abs(sin(a * 8.0));
        float spoke = pow(max(0.0, 1.0 - spokes), 18.0) * smoothstep(16.0, 2.5, r);
        float glow = exp(-r * 0.22) * (0.045 + uPulse * 0.22 + uSyzygy * 0.16);
        float rim = smoothstep(17.8, 17.0, r) * smoothstep(18.4, 17.6, r);
        vec3 gold = vec3(0.86, 0.64, 0.30);
        vec3 ice = vec3(0.50, 0.84, 1.0);
        vec3 ink = vec3(0.02, 0.016, 0.038);
        vec3 accent = mix(gold, ice, uSyzygy * 0.7);
        vec3 col = ink + accent * (lines * 0.55 + spoke * 0.1 + glow + rim * 0.95);
        float d = length(vPos.xz - uPlayer);
        col += vec3(1.0, 0.94, 0.75) * exp(-d * 1.7) * 0.2;
        float fade = smoothstep(18.5, 17.4, r);
        gl_FragColor = vec4(col * fade, 1.0);
      }
    `}));Lc.rotation.x=-Math.PI/2;ke.add(Lc);const Pg=new Ei({color:14725200,transparent:!0,opacity:.22,blending:dn,depthWrite:!1});[6.2,10.4,16.2].forEach((s,t)=>{const e=new ue(new Pi(s,.018+t*.004,8,96),Pg.clone());e.rotation.x=Math.PI/2,e.position.y=.03,ke.add(e)});const po=1400,Ys=new Float32Array(po*3),$s=new Float32Array(po*3);for(let s=0;s<po;s++){const t=30+Math.random()*70,e=Math.random()*Math.PI*2,n=Math.acos(2*Math.random()-1);Ys[s*3]=t*Math.sin(n)*Math.cos(e),Ys[s*3+1]=t*Math.cos(n)*.6+8,Ys[s*3+2]=t*Math.sin(n)*Math.sin(e);const i=new At().setHSL(.08+Math.random()*.12,.25,.6+Math.random()*.4);$s[s*3]=i.r,$s[s*3+1]=i.g,$s[s*3+2]=i.b}const mo=new le;mo.setAttribute("position",new ge(Ys,3));mo.setAttribute("color",new ge($s,3));const Dc=new Sc(mo,new no({size:.22,vertexColors:!0,transparent:!0,opacity:.85,depthWrite:!1,map:tr("#ffffff",32)}));ke.add(Dc);const Lg=xg();for(let s=0;s<4;s++){const t=new to({map:Lg,transparent:!0,blending:dn,depthWrite:!1,opacity:.22,color:new At().setHSL(.72+s*.06,.45,.5)}),e=new Mc(t);e.position.set((s-1.5)*14,4+s%2*3,-18-s*4),e.scale.set(28,18,1),ke.add(e)}const Ic=new Mg(ke,520),Yn=new dg,Se=new bg,qt=new Ag({scene:ke,fx:Ic,audio:Yn,ui:Se,canvas:Cc,camera:Jn,world:bn});window.__syzygy=qt;let we=vg();qt.setMeta(we);qt.startDemo();Se.setTitle(we);const ze=new Set,fe={x:0,z:0,aimx:1,aimz:0,dash:!1,fling:!1,pulse:!1,attract:!1,reverse:!1,selDelta:0},Ga=new nt,kl=new fg,Dg=new Tn(new w(0,1,0),0),Kr=new w;function Ig(){window.addEventListener("keydown",s=>{["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(s.code)&&s.preventDefault(),ze.add(s.code),Yn.resume(),s.code==="Escape"&&Ug(),s.code==="KeyR"&&(fe.reverse=!0),s.code==="Space"&&(fe.dash=!0),s.code==="KeyF"&&(fe.pulse=!0)}),window.addEventListener("keyup",s=>ze.delete(s.code)),window.addEventListener("pointerdown",s=>{Yn.resume(),s.button===0&&(fe.fling=!0),s.button===2&&(fe.pulse=!0)}),window.addEventListener("pointermove",s=>{Ga.x=s.clientX/window.innerWidth*2-1,Ga.y=-(s.clientY/window.innerHeight)*2+1}),window.addEventListener("contextmenu",s=>s.preventDefault()),window.addEventListener("wheel",s=>{fe.selDelta+=s.deltaY>0?1:-1},{passive:!0}),document.getElementById("btn-embark").onclick=Hl,document.getElementById("btn-how").onclick=()=>Se.showHow(!0),document.getElementById("how-close").onclick=()=>{Se.showHow(!1),we.seenHow=!0,fo(we)},document.getElementById("btn-reliquary").onclick=Uc,document.getElementById("btn-resume").onclick=()=>{qt.mode==="pause"&&(qt.mode="play",Se.showPause(!1))},document.getElementById("btn-abandon").onclick=()=>{qt.mode="title",Se.showPause(!1),qt.startDemo(),Se.setTitle(we)},document.getElementById("btn-again").onclick=Hl,document.getElementById("btn-menu").onclick=()=>{qt.mode="title",qt.startDemo(),Se.setTitle(we)},document.getElementById("vol").addEventListener("input",s=>{Yn.setVolume(Number(s.target.value)/100)})}function Hl(){Yn.resume(),qt.setMeta(we),qt.startRun(),we.seenHow||Se.hint("Line two relics through your core, then pulse or fling")}function Uc(){Se.showReliquary(we,s=>{we.unlocks[s.id]||we.ash<s.cost||(we.ash-=s.cost,we.unlocks[s.id]=!0,fo(we),Yn.relic(),Uc())},()=>{Se.show(Se.els.reliquary,!1),Se.setTitle(we)})}function Ug(){qt.mode==="play"?(qt.mode="pause",Se.showPause(!0)):qt.mode==="pause"&&(qt.mode="play",Se.showPause(!1))}function Ng(){let s=0,t=0;if((ze.has("KeyA")||ze.has("ArrowLeft"))&&(s-=1),(ze.has("KeyD")||ze.has("ArrowRight"))&&(s+=1),(ze.has("KeyW")||ze.has("ArrowUp"))&&(t-=1),(ze.has("KeyS")||ze.has("ArrowDown"))&&(t+=1),fe.x=s,fe.z=t,fe.attract=ze.has("ShiftLeft")||ze.has("ShiftRight"),kl.setFromCamera(Ga,Jn),kl.ray.intersectPlane(Dg,Kr)){const e=Kr.x-qt.player.x,n=Kr.z-qt.player.z,i=Math.hypot(e,n);i>.05&&(fe.aimx=e/i,fe.aimz=n/i)}else if(s||t){const e=Math.hypot(s,t);fe.aimx=s/e,fe.aimz=t/e}}function Nc(){const s=window.innerWidth,t=window.innerHeight;Zn.setSize(s,t,!1),Jn.aspect=s/t,Jn.updateProjectionMatrix()}window.addEventListener("resize",Nc);const Fg=new ug;let Jr=0;function Fc(){const s=Math.min(.033,Fg.getDelta());Ng(),qt.update(s,fe),fe.dash=!1,fe.fling=!1,fe.pulse=!1,fe.reverse=!1,fe.selDelta=0,bn.pulse=Math.max(0,bn.pulse-s*1.8),bn.syzygy=Math.max(0,bn.syzygy-s*1.4),Ji.uTime.value+=s,Ji.uPulse.value=bn.pulse,Ji.uSyzygy.value=bn.syzygy,Ji.uPlayer.value.set(qt.player.x,qt.player.z),Dc.rotation.y+=s*.012,Ic.update(s),bn.rig.update(s,qt.player,qt.mode!=="title"),Yn.setTension(qt.mode==="play"?Math.min(1,qt.enemies.length/10+qt.floor*.2):.15),Jr+=s,Jr>.08&&(qt.mode==="play"||qt.mode==="cards"||qt.mode==="altar"||qt.mode==="pause")&&(Se.renderRun(qt),Jr=0),Zn.render(ke,Jn),requestAnimationFrame(Fc)}Ig();Nc();requestAnimationFrame(Fc);
