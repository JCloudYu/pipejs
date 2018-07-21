/**
 * Project: PipeJS
 * File: pipe
 * Author: jcloudyu
 * Create Date: Jul. 21, 2018 
 */

(()=>{
	"use strict";
	
	
	const VERSION = "1.0.0";
	
	const _pipe_inst=window.pipe=(...resList)=>{
		if ( Array.isArray(resList[0]) ) { resList = resList[0]; }
		if ( resList.length <= 0 ) return false;
		let _inst = _PREPARE_LOAD_PROMISE(resList);
		_inst.pipe = _PIPE_CHAIN;
		return _inst;
	};
	Object.defineProperties(_pipe_inst, {
		version:{value:VERSION, configurable:false, writable:false, enumerable:true}
	});
	
	function _PIPE_CHAIN(...args){
		let inst=this.then(()=>{
			return _pipe_inst(...args);
		});
		inst.pipe=_PIPE_CHAIN;
		return inst;
	}
	function _PREPARE_LOAD_PROMISE(resources=[]) {
		let _chain = Promise.resolve(), _res = [];

		resources.forEach(function( item ) {
			let type = (item === null) ? "null" : typeof item;
		
			switch(type) {
				case "string":
					_res.push({type:'js', path:item, modulize:false, important:true});
					
				case "object":
					_res.push(item);
					return;
					
				default:
					break;
			}

			if ( _res.length > 0 ) {
				_chain = _chain.then(_LOAD_RESOURCES(_res));
				_res = [];
			}


			if ( type === 'function' ) {
				_chain = _chain.then(item);
			}
		});

		// INFO: There may be some leftover in resource chain
		if ( _res.length > 0 ) {
			_chain = _chain.then(_LOAD_RESOURCES(_res));
		}
		
		return _chain;
	}
	
	
	
	function _LOAD_RESOURCES(res, immediate=false) {
		res = Array.isArray(res) ? res : [res];
		let _doLoad = ()=>{
			let _promises = [];
			res.forEach(function( item ) {
				if ( !item.path ) return;
				
				let {path='', type='js', modulize=false, overwrites={}, cache=true, important=true} = item;
				if (path === '') return;
				

				path = path + ( cache ? '' : '?' + (new Date()).getTime());
				let promise;
				if ( type === "js" && modulize ) {
					promise = _FETCH_MODULE(path, overwrites, important);
				}
				else {
					promise = _FETCH_RESOURCE(path, type, important);
				}
				
				_promises.push( promise );
			});


			return Promise.all(_promises);
		};
		
		return immediate ? _doLoad() : _doLoad;
	}
	function _FETCH_RESOURCE(res, type, important=true) {
		return new Promise((resolve, reject)=>{
			let tag, anchor;
			switch ( type ) {
				case "css":
					anchor = document.getElementsByTagName( 'head' );
					tag = document.createElement( 'link' );
					tag.rel = "stylesheet";
					tag.type = "text/css";
					tag.href = res;
					break;
	
				case "js":
					anchor = document.getElementsByTagName( 'body' );
					tag = document.createElement( 'script' );
					tag.type = "application/javascript";
					tag.src = res;
					break;
	
				default:
					return false;
			}
			
			
			
			tag.onload  = resolve;
			tag.onerror = important ? reject : resolve;
			anchor[0].appendChild(tag);
		});
	}
	
	async function _FETCH_MODULE(path, overwrites, important=true){
		let variables = [], values = [], moduleCtrl = {};
		for(let prop in overwrites) {
			if(prop !== "module" && overwrites.hasOwnProperty(prop)) {
				variables.push(prop);
				values.push(overwrites[prop]);
			}
		}


		let result = await _LOAD_CONTENTS(path).catch((err)=>{
			if ( important ) {
				return Promise.reject(err);
			}
		});
		
		
		
		let response = result.currentTarget;
		if ( response.status < 200 || response.status >= 400 ) {
			return Promise.reject(response);
		}
		
		
		
		variables.push('module', response.responseText);
		values.push(moduleCtrl);
		(new Function(...variables)).apply({}, values);
		return Promise.resolve(moduleCtrl.signal);
	}
	function _LOAD_CONTENTS(res) {
		return new Promise((resolve, reject)=>{
			var request = new XMLHttpRequest();
			request.onload=resolve;
			request.onerror=reject;
			
			request.open('GET', res, true);
			request.send();
		});
	}
})();
