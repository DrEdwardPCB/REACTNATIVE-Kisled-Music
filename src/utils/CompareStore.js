// implemented to compare the store keys. if store keys change, 
export function compareStore(store1, store2){
    var key1=Object.keys(store1)
    var key2=Object.keys(store2)
    //console.log(store1)
    //console.log(store2)
    var isSame=true;
    for(var i=0;i<key1.length;i++){
        try{
            if(key1[i]==key2[i]){// see if there are different in length in terms of key
                if(typeof store1[key1[i]] == typeof store2[key2[i]]){ // check the type of variable and see if they are the same
                    if(typeof store1[key1[i]] == 'object' && store1[key1[i]]==undefined){// if it is object, determine the next layer recursively
                        var nextLayerIsSame = compareStore(store1[key1[i]], store2[key2[i]])
                        if(!nextLayerIsSame){// if next layer are different then is not the same and break loop
                            isSame= false
                            break;
                        }
                    }
                }
                else{
                    isSame=false
                    break;
                }
            }else{
                isSame=false
                break;
            }
        }catch(e){
            console.warn(e)
            isSame=false
            break;
        }
    }
    return isSame
}