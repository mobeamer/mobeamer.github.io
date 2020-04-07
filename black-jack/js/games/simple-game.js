function BlackJackGame()
{ 
    this.deck = [];    
    this.topOfDeckIdx = 0;
    this.debug = true;
    this.gameState = "";
    this.showDealerHand = false;
    this.betAmt = 10;
    this.playerBank = 100;
    this.moneyResult = "";

    this.initialize = function(options)
    {
        gui.setLogoHtml("Black Jack");

        gui.showView("view-black-jack");

        

        var cardClasses = ["C","S","H","D"];
        
        for(var j=0; j<cardClasses.length;j++)
        {
            var cardClass = cardClasses[j];
            
            for(var i=2;i<11;i++)
            {
                var cardFace = i;
                var cardVal = i;
                var imgPath = "img/tiles/cards/" + cardFace + cardClass + ".png";
                var card = {"cardFace": cardFace, "cardClass":cardClass, "cardVal": cardVal, "imgPath": imgPath, "location":"deck"};
                this.deck.push(card);
            }

            var card = {"cardFace": "J",  "cardClass":cardClass, "cardVal": 10, "imgPath": "img/tiles/cards/J" + cardClass + ".png", "location":"deck"};
            this.deck.push(card);

            var card = {"cardFace": "Q",  "cardClass":cardClass, "cardVal": 10, "imgPath": "img/tiles/cards/Q" + cardClass + ".png", "location":"deck"};
            this.deck.push(card);

            var card = {"cardFace": "K",  "cardClass":cardClass, "cardVal": 10, "imgPath": "img/tiles/cards/K" + cardClass + ".png", "location":"deck"};
            this.deck.push(card);
            
            var card = {"cardFace": "A",  "cardClass":cardClass, "cardVal": 11, "imgPath": "img/tiles/cards/A" + cardClass + ".png", "location":"deck"};
            this.deck.push(card);

        }

        this.shuffle(this.deck);

        this.startNextHand();
        
        this.updateDisplay();

        
    }

    this.clearLastHand = function()
    {
        for(var i=0;i<=this.topOfDeckIdx;i++)
        {
            this.deck[i].location = "discard";
        }

        for(var i=0;i<5;i++)
        {
            document.getElementById("div-player-card-" + i).innerHTML = "";
            document.getElementById("div-dealer-card-" + i).innerHTML = "";
        }

        this.showDealerHand = false;
        this.moneyResult = "";
        this.gameState = "playing";

        document.getElementById("div-dealer-hand-val").innerHTML = "";
        document.getElementById("div-player-hand-val").innerHTML = "";
        gui.hideGrowl();
    }

    this.startNextHand = function()
    {
        this.clearLastHand();

        this.dealNextCardTo("dealer");
        this.dealNextCardTo("player");
        this.dealNextCardTo("dealer");
        this.dealNextCardTo("player");

        var p = this.getPlayerHand("player");
        if(this.debug) console.log("player hand",p);

        var d = this.getPlayerHand("dealer");
        if(this.debug) console.log("dealer hand",d);

        this.gameState = "play";

        this.updateDisplay();

    }

    this.playerHit = function()
    {
        this.dealNextCardTo("player");

        var tot = this.getPlayerTotal("player");

        if(tot > 21)
        {
            this.gameState = "player-bust";
        }

        this.updateDisplay();

    }


    this.playerStand = function()
    {
       
        var moreDealerCards = true;
        var failSafeCount=0;

        while(moreDealerCards && failSafeCount < 10)
        {
            console.log("Dealing next card to dealer");

            var tot = this.getPlayerTotal("dealer");

            if(tot <= 16)
            {
                this.dealNextCardTo("dealer");
            }
            else
            {
                moreDealerCards = false;
            }

            if(tot > 21)
            {
                this.gameState = "dealer-bust";
            }
            
            failSafeCount++;
        }

        this.showDealerHand = true;

        this.calculateResults();
        this.updateDisplay();

    }    

    this.calculateResults = function()
    {
        var playerSum = this.getPlayerTotal("player");
        var dealerSum = this.getPlayerTotal("dealer");

        this.gameState = "";
        this.moneyResult = "";

        if(playerSum > 21)
        {
            this.gameState = "player-bust";
            this.moneyResult = "-";
        }

        if(playerSum == 21)
        {
            this.gameState = "player-wins";
            this.moneyResult = "+";
        }        

        if(dealerSum == 21 && this.gameState == "")
        {
            this.gameState = "dealer-wins";
            this.moneyResult = "-";
        }



        if(dealerSum > 21 && this.gameState == "")
        {
            this.gameState = "dealer-bust";
            this.moneyResult = "+";
        }

        if(dealerSum < 21 && playerSum < 21 && this.gameState == "")
        {
            if(dealerSum > playerSum)
            {
                this.gameState = "dealer-wins";
                this.moneyResult = "-";
            }

            if(dealerSum < playerSum)
            {
                this.gameState = "player-wins";
                this.moneyResult = "+";
            }            

            if(dealerSum == playerSum)
            {
                this.gameState = "push";
                this.moneyResult = "";
            }            

        }

        if(this.moneyResult == "-")
        {
            this.playerBank -= this.betAmt;
        }

        if(this.moneyResult == "+")
        {
            this.playerBank += this.betAmt;
        }

    }

    
    this.getPlayerTotal = function(playerID)
    {
        var total = 0;

        for(var i=0;i<this.deck.length;i++)
        {
            if(this.deck[i].location == playerID)
            {
                total+=this.deck[i].cardVal;
            }
        }

        return total;

    }

    this.getPlayerHand = function(playerID)
    {
        var hand = [];
        for(var i=0;i<this.deck.length;i++)
        {
            if(this.deck[i].location == playerID)
            {
                hand.push(this.deck[i]);
            }
        }

        return hand;
    }




    this.shuffle = function (array) 
    {
        array.sort(() => Math.random() - 0.5);
    }

    this.dealNextCardTo = function(playerID)
    {
        this.deck[this.topOfDeckIdx].location = playerID;

        this.topOfDeckIdx++;
    }

    this.updatePlayerHandDisplay = function()
    {
        var playerHand = this.getPlayerHand("player");

        if(this.debug) console.log("playerHand",playerHand);
    
        document.getElementById("div-player-hand-val").innerHTML = this.getPlayerTotal("player");

        for(var i=0;i<playerHand.length;i++)
        {
            var d = document.getElementById("div-player-card-" + i);
            
            d.innerHTML = "<img src='" + playerHand[i].imgPath + "' class='card-img'>";
        }
    }

    
    this.updateDealerHandDisplay = function()
    {
        var dealerHand = this.getPlayerHand("dealer");
        if(this.debug) console.log("dealerHand",dealerHand);
        var dealerSum = 0;

        var d = document.getElementById("div-dealer-card-0");
        
        if(!this.showDealerHand)
        {
            d.innerHTML = "<img src='img/tiles/cards/gray_back.png' class='card-img'>";
            
        }
        else
        {
            document.getElementById("div-dealer-hand-val").innerHTML = this.getPlayerTotal("dealer");
        }



        for(var i=0;i<dealerHand.length;i++)
        {
            var d = document.getElementById("div-dealer-card-" + i);
            
            if(this.showDealerHand && i == 0)
            {
                d.innerHTML = "<img src='" + dealerHand[i].imgPath + "' class='card-img'>";
            }
            
            if(i > 0)
            {
                d.innerHTML = "<img src='" + dealerHand[i].imgPath + "' class='card-img'>";
            }

            dealerSum+= dealerHand[i].cardVal;
            
        }

    }

    this.adjustBet = function(amt)
    {
        this.betAmt+=amt;

        if(this.betAmt <= 0)
        {
            this.betAmt = 10;
            gui.growl("Bet increased to " + this.betAmt, 3);
        }

        if(this.betAmt > this.playerBank)
        {
            this.betAmt = this.playerBank;
            gui.growl("You can't bet more than you have!",3);
        }

        this.updateDisplay();

    }


    this.updatePlayerButtons = function()
    {
        gui.clearButtons();
        
        if(this.gameState == "play")
        {
            gui.addButton("Hit", "play.playerHit()");
            gui.addButton("Stand", "play.playerStand()");
        }
        else
        {
            gui.addButton("New Hand","play.startNextHand()");
        }

        gui.addButton("Raise Bet","play.adjustBet(10)");
        gui.addButton("Lower Bet","play.adjustBet(-10)");

        document.getElementById("div-money").innerHTML = this.playerBank;
        document.getElementById("div-bet-amt").innerHTML = this.betAmt;


    }

    this.updateDisplay = function()
    {
        this.updatePlayerHandDisplay();
        
        this.updateDealerHandDisplay();

        this.updatePlayerButtons();

        if(this.gameState != "play")
        {
            if(this.gameState == "player-bust" || this.gameState == "dealer-bust")
            {
                var gameMsg = "Next Hand";

                if(this.gameState == "player-bust")
                {
                    gameMsg = "You have busted";
                }
                
                if(this.gameState == "dealer-bust")
                {
                    gameMsg = "Dealer Busted";
                    
                }
            }
            
            if(this.gameState == "player-wins")
            {
                gameMsg = "You Win!";
            }

            if(this.gameState == "dealer-wins")
            {
                gameMsg = "You Lose!";
            }

            if(this.gameState == "push")
            {
                gameMsg = "Push!";
            }

            if(this.moneyResult != "") 
            {
                gameMsg += " " + this.moneyResult + "" + this.betAmt;
            }

            console.log("GameState:" + this.gameState);
            console.log("MoneyResult:" + this.moneyResult);
            gui.growl(gameMsg, 5);
            //document.getElementById("div-hand-results").innerHTML = gameMsg;
        }





    }

}