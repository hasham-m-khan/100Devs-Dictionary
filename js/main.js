btn = document.querySelector('button')
btn.addEventListener('click', getMeaning)

async function getMeaning () {
    let word = document.querySelector('#wordEl').value;

    if (word) {
        let wordObj = await getWordObj(word);
        updateDom(wordObj)
    }
}

async function getWordObj (word) {
    let obj;
    await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(res => res.json())
        .then(data => {
            obj = data[0];
        });
    return obj;
}

function updateDom (wordObj) {
    let baseElement = document.querySelector('#wordInfo')
    baseElement.innerHTML = ''

    let titleElement = document.createElement('h2')
    titleElement.innerText = wordObj.word
    baseElement.appendChild(titleElement)

    // All POSSIBLE MEANINGS OF THE WORD
    for (meaning of wordObj.meanings) {

        let meaningsElement = document.createElement('section')
        
        let meaningTypeElement = document.createElement('section')
        meaningTypeElement.classList.add('meaning-type')
        
        let meaningTypeTitleElement = document.createElement('h3')
        meaningTypeTitleElement.innerText = meaning.partOfSpeech
        meaningTypeElement.appendChild(meaningTypeTitleElement)
        
        // DEFINITIONS
        let definitionListElement = document.createElement('ul')
        for (definition of meaning.definitions) {
            let definitionElement = document.createElement('li')
            definitionElement.innerText = definition.definition

            // IF DEFINITION HAS EXAMPLES
            if (definition.example) {
                let exampleListElement = document.createElement('ul')
                let exampleElement = document.createElement('li')
                let exampleQuoteElement = document.createElement('q')
                exampleQuoteElement.innerText = definition.example

                exampleElement.appendChild(exampleQuoteElement)
                exampleListElement.appendChild(exampleElement)
                definitionElement.appendChild(exampleListElement)
            }

            definitionListElement.appendChild(definitionElement)
        }
        meaningTypeElement.appendChild(definitionListElement)
        
        // SYNONYMS
        if (meaning.synonyms.length > 0) {
            let synonymsElement = document.createElement('section')
            synonymsElement.classList.add('synonyms')
            let synonymsTitleElement = document.createElement('h4')
            synonymsTitleElement.innerText = 'Synonyms'
            let synoynmsListElement = document.createElement('ul')
            synonymsElement.appendChild(synonymsTitleElement)
            synonymsElement.appendChild(synoynmsListElement)
    
            for (synonym of meaning.synonyms) {
                let synonymLiElement = document.createElement('li')
                let synonymElement = document.createElement('span')
                synonymElement.innerText = synonym
    
                synonymElement.addEventListener('click', searchWord)
                synonymLiElement.appendChild(synonymElement)
                synoynmsListElement.appendChild(synonymLiElement)
            }
            meaningTypeElement.appendChild(synonymsElement)
        }
        
        meaningsElement.appendChild(meaningTypeElement)
        baseElement.appendChild(meaningsElement)
    }



}

function searchWord (click) {
    document.querySelector('#wordEl').value = click.target.innerText;
    getMeaning()
}
