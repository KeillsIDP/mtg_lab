class Card {
    constructor(name,amount,mana,color){
        this.name = name;
        this.amount = amount;
        this.mana = mana;
        this.color = color;
    }

    increaseAmount() {
        this.amount++;
    }

    decreaseAmount() {
        this.amount--;
    }
}

export {Card}