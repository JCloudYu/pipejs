/**
 * Project: PipeJS
 * File: test.js
 * Author: JCloudYu
 * Create Date: Jul. 21, 2018 
 */
(async()=>{
	"use strict";
	
	await pipe([
		()=>{
			console.log( "WAITING TO START..." );
			return new Promise((resolve)=>{
				setTimeout(resolve, 1500);
			});
		},
	
		'http://code.jquery.com/jquery-3.3.1.min.js',
		()=>{
			console.log( "WAITING... 1" );
			return new Promise((resolve)=>{
				setTimeout(resolve, 1500);
			});
		}
	]).pipe(
		{ path:'http://momentjs.com/downloads/moment.min.js', cache:false },
		{ path:'http://res.purimize.com/lib/js/pump2.min.js', cache:false, important:false },
		()=>{
			console.log( "WAITING... 2" );
			return new Promise((resolve)=>{
				setTimeout(resolve, 1500);
			});
		},
		
		'./super-fast.js',
		()=>{
			console.log( "WAITING... 3" );
			return new Promise((resolve)=>{
				setTimeout(resolve, 1500);
			});
		}
	)
	.pipe([
		{ path:'./super-slow.js', modulize:true, cache:true, overwrites:{}},
		{ type:'css', path:'./style.css' },
		{ type:'css', path:'./style2.css', important:false },
		
		()=>{
			console.log( "WAITING... 4" );
			return new Promise((resolve)=>{
				setTimeout(resolve, 1500);
			});
		},
		
		// Valid separators...
		1,
		false,
		undefined,
		null,
//		{ type:'css', path:'./style3.css' },
		{ type:'css', path:'./style-final.css' }
	]);
	
	console.log( "IN" );
	console.log( moment().unix() );
})();
