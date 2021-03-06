var axios = require('axios');
var DomParser = require('dom-parser');
const DIKI_URL = "https://www.diki.pl";

exports.getTranslation = (phrase) => {
    const DICT_EN_URL = DIKI_URL+"/slownik-angielskiego";
    try {
        return axios({
            url: DICT_EN_URL,
            methog: 'get',
            params: {
                q: phrase
            }
        })
    } catch (error) {
        console.log('###Error: getTranslation');
        console.error(error);
    }
}


exports.parseSimple = (html) => {    
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    let translations = [];
    let dE = dom.getElementsByClassName('foreignToNativeMeanings')[0];   
    if (dE) {
        let ts = dE.getElementsByClassName('plainLink');
        if (ts) ts.forEach(element => {
            translations.push(element.innerHTML);    
        });
    }
    return translations;
}

String.prototype.replaceHtmlEntites = function() {
    var s = this.trim().replace(/<[^>]*>?/gm, '').replace(/\s\s+/g, ' ');
    var translate_re = /&(nbsp|amp|quot|lt|gt|apos);/g;
    var translate = {"nbsp": " ","amp" : "&","quot": "\"","lt"  : "<","gt"  : ">", "apos": "\""};
    return ( s.replace(translate_re, function(match, entity) {
      return translate[entity];
    }) );
};

exports.parse = (html) => {    
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    var translations = [];

    try {
        var drlc = dom.getElementsByClassName('diki-results-left-column');
        if (drlc.length === 0) return [];
        var dictionaryEntities = drlc[0].getElementsByClassName('dictionaryEntity');	
        //console.log(dictionaryEntities);				
        for (var de = 0; de < dictionaryEntities.length; de++) {	

            var obj = {};
            obj.hws = [];
            obj.meanings = [];
            obj.examples = []; 
            obj.audiourls = [];
               
            //part of speech
            var partOfSpeech = dictionaryEntities[de].getElementsByClassName('partOfSpeech');
            obj.part = (partOfSpeech.length > 0 ? partOfSpeech[0].innerHTML.replaceHtmlEntites() : '');
            
            //english
            var hws = dictionaryEntities[de].getElementsByClassName('hws')[0].getElementsByClassName('hw');           
            for (var h = 0; h < hws.length; h++) {
                let txt = hws[h].innerHTML.replaceHtmlEntites();
                obj.hws.push(txt);
            }

            //audio
            var audios = dictionaryEntities[de].getElementsByClassName('hws')[0].getElementsByClassName('audioIcon');
            audios.forEach(audio => {
                let audiourl = audio.getAttribute('data-audio-url');
                console.debug("audiourl", audiourl);
                obj.audiourls.push(DIKI_URL+audiourl);
            });

            //meanings
            var foreignToNativeMeanings = dictionaryEntities[de].getElementsByClassName('foreignToNativeMeanings');
            for (var fn = 0; fn < foreignToNativeMeanings.length; fn++) {     

                //translations
                var hw = foreignToNativeMeanings[fn].getElementsByClassName('hw');						
                for (var pl = 0; pl < hw.length; pl++) {
                    let txt = hw[pl].innerHTML.replaceHtmlEntites();
                    obj.meanings.push(txt);
                }
                
                //sample sentences
                var exampleSentences = foreignToNativeMeanings[fn].getElementsByClassName('exampleSentence');
                for (var es = 0; es < exampleSentences.length; es++) {
                    let txt = exampleSentences[es].innerHTML.replaceHtmlEntites();							
                    obj.examples.push(txt);
                }
            }
            translations.push(obj);
        }
        //console.log(JSON.stringify(translations));
        //console.log(translations);
        return translations;
    } catch (e) {
        console.log(e.toString());
        console.error();
    }
}


//structure
//dictionaryEntity
//  hws
//    hw
//    recordingsAndTranscriptions
//    dictionaryEntryHeaderAdditionalInformation
//
//  partOfSpeechSectionHeader
//    partOfSpeech
//
//  foreignToNativeMeanings
//

// exports.translate = async (text) => {
//     return await getTranslation(text);
// }

// const translateXXX = async (text) => {
//     await getTranslation(text)
//         .then(translation => {
//         //console.log("get", translation.data);
//         let result = parse(translation.data);
//         //console.log("parse", result);
//         res.json({ message: result });
//     })
//     .catch(error => {
//         //console.log('ERROR-404');
//         console.log(error);
//         res.json({ message: "ERROR-404" });
//     })
// }