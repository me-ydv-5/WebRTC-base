export const handleFail = function(err){
    console.log("Error : ", err);
};


let channels = []
export function storeChannels(val) {
    channels.push(val)
    console.log(channels)
}

export function getChannelNames() {
    return channels
}

export const audioFile = 'http://www.littlegrantvillebluegrass.com/music/%20Track6.mp3'