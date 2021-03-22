// Importing File System and Utilities module 
const fs = require('fs')
const util = require('util')

// Convert callback based methods to  
// promise based methods 
const makeDir = util.promisify(fs.mkdir)
const readDir = util.promisify(fs.readdir)


readDir(process.cwd())
    .then(filenames => {

        // Fetch the contents of current working 
        // directory before creating new directory 
        for (let filename of filenames) {
            console.log(filename)
        }
    })
    .catch(err => {
        console.log(`Error occurs,  
        Error code -> ${err.code}, 
        Error No -> ${err.errno}`);
    })

// Create new directory 
makeDir('./Test Directory')a                                                                                                                                                                                 
    .then(() => {

        // Fetch the contents of current working 
        // directory after creating new directory 
        console.log(`\nAfter creating new directory : \n`)

        return readDir(process.cwd())
    })

    .then(filenames => {
        for (let filename of filenames) {
            console.log(filename)
        }
    })

    // If promise gets rejected 
    .catch(err => {
        console.log(`Error occurs,  
        Error code -> ${err.code}, 
        Error No -> ${err.errno}`)
    }) 