const API_URL = 'https://mock-api.driven.com.br/api/v6/buzzquizz';
const RECURSO_QUIZZES_URL = '/quizzes'; //Aceita GET e POST

//regex para garantir que o q foi passado é um url válido
const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
const colorRegex = /^#[a-fA-F0-9]{6}/;


renderFormInfoBasicaQuizz();
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

//requisiçoes
function getQuizzes() {
    const promise = axios.get(API_URL + RECURSO_QUIZZES_URL);
    promise.then((response) => {
        const listQuizzes = response.data.map(quizzConstructor);
        renderListQuizzes(listQuizzes);
    });
    promise.then((error) => {
        console.log(error);
    });
}

//Navegação =======================================
//finalização da criação do quizz
function onTapBackHome() {
    console.log("Voltou home");
    //TODO criar funcao de renderizar
    //TODO: adicionar na lista de quizzes do usuário
}

//Aqui recebe o quizz(index no array, id ou objeto) como parametro para renderizar na tela
function onTapQuizz(quizz) {
    //TODO: criar funcao de renderizar
}

//TELA PRINCIPAL =======================================
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



function renderCardQuizzLista(quizz) {
    const cardQuizz = `<div class="card-quizz" onclick="onTapQuizz('${quizz}')">
            <img src="${quizz.image}"
                alt="Imagem de exibição do Quizz">
            <div class="degrade-card-quizz"></div>
            <span>${quizz.title}</span>
        </div>`;
    document.querySelector(".lista-quizzes").innerHTML += cardQuizz;
}


//Funçoes utilitárias
//Percorre todos os forms na tela e vai dando submit
function submitAll() {
    const forms = document.forms;
    for (let i = 0; i < forms.length; i++) {
        const formValido = forms[i].reportValidity();
        if (formValido) {
            forms[i].submit();
        }
    }
}

//Construtores ================================
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


//CRIACAO DE QUIZ ==============================

//Visual Utilitario
//Abre e fecha os elementos
function abrirElemento(elemento) {
    const div = elemento.parentNode;
    const form = div.parentNode;
    const listaEscondida = form.querySelector(".hide-questions");
    listaEscondida.classList.toggle('hidden');
}

