(window.webpackJsonpsnakey3=window.webpackJsonpsnakey3||[]).push([[0],[,,,,,,,function(e,t,r){"use strict";r.d(t,"b",(function(){return l.a})),r.d(t,"a",(function(){return u}));var s,i=r(2),n=r(9),a=r(1),o=r(15),h=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},c=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class d extends a.b{constructor(e,t){if(super(),s.set(this,void 0),Math.trunc(t.playerId)!==t.playerId)throw new RangeError("Player ID's must be integer values.");this.playerId=t.playerId,this.isALocalOperator=t.isALocalOperator,this.game=e,this.status=new this.game._playerStatusCtor(this,t.noCheckGameOver),this.tile=new o.a(new d.TileGetterSource(this))}_afterAllPlayersConstruction(){this.status._afterAllPlayersConstruction()}reset(e){h(this,s,e),this.hostTile._setOccupant(this.playerId,this.status.immigrantInfo)}get coord(){return this.hostTile.coord}get hostTile(){return c(this,s)}moveTo(e){if(this.hostTile.occupantId!==this.playerId){if(this.game.gameType!==i.a.Type.ONLINE)throw new Error("Linkage between player and occupied tile disagrees.")}else this.hostTile.evictOccupant();if(e.isOccupied){if(this.game.gameType!==i.a.Type.ONLINE)throw new Error("Only one player can occupy a tile at a time.")}else h(this,s,e),e._setOccupant(this.playerId,this.status.immigrantInfo)}}s=new WeakMap,function(e){var t,r;class s{constructor(e){t.set(this,void 0),r.set(this,void 0),h(this,t,e),h(this,r,e.game.grid.tile._source)}_getTileAt(){return c(this,r)._getTileAt(c(this,t).coord)}_getTileDestsFrom(){return c(this,r)._getTileDestsFrom(c(this,t).coord)}_getTileSourcesTo(){return c(this,r)._getTileSourcesTo(c(this,t).coord)}}t=new WeakMap,r=new WeakMap,e.TileGetterSource=s,Object.freeze(s),Object.freeze(s.prototype)}(d||(d={})),Object.freeze(d),Object.freeze(d.prototype);r(10);var l=r(11);class u extends d{constructor(e,t){if(super(e,t),!u.Username.REGEXP.test(t.username))throw new RangeError(`Username "${t.username}" does not match the required regular expression, "${u.Username.REGEXP.source}".`);this.familyId=t.familyId,this.teamId=t.teamId,this.username=t.username}reset(e){super.reset(e),this.status.reset(),this.lastAcceptedRequestId=n.a.INITIAL_REQUEST_ID,this.requestInFlight=!1}_notifyGameNowPlaying(){}_notifyGameNowPaused(){}_notifyGameNowOver(){}makeMovementRequest(e,t){if(this.game.status!==i.a.Status.PLAYING)throw new Error("This is not a necessary precondition, but we're doing it anyway.");if(this.requestInFlight)throw new Error("Only one request should ever be in flight at a time.");this.requestInFlight=!0,this.game.processMoveRequest(new n.a.Movement(this.playerId,this.lastAcceptedRequestId,e,t))}get team(){return this.game.teams[this.teamId]}isTeamedWith(e){return this.team.members.includes(e)}}!function(e){let t,r;!function(e){e.REGEXP=/[a-zA-Z](?:[ ]?[a-zA-Z0-9:-]+?){4,}/}(t=e.Username||(e.Username={})),function(e){e.finalize=e=>{const t=Array.from(new Set(e.map(e=>e.teamId))).sort((e,t)=>e-t).reduce((e,t,r)=>(e[t]=r,e),[]);return e.slice().sort((e,r)=>t[e.teamId]-t[r.teamId]).map((e,r)=>Object.assign(e,{playerId:r,teamId:t[e.teamId]}))}}(r=e.CtorArgs||(e.CtorArgs={})),Object.freeze(r)}(u||(u={})),Object.freeze(u),Object.freeze(u.prototype)},function(e,t,r){"use strict";r.d(t,"a",(function(){return h}));var s,i=r(1),n=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},a=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};!function(e){var t,r;class s{constructor(){this.children=[]}reset(){this.inheritingWeightedHitCount=0,this.children.forEach(e=>e.reset())}_finalize(){Object.freeze(this.children),this.children.forEach(e=>e._finalize())}_addCharMapping(e,t){if(!i.a.Seq.REGEXP.test(e))throw new RangeError(`Mapping-sequence "${e}" did not match the required regular expression "${i.a.Seq.REGEXP.source}".`);if(0===t.length)throw new Error("never");let r=this;{let t=this;for(;t;)r=t,t=t.children.find(t=>e.startsWith(t.sequence))}if(r.sequence===e)throw new Error(`Mappings for all written-characters with a commoncorresponding typeable-sequence should be registered together,but an existing mapping for the sequence "${e}" was found.`);r.children.push(new h(r,e,t))}getLeafNodes(){const e=[];return this._recursiveGetLeafNodes(e),e}_recursiveGetLeafNodes(e){this.children.length?this.children.forEach(t=>{t._recursiveGetLeafNodes(e)}):e.push(this)}simpleView(){return this.children}static CREATE_TREE_MAP(e,t){const r=Object.values(e).reduce((e,t)=>e+t.weight,0),i=0===t?e=>1:1===t?e=>e:e=>Math.pow(e/r,t),n=new Map;for(const t in e){const r=e[t].seq,s=new o(t,i(e[t].weight)),a=n.get(r);a?a.push(s):n.set(r,[s])}const a=new s;return Array.from(n).sort((e,t)=>e[0].length-t[0].length).forEach(e=>{a._addCharMapping(...e)}),a._finalize(),a}}s.LEAF_CMP=(e,t)=>e.inheritingWeightedHitCount-t.inheritingWeightedHitCount,e.ParentNode=s,Object.freeze(s),Object.freeze(s.prototype);class h extends s{constructor(e,s,i){super(),t.set(this,void 0),r.set(this,void 0),this.sequence=s,n(this,r,i),n(this,t,e)}_finalize(){Object.freeze(a(this,r)),super._finalize()}reset(){super.reset(),a(this,r).forEach(e=>{e.reset(),this.incrementNumHits(e,Math.random()*i.a.CHAR_HIT_COUNT_SEED_CEILING)})}chooseOnePair(){const e=a(this,r).slice(0).sort(o.CMP).shift(),t={char:e.char,seq:this.sequence};return this.incrementNumHits(e),t}incrementNumHits(e,t=1){e._incrementNumHits(),this._recursiveIncrementNumHits(e.weightInv*t)}_recursiveIncrementNumHits(e){this.inheritingWeightedHitCount+=e,this.children.forEach(t=>t._recursiveIncrementNumHits(e))}get personalWeightedHitCount(){return this.inheritingWeightedHitCount-a(this,t).inheritingWeightedHitCount}andNonRootParents(){const e=[];for(let r=this;r instanceof h;r=a(r,t))e.push(r);return e}simpleView(){let e=a(this,r).map(e=>e.simpleView());return Object.assign(Object.create(null),{seq:this.sequence,chars:1===e.length?e[0]:e,kids:this.children.map(e=>e.simpleView())})}}t=new WeakMap,r=new WeakMap,h.PATH_CMP=(e,t)=>e.personalWeightedHitCount-t.personalWeightedHitCount,e.ChildNode=h,Object.freeze(h),Object.freeze(h.prototype)}(s||(s={})),Object.freeze(s);class o{constructor(e,t){if(t<=0)throw new RangeError(`All weights must be positive, but we were passed the value "${t}" for the character "${e}".`);this.char=e,this.weightInv=1/t}reset(){this.hitCount=0,this.weightedHitCount=0}_incrementNumHits(){this.hitCount+=1,this.weightedHitCount+=this.weightInv}simpleView(){return Object.assign(Object.create(null),{char:this.char,hits:this.hitCount})}}o.CMP=(e,t)=>e.weightedHitCount-t.weightedHitCount,Object.freeze(o),Object.freeze(o.prototype);class h extends i.a{constructor(e,t,r){if(super(),this.frontendDesc=h.GET_FRONTEND_DESC_BY_ID(e),this.treeMap=s.ParentNode.CREATE_TREE_MAP(t,r),this.leafNodes=this.treeMap.getLeafNodes(),this.leafNodes.length!==this.frontendDesc.numLeaves)throw new Error(`maintenance required: the frontend constant for the language "${this.frontendDesc.id}" needs to be updated to the correct, computed value, which is \`${this.leafNodes.length}\`.`)}get numLeaves(){return this.leafNodes.length}reset(){this.treeMap.reset()}getNonConflictingChar(e){this.leafNodes.sort(s.ParentNode.LEAF_CMP);let t=void 0;for(const r of this.leafNodes){const s=r.andNonRootParents();for(let t=0;t<s.length;t++){const r=e.find(e=>e.startsWith(s[t].sequence));if(r){r===s[t].sequence?s.length=0:s.splice(t);break}}if(s.length){t=s[0];for(const e of s)e.personalWeightedHitCount<t.personalWeightedHitCount&&(t=e);break}}if(!t)throw new Error("Invariants guaranteeing that a LangSeq canalways be shuffled-in were not met.");return t.chooseOnePair()}simpleView(){return Object.assign(Object.create(null),{id:this.frontendDesc.id,displayName:this.frontendDesc.displayName,root:this.treeMap.simpleView(),numLeaves:this.leafNodes.length})}}h||(h={}),Object.freeze(h),Object.freeze(h.prototype)},function(e,t,r){"use strict";r.d(t,"a",(function(){return s}));var s,i=r(14);!function(e){e.INITIAL_REQUEST_ID=-1,e.EVENT_NAME=Object.freeze({Bubble:"player-bubble",Movement:"player-movement"});class t{constructor(e,t){this.eventId=i.a.EVENT_ID_REJECT,this.affectedNeighbours=void 0,this.playerId=e,this.playerLastAcceptedRequestId=t}}e.Bubble=t;e.Movement=class extends t{constructor(e,t,r,s){super(e,t),this.newPlayerHealth=void 0,this.tileHealthModDescs=void 0,this.destModDesc={coord:r.coord,lastKnownUpdateId:r.lastKnownUpdateId,newCharSeqPair:void 0,newFreeHealth:void 0},this.moveType=s}}}(s||(s={})),Object.freeze(s)},function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var s,i=r(11),n=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)},a=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r};class o{constructor(e,t){s.set(this,void 0),this.player=e,this.noCheckGameOver=t}reset(){this.health=0}_afterAllPlayersConstruction(){}get immigrantInfo(){}get health(){return n(this,s)}set health(e){const t=this.isDowned;if(a(this,s,e),t||!this.isDowned||this.noCheckGameOver)return;const r=this.player.team,n=this.player.game.teams;if(r.elimOrder===i.a.ElimOrder.STANDING&&r.members.every(e=>e.status.noCheckGameOver||e.status.isDowned)){const e=1+n.filter(e=>e.elimOrder!==i.a.ElimOrder.STANDING).length;r.elimOrder=1+n.filter(e=>e.elimOrder!==i.a.ElimOrder.STANDING&&e.elimOrder!==i.a.ElimOrder.IMMORTAL).length,e===n.length&&this.player.game.statusBecomeOver()}}get isDowned(){return this.health<0}}s=new WeakMap,Object.freeze(o),Object.freeze(o.prototype)},function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var s,i=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},n=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class a{constructor(e,t){if(s.set(this,void 0),0===t.length)throw new Error("teams must have at least one member.");this.id=e,this.members=t,i(this,s,this.members.every(e=>e.status.noCheckGameOver)?a.ElimOrder.IMMORTAL:a.ElimOrder.STANDING)}reset(){this.elimOrder!==a.ElimOrder.IMMORTAL&&(this.elimOrder=a.ElimOrder.STANDING)}get elimOrder(){return n(this,s)}set elimOrder(e){if(this.elimOrder===a.ElimOrder.IMMORTAL)throw new Error("Cannot change the elimination status of an immortal team.");i(this,s,e)}}s=new WeakMap,function(e){let t;!function(e){e.IMMORTAL=-1,e.STANDING=0}(t=e.ElimOrder||(e.ElimOrder={}))}(a||(a={})),Object.freeze(a),Object.freeze(a.prototype)},function(e,t,r){"use strict";r.d(t,"a",(function(){return n}));var s=r(2),i=r(7);r.d(t,"b",(function(){return i.a}));class n extends i.a{constructor(e,t){if(super(e,t),e.gameType===s.a.Type.ONLINE)throw new TypeError("OnlineGames should be using regular Players instead.")}_notifyGameNowPlaying(){this.delayedMovementContinue()}_notifyGameNowPaused(){this.game.cancelTimeout(this._scheduledMovementCallbackId),this._scheduledMovementCallbackId=void 0}_notifyGameNowOver(){this.game.cancelTimeout(this._scheduledMovementCallbackId),this._scheduledMovementCallbackId=void 0}movementContinue(){const e=this.computeDesiredDest();this._nextMovementTimerMultiplier=this.game.grid.tile.at(e).langSeq.length,this.makeMovementRequest(this.game.grid.getUntToward(e,this.coord),this.getNextMoveType()),this.delayedMovementContinue()}delayedMovementContinue(){this._scheduledMovementCallbackId=this.game.setTimeout(this.movementContinue.bind(this),this.computeNextMovementTimer()*this._nextMovementTimerMultiplier)}}!function(e){e.of=(t,r)=>{const s=r.familyId;return new e._Constructors[s](t,r)}}(n||(n={}))},function(e,t,r){},function(e,t,r){"use strict";var s;r.d(t,"a",(function(){return s})),function(e){e.EVENT_ID_REJECT=-1}(s||(s={})),Object.freeze(s)},function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var s,i=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},n=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class a{constructor(e){s.set(this,void 0),i(this,s,e),Object.freeze(this)}get _source(){return n(this,s)}at(...e){return n(this,s)._getTileAt(...e)}destsFrom(...e){return new o(n(this,s)._getTileDestsFrom(...e))}sourcesTo(...e){return new o(n(this,s)._getTileSourcesTo(...e))}}s=new WeakMap,Object.freeze(a),Object.freeze(a.prototype);class o{constructor(e){this.contents=e}get occupied(){return this.contents=this.contents.filter(e=>e.isOccupied),this}get unoccupied(){return this.contents=this.contents.filter(e=>!e.isOccupied),this}get get(){return this.contents}}Object.freeze(o),Object.freeze(o.prototype)},function(e,t,r){"use strict";r.d(t,"b",(function(){return n.a})),r.d(t,"e",(function(){return d})),r.d(t,"c",(function(){return f.a})),r.d(t,"f",(function(){return v.d})),r.d(t,"d",(function(){return _})),r.d(t,"a",(function(){return L}));var s,i,n=r(2),a=r(0),o=r(3),h=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},c=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class d extends o.b{constructor(e){super(e),s.set(this,void 0);{const e=h(this,s,document.createElement("div"));e.setAttribute("aria-label","Tile"),e.classList.add(a.a.General.Class.CENTER_CONTENTS,a.a.General.Class.STACK_CONTENTS,a.a.Tile.Class.BASE)}{const e=document.createElement("div");e.setAttribute("aria-hidden","true"),e.classList.add(a.a.Tile.Class.POINTER_HB),c(this,s).appendChild(e)}{const e=document.createElement("div");e.setAttribute("role","presentation"),e.classList.add(a.a.Tile.Class.LANG_CHAR_WRAP);const t=this.langCharElem=document.createElement("div");e.appendChild(t),c(this,s).appendChild(e)}{const e=this.langSeqElem=document.createElement("div");e.setAttribute("role","tooltip"),e.classList.add(a.a.Tile.Class.LANG_SEQ),c(this,s).appendChild(e)}}_addToDom(e){e.appendChild(c(this,s))}_setOccupant(e,t){super._setOccupant(e,t),this.langCharElem.parentElement.insertAdjacentElement("beforebegin",t.playerElem),this.langSeqElem.textContent=t.username}evictOccupant(){super.evictOccupant(),this.langSeqElem.textContent=this.langSeq}set freeHealth(e){super.freeHealth=e,this.freeHealth>0?c(this,s).dataset[a.a.Tile.Dataset.HEALTH]=this.freeHealth.toString():delete c(this,s).dataset[a.a.Tile.Dataset.HEALTH]}get freeHealth(){return super.freeHealth}setLangCharSeqPair(e){super.setLangCharSeqPair(e),this.langCharElem.textContent=this.langChar,this.langSeqElem.textContent=this.langSeq}}s=new WeakMap,Object.freeze(d),Object.freeze(d.prototype),function(e){e.getImplementation=t=>e._Constructors[t]}(i||(i={}));class l{_superVisibleGrid(e,t){const r=a.a.Grid;t.setAttribute("role","presentation"),t.classList.add(r.Class.IMPL_BODY),t.dataset[r.Dataset.IMPL_COORD_SYS]=e.coordSys,this.baseElem=t;const s=document.createElement("div");s.classList.add(a.a.Player.Class.SHORT_SPOTLIGHT);const i=document.createElement("div");i.classList.add(a.a.Player.Class.LONG_SPOTLIGHT),this.spotlightElems=Object.freeze([s,i])}}Object.freeze(l),Object.freeze(l.prototype);var u,m,f=r(7),p=r(8),g=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},E=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class y extends f.a{constructor(e,t){super(e,t),u.set(this,void 0),m.set(this,void 0),g(this,m,this.game.langFrontend.remapFunc)}reset(e){super.reset(e),this.prevCoord=e.coord,g(this,u,"")}processKeyboardInput(e){this.game.status===n.a.Status.PLAYING&&(this.requestInFlight||(" "===e.key?this.coord.equals(this.prevCoord)||this.makeMovementRequest(this.game.grid.getUntAwayFrom(this.prevCoord,this.coord),f.a.MoveType.BOOST):1!==e.key.length||e.repeat||this.seqBufferAcceptKey(e.key)))}seqBufferAcceptKey(e){const t=this.tile.destsFrom().unoccupied.get;if(0!==t.length)if(e){if(e=E(this,m).call(this,e),p.a.Seq.REGEXP.test(e)){for(let r=this.seqBuffer+e;r.length;r=r.substring(1)){const e=t.find(e=>e.langSeq.startsWith(r));if(e)return g(this,u,r),void(e.langSeq===r&&this.makeMovementRequest(e,f.a.MoveType.NORMAL))}g(this,u,""),this.status.visualBell()}}else{t.find(e=>e.langSeq.startsWith(this.seqBuffer))||g(this,u,"")}}moveTo(e){g(this,u,""),this.prevCoord=this.coord,super.moveTo(e)}_notifyWillBecomeCurrent(){this.status._notifyWillBecomeCurrent(this.game.grid.spotlightElems)}get seqBuffer(){return E(this,u)}}u=new WeakMap,m=new WeakMap,Object.freeze(y),Object.freeze(y.prototype);var w,b,v=r(1),O=r(10),T=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},C=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class _ extends O.a{constructor(e,t){super(e,t),w.set(this,void 0),b.set(this,void 0);T(this,w,document.createElement("div")).classList.add(a.a.General.Class.CENTER_CONTENTS,a.a.General.Class.STACK_CONTENTS,a.a.Player.Class.BASE);{const e=document.createElement("div");e.classList.add(a.a.Player.Class.FACE),T(this,b,this.player.isALocalOperator?[e.animate({filter:["brightness(0.7)","brightness(1.0)"]},{duration:300,easing:"ease-in",delay:1}),e.animate({transform:_.makeWiggleAnimation(10,2)},{duration:270,easing:"ease-out",delay:1})]:[]).forEach(e=>e.pause());{const t=document.createElement("div");t.classList.add(a.a.Player.Class.DOWNED_OVERLAY),e.appendChild(t)}C(this,w).appendChild(e)}}_afterAllPlayersConstruction(){this._immigrantInfoCache=Object.freeze({playerElem:C(this,w),username:this.player.username})}reset(){super.reset();const e=a.a.Player.Dataset.DOWNED;C(this,w).dataset[e.KEY]=e.VALUES.NO}get immigrantInfo(){return this._immigrantInfoCache}_notifyWillBecomeCurrent(e){const t=this.player.game.currentOperator,r=this.player;requestAnimationFrame(r=>{e.forEach(e=>{C(this,w).appendChild(e)}),null==t||t.status.immigrantInfo.playerElem.scrollIntoView(v.c)}),r.teamId!==(null==t?void 0:t.teamId)&&r.game.players.forEach(e=>{const t=e.teamId===r.teamId;C(e.status,w).dataset[a.a.Player.Dataset.FACE_SWATCH]=e.isALocalOperator?t?"me":"meOppo":t?"teammate":"opponent"})}visualBell(){C(this,b),window.requestAnimationFrame(e=>{C(this,b).forEach(e=>e.play())})}get health(){return super.health}set health(e){const t=this.isDowned;if(super.health=e,t!==this.isDowned){const e=a.a.Player.Dataset.DOWNED;C(this,w).dataset[e.KEY]=this.isDowned?this.player.team.elimOrder?e.VALUES.TEAM:e.VALUES.SELF:e.VALUES.NO}}}w=new WeakMap,b=new WeakMap,function(e){var t,r,s;e.makeWiggleAnimation=function(e,t){const r=Array(2*t).fill(e);return r.unshift(0),r.push(0),r.map((e,t)=>`translate(${t%2?e:-e}%)`)};t=new WeakMap,r=new WeakMap,s=new WeakMap,e.Card=class{constructor(e){t.set(this,void 0),r.set(this,void 0),s.set(this,void 0),this.baseElem=document.createElement("div"),this.baseElem.setAttribute("label","Player"),T(this,t,document.createElement("div"));const i=C(this,t);i.textContent=e,this.baseElem.appendChild(i)}}}(_||(_={})),Object.freeze(_),Object.freeze(_.prototype);var I,M,A,N=r(15);class S{constructor(e){this.static=e.gridClass,this.dimensions=e.dimensions,this.tile=new N.a(this)}get area(){return this.static.getArea(this.dimensions)}reset(){this.forEachTile(e=>e.reset())}getRandomCoord(){return this.static.getRandomCoord(this.dimensions)}}(I=S||(S={})).getImplementation=e=>I._Constructors[e],function(e){class t extends o.a.Abstract.Mathy{constructor(e){super(e),this.x=e.x,this.y=e.y,Object.freeze(this)}equals(e){return this.x===e.x&&this.y===e.y}round(){return new t({x:Math.round(this.x),y:Math.round(this.y)})}oneNorm(e){return this.sub(e).originOneNorm()}originOneNorm(){return Math.abs(this.x)+Math.abs(this.y)}infNorm(e){return this.sub(e).originInfNorm()}originInfNorm(){return Math.max(Math.abs(this.x),Math.abs(this.y))}axialAlignment(e){return this.sub(e).originAxialAlignment()}originAxialAlignment(){return Math.abs(Math.abs(this.x)-Math.abs(this.y))/(Math.abs(this.x)+Math.abs(this.y))}add(e){return new t({x:this.x+e.x,y:this.y+e.y})}sub(e){return new t({x:this.x-e.x,y:this.y-e.y})}mul(e){return new t({x:e*this.x,y:e*this.y})}}e.Coord=t,Object.freeze(t),Object.freeze(t.prototype);class r extends S{constructor(e){super(e);const r=[];for(let s=0;s<this.dimensions.height;s++){const i=[];for(let r=0;r<this.dimensions.width;r++){const n=new e.tileClass(new t({x:r,y:s}));i.push(n)}r.push(Object.freeze(i))}this.grid=Object.freeze(r)}static getAmbiguityThreshold(){return 24}static getSizeLimits(){return this.SIZE_LIMITS}forEachTile(e){for(const t of this.grid)for(const r of t)e(r)}shuffledForEachTile(e){this.grid.flat().sort((e,t)=>Math.random()-.5).forEach(t=>e(t))}getUntToward(e,t){const r=this.tile.destsFrom(t).unoccupied.get;if(0===r.length)return this.tile.at(t);if(1===r.length)return r[0];r.sort((t,r)=>t.coord.oneNorm(e)-r.coord.oneNorm(e)).sort((t,r)=>t.coord.infNorm(e)-r.coord.infNorm(e));for(let t=1;t<r.length;t++)if(r[t].coord.infNorm(e)>r[0].coord.infNorm(e)){r.splice(t);break}if(1===r.length)return r[0];if(r[0].coord.x-t.x==0||r[0].coord.y-t.y==0){if(t.axialAlignment(t.sub(e))-.5>0)return r[0];r.shift()}return r[Math.floor(r.length*Math.random())]}getUntAwayFrom(e,t){return this.getUntToward(t.add(t.sub(e)),t)}getRandomCoordAround(e,r){return new t({x:e.x+Math.trunc(2*r*(Math.random()-.5)),y:e.y+Math.trunc(2*r*(Math.random()-.5))})}_getTileAt(e){if(e.x<0||e.x>=this.dimensions.width||e.y<0||e.y>=this.dimensions.height)throw new RangeError("Out of bounds. No such tile exists.");return this.grid[e.y][e.x]}_getTileDestsFrom(e,t=1){let r=e.y-t,s=e.y+t+1,i=e.x-t,n=e.x+t+1;return r>=this.dimensions.height||s<0||i>=this.dimensions.width||n<0?[]:this.grid.slice(Math.max(0,r),Math.min(this.dimensions.height,s)).flatMap(e=>e.slice(Math.max(0,i),Math.min(this.dimensions.width,n)))}_getTileSourcesTo(e,t=1){return this._getTileDestsFrom(e,t)}minMovesFromTo(e,t){return Math.min(Math.abs(t.x-e.x),Math.abs(t.y-e.y))}static getSpawnCoords(e,t){const s=[];return e.map(e=>{const i=[];for(;e>0;){let n;do{n=r.getRandomCoord(t)}while(s.find(e=>n.equals(e)));i.push(n),s.push(n),e--}return i})}static getArea(e){return e.height*e.width}static getRandomCoord(e){const r=Math.floor(e.width*Math.random()),s=Math.floor(e.height*Math.random());return new t({x:r,y:s})}}r.SIZE_LIMITS=Object.freeze({height:Object.freeze({min:11,max:51}),width:Object.freeze({min:11,max:51})}),e.Grid=r,function(e){class t extends e{constructor(e){super(e);const t=document.createElement("div");t.style.setProperty("--euclid2-grid-width",this.dimensions.width.toString());for(const e of this.grid)for(const r of e)r._addToDom(t);this._superVisibleGrid(e,t)}}e.Visible=t,Object(v.d)(t,[l]),Object.freeze(t),Object.freeze(t.prototype)}(r=e.Grid||(e.Grid={})),Object.freeze(r),Object.freeze(r.prototype)}(M||(M={})),Object.freeze(M),function(e){class t extends o.a.Abstract.Mathy{constructor(e){super(e),this.dash=e.dash,this.bash=e.bash,Object.freeze(this)}equals(e){return this.dash===e.dash&&this.bash===e.bash}round(){const e=Math.floor(this.dash),r=Math.floor(this.bash),s=e-this.dash,i=r-this.bash;return s>2*i?new t({dash:e+1,bash:r}):s<.5*i?new t({dash:e,bash:r+1}):Math.min(s,i)>.5?new t({dash:e+1,bash:r+1}):new t({dash:e,bash:r})}add(e){return new t({dash:this.dash+e.dash,bash:this.bash+e.bash})}sub(e){return new t({dash:this.dash-e.dash,bash:this.bash-e.bash})}mul(e){return new t({dash:e*this.dash,bash:e*this.bash})}}e.Coord=t,Object.freeze(t),Object.freeze(t.prototype);class r extends S{constructor(e){super(e);this.grid=Object.freeze(void 0)}static getAmbiguityThreshold(){return 18}static getSizeLimits(){return this.SIZE_LIMITS}forEachTile(e){for(const t of this.grid)for(const r of t)e(r)}shuffledForEachTile(e){this.grid.flat().sort((e,t)=>Math.random()-.5).forEach(t=>e(t))}getUntToward(e,t){}getUntAwayFrom(e,t){return this.getUntToward(t.add(t.sub(e)),t)}getRandomCoordAround(e,t){}_getTileAt(e){}_getTileDestsFrom(e){}_getTileSourcesTo(e){}minMovesFromTo(e,t){}static getSpawnCoords(e,t){}static getArea(e){const t=Math.min(e.fslash,e.bslash),r=Math.max(e.fslash,e.bslash),s=-1+e.dash+t;let i=2*t*(e.dash+s);return i+=(r-t-1)*s,i}static getRandomCoord(e){return new t(void 0)}}r.SIZE_LIMITS=Object.freeze({dash:Object.freeze({min:10,max:50}),bslash:Object.freeze({min:10,max:50}),fslash:Object.freeze({min:10,max:50})}),e.Grid=r,function(e){class t extends e{constructor(e){super(e);this._superVisibleGrid(e,void 0)}}e.Visible=t,Object(v.d)(t,[l]),Object.freeze(t),Object.freeze(t.prototype)}(r=e.Grid||(e.Grid={})),Object.freeze(r),Object.freeze(r.prototype)}(A||(A={})),Object.freeze(A);var P,j,z=r(12),R=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},D=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class x extends z.a{constructor(e,t){super(e,t),P.set(this,void 0),this.behaviour=Object.freeze(Object.assign(Object.create(null),x.Behaviour.DEFAULT,t.familyArgs)),this.grid=this.game.grid}_afterAllPlayersConstruction(){super._afterAllPlayersConstruction(),this.threatProximity=this.game.teams.filter(e=>e.id!==this.teamId).flatMap(e=>e.members),this.targetProximity=this.threatProximity.slice()}reset(e){super.reset(e),R(this,P,this.coord)}moveTo(e){R(this,P,this.coord),super.moveTo(e)}computeDesiredDest(){this.threatProximity.sort((e,t)=>this.grid.minMovesFromTo(e.coord,this.coord)-this.grid.minMovesFromTo(t.coord,this.coord));for(const e of this.threatProximity){if(this.grid.minMovesFromTo(e.coord,this.coord)>this.behaviour.fearDistance)break;if(!e.status.isDowned&&e.status.health>this.status.health)return this.grid.getUntAwayFrom(e.coord,this.coord).coord}if(this.targetProximity.sort((e,t)=>this.grid.minMovesFromTo(this.coord,e.coord)-this.grid.minMovesFromTo(this.coord,t.coord)),this.status.isDowned)for(const e of this.targetProximity){if(this.grid.minMovesFromTo(this.coord,e.coord)>this.behaviour.bloodThirstDistance)break;if(e.status.health<this.status.health-this.behaviour.healthReserve)return e.coord}if(0===this.game.freeHealthTiles.size){if(Math.random()<this.behaviour.wanderingAimlessness)return this.grid.getRandomCoordAround(this.coord,3);{const e=this.grid.getUntAwayFrom.bind(this.grid,D(this,P));return this.grid.getRandomCoordAround(e(e(this.coord).coord).coord,1)}}let e=void 0,t=1/0;for(const r of this.game.freeHealthTiles){const s=this.grid.minMovesFromTo(this.coord,r.coord);s<t&&(e=r,t=s)}return e.coord}getNextMoveType(){return z.b.MoveType.NORMAL}computeNextMovementTimer(){return 1e3/this.behaviour.keyPressesPerSecond}}P=new WeakMap,function(e){let t;!function(e){e.DEFAULT=Object.freeze({fearDistance:5,bloodThirstDistance:7,healthReserve:3,keyPressesPerSecond:2,wanderingAimlessness:.2})}(t=e.Behaviour||(e.Behaviour={}))}(x||(x={})),Object.freeze(x),Object.freeze(x.prototype),function(e){function t(){S._Constructors=Object.freeze({EUCLID2:M.Grid,BEEHIVE:A.Grid}),Object.freeze(S),Object.freeze(S.prototype);{const e=i;e._Constructors=Object.freeze({EUCLID2:M.Grid.Visible,BEEHIVE:A.Grid.Visible}),Object.freeze(e)}{const e=z.a;e._Constructors=Object.freeze({CHASER:x}),Object.freeze(e),Object.freeze(e.prototype)}}e.INIT_CLASS_REGISTRIES=t,Object.freeze(t)}(j||(j={})),Object.freeze(j),j.INIT_CLASS_REGISTRIES();class L{_ctorBrowserGame(){this.htmlElements=Object.freeze({gridImpl:this.grid.baseElem,playersBar:document.createElement("div")})}_getGridImplementation(e){return i.getImplementation(e)}_createOperatorPlayer(e){return new y(this,e)}}Object.freeze(L),Object.freeze(L.prototype)},function(e,t,r){"use strict";r.d(t,"a",(function(){return g}));var s,i,n,a=r(2),o=r(14),h=(r(9),r(1)),c=r(7),d=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},l=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class u{constructor(e,t,r){s.set(this,void 0),i.set(this,void 0),n.set(this,void 0),this.gameType=e;const a=this._getGridImplementation(r.coordSys);this.grid=new a({gridClass:a,tileClass:t.tileClass,coordSys:r.coordSys,dimensions:r.gridDimensions}),d(this,s,t.onGameBecomeOver),this.langFrontend=h.a.GET_FRONTEND_DESC_BY_ID(r.langId),this._playerStatusCtor=t.playerStatusCtor,this.players=this.createPlayers(r),this.operators=Object.freeze(this.players.filter(e=>e.isALocalOperator)),this.setCurrentOperator(0);{const e=[];if(this.players.forEach(t=>{e[t.teamId]||(e[t.teamId]=[]),e[t.teamId].push(t)}),this.teams=e.map((e,t)=>new c.b(t,e)),this.teams.every(e=>e.id===c.b.ElimOrder.IMMORTAL))throw new Error("All teams are immortal. The game will never end.")}this.players.forEach(e=>e._afterAllPlayersConstruction())}reset(){return this.grid.reset(),d(this,n,a.a.Status.PAUSED),Promise.resolve()}createPlayers(e){const t=e.playerDescs=this.gameType===a.a.Type.ONLINE?e.playerDescs:c.a.CtorArgs.finalize(e.playerDescs);return Object.freeze(t.map(e=>e.familyId===c.a.Family.HUMAN?e.isALocalOperator?this._createOperatorPlayer(e):new c.a(this,e):this._createArtifPlayer(e)))}serializeResetState(){const e=[],t=this.players.map(e=>e.coord),r=[];return this.grid.forEachTile(t=>{e.push({char:t.langChar,seq:t.langSeq}),t.freeHealth&&r.push({coord:t.coord,health:t.freeHealth})}),{csps:e,playerCoords:t,healthCoords:r}}deserializeResetState(e){{let t=0;this.grid.forEachTile(r=>{r.setLangCharSeqPair(e.csps[t++]),r.lastKnownUpdateId=1})}e.playerCoords.forEach((e,t)=>{this.players[t].moveTo(this.grid.tile.at(e))}),e.healthCoords.forEach(e=>{this.grid.tile.at(e.coord).freeHealth=e.health})}get currentOperator(){return l(this,i)}setCurrentOperator(e){const t=this.operators[e];t&&this.currentOperator!==t&&(t._notifyWillBecomeCurrent(),d(this,i,t))}get status(){return l(this,n)}statusBecomePlaying(){if(this.status!==a.a.Status.PLAYING){if(this.status!==a.a.Status.PAUSED)throw new Error("Can only resume a game that is currently paused.");this.players.forEach(e=>{e._notifyGameNowPlaying()}),this._abstractStatusBecomePlaying(),d(this,n,a.a.Status.PLAYING)}else console.log("[statusBecomePlaying]: Game is already playing")}statusBecomePaused(){if(this.status!==a.a.Status.PAUSED){if(this.status!==a.a.Status.PLAYING)throw new Error("Can only pause a game that is currently playing.");this.players.forEach(e=>{e._notifyGameNowPaused()}),this._abstractStatusBecomePaused(),d(this,n,a.a.Status.PAUSED)}else console.log("[statusBecomePaused]: Game is already paused")}statusBecomeOver(){if(this.status!==a.a.Status.PLAYING)throw new Error("Can only end a game that is currently playing.");this.players.forEach(e=>{e._notifyGameNowOver()}),this._abstractStatusBecomeOver(),d(this,n,a.a.Status.OVER),l(this,s).call(this),console.log("game is over!")}_abstractStatusBecomePlaying(){}_abstractStatusBecomePaused(){}_abstractStatusBecomeOver(){}}s=new WeakMap,i=new WeakMap,n=new WeakMap,Object.freeze(u),Object.freeze(u.prototype);var m,f=function(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r},p=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)};class g extends u{constructor(e,t,r){super(e,t,r),m.set(this,void 0),this.eventRecordBitmap=[]}reset(){const e=super.reset();return this.eventRecordBitmap.fill(!1,0,a.a.K.EVENT_RECORD_WRAPPING_BUFFER_LENGTH),f(this,m,0),e}get nextUnusedEventId(){return p(this,m)}_recordEvent(e){const t=e.eventId,r=t%a.a.K.EVENT_RECORD_WRAPPING_BUFFER_LENGTH;if(t===o.a.EVENT_ID_REJECT)throw new TypeError("Do not try to record events for rejected requests.");if(t<0||t!==Math.trunc(t))throw new RangeError("Event ID's must only be assigned positive, integer values.");if(this.eventRecordBitmap[r])throw new Error("Event ID's must be assigned unique values.");this.eventRecordBitmap[r]=!0,this.eventRecordBitmap[(t+a.a.K.EVENT_RECORD_WRAPPING_BUFFER_LENGTH-a.a.K.EVENT_RECORD_FORWARD_WINDOW_LENGTH)%a.a.K.EVENT_RECORD_WRAPPING_BUFFER_LENGTH]=!1,f(this,m,+p(this,m)+1)}executeTileModEvent(e,t=!0){Object.freeze(e);const r=this.grid.tile.at(e.coord);if(r.lastKnownUpdateId>e.lastKnownUpdateId)return r;if(r.lastKnownUpdateId===e.lastKnownUpdateId)throw new Error("never.");return e.newCharSeqPair&&(r.setLangCharSeqPair(e.newCharSeqPair),t&&this.operators.filter(e=>e.tile.destsFrom().get.includes(r)).forEach(e=>e.seqBufferAcceptKey(""))),r.lastKnownUpdateId=e.lastKnownUpdateId,r.freeHealth=e.newFreeHealth,r}executePlayerMoveEvent(e){var t;const r=this.players[e.playerId],s=e.playerLastAcceptedRequestId-r.lastAcceptedRequestId;if(e.eventId===o.a.EVENT_ID_REJECT)return void(0===s&&(r.requestInFlight=!1));this._recordEvent(e);const i=this.executeTileModEvent(e.destModDesc,r!==this.currentOperator);if(null===(t=e.tileHealthModDescs)||void 0===t||t.forEach(e=>{this.executeTileModEvent(e)}),s>1){if(r===this.currentOperator)throw new Error("This never happens. See comment in source.")}else{if(r.requestInFlight=!1,!(r===this.currentOperator?1===s:s<=1))throw new Error("This never happens. See comment in source");r.status.health=e.newPlayerHealth.health,r.moveTo(i),r.lastAcceptedRequestId=e.playerLastAcceptedRequestId}}executePlayerBubbleEvent(e){this.players[e.playerId].requestInFlight=!1,e.eventId!==o.a.EVENT_ID_REJECT&&this._recordEvent(e)}}m=new WeakMap,Object.freeze(g),Object.freeze(g.prototype)}]]);
//# sourceMappingURL=online.js.map