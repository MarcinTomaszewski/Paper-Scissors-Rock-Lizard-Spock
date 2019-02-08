'use-strict';
(function () {
    const domItem = {
        btnsMove: document.querySelectorAll('.js-player-move'),
        resultsInfo: document.querySelector('.results-info'),
        playerMove: document.querySelector('.player-move'),
        compMove: document.querySelector('.comp-move'),
        startBtn: document.querySelector('.start-btn'),
        overlay: document.querySelector('.overlay'),
        modalStart: document.querySelector('.modal-start'),
        modalError: document.querySelector('.modal-error'),
        modalEnd: document.querySelector('.modal-end'),
        modalInfo: document.querySelector('.modal-info'),
        modalEndTitle: document.querySelector('.modal-end-title'),
        closeModalStartBtn: document.querySelector('.close'),
        closeModalErrorBtn: document.querySelector('.modal-error-close'),
        closeModalEndBtn: document.querySelector('.modal-end-close'),
        closeModalInfoBtn: document.querySelector('.modal-info-close'),
        btnPlay: document.querySelector('.btn-play'),
        playerName: document.querySelector('.player'),
        roundsNumber: document.querySelector('.number-rounds'),
        playerId: document.querySelector('.player-name'),
        round: document.querySelector('.round'),
        roundToEnd: document.querySelector('.round-to-end'),
        winPlayer: document.querySelector('.win-player'),
        winComp: document.querySelector('.win-comp'),
        scoreGame: document.querySelector('.score-game'),
        yes: new Audio("sound/yes.wav")
    }
    const gameData = {
        counterRound: 0, //licznik rund
        playerName: "", //imie gracza
        round: 0, //liczba rund
        winPlayer: 0, //ilość wygranych gracza
        winComp: 0, //ilość wygranych comp
        roundToEnd: 0, //ilość rund do końca
        playerChoice: "", //ruch gracza
        compChoice: "", //ruch comp
        finalScore: [] //zmienna przechowująca obiekty z wynikami po każdej rundzie. Na końcu zostaną wyświetlone w modalu.
    }
    // funkcja przesyłająca dane z rundy do tablicy finalScore
    const scoreSendToFinalScore = (counter, player, comp, winP, winC) => {
        gameData.finalScore.push({
            roundResult: counter,
            player: player,
            comp: comp,
            score: `${winP}:${winC}`
        })
    }
    // funkcja sprawdza kto wygrał mecz i wyświetla komunikat w tytule modalu end.
    const sendResultToModalEndTitle = () => {
        if (gameData.roundToEnd === 0) {
            if (gameData.winPlayer > gameData.winComp) domItem.modalEndTitle.textContent = 'Wygrałeś mecz!';
            else if (gameData.winPlayer == gameData.winComp) domItem.modalEndTitle.textContent = 'Remis';
            else domItem.modalEndTitle.textContent = 'Komputer wygrał!';
        }
    }
    // funkcja tworząca tabele z wynikami meczu na koniec gry
    const tableWithGameResults = () => {
        if (gameData.roundToEnd === 0) {
            const table = document.createElement('table');
            table.className = 'score-table';
            domItem.modalEnd.appendChild(table);
            let row = table.insertRow(0);
            row.style.fontWeight = '700';
            row.insertCell(0).textContent = 'Round';
            row.insertCell(1).textContent = 'Player choise';
            row.insertCell(2).textContent = 'Computer choise';
            row.insertCell(3).textContent = 'Game score';
            gameData.finalScore.forEach(function (item, index) {
                row = table.insertRow(index + 1);
                row.insertCell(0).textContent = gameData.finalScore[index].roundResult;
                row.insertCell(1).textContent = gameData.finalScore[index].player;
                row.insertCell(2).textContent = gameData.finalScore[index].comp;
                row.insertCell(3).textContent = gameData.finalScore[index].score;
            })
        }
    }
    // funkcja usuwająca tabele z wynikami
    const removeTable = () => {
        const table = document.querySelector('.score-table');
        if (table) table.remove();
    }
    // funkcja resetuje wyniki(dane) gry 
    const resetData = () => {
        gameData.counterRound = 0;
        gameData.playerName = "";
        gameData.round = 0;
        gameData.winPlayer = 0;
        gameData.winComp = 0;
        gameData.roundToEnd = 0;
        gameData.playerChoice = "";
        gameData.compChoice = "";
        gameData.finalScore = [];
    }
    // funkcja resetująca wyniki gry na ekranie
    const resetDataScreen = () => {
        domItem.round.textContent = 0;
        domItem.roundToEnd.textContent = 0;
        domItem.winPlayer.textContent = 0;
        domItem.scoreGame.textContent = '0:0';
        domItem.winComp.textContent = 0;
        domItem.playerMove.textContent = 0;
        domItem.compMove.textContent = 0;
    }
    // funkcja losująca ruch computera
    const compChoice = () => {
        let compMove = domItem.btnsMove[Math.floor(Math.random() * 5)].dataset.move;
        return compMove;
    }
    // funkcja pobierająca imie i liczbę rund z inputów. Sprawdza poprawność tych danych.
    const nameAndRoundValue = (name, rounds) => {
        if (isNaN(name) && rounds > 0) {
            gameData.playerName = name;
            gameData.round = rounds;
            gameData.roundToEnd = rounds;
            domItem.playerId.textContent = gameData.playerName;
            domItem.round.textContent = gameData.round;
            domItem.roundToEnd.textContent = gameData.round;
            return;
        } else domItem.modalError.classList.add('active');
    }
    // funkcja wyświetla wynik jednej rundy na ekranie
    const whoWinRound = (result) => {
        switch (result) {
            case 'draw':
                domItem.resultsInfo.textContent = 'Remis :/';
                break;
            case 'win':
                domItem.resultsInfo.textContent = 'Wygrałeś rundę :)';
                break;
            case 'lose':
                domItem.resultsInfo.textContent = 'Przegrałeś rundę :(';
        }
    }
    // funkcja wysyłająca informacje o wyborze ruchu gracza i komputera
    const choiseMovePlayerAndComp = () => {
        domItem.playerMove.textContent = gameData.playerChoice;
        domItem.compMove.textContent = gameData.compChoice;
    }
    // funkcja uaktualnia wyniki na ekranie po każdej rundzie
    const updateScore = (result) => {
        switch (result) {
            case 'draw':
                domItem.roundToEnd.textContent = --gameData.roundToEnd;
                gameData.counterRound++;
                break;
            case 'win':
                domItem.roundToEnd.textContent = --gameData.roundToEnd;
                domItem.winPlayer.textContent = ++gameData.winPlayer;
                domItem.scoreGame.textContent = `${gameData.winPlayer}:${gameData.winComp}`;
                gameData.counterRound++;
                break;
            case 'lose':
                domItem.roundToEnd.textContent = --gameData.roundToEnd;
                domItem.winComp.textContent = ++gameData.winComp;
                domItem.scoreGame.textContent = `${gameData.winPlayer}:${gameData.winComp}`;
                gameData.counterRound++;
                break;
        }
    }
    // funkcja wykrywa koniec gry i wyświetla modal end
    const gameEnd = (rounds) => {
        if (rounds === 0) modalOnOff(domItem.overlay, domItem.modalEnd);
    }
    // funkcja ustala kto wygrał rundę
    const resultRound = (playerChoice, compChoice) => {
        if (playerChoice === compChoice) return 'draw';
        if ((playerChoice === 'scissors' && (compChoice === 'paper' || compChoice === 'lizard')) ||
            (playerChoice === 'paper' && (compChoice === 'spock' || compChoice === 'rock')) ||
            (playerChoice === 'rock' && (compChoice === 'lizard' || compChoice === 'scissors')) ||
            (playerChoice === 'lizard' && (compChoice === 'spock' || compChoice === 'paper')) ||
            (playerChoice === 'spock' && (compChoice === 'scissors' || compChoice === 'rock'))) return 'win';
        else return 'lose';
    }
    //funkcja włączająca przycisk start
    const startBtnOn = () => domItem.startBtn.disabled = false;
    //funkcja wyłączająca przycisk start
    const startBtnOff = () => domItem.startBtn.disabled = true;
    // funkcja włączająca przyciski gry (scissors. paper itp.)
    const onBtnsSelection = (btns) => btns.forEach(btn => btn.disabled = false);
    // funkcja wyłączająca przyciski gry (scissors. paper itp.)
    const offBtnsSelection = (btns) => btns.forEach(btn => btn.disabled = true);
    // funkcja dodająca lub zabierająca klase active z modali
    const modalOnOff = (overlay, modal) => {
        overlay.classList.toggle('active');
        modal.classList.toggle('active');
    }
    // funkcja nadająca dzwiek dla przycisków 
    const sound = () => domItem.yes.play();
    // funkcja obsługująca grę
    const startGame = e => {
        gameData.playerChoice = e.target.dataset.move;
        gameData.compChoice = compChoice();
        const result = resultRound(gameData.playerChoice, gameData.compChoice)
        choiseMovePlayerAndComp();
        whoWinRound(result);
        updateScore(result);
        scoreSendToFinalScore(gameData.counterRound, gameData.playerChoice, gameData.compChoice, gameData.winPlayer, gameData.winComp);
        tableWithGameResults();
        sendResultToModalEndTitle();
        gameEnd(gameData.roundToEnd);
        sound();
    }

    // EVENTY
    // OBSŁUGA PRZYCISKÓW WYBORU RUCHU GRACZA
    domItem.btnsMove.forEach(btnMove => btnMove.addEventListener('click', startGame))
    // OBSŁUGA PRZYCISKU START
    domItem.startBtn.addEventListener('click', (e) => {
        modalOnOff(domItem.overlay, domItem.modalStart);
        sound();
    })
    // ZAMKNIECIE MODALA START
    domItem.closeModalStartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalOnOff(domItem.overlay, domItem.modalStart);
        startBtnOn();
        offBtnsSelection(domItem.btnsMove);
        sound();
    })
    // ZAMKNIECIE MODALA ERROR
    domItem.closeModalErrorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        domItem.modalError.classList.remove('active');
        modalOnOff(domItem.overlay, domItem.modalStart);
        sound();
    })
    // ZAMKINIECIE MODALA END
    domItem.closeModalEndBtn.addEventListener('click', () => {
        modalOnOff(domItem.overlay, domItem.modalEnd);
        resetData();
        startBtnOn()
        offBtnsSelection(domItem.btnsMove);
        resetDataScreen();
        sound();
        removeTable();
    })
    // OBSŁUGA PRZYCISKU PLAY W MODALU START
    domItem.btnPlay.addEventListener('click', (e) => {
        e.preventDefault();
        nameAndRoundValue(domItem.playerName.value, domItem.roundsNumber.value);
        modalOnOff(domItem.overlay, domItem.modalStart);
        startBtnOff();
        onBtnsSelection(domItem.btnsMove);
        sound();
    })
    // OBSŁUGA MODALA INFO
    domItem.closeModalInfoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        domItem.modalInfo.classList.remove('active');
        sound();
    })
})()