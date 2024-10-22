import {Mtg} from "./api/mtg.js";
import {ColorStats} from "./widgets/colorStats.js";
import {ManaCostStats} from "./widgets/manaCostStats.js";
import {Card} from "./api/card.js";

document.addEventListener("DOMContentLoaded", setup)
const deck = []
const cardsContainer = document.getElementById("cardsContainer")

function setup() {
    const mtg = new Mtg();
    searchInput = document.getElementById("search_input");

    mtg.loadCards()
        .then((cards) => showCards(cards))

    searchInput.addEventListener("change", (event) => {
        mtg.loadCardsByName(searchInput.value)
        .then((cards) => showCards(cards))
    })
}

function showCards(cards) {
    const menu = document.getElementById('listContainer');
    const list = document.createElement('ul');

    cards.forEach(card => {
        const listItem = document.createElement('li');
        listItem.innerHTML = card.name;
        listItem.addEventListener("click",(event)=>addCardToDeck(card));
        list.appendChild(listItem)
    })
    menu.innerHTML = ''

    menu.appendChild(list);
}

function addCardToDeck(card) {
    let savedCard;
    deck.forEach((x)=>{
        if(x.name==card.name){
            savedCard = x;
        }
    });

    if (savedCard!=null) {
        if((savedCard.amount<4 || card.type.includes("Land")))
            savedCard.increaseAmount();
        else
            return;
    }
    else {
        savedCard = new Card(card.name,
            1,
            card.manaCost,
            card.colors);
        deck.push(savedCard);
    }

    let cardObject = document.getElementById(card.name);
    if(cardObject==null){
        cardObject = document.createElement('div');
        cardObject.id = card.name;

        cardImage = document.createElement('img');
        cardImage.src = card.imageUrl;

        cardAmount = document.createElement('p');
        cardAmount.innerHTML = savedCard.amount;

        cardsContainer.appendChild(cardObject);
        cardObject.appendChild(cardAmount);
        cardObject.appendChild(cardImage);

        cardObject.addEventListener("click",(event)=>deleteCard(card))
    } else {
        cardObject.firstChild.innerHTML = savedCard.amount;
    }
    console.log(deck);
    updateWidgets()
}

function deleteCard(card) {
    let savedCard;
    deck.forEach((x)=>{
        if(x.name==card.name){
            savedCard = x;
        }
    });

    if(savedCard==null)
        return;

    if(savedCard.amount <= 1){
        let cardObject = document.getElementById(card.name);
        deck.splice(deck.indexOf(savedCard), 1);
        if(cardObject == null){
            return;
        }

        cardObject.remove();
    } else {
        let cardObject = document.getElementById(card.name);
        savedCard.decreaseAmount();
        cardObject.firstChild.innerHTML = savedCard.amount;
    }
    updateWidgets()
}

function updateWidgets() {
    document.getElementById("manaStats").innerHTML = '';
    document.getElementById("colorStats").innerHTML = '';
    const regexMana = /\{(.*?)\}/;
    const colorData = [
        { color: 'White', count: 0 },
        { color: 'Blue', count: 0 },
        { color: 'Black', count: 0 },
        { color: 'Red', count: 0 },
        { color: 'Green', count: 0 },
        { color: 'Colorless', count: 0 }
    ];
    const manaData = [
        { cost: 0, count: 0 },
        { cost: 1, count: 0 },
        { cost: 2, count: 0 },
        { cost: 3, count: 0 },
        { cost: 4, count: 0 },
        { cost: 5, count: 0 },
        { cost: 6, count: 0 },
        { cost: '7+', count: 0 }
    ];
    deck.forEach((x)=>{
        const manaCost = x.mana.match(regexMana)[1];
        if(manaCost>6){
            manaData.find(item => item.cost == '7+').count+=x.amount;
        } else if(!isNaN(manaCost)){
            manaData.find(item => item.cost == manaCost).count+=x.amount;
        } else {
            manaData.find(item => item.cost == 0).count+=x.amount;
        }

        if(x.color==null)
            colorData.find(item=>item.color=="Colorless").count+=x.amount
        else
            x.color.forEach((c)=>{
                switch(c){
                    case "W": colorData.find(item=>item.color== "White").count+=x.amount
                        break;
                    case "U": colorData.find(item=>item.color== "Blue").count+=x.amount
                        break;
                    case "B": colorData.find(item=>item.color== "Black").count+=x.amount
                        break;
                    case "R": colorData.find(item=>item.color== "Red").count+=x.amount
                        break;
                    case "G": colorData.find(item=>item.color== "Green").count+=x.amount
                        break;
                }
            })
    })

    console.log(manaData);
    new ManaCostStats().buildStats(document.getElementById("manaStats"),manaData);
    new ColorStats().buildStats(document.getElementById("colorStats"),colorData);
}