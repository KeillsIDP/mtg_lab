class Mtg {

    constructor(baseUrl = "https://api.magicthegathering.io/v1/") {
        this.baseUrl = baseUrl;
    }

    loadCards(){
        return fetch(`${this.baseUrl}cards`)
            .then(response=>response.json())
            .then(json=>json.cards)
    }

    loadCardsByName(name){
        return fetch(`${this.baseUrl}cards?name=`+name)
            .then(response=>response.json())
            .then(json=>json.cards)
    }
}


export {Mtg}
