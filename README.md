Progress Bar Project

## Usage

First we create a ProgressBar,giving it a string and options (if we want)
```javascript
let ProgressBar = require(`./progressBar`);
const bar = new ProgressBar(':bar',{total: 100});    
```
After this we call 'progress()' appropiately

```javascript
const timer = setInverval(function(){
    bar.progress();
    if(bar.complete) {
        console.log('\n Finished!');
        clearInterval(timer);
    }
})
```

### Options

There are options that you can pass to the progress bar beside
`total` that was used in the exemple above.

- `current` current completed index
- `total` total length of the bar
- `width` the displayed width of the progress bar defaulting to total
- `stream` the output stream defaulting to stderr
- `head` head character defaulting to complete character
- `complete` completion character defaulting to "-"
- `incomplete` incomplete character defaulting to "+"
- `renderRule` minimum time between updates in milliseconds defaulting to 50
- `timeout` if the response is later than the set timeout then the progress bar will progress with 1% each time the timeout expires
- `callback` optional function to call when the progress bar completes

### Tokens 

These are the tokens you can use for your progress bar


- `:bar` the progress bar itself
- `:current` current progress position
- `:total` total progressed
- `:elapsed` time elapsed in seconds
- `:percent` completion percentage
- `:eta` estimated completion time in seconds
- `:rate` rate of ticks per second