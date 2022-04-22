const API_URL = 'https://mock-api.driven.com.br/api/v6/buzzquizz';
const RECURSO_QUIZZES_URL = '/quizzes'; //Aceita GET e POST


//regex para garantir que o q foi passado é um url válido
const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;

/*
    O quizz criado se refere ao quizz q está sendo criado
    Ao longo dos formulários, ele será preenchido com as informaçoes
    O objeto deve ter a seguinte estrutura:

    title:texto
    image:text(url)
    questions:lista de questoes
        title:texto
        color:cor em forma hexadecimal
        answers:lista de respostas
            text:texto
            image:texto(url)
            isCorrectAnswer:boolean
    levels:lista de niveis
        title:texto
        image:texto(url)
        text:texto
        minValue:numero
*/
const quizzCriadoObj = {};

function validarInfoBasicas(titulo, imageUrl, qtdPerguntas, qtdNiveis) {
    if (tituloIsValid(titulo)
        && urlIsValid(imageUrl)
        && qtdPerguntasIsValid(qtdPerguntas)
        && qtdNiveisIsValid(qtdNiveis)) {

        //aqui vai renderizar a proxima etapa das perguntas
    } else {
        alert("Você preencheu os dados de forma errada, preencha novamente!");
    }
}


getQuizzes();
//requisiçoes
function getQuizzes() {
    const promise = axios.get(API_URL + RECURSO_QUIZZES_URL);
    promise.then((response) => {
        const listQuizzes = response.data.map(quizzConstructor);

        console.log(`LIST QUIZZES: ${listQuizzes}`);

        renderListQuizzes(listQuizzes);
    });

    promise.then((error) => {
        console.log(error);
    });
}



//construtores recebem um mapa como parametro e retornam o objeto
function quizzConstructor(quizzData) {
    const quizz = {};
    quizz.title = quizzData.title;
    quizz.image = quizzData.image;
    quizz.questions = quizzData.questions.map(questionConstructor);
    quizz.levels = quizzData.levels.map(levelConstructor);

    return quizz;
}

function questionConstructor(questionData) {
    const question = {};
    question.title = questionData.title;
    question.color = questionData.color;
    question.answers = questionData.answers.map(answerConstructor);

    return question;
}

function answerConstructor(answerData) {
    const answer = {};
    answer.text = answerData.text;
    answer.image = answerData.image;
    answer.isCorrectAnswer = answerData.isCorrectAnswer;

    return answer;
}

function levelConstructor(levelData) {
    const level = {};

    level.title = levelData.title;
    level.image = levelData.image;
    level.text = levelData.text;
    level.minValue = levelData.minValue;

    return level;
}

//finalização da criação do quizz
function onTapBackHome() {
    console.log("Voltou home");
    //TODO criar funcao de renderizar
    //TODO: adicionar na lista de quizzes do usuário
}

//Aqui recebe o quizz(index no array, id ou objeto) como parametro para renderizar na tela
function onTapQuizz(quizz) {
    console.log(quizz);
    console.log("Apertou quizz");
    //TODO: criar funcao de renderizar
}

function renderListQuizzes(quizzes) {
    const quizzesList = `
        <div>
            <span class="title-text-field">Todos os quizzes</span>
            <div class="lista-quizzes">
            </div>
        </div>
    `;
    document.querySelector("main").innerHTML = quizzesList;
    quizzes.map(renderCardQuizzLista);
}

function renderCardQuizzCricao(quizz) {
    const cardQuizz = `<div class="card-quizz criacao-card" onclick="onTapQuizz('${quizz}')">
            <img src="${quizz.image}"
                alt="Imagem de exibição do Quizz">
            <div class="degrade-card-quizz"></div>
            <span>${quizz.title}</span>
        </div>`;
    document.querySelector(".lista-quizzes").innerHTML += cardQuizz;
}

function renderCardQuizzLista(quizz) {
    const cardQuizz = `<div class="card-quizz" onclick="onTapQuizz('${quizz}')">
            <img src="${quizz.image}"
                alt="Imagem de exibição do Quizz">
            <div class="degrade-card-quizz"></div>
            <span>${quizz.title}</span>
        </div>`;
    document.querySelector(".lista-quizzes").innerHTML += cardQuizz;
}

//Aqui recebe o objeto do quizz como parametro pra já renderizar com as informaçoes corretas
function renderQuizzCreated(quizz) {
    const quizzToRender = `<div class="title-form">Seu quizz está pronto!</div>
        ${renderCardQuizzCricao(quizz)}
        <button class="btn-criar" onclick="onTapQuizz()">Acessar Quizz</button>
        <span class="sub-text" onclick="onTapBackHome()">Voltar pra home</span>`;

    const divMain = document.querySelector("main");
    divMain.innerHTML = quizzToRender;
}

function renderFormInfoBasicaQuizz() {
    const form = `<div class="title-form">Comece pelo começo</div>
        <form
            action='javascript:validarInfoBasicas(titleQuizz.value, urlQuizz.value, qtdPergQuizz.value, qtdNiveisQuizz.value)'>
            <div class="fields">
                <input class="text-field" id="titleQuizz" type="text" placeholder="Título do seu quizz" minlength="20"
                    maxlength="65">
                <input class="text-field" id="urlQuizz" type="url" placeholder="Url da imagem do seu quizz">
                <input class="text-field" id="qtdPergQuizz" type="number"
                    placeholder="Quantidade de perguntas do quizz">
                <input class="text-field" id="qtdNiveisQuizz" type="number" placeholder="Quantidade de níveis do quizz">
            </div>
            <button type="submit" class="btn-criar">Prosseguir para criar perguntas</button>
        </form>`;

    const divMain = document.querySelector("main");
    divMain.innerHTML = form;
}

//validações info basicas criaçao de quizz
function tituloIsValid(titulo) {
    if (titulo != null)
        return true;
    return false;
}

function urlIsValid(url) {
    if (url.match(urlRegex))
        return true;
    return false;
}

function qtdPerguntasIsValid(qtdPerguntas) {
    if (qtdPerguntas >= 3)
        return true;
    return false;
}

function qtdNiveisIsValid(qtdNiveis) {
    if (qtdNiveis >= 2)
        return true;
    return false;
}
