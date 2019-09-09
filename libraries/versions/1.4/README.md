# Libraries
This folder holds a collection of libraries that you may find useful in your Bezl development (or any Javascript development for that matter).  Nearly everything in here is going to be derived from somewhere else and we try to ensure proper credit and link-backs are provided to where it was derived from.

## Usage
In order to use these libraries you can either:

1. Copy + paste the function body into a function within Bezlio.  The function body, using helloworld.js as an example would be only line 2.
2. Use a require statement similar to the following to dynamically pull the latest library code from this repository (this example will actually work):

```
require(['https://bezlio-apps.bezl.io/libraries/helloworld.js'], function() {
	helloWorld(); 
}); 
```

If you opt for #2, you will also need to put the name of the function you are calling (in this case helloWorld) in the 'Declare' box of the function editor and press the 'New' button so that Bezlio understands this is a defined function.

## Index

* [Generate Random Colors Array](https://bezlio-apps.bezl.io/libraries/generateRandomColorsArray.js)
This library is helpful if you need an array of random RGBA colors that would look decent in something like a Chart.JS chart.  The credit on this one goes to [@SterlingWes](https://github.com/sterlingwes) and his project here https://github.com/sterlingwes/RandomColor/blob/master/rcolor.js which simply had to be extended to fill an array.  As @SterlingWes notes, his work was inspired by http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/.  To use this library you will want to pass in the array you wish to fill with random colors as the first argument and then the total number of random colors you want as the second argument.  For example:

```
var myArray = [];
require(['https://bezlio-apps.bezl.io/libraries/generateRandomColorsArray.js'], function() {
	myArray = generateRandomColors(myArray, 7); 
}); 

// Now myArray should be filled with 7 unique colors.
```
