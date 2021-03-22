
fs.readdir(sourceDir, (err, files) => {
    files.forEach(file => {
        console.log(file);
    });
});

const makeDir2 = util.promisify(fs.mkdir)
const aaa = path.join('./stockFiles/', 'E_CBINT.html')
const bbb = path.join(homedir, '/Downloads/aaa');
const ccc = path.join(bbb, 'E_CBINT.html');
makeDir2(bbb)

    .then(() => {
        fs.copyFile(aaa, ccc, (err) => {
            console.log("error " + err)
        })
    })


const goButton = document.getElementById('goButton');

goButton.addEventListener('click', () => {
    beginFileCopy2();
})

// the basic promise

// the promise when resolve works
const promiseResolve = new Promise((resolve, reject) => {
    resolve("i did it");

})

// .then will be fired when resolve is true
promiseResolve.then((msg) => {
    console.log('this was a success! ' + msg)
})


// here's what happens when it rejects
const promiseReject = new Promise((resolve, reject) => {
    reject(new Error('error message'))
})

promiseReject.then(msg => {
    console.log('it worked')
}).catch(err => {
    // catch is fired when reject is true
    console.log(err.message)
})

//how it's used



function myPromiseFunction(){
    return new Promise((resolve, reject) => {
        // do some stuff here!  like go get data

        // here you evaluate what just happened above and determine
        // if it failed or succeeded
        if (status == 0){
            resolve(data)
        }
        else {
            reject("error!")
        }
    })
}

myPromiseFunction().then((data) => {
    // the resolve goes here
    console.log("success!")
    // to chain, you put return first??!!!
    return myPromiseFunction();
})
.then((data) => {
    console.log("second part of the chain success")
})
.catch(err => {
    // all rejects go here
    console.log("failure" + err)
})

/*
with this in mind, does this mean that for each step (copy, open, replace, rename) we need a function that includes
return Promise() for it to be chained together?
*/



/*
myPromiseFunction().then()

first step, create a function to call (and it is this function call that you can tack
                                        on a .then to.  and the first function passes
                                        the data in the resolve line resolve(data) to the 
                                        .then()

    2nd, that function returns a promise

        and that promise takes as a parameter a function

        in that function you set up the resolve and reject
            if success
                resolve(data)
            if fail
                reject(err)
    

make folder
THEN
    copy HTML file

        if no error, open HTML file
        
            if no error, search and replace in HTML file  (3 ways: e, l only, l+p)

            write HTML file

                if no error, rename HTML file
THEN  
    copy manifest file

        if no error, open manifest file

            if no error, search and replace in manifest file (3 ways: e, l only, l+p)

            write manifest file

            if no error, rename manifest file
THEN
    copy E media file

        if no error, rename E media file
THEN
    copy L media file

        if no error, rename L media file
THEN
    copy P media file

        if no error, rename P media file

*/

