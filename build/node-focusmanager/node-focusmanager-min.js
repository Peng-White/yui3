YUI.add("node-focusmanager",function(B){var J="activeDescendant",L="id",I="disabled",M="tabIndex",E="focused",A="focusClass",P="circular",C="UI",F="key",G=J+"Change",N="host",O={37:true,38:true,39:true,40:true},H=B.Lang,K=B.UA;var D=function(){D.superclass.constructor.apply(this,arguments);};D.ATTRS={focused:{value:false,readOnly:true},descendants:{getter:function(Q){return this.get(N).queryAll(Q);}},activeDescendant:{setter:function(U){var S=H.isNumber,R=B.Attribute.INVALID_VALUE,Q=this._descendantsMap,X=this._descendants,W,T,V;if(S(U)){W=U;T=W;}else{if((U instanceof B.Node)&&Q){W=Q[U.get(L)];if(S(W)){T=W;}else{T=R;}}else{T=R;}}if(X){V=X.item(W);if(V&&V.get("disabled")){T=R;}}return T;}},keys:{value:{next:null,previous:null}},focusClass:{},circular:{value:true}};B.extend(D,B.Plugin.Base,{_stopped:true,_descendants:null,_descendantsMap:null,_focusedNode:null,_lastNodeIndex:0,_eventHandlers:null,_initDescendants:function(){var X=this.get("descendants"),Q={},V=-1,U,T=this.get(J),W,R,S=0;if(H.isUndefined(T)){T=-1;}if(X){U=X.size();if(U>1){for(S=0;S<U;S++){W=X.item(S);if(V===-1&&!W.get(I)){V=S;}if(T<0&&W.getAttribute(M)==="0"){T=S;}W.set(M,-1);R=W.get(L);if(!R){R=B.guid();W.set(L,R);}Q[R]=S;}if(T<0){T=0;}W=X.item(T);if(!W||W.get(I)){W=X.item(V);T=V;}this._lastNodeIndex=U-1;this._descendants=X;this._descendantsMap=Q;this.set(J,T);W.set(M,0);}}},_isDescendant:function(Q){return(Q.get(L) in this._descendantsMap);},_removeFocusClass:function(){var R=this._focusedNode,S=this.get(A),Q=H.isString(S)?S:S.className;if(R&&Q){R.removeClass(Q);}},_detachKeyHandler:function(){var S=this._prevKeyHandler,Q=this._nextKeyHandler,R=this._keyPressHandler;if(S){S.detach();}if(Q){Q.detach();}if(R){R.detach();}},_preventScroll:function(Q){if(O[Q.keyCode]){Q.preventDefault();}},_attachKeyHandler:function(){this._detachKeyHandler();var S=this.get("keys.next"),Q=this.get("keys.previous"),R=this.get(N);if(Q){this._prevKeyHandler=B.on(F,B.bind(this._focusPrevious,this),R,Q);}if(S){this._nextKeyHandler=B.on(F,B.bind(this._focusNext,this),R,S);}if(K.opera||(K.gecko&&K.gecko<1.9)){this._keyPressHandler=R.on("keypress",B.bind(this._preventScroll,this));}},_detachEventHandlers:function(){this._detachKeyHandler();var Q=this._eventHandlers;if(Q){B.Array.each(Q,function(R){R.detach();});this._eventHandlers=null;}},_attachEventHandlers:function(){var S=this._descendants,Q,R;if(S&&S.size()>1){Q=this._eventHandlers||[];R=this.get(N).get("ownerDocument");if(Q.length===0){Q.push(B.on("focus",B.bind(this._onDocFocus,this),R));Q.push(B.on("mousedown",B.bind(this._onDocMouseDown,this),R));Q.push(this.after("keysChange",this._attachKeyHandler));Q.push(this.after("descendantsChange",this._initDescendants));Q.push(this.after(G,this._afterActiveDescendantChange));}else{this._attachKeyHandler();}this._eventHandlers=Q;}},_onDocMouseDown:function(T){var V=this.get(N),Q=T.target,U=V.contains(Q),S;var R=function(X){var W=false;if(!X.compareTo(V)){W=H.isNumber(X.get(M))?X:R(X.get("parentNode"));}return W;};if(U){S=R(Q);if(S){Q=S;}else{if(!S&&this.get(E)){this._set(E,false);this._onDocFocus(T);}}}if(U&&this._isDescendant(Q)){this.focus(Q);}else{if(K.webkit&&this.get(E)&&(!U||(U&&!this._isDescendant(Q)))){this._set(E,false);this._onDocFocus(T);}}},_onDocFocus:function(V){var T=this._focusTarget||V.target,R=this.get(E),U=this.get(A),S=this._focusedNode,Q;if(this._focusTarget){this._focusTarget=null;}if(this.get(N).contains(T)){Q=this._isDescendant(T);if(!R&&Q){R=true;}else{if(R&&!Q){R=false;}}}else{R=false;}if(U){if(S&&(S!==T||!R)){this._removeFocusClass();}if(Q&&R){if(U.fn){T=U.fn(T);T.addClass(U.className);}else{T.addClass(U);}this._focusedNode=T;}}if(R&&this._eventHandlers.length===5){this._attachEventHandlers();}this._set(E,R);},_focusNext:function(R,S){var Q=S||this.get(J),T;if(this._isDescendant(R.target)&&(Q<=this._lastNodeIndex)){Q=Q+1;if(Q===(this._lastNodeIndex+1)&&this.get(P)){Q=0;}T=this._descendants.item(Q);if(T.get(I)){this._focusNext(R,Q);}else{this.focus(Q);}}this._preventScroll(R);},_focusPrevious:function(R,S){var Q=S||this.get(J),T;if(this._isDescendant(R.target)&&Q>=0){Q=Q-1;if(Q===-1&&this.get(P)){Q=this._lastNodeIndex;}T=this._descendants.item(Q);if(T.get(I)){this._focusPrevious(R,Q);}else{this.focus(Q);}}this._preventScroll(R);},_afterActiveDescendantChange:function(Q){var R=this._descendants.item(Q.prevVal);if(R){R.set(M,-1);}R=this._descendants.item(Q.newVal);if(R){R.set(M,0);}},initializer:function(Q){this.start();},destructor:function(){this.stop();this.get(N).focusManager=null;},focus:function(Q){if(H.isUndefined(Q)){Q=this.get(J);}this.set(J,Q,{src:C});var R=this._descendants.item(this.get(J));if(R){R.focus();if(K.opera&&R.get("nodeName").toLowerCase()==="button"){this._focusTarget=R;}}},blur:function(){var Q;if(this.get(E)){Q=this._descendants.item(this.get(J));if(Q){Q.blur();this._removeFocusClass();}this._set(E,false,{src:C});}},start:function(){if(this._stopped){this._initDescendants();this._attachEventHandlers();this._stopped=false;}},stop:function(){if(!this._stopped){this._detachEventHandlers();this._descendants=null;this._focusedNode=null;this._lastNodeIndex=0;this._stopped=true;}},refresh:function(){this._initDescendants();}});D.NAME="nodeFocusManager";D.NS="focusManager";B.namespace("Plugin");B.Plugin.NodeFocusManager=D;},"@VERSION@",{requires:["node","plugin"]});