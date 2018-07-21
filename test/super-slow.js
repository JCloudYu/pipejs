/**
 * Project: PipeJS
 * File: super-fast.js
 * Author: jcloudyu
 * Create Date: Jul. 21, 2018 
 */
(()=>{
	"use strict";
	
	let countdown = 10;
	module.signal = new Promise((resolve)=>{
		let interval = setInterval(()=>{
			if ( countdown <= 0 ) {
				clearInterval(interval);
				resolve();
				return;
			}
		
			console.log( `WAIT UP: ${countdown}` );
			countdown--;
		}, 1000);
	});
})();