//Renderização visual
function renderCardQuizzCricao(quizz) {
    const cardQuizz = `<div class="card-quizz criacao-card" onclick="onTapQuizz('${quizz}')">
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

function renderFormNiveisQuizz(qtdNiveis) {
    let niveis = "";
    for (let i = 0; i < qtdNiveis; i++) {
        niveis += `
        <form action='javascript:validarNivel(titleLevel.value, %right.value, urlLevel.value, descriptionLevel.value)'>
            <div class="fields">
                <div class="title-text-field">Nivel ${i + 1}  <img src="/img/preencher.png" alt="" onclick="abrirElemento(this)"></div>                
                <div class="hide-questions hidden">
                    <input class="text-field" id="titleLevel" type="text" minlength="10" placeholder="Título do nível">
                    <input class="text-field" id="%right" type="number" placeholder="% de acerto mínima" minlength="0" maxlength="100">
                    <input class="text-field" id="urlLevel" type="url" placeholder="Url da imagem do nível ">
                    <input class="text-field" id="descriptionLevel" type="text" placeholder="Descrição do nível" minlength="30" >
                </div>
            </div>
        </form>`
    }

    const form = `<div class="title-form">Agora, decida os níveis</div>
    <div>
        <form action='javascript:validarNivel(titleLevel.value, %right.value, urlLevel.value, descriptionLevel.value)'>
        </form>
        ${niveis}
        <button type="submit" onclick = "submitAll()"class="btn-criar">Finalizar Quizz</button>`;

    const divMain = document.querySelector("main");
    divMain.innerHTML = form;
}

// Formulário de Criação de Perguntas - tela 3.2
function renderFormPerguntasQuizz(qtdPerguntas, qtdNiveis) {
    let perguntas = "";
    for (let i = 0; i < qtdPerguntas; i++) {
        perguntas += `
        <form action='javascript:validarPergunta(titleQuestion${i + 1}.value, colorQuestion${i + 1}.value, textAnswer${i + 1}.value, urlAnswer${i + 1}.value, textAnswer1${i + 1}.value, urlAnswer1${i + 1}.value, textAnswer2${i + 1}.value, urlAnswer2${i + 1}.value, textAnswer3${i + 1}.value, urlAnswer3${i + 1}.value )' >
            <div class="fields">
                <div class="title-text-field">Pergunta ${i + 1}  <img src="/img/preencher.png" alt="" onclick="abrirElemento(this)"></div>
                
                <div class="hide-questions  ${i != 0 ? 'hidden' : ''}">
                <input class="text-field" id="titleQuestion${i + 1}" type="text"  minlength="20" placeholder="Texto da pergunta" >
                <input class="text-field" id="colorQuestion${i + 1}" type="text" placeholder="Cor de fundo da pergunta (#FFFFFF)">
            
                <div class="title-text-field">Resposta correta </div>
                <input class="text-field" id="textAnswer${i + 1}" type="text" placeholder="Texto da pergunta" >
                <input class="text-field" id="urlAnswer${i + 1}" type="url" placeholder="Url da imagem ">
        
                <div class="title-text-field">Resposta incorreta </div>
                <input class="text-field" id="textAnswer1${i + 1}" type="text" placeholder="Texto da pergunta" >
                <input class="text-field" id="urlAnswer1${i + 1}" type="url" placeholder="Url da imagem ">
                <input class="text-field" id="textAnswer2${i + 1}" type="text" placeholder="Texto da pergunta" >
                <input class="text-field" id="urlAnswer2${i + 1}" type="url" placeholder="Url da imagem ">
                <input class="text-field" id="textAnswer3${i + 1}" type="text" placeholder="Texto da pergunta" >
                <input class="text-field" id="urlAnswer3${i + 1}" type="url" placeholder="Url da imagem ">
                </div>
            </div> 
        </form>`
    }
    const form = `<div class="title-form">Crie suas perguntas</div>
    <div>
        ${perguntas}
        <button type="submit" onclick = "submitAll(${true}, ${qtdNiveis})" class="btn-criar">Prosseguir para criar níveis</button>
    </div>`;
    const divMain = document.querySelector("main");
    divMain.innerHTML = form;
}

//Validacoes na criacao de quizz
function validarInfoBasicas(titulo, imageUrl, qtdPerguntas, qtdNiveis) {
    if (tituloIsValid(titulo)
        && urlIsValid(imageUrl)
        && qtdPerguntasIsValid(qtdPerguntas)
        && qtdNiveisIsValid(qtdNiveis)) {
        quizzCriadoObj.title = titulo;
        quizzCriadoObj.image = imageUrl;
        renderFormPerguntasQuizz(qtdPerguntas, qtdNiveis);
    } else {
        alert("Você preencheu os dados de forma errada, preencha novamente!");
    }
}


function validarPergunta(pergunta, cor, resposta, url, resposta1, url1, resposta2, url2, resposta3, url3) {
    if (questionIsValid(pergunta) && colorIsValid(cor)
        && correctAnswerIsValid(resposta, url)
        && verifyWrongAnswers(resposta1, url1, resposta2, url2, resposta3, url3)) {
        if (quizzCriadoObj.questions == null) {
            quizzCriadoObj.questions = [];
        }
        const respostas = [];
        respostas.push({
            texto: resposta,
            image: url,
            isCorrectAnswer: true
        });
        if (resposta1 != null && resposta1 != "" && url1 != null && url1 != "") {
            respostas.push({
                texto: resposta1,
                image: url1,
                isCorrectAnswer: false
            });
        }
        if (resposta2 != null && resposta2 != "" && url2 != null && url2 != "") {
            respostas.push({
                texto: resposta2,
                image: url2,
                isCorrectAnswer: false
            });
        }
        if (resposta3 != null && resposta3 != "" && url3 != null && url3 != "") {
            respostas.push({
                texto: resposta3,
                image: url3,
                isCorrectAnswer: false
            });
        }
        const question = {
            title: pergunta,
            color: cor,
            answers: respostas,
        };
        quizzCriadoObj.questions.push(question);
        console.log(quizzCriadoObj);
        renderFormNiveisQuizz(qtdNiveis);
    } else {
        alert("Você preencheu um ou mais campos de forma errada!");
    }
}

//validações perguntas criaçao de quizz
function questionIsValid(texto) {
    if (texto != null && texto != "")
        return true;
    return false;
}

//Verifica se todas as respostas erradas sao validas
function verifyWrongAnswers(texto1, url1, texto2, url2, texto3, url3) {
    const wronAnswersValidations = [wrongAnswerIsValid(texto1, url1), wrongAnswerIsValid(texto2, url2), wrongAnswerIsValid(texto3, url3),];
    if (wronAnswersValidations.indexOf(false) == -1 && (
        (questionIsValid(texto1) && urlIsValid(url1)) ||
        (questionIsValid(texto2) && urlIsValid(url2)) ||
        (questionIsValid(texto3) && urlIsValid(url3)))) { //verifica se nao existe valor false e se ao menos 1 dos true é diferente de vazio
        return true;
    }
    return false;
}

//Essa aqui verifica pq as respostas erradas podem ser válidas mesmo nao existindo
//Mas essa condiçao so existe se o texto e url forem iguais, ou seja
//Ou ambos sao válidos ou ambos sao inválidos, o que muda é que ao menos 1 deve ser ambos válidos
function wrongAnswerIsValid(texto, url) {
    if ((questionIsValid(texto) && urlIsValid(url)) || (!questionIsValid(texto) && !urlIsValid(url)))
        return true;
    return false;
}

function correctAnswerIsValid(texto, url) {
    if (questionIsValid(texto) && urlIsValid(url))
        return true;
    return false;
}

function colorIsValid(cor) {
    if (cor.match(colorRegex))
        return true;
    return false;
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