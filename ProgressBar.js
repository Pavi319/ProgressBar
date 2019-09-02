exports = module.exports = ProgressBar;

let eta = ratio =  percent =  elapsed = 0
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
    this.renderRule = options.renderRule || 16
    this.lastRender = -1;
    this.callback = options.callback || function () {};
    this.tokens = {};
    this.lastDraw = ''
    this.timeout=options.timeout !== 0 ? (options.timeout || null) : 0;
    this.timeoutIntervalId = null; 
}

ProgressBar.prototype.progress = function(length,tokens){
    if(this.curr === 0) {this.start = new Date;}
    if(tokens){this.tokens = tokens}
    if(length !== 0){length= length || 1;}
    if(this.timeoutIntervalId){clearInterval(this.timeoutIntervalId)}
    if(this.timeout!== null){
                this.timeoutIntervalId = setInterval(() => {
                    this.curr +=1 ;
                    this.verifyEtaAndRatio();    
                    this.render();
                },this.timeout)
                this.stream.clearLine(1);
                this.stream.cursorTo(0);
                this.curr =length;
                this.render();

    } else {
        this.curr =length;
        this.render();

    }
    this.verifyEtaAndRatio();
    if(this.curr >= this.total){
        this.render(undefined,false);
        this.complete = true;
        clearInterval(this.timeoutIntervalId)
        this.terminate();
        this.callback(this)
        return;
    }
    
}
ProgressBar.prototype.verifyEtaAndRatio = function(){
    ratio =this.curr/this.total;
    ratio = Math.min(Math.max(ratio,0),1);
    percent = Math.floor(ratio*100);
    elapsed = new Date - this.start;
    let tempEta;
    if(percent === 100) { tempEta = 0}
    else { tempEta = elapsed * (this.total / this.curr -1)}
    if(Math.abs(tempEta - eta)>2000){
        eta=tempEta
    }
    if(tempEta<=10000){
        eta=tempEta
    }
}

ProgressBar.prototype.render = function (tokens, stopRender){
    if (stopRender === undefined){stopRender= true;}
    //this.stream.isTTY - A boolean that is always true for reading instances
    if(!this.stream.isTTY) {return;}
    const now = Date.now();
    const timeDifference = now-this.lastRender;
    if(stopRender && (timeDifference < this.renderRule)) { return; } 
    else { this.lastRender = now;}
    
    // console.log(Math.abs(eta))
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
    if(tokens){ this.tokens = tokens}
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
    if(this.clear){
        if(this.stream.clearLine){
            this.stream.clearLine();
            this.stream.cursorTo(0);
        }
    }else {
        this.stream.write('\n')
    }
}