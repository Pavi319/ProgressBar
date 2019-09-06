

jest.useFakeTimers();
// jest.useRealTimers();
//Test1 Verify if the options are took correctly(2/10)
 const ProgressBar = require('./ProgressBar')
test('should output the bar with options and some tokens',() => {

    const bar =new ProgressBar('[:bar] :percent :current :total :elapsed',{total:100,width:10,complete: '=',incomplete: '-'});
    let progress = 20;
    bar.progress(progress)
    console.log(bar.lastDraw)
    expect(bar.lastDraw).toBe('[==--------] 20% 20 100 0.0')
})

//Test2 Verify if the timeout works!
test('Timeout test',() => {
    let progress = 10
    const bar = new ProgressBar('downloading [:bar] :percent :eta :total',{total: 100, width:100,complete: '=',incomplete: '-'})
    setTimeout(function() {
        bar.progress(progress)
    },1000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000)
})

//Test3 Verify if the progress works correctly 
test('progress verifier test ', () => {

    let progress =0;
    let timer = null
    const bar = new ProgressBar('[:bar]',{total: 100, width:100,complete: '=',incomplete: '-'})
    let progressTest = function() {
        bar.progress(progress)
        progress += 10;
        if(bar.complete) {
            console.log('\n Complete \n');
            return clearTimeout(timer)
        }
        timer = setTimeout(progressTest(),1000);
    }
    timer = setTimeout(progressTest(),1000)
    expect(setTimeout).toHaveBeenCalledTimes(11);
    expect(setTimeout).toHaveBeenCalledWith(expect().toBeUndefined(), 1000)
})

//Test4 Verify if the callback works correctly
test('callback test',() => {
    
    let timer = null;
    let progress = 0;
    const bar = new ProgressBar('[:bar] :percent',{total: 100, width:100,complete: '=',incomplete: '-',callback: showFive})
    let callbackTest = function() {
        bar.progress(progress)
        progress += 5;
        // console.log(bar.getProgress())
        if(bar.complete) {
            console.log('\n Complete \n');
            return clearTimeout(timer)
        }
        timer =setTimeout(callbackTest(),1000);
    }
    timer =setTimeout(callbackTest(),1000); 
    expect(setTimeout).toHaveBeenCalledTimes(21);
    expect(setTimeout).toHaveBeenCalledWith(expect().toBeUndefined(), 1000)
})

function showFive() {
    console.log('5!');
}

afterEach(()=> {
    jest.clearAllMocks()
    // console.log('Mock timers were cleaned!')
})
// beforeEach(() => {
//     jest.useRealTimers();
// })
//Test5 timeout +1% test
test('timeout option test',() => {
    const bar = new ProgressBar('[:bar]',{total: 100, width:100,complete: '=',incomplete: '-',timeout: 500})
    let progress = 10;
    let timer = null;
    let timeoutTest =function() {
        
        bar.progress(progress);
        console.log(bar.getProgress());
        progress += 10;
        if(bar.complete) {
            console.log('\n Complete \n');
            return clearTimeout(timer)
        }
        timer =setTimeout(timeoutTest(),100);
    }
    timer =setTimeout(timeoutTest(),1000);
    expect(setInterval).toHaveBeenCalledTimes(10);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 500)
    expect(setTimeout).toHaveBeenCalledTimes(10);
    expect(setTimeout).toHaveBeenCalledWith(expect().toBeUndefined(), 1000)
})