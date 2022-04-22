const API_URL = 'https://mock-api.driven.com.br/api/v6/buzzquizz';
const RECURSO_QUIZZES_URL = '/quizzes'; //Aceita GET e POST

//preciso pegar os valores de qtdPerguntas e qtdniveis pras outras funções..
let QtdPerguntas;
let QtdNiveis;

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
        QtdPerguntas = Number(qtdPerguntas);
        QtdNiveis = Number(qtdNiveis);

        renderFormPerguntasQuizz();
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

// Formulário de Criação de Perguntas - tela 3.2

function renderFormPerguntasQuizz() {
    console.log(QtdPerguntas);
    let perguntas = "";

    for (let i = 1; i< QtdPerguntas; i++){

        perguntas += `
        <div class="fields" action='javascript:validarPergunta(titleQuestion.value, colorQuestion.value, textAnswer.value, urlAnswer.value, textAnswer1.value, urlAnswer1.value, textAnswer2.value, urlAnswer2.value, textAnswer3.value, urlAnswer3.value )' >
            <div class="title-text-field">Pergunta ${i+1}  <img src="/img/preencher.png" alt="" onclick="abrirPergunta(this)"></div>
            
            <div class="hide-questions hidden">
            <input class="text-field" id="titleQuestion" type="text" placeholder="Texto da pergunta" minlength="20">
            <input class="text-field" id="colorQuestion" type="text" placeholder="Cor de fundo da pergunta">
           
            <div class="title-text-field">Resposta correta </div>
            <input class="text-field" id="textAnswer" type="text" placeholder="Texto da pergunta" >
            <input class="text-field" id="urlAnswer" type="url" placeholder="Url da imagem ">
    
            <div class="title-text-field">Resposta incorreta </div>
            <input class="text-field" id="textAnswer1" type="text" placeholder="Texto da pergunta" >
            <input class="text-field" id="urlAnswer1" type="url" placeholder="Url da imagem ">
            <input class="text-field" id="textAnswer2" type="text" placeholder="Texto da pergunta" >
            <input class="text-field" id="urlAnswer2" type="url" placeholder="Url da imagem ">
            <input class="text-field" id="textAnswer3" type="text" placeholder="Texto da pergunta" >
            <input class="text-field" id="urlAnswer3" type="url" placeholder="Url da imagem ">
            </div>
        </div> ` 
    }

    console.log(perguntas.innerHTML);

    const form = `<div class="title-form">Crie suas perguntas</div>
    <form>
        <div class="fields" action='javascript:validarPergunta(titleQuestion.value, colorQuestion.value, textAnswer.value, urlAnswer.value, textAnswer1.value, urlAnswer1.value, textAnswer2.value, urlAnswer2.value, textAnswer3.value, urlAnswer3.value )'>
            <div class="title-text-field">Pergunta 1</div>
            <input class="text-field" id="titleQuestion" type="text" placeholder="Texto da pergunta" minlength="20">
            <input class="text-field" id="colorQuestion" type="text" placeholder="Cor de fundo da pergunta">
           
            <div class="title-text-field">Resposta correta </div>
            <input class="text-field" id="textAnswer" type="text" placeholder="Texto da pergunta" >
            <input class="text-field" id="urlAnswer" type="url" placeholder="Url da imagem ">

            <div class="title-text-field">Resposta incorreta </div>
            <input class="text-field" id="textAnswer1" type="text" placeholder="Texto da pergunta" >
            <input class="text-field" id="urlAnswer1" type="url" placeholder="Url da imagem ">
            <input class="text-field" id="textAnswer2" type="text" placeholder="Texto da pergunta" >
            <input class="text-field" id="urlAnswer2" type="url" placeholder="Url da imagem ">
            <input class="text-field" id="textAnswer3" type="text" placeholder="Texto da pergunta" >
            <input class="text-field" id="urlAnswer3" type="url" placeholder="Url da imagem ">
        </div>

        ${perguntas}

        <button type="submit" class="btn-criar">Prosseguir para criar níveis</button>
    </form>`;

    const divMain = document.querySelector("main");
    divMain.innerHTML = form;
}

function abrirPergunta(img){
    let elemento = img.parentNode;
    let form = elemento.parentNode;
    let listaesc = form.querySelector(".hide-questions");
    listaesc.classList.toggle('hidden');
}

//validações info basicas criaçao de quizz
