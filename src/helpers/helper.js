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