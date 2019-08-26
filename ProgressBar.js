exports = module.exports = ProgressBar;
    
function ProgressBar(str,options) {
    //process.stderr - the standard error steam 
    this.stream = options.stream || process.stderr;
    if(typeof(options) !== 'number'){options = options || {} } 
    else {
        const total = options;
        options = {};
        options.total=total
    }
    this.str =str;
    this.total = options.total || 100;
    this.curr = options.curr || 0
    this.width = options.width || this.total
    this.characters = {
        complete : options.complete || '-',
        incomplete : options.incomplete || '+',
        head : options.head || (options.complete || '-')
    }
    this.renderRule = options.renderRule || 10
    this.lastRender = -Infinity;
    this.callback = options.callback || function () {};
    this.tokens = {};
    this.lastDraw = ''
    this.ticksWithoutProgress = 0;
    this.ticksTillRising = 5;
    this.timeout=options.timeout!== 0 ? (options.timeout || null) : 0;
}

ProgressBar.prototype.tick = function(length,tokens){
    if(this.timeout>=0){
        if(this.ticksWithoutProgress%this.ticksTillRising === 0){
            this.timeout+=this.ticksTillRising;
        }
        this.ticksWithoutProgress++;
    }
    if(length !== 0){length= length || 1;}

    if(tokens){this.tokens = tokens}

    if(this.curr === 0) {this.start = new Date;}
    this.curr +=length;

    this.render();
    if(this.curr >= this.total){
        this.render(undefined,true);
        this.complete = true;
        this.terminate();
        this.callback(this)
        return;
    }
}


ProgressBar.prototype.progress = function(progress){
    console.log(this.timeout,progress)
    if(this.curr === 0) {this.start = new Date;}
    progress +=this.timeout
    if(progress>this.total){
        progress = this.total;
    }

    this.curr = progress;
    this.render();
    if(this.curr >= this.total){
        this.render(undefined,true);
        this.complete = true;
        this.terminate();
        this.callback(this)
        return;
    }
}

ProgressBar.prototype.render = function (tokens, boolean){
    if (boolean === undefined){boolean= false;}
    if(tokens){ this.tokens = tokens}
    //this.stream.isTTY - A boolean that is always true for reading instances
    if(!this.stream.isTTY) {return;}
    const now = Date.now();
    const timeDifference = now-this.lastRender;
    if(!boolean && (timeDifference < this.renderRule)) { return; } 
    else { this.lastRender = now;}
    let ratio =this.curr/this.total;
    ratio = Math.min(Math.max(ratio,0),1);

    const percent = Math.floor(ratio*100);
    const elapsed = new Date - this.start;
    let eta;
    if(percent === 100) { eta = 0}
    else { eta = elapsed * (this.total / this.curr -1)}
    let string = this.str
        .replace(':current',this.curr)
        .replace(':total',this.total)
        .replace(':elapsed',!isNaN(elapsed) ? (elapsed / 1000).toFixed(1) : '0:0')
        .replace(':eta',!(isNaN(eta) || !isFinite(eta)) ? (eta/1000).toFixed(1) + 's' : '0.0s')
        .replace(':percent',percent.toFixed(0) + '%')

    //this.stream.columns - A number specifying the number of columns the steam currently has.
    let freeSpace = Math.max(0,this.stream.columns - string.replace(':bar','').length);

    //process.platform - returns a string identifying the operating system platform on which the Node.js process is running.
    if(freeSpace && process.platform === 'win32'){
        freeSpace -=1;
    }

    const width = Math.min(this.width,freeSpace)

    let completeLength = Math.round(width * ratio);
    let complete = Array(Math.max(0, completeLength + 1)).join(this.characters.complete)
    let incomplete = Array(Math.max(0,width-completeLength + 1)).join(this.characters.incomplete)

    if(completeLength > 0){
        complete = complete.slice(0,-1) + this.characters.head;
    }

    string = string.replace(':bar',complete + incomplete);
    if(this.tokens){
        for(let key in this.tokens){
            string = string.replace(':' + key,this.tokens[key])
        }
    }
    if(this.lastDraw !==string){
        this.stream.cursorTo(0);
        this.stream.write(string);
        this.stream.clearLine(1)
        this.lastDraw = string
    }
}

ProgressBar.prototype.terminate = function() {
    console.log(this.timeout)
    if(this.clear){
        if(this.stream.clearLine){
            this.stream.clearLine();
            this.stream.cursorTo(0);
        }
    }else {
        this.stream.write('\n')
    }
}
