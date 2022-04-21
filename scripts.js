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
            texto:texto
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


//finalização da criação do quizz
function onTapBackHome() {
    console.log("Voltou home");
    //TODO criar funcao de renderizar
    //TODO: adicionar na lista de quizzes do usuário
}

//Aqui recebe o quizz(index no array, id ou objeto) como parametro para renderizar na tela
function onTapQuizz(quizz) {
    console.log("Apertou quizz");
    //TODO: criar funcao de renderizar
}

//Aqui recebe o objeto do quizz como parametro pra já renderizar com as informaçoes corretas
function renderQuizzCreated(quizz) {
    const quizzToRender = `<div class="title-form">Seu quizz está pronto!</div>
        <div class="card-quizz criacao-card" onclick="onTapQuizz()">
            <img src="${quizz.image}"
                alt="Imagem de exibição do Quizz">
            <div class="degrade-card-quizz"></div>
            <span>${quizz.title}</span>
        </div>
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
