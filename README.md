# PipeJS #
PipeJS is a tinny library that allows developers to fetch and load external scripts and styles asynchronously but at the same time, sequentially according to the specific order.

> Note this library is designed for browser only!

## Why PipeJS? ##
Websites nowadays often depend on many different external scripts and styles, which usually requires lots of times to load them all. So developers may want to load the resources separately and asynchronously but according to the dependencies and orders among them. This usually involves many dom manipulating methods and ajax loads and waits to finish them all! So PipeJS is designed to provide a simplified means to fulfill the needs as easy and intuitive as possible. And at the same time, it will be better to acheive it without any dependency.

## Installation ##
Simply add the following line into ```<head>``` tag
```html
<script src="https://cdn.rawgit.com/JCloudYu/pipejs/master/pipe.min.js"></script>
```

Or you can download the script from [here](https://cdn.rawgit.com/JCloudYu/pipejs/master/pipe.min.js) and add to your code stash~

## How to use? ##
This library registers a function named ```pipe``` onto the ```window``` object. It's the sole function the developer should know to load resources. The ```pipe``` api accept an array of ``` resource descriptors```. 

### Resource Descriptor ###
Resource descriptors is an object contains following properties:

| name | type | required | default | description |
|:----------|:-----:|:---:|:----:|:--------------|
| path | String | Y |  | The path of the external resource |
| type | 'js' or 'css' | N | 'js' | The type of the resource |
| cache | Boolean | N | true | Whether the resource will be cached by the browser |
| important | Boolean | N | true | True will make the whole reading process stop if the resource is not loaded |
| modulize | Boolean | N | false | A special flag that will read the script as module |
| overwrites | Object | N | {} | The variable to be overwritten when the resource is read in module mode |

Moreover, a resource descriptor can simply be a string, which is equivalent to the following object resource descriptor.
```javascript
{
    path: "The resource string...",
    type: "js",
    cache: false,
    important: true,
    modulize: false,
    overwrites: {}
}
```

### The sequence separator ###
If a resource descriptor is neither a string nor an object, then the descriptor is treated as a sequence separator. Resources between the separators will be treated as different groups. Within a groupped resources, the resources will be loaded asynchronously and the order among them will not be guaranteed. However, the groups will be guaranteed to be loaded sequentially. 

A function can also be a sequence separator. A separator function will be guarateed to be invoked after the prior resources are loaded completely. This is handy for developers to perform some procedural actions between the load of the resources.


## Example ##

```javascript
await pipe([
    'http://code.jquery.com/jquery-3.3.1.min.js',    
    ()=>{
        console.log( "Jquery is loaded!" );
        console.log( "From now on, the jQuery is guaranteed to be available!" );
    },
    
    { path:'http://momentjs.com/downloads/moment.min.js', cache:false },
    // This script will be failed but the whole loading process will not be stopped!
	{ path:'http://momentjs.com/downloads/moment222.min.js', cache:false, important:false },

    //A separator the guarantee the super-fast.js is loaded after the load of moment.min.js and pump2.min.js
    null,
    
    './super-fast.js'
])
// The promise returned by the pipe api will contain a pipe method
// This allows developers to chain up the load process
.pipe([
    { path:'./super-slow.js', modulize:true, cache:true, overwrites:{}},
    { type:'css', path:'./style.css' },
    { type:'css', path:'./style2.css', important:false },
	
    // The following line will make the reading process stopped and the promise returned will be rejected!
    //{ type:'css', path:'http://momentjs.com/downloads/moment222.min.js' },
    { type:'css', path:'./style-final.css' }
]);

console.log( "Everything is done! Now you can use anything freely!" );
```

