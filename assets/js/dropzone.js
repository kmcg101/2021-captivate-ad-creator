const fs = require('fs');
const path = require('path')
const navigation = require('./navigation.js')
const chooseProduct = require('./chooseProduct.js')
const filecopy = require('./filecopy.js');
var mi = require('mediainfo-wrapper');

var dropTargetELPId = '';
var dropTargetImgDiv;
var dropTargetVidDiv;
var dropTargetSizeDiv;

exports.resetDropzones = function () {
    const elpArray = ['e', 'l', 'p']
    elpArray.forEach(element => {
       
        // let t1 = document.getElementById('dropzone__error_' + element)
        let t2 = document.getElementById('dropzone__img_' + element)
        let t3 = document.getElementById('dropzone__vid_' + element)
        let t4 = document.getElementById('dropzone__size_' + element)
        // t1.style.display = 'none';
        t2.style.display = 'none';
        t3.style.display = 'none';
        t4.style.display = 'block';
    })
}

let resetAllDropSources = () => {
    //dropzone_img
    //dropzone_vid
    console.log("trying to reset")
    const allImg = document.querySelectorAll('.dropzone_img');
    const allVid = document.querySelectorAll('.dropzone_vid');
    allImg.forEach(item => {
        item.src = "//:0";
    })
    allVid.forEach(item => {
        item.src = "//:0";
    })
    

}
function isDroppedExtensionCorrect(ext) {

    var useFile = false;
    let obj = chooseProduct.getObjectClicked();
    if (obj.mediaType == 'image') {
        if (ext == '.jpg' || ext == '.png') {
            useFile = true;
        }
    }
    else {
        if (ext == '.mp4') {
            useFile = true;
        }
    }
    return useFile;
}

document.querySelectorAll(".dropzone__size").forEach(item => {
    //console.log("item = " + item)
    item.ondragover = (e) => {
        e.stopPropagation();
        e.preventDefault();

        e.target.classList.add('dropzone__container__over')
    }

    item.ondragleave = (e) => {
        e.stopPropagation();
        e.preventDefault();

        e.target.classList.remove('dropzone__container__over')
        // on drag out, remove from class list
    }
    item.ondrop = (e) => {
        e.preventDefault();
        let f = e.dataTransfer.files[0]
        e.target.classList.remove('dropzone__container__over')

        dropTargetELPId = e.target.id.slice(-1);
        dropTargetDivId = e.target.id;
        // dropTargetErrorDiv = document.getElementById("dropzone__error_" + dropTargetELPId)
        dropTargetImgDiv = document.getElementById("dropzone__img_" + dropTargetELPId)
        dropTargetVidDiv = document.getElementById("dropzone__vid_" + dropTargetELPId)
        dropTargetSizeDiv = document.getElementById("dropzone__size_" + dropTargetELPId)
        droppedIt(f);
    }
})

