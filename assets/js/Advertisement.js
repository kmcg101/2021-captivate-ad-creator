var fs = require('fs');
const { runInThisContext } = require('vm');
class Advertisement {

    constructor(name, format) {
        // from the constructor
        this.name = name; // adElevator, adLandscape, adPortrait
        this.format = format // e, l, or p;

        // from the file drop
        this.fullMediaPath = null;
        this.mediaFilename = null;
        this.mediaExtension = null;
        this.fileDropOK = false;
           

        // from the filename
        this.trafficFilename = null;
        this.client = null;
        this.descriptor = null;
        this.htmlFileName = null
        this.manifestFileName = null;
        this.lowerCaseFilename = null;
        this.filenameCheckOK = false;
        

        // from the button
        this.product = null; // bint, fsa, ...
        this.time = null;
        this.mediaType = null; // image or video
        this.mediaWidth = null;
        this.mediaHeight = null;
        this.mediaSize = null; // width x height

        this.videoFPS = null;
        this.videoCodec = null;
        this.videoDuration = null;

        this.activeForThisProject = false;
        
        

    }

    clearButtonProperties(){
        this.time = null;
        this.mediaType = null;
        this.product = null;
        this.mediaWidth = null;
        this.mediaHeight = null;
        this.mediaSize = null;
        this.videoFPS = null;
        this.videoCodec = null
        this.videoDuration = null;
        this.activeForThisProject = false
    }
    clearMediaDropProperties(){
        this.fullMediaPath = null;
        this.mediaFilename = null;
        this.mediaExtension = null;
        this.fileDropOK = false;
    }

    clearFilenameProperties(){
        this.trafficFilename = null;
        this.client = null;
        this.descriptor = null;
        this.htmlFileName = null
        this.manifestFileName = null;
        this.lowerCaseFilename = null;
        this.filenameCheckOK = false;
    }

}

module.exports = Advertisement;
