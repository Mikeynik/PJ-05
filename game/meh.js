let snake, food, timerId, speed = 300, stopMovement = false
let currentScore = 0
let bestScore = 0
let death_audio = new Audio("Dark Souls - Звук Смерти_.mp3")
let music = new Audio("8597bb02c2b2555.mp3")
let currentScoreBlock = document.getElementsByClassName("current-score")[0]
let bestScoreBlock = document.getElementsByClassName("best-score")[0]

// Функция для заполнения игрового поля
function fillField() {
    // Объявляем переменную таблицы и записываем в неё элемент из HTML
    let table = document.getElementById("game-field")

    // Цикл для добавления 10ка строк в таблицу
    for (let i = 0; i < 10; i++) {

        // Дописываем во внутренний HTML строку
        table.innerHTML += `<tr id="${"tr-"+i}"></tr>`

        // Объявляем переменную и пишем в неё элемент строки
        let table_row = document.getElementById(`${"tr-"+i}`)

        // Цикл для заполнения текущей строки ячейками
        for (let j = 0; j < 10; j++) {
            // Дописываем в строку ячейку
            table_row.innerHTML += `<td class="cell" id="${"td-"+i+"_"+j}"></td>`
        }
    }
}

// функция для создания змейки
function makeSnake() {
    // объект с параметрами змейки 
    snake = {
        bodyParts: ["td-0_0", "td-0_1", "td-0_2", "td-0_3", "td-0_4", ],
        // tail: bodyParts[0],
        // head: bodyParts[-1],

        direction: "вправо"
    }
    
    // для каждой части тела змейки покрасить соответсвующую ячейку в черный 
    snake.bodyParts.forEach(
        (element)=>{
            let cell = document.getElementById(element)
            cell.setAttribute("style", "background-color: black")
        }
    )   
    
}

// функция движения змейки 
function moveSnake() {
    // находим голову
    let head = document.getElementById(snake.bodyParts[snake.bodyParts.length-1])

    // находим строку головы 
    let row = head.id.split("-")[1]
    row = Number(row.split("_")[0])

    // находим колонку головы 
    let col = Number(head.id.split("_")[1])

    let snakeDeathParts = []
    for (let i = 0; i < snake.bodyParts.length-1; i++){
        let part = snake.bodyParts[i]
        
        let rowX = part.split("-")[1]
        rowX = Number(rowX.split("_")[0])

        let colX = Number(part.split("_")[1])

        snakeDeathParts.push({rowX, colX})
    }

    function death(){
        stopMovement = true
        updateBestScore()

        document.getElementById("death-screen").classList.add("active")
        document.getElementById("death-text").classList.add("show")
        document.getElementById("restart").classList.add("show")

        death_audio.load()    
        death_audio.play()

        music.load()
    }

    let deleteTail = true

    // в зависимости от последнего направления меняем строку или колонку
    switch (snake.direction) {
        case "вправо":
            // Если змейка попала в себя
            snakeDeathParts.forEach((part)=>{
                if ((col+1 == part.colX) && (row == part.rowX)){death()}
            })
            
            // Если змейка попала в стену
            if (col+1 == 10) {death()}

            // Если змейка попала в еду
            if (head.id == food) {
                deleteTail = false
                increaseCurrScore()
            }

            else{col = col+1}
            break;



        case "влево":
            // Если змейка попала в себя
            snakeDeathParts.forEach((part)=>{
                if ((col-1 == part.colX) && (row == part.rowX)){death()}
            })

            // Если змейка попала в стену
            if (col-1 == -1) {death()}

            // Если змейка попала в еду
            if (head.id == food) {
                deleteTail = false
                increaseCurrScore()
            }

            else{col = col-1}
            break;



        case "вниз":
            // Если змейка попала в себя
            snakeDeathParts.forEach((part)=>{
                if ((row+1 == part.rowX) && (col == part.colX)){death()}
            })

            // Если змейка попала в стену
            if (row+1 == 10) {death()}

            // Если змейка попала в еду
            if (head.id == food) {
                deleteTail = false
                increaseCurrScore()
            }

            else{row = row+1}
            break;



        case "вверх":
            // Если змейка попала в себя
            snakeDeathParts.forEach((part)=>{
                if ((row-1 == part.rowX) && (col == part.colX)){death()}
            })

            // Если змейка попала в стену
            if (row-1 == -1) {death()}

            // Если змейка попала в еду
            if (head.id == food) {
                deleteTail = false
                increaseCurrScore()
            }

            else{row = row-1}
            break;



        default:
            break;
    }

    if (deleteTail) {
        // удаляем хвост 
        let tail = document.getElementById(snake.bodyParts[0])
        tail.setAttribute("style", "")
        snake.bodyParts.splice(0, 1)
    } else {
        makeFood()
    }

    // находим ячейку новой головы и красим в черный
    if (!stopMovement) {
        let newHead = document.getElementById(`${"td-"+row+"_"+col}`)
        newHead.setAttribute("style", "background-color: black")
        snake.bodyParts.push(`${"td-"+row+"_"+col}`)
    
        console.log(newHead)        
    }

}

function turnSnake (event){
    let key = event.code

    switch (key) {
        case "KeyW":
            if (snake.direction != "вниз"){snake.direction = "вверх"}
            break;
        case "KeyS":
            if (snake.direction != "вверх"){snake.direction = "вниз"}
            break;
        case "KeyA":
            if (snake.direction != "вправо"){snake.direction = "влево"}
            break;
        case "KeyD":
            if (snake.direction != "влево"){snake.direction = "вправо"}
            break;

        case "KeyP":
            makeFood()
            break;

        default:
            break;
    }
}

function getRandomArbitrary(min, max) {return Math.random() * (max - min) + min;}

function makeFood (){
    function generateCoords (){
        // колонка
        let col = Math.round(getRandomArbitrary(0, 9))
        
        // строка
        let row = Math.round(getRandomArbitrary(0, 9))

        return "td-"+col+"_"+row
    }

    function checkCoords (){
        food = generateCoords()

        snake.bodyParts.forEach((part)=>{
            if (part == food){checkCoords()}
        })
    }

    if (snake.bodyParts.length <= 38){
        checkCoords()
    } else {
        // победа
    }

    let food_element = document.getElementById(food)
    food_element.setAttribute("style", "background-color: blue")

}

function startGame() {
    // запустить постоянное движение змейки раз в speed (2000) милисекунд
    timerId = setInterval(()=>{
        // подвинуть змейку
        if (!stopMovement) {moveSnake()}
    }, speed)

    makeFood()
    music.loop = true
    music.play()
}

function init() {
    // заполнить поле 
    fillField()

    // нарисовать змейку
    makeSnake()
    
    fillScoreBlock()
    fillBestScoreBlock()

    document.getElementsByTagName("body")[0].onkeydown = turnSnake
}

// Функция заполнения счетчика очков
function fillScoreBlock() {
    currentScoreBlock.innerText = `Текущий: ${currentScore}`
}
function fillBestScoreBlock() {
    // Проверяем хранилище на наличие лучшего счёта
    let storageScore = window.localStorage.getItem("snakeBestScore")
    if (storageScore === null) {
        window.localStorage.setItem("snakeBestScore", "0")
    } else {
        bestScore = +storageScore
    }

    bestScoreBlock.innerText = `Лучший: ${bestScore}`
}
function increaseCurrScore() {
    currentScore += 1
    currentScoreBlock.innerText = currentScore
    fillScoreBlock()
}
function updateBestScore() {
    if (currentScore > bestScore){
        window.localStorage.setItem("snakeBestScore", `${currentScore}`)
    }
}