function droppedIt(f) {
    //console.log('File(s) you dragged here: ', f.path)

    // clear check area
    navigation.clearChecksArea();
    
    let headerText = 'Elevator'
    if(dropTargetELPId == 'l'){
        headerText = "Landscape"
    }
    else if(dropTargetELPId == 'p'){
        headerText = "Portrait"
    }
    
    navigation.createCheck(false, headerText, true)

    // ok = elevator error, elevator good
    // ok = l an p error.  does not work for l and p OK
        
    // get extension of dropped file
    const ext = path.extname(f.path);

    // is file type correct?
    let isFileTypeCorrect = isDroppedExtensionCorrect(ext);

    // file type is correct, check video attributes
    if (isFileTypeCorrect) {
        navigation.createCheck(false, "file type correct", false)
        var obj = chooseProduct.getObjectClicked();
        var expectedSize;   
        if (dropTargetELPId == 'e') {
            expectedSize = obj.eSize
        }
        else if (dropTargetELPId == 'l') {
            expectedSize = obj.lSize
        }
        else if (dropTargetELPId == 'p') {
            expectedSize = obj.pSize
        }
        

        if (obj.mediaType == 'video') {
          
            mi(f.path).then(function (data) {
                var numberVideoErrors = 0;
                var videoErrorArray = [];

                // frame rate
                const expectedFPS = obj.mediaFPS
                const vidFPS = (data[0].general.frame_rate[0]) 
                if (vidFPS != expectedFPS) {
                    navigation.createCheck(true, "FPS is not " + expectedFPS, false)
                    numberVideoErrors++;
                }
                else{
                    navigation.createCheck(false, "FPS = "+vidFPS, false)
                }

                // width
                const vidWidth = data[0].video[0].width[0]

                // height
                const vidHeight = data[0].video[0].height[0]
                const vidSize = vidWidth * vidHeight;
                if (vidSize != expectedSize) {
                    navigation.createCheck(true, "incorrect size " + vidWidth + 'x' + vidHeight, false)
                    numberVideoErrors++;
                }
                else{
                    navigation.createCheck(false,vidWidth + " x " + vidHeight, false)
                }

                // duration
                const vidDuration = (data[0].video[0].duration[0]) ;
                navigation.createCheck(false, "duration =  " + vidDuration, false)

                // codec
                const vidCodec = data[0].video[0].codec[0];
                if (vidCodec != 'AVC') {
                    
                    navigation.createCheck(true, "codec not AVC, " + vidCodec, false)
                    numberVideoErrors++;
                }
                else{
                   
                    navigation.createCheck(false, "Codec = " + vidCodec, false)
                }

                // no video file errors, load it
                if (numberVideoErrors == 0) {
                    displayMediaFile(f)
                }
                else {
                    // at least one video file error
                    //redDropzoneError("ERROR!")
                }

            }).catch(function (e) {
                console.error(e)
            });
        }
        else {
            // the dropped file is an image
            const img = new Image();
            img.onload = function () {
                const loadedImageSize = this.width * this.height;

                if (loadedImageSize == expectedSize) {
                    navigation.createCheck(false,"size = " + this.width + "x" + this.height, false)
                    displayMediaFile(f)
                }
                else {
                    // file size not correct
                    // redDropzoneError('Image file is wrong height and/or width')
                    navigation.createCheck(true ,"size wrong, " + this.width + "x" + this.height, false)  
                }
            }
            img.src = f.path;
        }
    }
    else {
        // file type not correct
        var obj = chooseProduct.getObjectClicked();
        navigation.createCheck(true,'Incorrect file type. Must be ' + obj.mediaExtension + ' and not ' + ext, false)
    }
}
function displayMediaFile(f) {
    // all good

    // update the ad instances
    if (chooseProduct.getObjectClicked().format == 'e'){
        chooseProduct.adElevator.fullMediaPath = f;
        chooseProduct.adElevator.mediaFilename = path.basename(f.path);
        chooseProduct.adElevator.mediaExtension = path.extname(f.path).slice(1);
        chooseProduct.adElevator.fileDropOK = true;
    }
    else if (dropTargetELPId == 'l'){
        chooseProduct.adLandscape.fullMediaPath = f;
        chooseProduct.adLandscape.mediaFilename = path.basename(f.path);
        chooseProduct.adLandscape.mediaExtension = path.extname(f.path).slice(1);
        chooseProduct.adLandscape.fileDropOK = true;
    }
    else{
        chooseProduct.adPortrait.fullMediaPath = f;
        chooseProduct.adPortrait.mediaFilename = path.basename(f.path);
        chooseProduct.adPortrait.mediaExtension = path.extname(f.path).slice(1);
        chooseProduct.adPortrait.fileDropOK = true;
    }
   
    // display the image or video
    var obj = chooseProduct.getObjectClicked();
    if (obj.mediaType == "video") {
        dropTargetVidDiv.src = f.path
        dropTargetVidDiv.style.width = dropTargetSizeDiv.style.width;
        dropTargetVidDiv.style.height = dropTargetSizeDiv.style.height;
        dropTargetVidDiv.play();
        dropTargetImgDiv.style.display = 'none';
        dropTargetVidDiv.style.display = 'block';
    }
    else {
        dropTargetImgDiv.src = f.path;
        dropTargetImgDiv.style.width = dropTargetSizeDiv.style.width;
        dropTargetImgDiv.style.height = dropTargetSizeDiv.style.height;
        dropTargetImgDiv.style.display = 'block';
        dropTargetVidDiv.style.display = 'none';
    }
    let doneNow = determineIfWeAreDone();
    if(doneNow){
        filecopy.goButton.style.display='block';
    }
   
}
function determineIfWeAreDone(){
    // determine how many files
    obj = chooseProduct.getObjectClicked();
    numFiles = parseInt(obj.numberMediaFiles)
    
    if(numFiles == 1){
        return true;
    }
    else{
        
        if(chooseProduct.adLandscape.fileDropOK && chooseProduct.adPortrait.fileDropOK){
            return true
        }
        else{
            return false;
        }
    }

}


exports.resetAllDropSources = resetAllDropSources;