const API_URL = 'https://mock-api.driven.com.br/api/v6/buzzquizz';
const RECURSO_QUIZZES_URL = '/quizzes'; //Aceita GET e POST
//regex para garantir que o q foi passado é um url válido
const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
const colorRegex = /^#[a-fA-F0-9]{6}/;

let qtdPerguntas;
let qtdNiveis;
let idsQuizzesUsuario = []; //Lista com os IDS de quizzes do usuário

let quizzes;
let quizzesUsuario;


function comparador() {
    return Math.random() - 0.5;
}


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

function iniciarBuzzQuizz() {
    document.querySelector("main").innerHTML = "";
    getQuizzesUsuario();
    getQuizzes();
}

function isUserQuizz(quizz) {
    console.log(quizz.id);
    console.log(idsQuizzesUsuario);
    console.log(idsQuizzesUsuario.includes(quizz.id));
    return idsQuizzesUsuario.includes(quizz.id.toString());
}

function isntUserQuizz(quizz) {
    return idsQuizzesUsuario.indexOf(quizz.id.toString()) == -1
}

//requisiçoes
function getQuizzes() {
    const promise = axios.get(API_URL + RECURSO_QUIZZES_URL);
    promise.then((response) => {
        const listQuizzes = response.data.map(quizzConstructor);
        quizzesUsuario = listQuizzes.filter(isUserQuizz);
        quizzes = listQuizzes.filter(isntUserQuizz);
        renderListQuizzesUsuario(quizzesUsuario);
        renderListQuizzes(quizzes);
    });
    promise.then((error) => {
        console.log(error);
    });
}

//requisiçoes
function saveQuizz() {
    const promise = axios.post(API_URL + RECURSO_QUIZZES_URL, quizzCriadoObj);
    promise.then((response) => {
        const createdQuizz = quizzConstructor(response.data);
        idsQuizzesUsuario.push(createdQuizz.id);
        setQuizzesUsuario();
    });
    promise.then((error) => {
        console.log(error);
    });
}

function getQuizzesUsuario() {
    const quizzesUsuario = localStorage.getItem("idsQuizzes");
    idsQuizzesUsuario = JSON.parse(quizzesUsuario) ?? [];
}

function setQuizzesUsuario() {
    const quizzesUsuarioString = JSON.stringify(idsQuizzesUsuario);
    localStorage.setItem("idsQuizzes", quizzesUsuarioString);
}

//Navegação =======================================
//finalização da criação do quizz
function onTapBackHome() {
    iniciarBuzzQuizz();
}

//Aqui recebe o quizz(index no array, id ou objeto) como parametro para renderizar na tela
function onTapQuizz(quizz) {
    renderPageQuizz(quizz);
}

function renderPageQuizz(quizz){
    
    let paginaQuizz = "";
    let caixaPergunta = [];

    let topoQuizz = `
    <div class="banner">
            <img src="${quizz.image}" alt="">
            <div class="opaco">
                <span>${quizz.title}</span>
            </div>
        </div>
    `
    for(let i = 0; i < quizz.questions.length; i++){
        let pergunta = quizz.questions;
        let respostas= "";

        console.log(pergunta[i].answers.length);
        let resposta = pergunta[i].answers;
        console.log(resposta);
        let respostaAleat = resposta;
        console.log(respostaAleat);

        for(let j = 0; j < pergunta[i].answers.length; j++){
        
            if(respostaAleat[j].isCorrectAnswer){
                console.log("resposta certa")
                respostas += `
                    <li class="opcao " onclick="chooseOption(this)">
                        <img src=${resposta[j].image} alt="">
                        <div class= "certa">${resposta[j].text}</div>
                    </li>`

            } else{
                console.log("peee, errada");
                respostas += `
                    <li class="opcao " onclick="chooseOption(this)">
                        <img src=${resposta[j].image} alt="">
                        <div class="errada">${resposta[j].text}</div>
                    </li>`;
            }

        }
        
        caixaPergunta += `
                <div class="perguntas" >
                    <div style="background-color:${pergunta[i].color};"> <p>${pergunta[i].title}</p></div>
                    <ul class="opcoes">
                        ${respostas}
                    </ul>
                </div> `;
        
    }

    const divMain = document.querySelector("main");
    divMain.innerHTML = '';

    const divContainer = document.querySelector(".container");
    divContainer.innerHTML = topoQuizz + caixaPergunta;

    scrollToTop();
  
}


function chooseOption(elemento){
    console.log(elemento);
    let lista = elemento.parentNode;
    let pergunta = elemento.parentNode;

    if(pergunta.querySelector(".escolhida") === null){
        //elemento.classList.add("escolhida");
        console.log(lista)
        let listaOpcoes = lista.querySelectorAll("li");
        console.log(listaOpcoes);
        for (let i = 0; i < listaOpcoes.length; i++ ) {
            listaOpcoes[i].classList.add("clicadas");
        }
        
        elemento.classList.add("escolhida");
    }
    
}

//TELA PRINCIPAL =======================================
function renderListQuizzes(quizzes) {
    const quizzesList = `
        <div style="width: 100%">
            <div class="title-list-content"><span class="title-list">Todos os quizzes</span></div>
            <div class="lista-quizzes">
            </div>
        </div>
    `;
    document.querySelector("main").innerHTML += quizzesList;
    quizzes.map(renderCardQuizzLista);
}

function renderListQuizzesUsuario(quizzes) {
    let quizzesList;
    if (quizzes.length == 0) {
        quizzesList = `
            <div class="usuario">
                    <div class="text">
                        Você não criou nenhum quizz ainda :(
                    </div>
                    <button onclick="renderFormInfoBasicaQuizz()"> Criar Quizz</button>
                </div>`;
    } else {
        quizzesList = `
            <div style="width: 100%">
                <div class="title-list-content"><span class="title-list" style="width:auto">Seus quizzes</span> <div class="add-button" onclick="renderFormInfoBasicaQuizz()"><ion-icon name="add-outline"></ion-icon></div></div>
                <div class="lista-quizzes-usuario">
                </div>
            </div>`;
    }

    document.querySelector("main").innerHTML += quizzesList;
    quizzes.map(renderCardQuizzListaUsuario);
}



function renderCardQuizzLista(quizz) {
    const cardQuizz = document.createElement("div");
    cardQuizz.setAttribute("class", "card-quizz");
    cardQuizz.addEventListener("click", function () {
        onTapQuizz(quizz);
    });
    cardQuizz.innerHTML = `<img src="${quizz.image}"
                alt="Imagem de exibição do Quizz">
            <div class="degrade-card-quizz"></div>
            <span>${quizz.title}</span>`;

    const element = document.querySelector(".lista-quizzes");
    element.append(cardQuizz);
}

function renderCardQuizzListaUsuario(quizz) {
    const cardQuizz = document.createElement("div");
    cardQuizz.setAttribute("class", "card-quizz");
    cardQuizz.setAttribute("onclick", `onTapQuizz('${quizz}')`);
    cardQuizz.innerHTML = `<img src="${quizz.image}"
                alt="Imagem de exibição do Quizz">
            <div class="degrade-card-quizz"></div>
            <span>${quizz.title}</span>`;

    const element = document.querySelector(".lista-quizzes-usuario");
    element.append(cardQuizz);
}

//Construtores ================================
//construtores recebem um mapa como parametro e retornam o objeto
function quizzConstructor(quizzData) {
    const quizz = {};
    quizz.id = quizzData.id;
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
//function renderCardQuizzCricao(quizz) {
//  const cardQuizz = `<div class="card-quizz criacao-card" onclick="onTapQuizz('${quizz}')">
//         <img src="${quizz.image}"
//            alt="Imagem de exibição do Quizz">
//      <div class="degrade-card-quizz"></div>
//    <span>${quizz.title}</span>
// </div>`;
//document.querySelector(".lista-quizzes").innerHTML += cardQuizz;
//}

//Aqui recebe o objeto do quizz como parametro pra já renderizar com as informaçoes corretas
function renderQuizzCreated(quizz) {
    const quizzToRender = `
    <div class="title-form">Seu quizz está pronto!</div>
    <div class="card-quizz criacao-card" onclick="onTapQuizz('${quizz}')">
        <img src="${quizz.image}" alt="Imagem de exibição do Quizz">
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
        <form action="javascript:validarFormInfoBasica()">
            <div class="fields">
                <div><input class="text-field" name="titulo" type="text" placeholder="Título do seu quizz"></div>
                <div><input class="text-field" name="url" type="url" placeholder="Url da imagem do seu quizz"></div>
                <div><input class="text-field" name="qtdPerguntas" type="number" placeholder="Quantidade de perguntas do quizz"></div>
                <div><input class="text-field" name="quantidadeNiveis" type="number" placeholder="Quantidade de níveis do quizz"></div>     
                </div>
            <button type="submit" class="btn-criar">Prosseguir para criar perguntas</button>
        </form>`;

    const divMain = document.querySelector("main");
    divMain.innerHTML = form;
}


function renderFormPerguntasQuizz() {
    let perguntas = "";
    for (let i = 0; i < qtdPerguntas; i++) {
        perguntas += `
        <form action='javascript:validarPerguntas()'>
            <div class="fields">
                <div class="title-text-field"> <span> Pergunta ${i + 1} </span>  <img src="/img/preencher.png" alt="" onclick="abrirElemento(this)"></div>
                <div class="hide-questions ${i != 0 ? 'hidden' : ''}">
                    <div><input class="text-field" name="titleQuestion${i + 1}" type="text" placeholder="Texto da pergunta"></div>    
                    <div><input class="text-field" name="colorQuestion${i + 1}" type="text" placeholder="Cor de fundo da pergunta (#FFFFFF)"></div>
                
                    <div class="title-text-field">Resposta correta </div>
                    <div><input class="text-field" name="textAnswer${i + 1}" type="text" placeholder="Resposta correta"></div>
                    <div><input class="text-field" name="urlAnswer${i + 1}" type="url" placeholder="Url da imagem"></div>
            
                    <div class="title-text-field">Resposta incorreta </div>
                    <div><input class="text-field" name="textAnswer1${i + 1}" type="text" placeholder="Resposta incorreta1"></div>
                    <div><input class="text-field" name="urlAnswer1${i + 1}" type="url" placeholder="Url da imagem1"></div>
                    <div><input class="text-field" name="textAnswer2${i + 1}" type="text" placeholder="Resposta incorreta2"></div>
                    <div><input class="text-field" name="urlAnswer2${i + 1}" type="url" placeholder="Url da imagem2"></div>
                    <div><input class="text-field" name="textAnswer3${i + 1}" type="text" placeholder="Resposta incorreta3"></div>
                    <div><input class="text-field" name="urlAnswer3${i + 1}" type="url" placeholder="Url da imagem3"></div>
                </div>
            </div> 
        </form>`
    }
    const form = `<div class="title-form">Crie suas perguntas</div>
    <div>
        ${perguntas}
        <button type="submit" onclick="submitAll()" class="btn-criar">Prosseguir para criar níveis</button>
    </div>`;
    const divMain = document.querySelector("main");
    divMain.innerHTML = form;
}

function renderFormNiveisQuizz() {
    let niveis = "";

    for (let i = 0; i < qtdNiveis; i++) {

        if (i === 0) {
            niveis += `
            <div class="fields">
                <div class="title-text-field"> Nivel ${i + 1}</div>                
                <div>
                    <div><input class="text-field" name="titleLevel${i + 1}" type="text" placeholder="Título do nível"></div>
                    <div><input class="text-field" name="percRight${i + 1}" type="number" placeholder="% de acerto mínima"></div>
                    <div><input class="text-field" name="urlLevel${i + 1}" type="url" placeholder="Url da imagem do nível "></div>
                    <div><input class="text-field" name="descriptionLevel${i + 1}" type="text" placeholder="Descrição do nível"></div>                    
                </div>
            </div>
        `

        } else {
            niveis += `
                <div class="fields">
                    <div class="title-text-field"> <span> Nivel ${i + 1} </span>  <img src="/img/preencher.png" alt="" onclick="abrirElemento(this)"></div>                
                    <div class="hide-questions hidden">
                    <div><input class="text-field" name="titleLevel${i + 1}" type="text" placeholder="Título do nível"></div>
                    <div> <input class="text-field" name="percRight${i + 1}" type="number" placeholder="% de acerto mínima"></div>
                    <div> <input class="text-field" name="urlLevel${i + 1}" type="url" placeholder="Url da imagem do nível "></div>
                    <div><input class="text-field" name="descriptionLevel${i + 1}" type="text" placeholder="Descrição do nível"></div>
                    </div>
                </div>
            `
        }
    }

    const form = `<div class="title-form">Agora, decida os níveis</div>
    <div>
        <form action='javascript:validarNivel()'>
            ${niveis}
            <button type="submit" class="btn-criar">Finalizar Quizz</button>
        </form>`;

    const divMain = document.querySelector("main");
    divMain.innerHTML = form;
}




function validarFormInfoBasica() {
    //preciso fazer isso pra gerar os avisos todos
    const listaInputs = document.querySelectorAll("input");
    const _tituloIsValid = tituloIsValid(listaInputs[0]);
    const _urlIsValid = urlIsValid(listaInputs[1]);
    const _qtdPerguntasIsValid = qtdPerguntasIsValid(listaInputs[2]);
    const _qtdNiveisIsValid = qtdNiveisIsValid(listaInputs[3]);
    if (_tituloIsValid && _urlIsValid && _qtdPerguntasIsValid && _qtdNiveisIsValid) {
        quizzCriadoObj.title = listaInputs[0].value;
        quizzCriadoObj.image = listaInputs[1].value;
        qtdPerguntas = listaInputs[2].value;
        qtdNiveis = listaInputs[3].value;
        renderFormPerguntasQuizz();
    }
}

function validarPerguntas() {
    const validadores = [];
    const questions = [];
    const element = document.querySelectorAll("form");
    for (let index = 0; index < element.length; index++) {
        const respostas = []; //array do objeto
        const form = element[index];
        const pergunta = form.querySelector(`[name="titleQuestion${index + 1}"]`);
        const cor = form.querySelector(`[name="colorQuestion${index + 1}"]`);
        const correctResponse = form.querySelector(`[name="textAnswer${index + 1}"]`);
        const correctUrl = form.querySelector(`[name="urlAnswer${index + 1}"]`);
        const response1 = form.querySelector(`[name="textAnswer1${index + 1}"]`);
        const url1 = form.querySelector(`[name="urlAnswer1${index + 1}"]`);
        const response2 = form.querySelector(`[name="textAnswer2${index + 1}"]`);
        const url2 = form.querySelector(`[name="urlAnswer2${index + 1}"]`);
        const response3 = form.querySelector(`[name="textAnswer3${index + 1}"]`);
        const url3 = form.querySelector(`[name="urlAnswer3${index + 1}"]`);
        const _questionIsValid = questionIsValid(pergunta);
        const _colorIsValid = colorIsValid(cor);

        const _correctAnswerIsValid = correctAnswerIsValid(correctResponse, correctUrl);
        const _wrongAnswersIsValid = verifyWrongAnswers(response1, url1, response2, url2, response3, url3);

        if (_questionIsValid && _colorIsValid && _correctAnswerIsValid && _wrongAnswersIsValid) {
            respostas.push({
                text: correctResponse.value,
                image: correctUrl.value,
                isCorrectAnswer: true,
            });
            if (response1.value != "" && url1.value != "") {
                respostas.push({
                    text: response1.value,
                    image: url1.value,
                    isCorrectAnswer: false,
                });
            }
            if (response2.value != "" && url2.value != "") {
                respostas.push({
                    text: response2.value,
                    image: url2.value,
                    isCorrectAnswer: false,
                });
            }
            if (response3.value != "" && url3.value != "") {
                respostas.push({
                    text: response3.value,
                    image: url3.value,
                    isCorrectAnswer: false,
                });
            }
            const question = {
                title: pergunta.value,
                color: cor.value,
                answers: respostas,
            }
            questions.push(question);
            validadores.push(true);
        } else {
            validadores.push(false);
        }
    }
    console.log(validadores);
    if (validadores.indexOf(false) == -1) {
        quizzCriadoObj.questions = questions;
        renderFormNiveisQuizz();
    }
}


//Verifica se todas as respostas erradas sao validas
function verifyWrongAnswers(texto1, url1, texto2, url2, texto3, url3) {
    const wronAnswersValidations = [wrongAnswerIsValid(texto1, url1), wrongAnswerIsValid(texto2, url2), wrongAnswerIsValid(texto3, url3),];
    if (wronAnswersValidations.indexOf(false) == 1) {
        //verifica se nao existe valor false e se ao menos 1 dos true é diferente de vazio
        return false;
    } else if ((!answerIsValid(texto1) || !urlIsValid(url1)) &&
        (!answerIsValid(texto2) || !urlIsValid(url2)) &&
        (!answerIsValid(texto3) || !urlIsValid(url3))) {
        removeErrorText(texto1);
        removeErrorText(url1);
        removeErrorText(texto2);
        removeErrorText(url2);
        removeErrorText(texto3);
        removeErrorText(url3);
        addErrorText(texto1, "Você deve preencher ao menos 1 resposta");
        addErrorText(url1, "Você deve preencher ao menos 1 resposta");
        return false;
    } else {
        return true;
    }

}

//Essa aqui verifica pq as respostas erradas podem ser válidas mesmo nao existindo
//Mas essa condiçao so existe se o texto e url forem iguais, ou seja
//Ou ambos sao válidos ou ambos sao inválidos, o que muda é que ao menos 1 deve ser ambos válidos
function wrongAnswerIsValid(textoInput, urlInput) {
    removeErrorText(textoInput);
    removeErrorText(urlInput);
    if (answerIsValid(textoInput) != urlIsValid(urlInput)) {
        if (!answerIsValid(textoInput)) {
            removeErrorText(textoInput);
            addErrorText(textoInput, "Preencha ambos os campos!");
        }
        if (!urlIsValid(urlInput)) {
            removeErrorText(urlInput);
            addErrorText(urlInput, "Preencha ambos os campos!");
        }
        return false;
    }
    removeErrorText(textoInput);
    removeErrorText(urlInput);
    return true;
}

function correctAnswerIsValid(texto, url) {
    if (answerIsValid(texto) && urlIsValid(url))
        return true;
    return false;
}

function returnErrorDiv(textoDeErro) {
    const element = document.createElement('div');
    element.classList.add('error-text');
    element.innerText = textoDeErro;
    return element;
}

//validações info basicas criaçao de quizz
function tituloIsValid(tituloInput) {
    removeErrorText(tituloInput);
    if (tituloInput.value == null || tituloInput.value == "") {
        addErrorText(tituloInput, "Preencha o campo!");
        return false;
    } else if (tituloInput.value.length < 20 || tituloInput.value.length > 65) {
        addErrorText(tituloInput, "O titulo deve ter entre 20 e 65 caracteres!");
        return false;
    } else {
        return true;
    }
}

function addErrorText(element, text) {
    const elementPai = element.parentNode;
    element.classList.add("error-input");
    element.style.marginBottom = "5px";
    elementPai.append(returnErrorDiv(text));
}

//deve passar o input que esteja dentro de uma div!!!
function removeErrorText(element) {
    const elementPai = element.parentNode;
    if (elementPai.children.length > 1) {
        element.style.marginBottom = "10px";
        element.classList.remove("error-input");
        elementPai.removeChild(elementPai.lastChild);
    }
}

function urlIsValid(urlInput) {
    removeErrorText(urlInput);
    if (!urlInput.value.match(urlRegex)) {
        addErrorText(urlInput, "Insira uma url válida!");
        return false;
    } else if (urlInput.value == "") {
        addErrorText(urlInput, "Insira uma url!");
        return false;
    } else {
        return true;
    }
}

function qtdPerguntasIsValid(qtdPerguntasInput) {
    removeErrorText(qtdPerguntasInput);
    if (qtdPerguntasInput.value < 3) {
        addErrorText(qtdPerguntasInput, "O número de perguntas deve ser maior do que 2!");
        return false;
    } else {
        return true;
    }
}

function qtdNiveisIsValid(qtdNiveisInput) {
    removeErrorText(qtdNiveisInput);
    if (qtdNiveisInput.value < 2) {
        addErrorText(qtdNiveisInput, "O número de níveis deve ser maior do que 1!");
        return false;
    } else {
        return true;
    }
}


function abrirElemento(elemento) {
    let div = elemento.parentNode;
    let form = div.parentNode;
    let listaesc = form.querySelector(".hide-questions");
    listaesc.classList.toggle('hidden');
}

//validações perguntas criaçao de quizz
function questionIsValid(titleInput) {
    removeErrorText(titleInput);
    if (titleInput.value == null || titleInput.value == "") {
        addErrorText(titleInput, "Informe o título!");
        return false;
    } else if (titleInput.value.length < 20) {
        addErrorText(titleInput, "O título deve ter mais do que 20 caracteres!");
        return false;
    }
    return true;
}

function answerIsValid(titleInput) {
    removeErrorText(titleInput);
    if (titleInput.value == null || titleInput.value == "") {
        addErrorText(titleInput, "Informe o título!");
        return false;
    }
    return true;
}


function colorIsValid(corInput) {
    removeErrorText(corInput);
    if (!corInput.value.match(colorRegex)) {
        addErrorText(corInput, "Insira uma cor válida!")
        return false;
    }
    return true;
}


let levels;

function validarNivel() {
    const validadores = [];
    let levels = [];
    const element = document.querySelectorAll(".fields");
    console.log(element);
    for (let index = 0; index < element.length; index++) {
        const field = element[index];
        const titulo = field.querySelector(`[name="titleLevel${index + 1}"]`);
        const url = field.querySelector(`[name="urlLevel${index + 1}"]`);
        const texto = field.querySelector(`[name="descriptionLevel${index + 1}"]`);
        const acertos = field.querySelector(`[name="percRight${index + 1}"]`);

        const _titleLevelIsValid = tituloNivelisValid(titulo);
        const _percRightIsValid = acertoIsValid(acertos);
        const _descriptionIsValid = descricaoNivelisValid(texto);
        const _urlIsValid = urlIsValid(url);

        if (_titleLevelIsValid && _percRightIsValid && _descriptionIsValid && _urlIsValid) {
            levels.push({
                title: titulo.value,
                image: url.value,
                text: texto.value,
                minValue: Number((acertos.value))
            });
            validadores.push(true);
        } else {
            validadores.push(false);
        }

    }
    const minValues = levels.filter(temZero);

    if (validadores.indexOf(false) == -1) {
        if (minValues.length == 0) {
            for (let index = 0; index < element.length; index++) {
                const acertos = element[index].querySelector(`[name="percRight${index + 1}"]`);
                addErrorText(acertos, "Ao menos uma das porcentagens de acertos deve ser igual a 0.");
            }
        } else {
            quizzCriadoObj.levels = levels;
            //finalizar e mandar o quizz pro sistema 
            saveQuizz();
            renderQuizzCreated(quizzCriadoObj);
        }
    }

}

function tituloNivelisValid(titulo) {
    removeErrorText(titulo);
    if ((titulo.value).length >= 10) {
        return true;
    } else {
        if (titulo.value == "") {
            addErrorText(titulo, "Informe o título!");
        } else {
            addErrorText(titulo, "O título deve ter pelo menos 10 caracteres!");
        }
        return false;
    }
}

function acertoIsValid(acertos) {
    removeErrorText(acertos);
    if (acertos.value === "") {
        addErrorText(acertos, "Informe a porcentagem de acertos!");
        return false
    } else {
        const percAcertos = Number(acertos.value);
        if (percAcertos >= 0 && percAcertos <= 100) {
            return true;
        } else {
            addErrorText(acertos, "A porcentagem de acertos deve estar entre 0 e 100!");
            return false;
        }

    }
}

function descricaoNivelisValid(texto) {
    removeErrorText(texto);
    if ((texto.value).length >= 30) {
        return true;
    } else {
        if (texto.value == "") {
            addErrorText(texto, "Informe a descrição!");
        } else {
            addErrorText(texto, "A descrição deve ter no mínimo 30 caracteres!");
        }
        return false;
    }
}

function temZero(elemento) {
    if (elemento.minValue === 0) {
        return true
    } else {
        return false
    }
}

function submitAll() {
    const forms = document.forms;
    for (let i = 0; i < forms.length; i++) {
        const formValido = forms[i].reportValidity();
        if (formValido) {
            forms[i].submit();
        }
    }
}

function renderResultado(nivel, porcentagem) {
    const divMain = document.querySelector("main");
    const cardResultado = `<div class="resultado">
            <div class="cabecalho">
                ${porcentagem}%: ${nivel.title}
            </div>
            <div class="corpo">
                <img src="${nivel.image}"
                    alt="Imagem de resultado do quizz">
                <div class="descricao">
                    ${nivel.text}
                </div>
            </div>
        </div>
        <button class="btn-criar" onclick="onTapReiniciarQuizz()">Reiniciar Quizz</button>
        <span class="sub-text" onclick="onTapBackHome()">Voltar pra home</span>
`;
    divMain.innerHTML += cardResultado;
}

function finishQuizz() {

    //calcula a porcentagem, precisa passar acertos e perguntas
    const porcentagem = calcularPorcentagem();
    //adiciona o cardzinho de resposta
    const nivel = getNivel(porcentagem);
    //renderiza o cardzinho na tela
    renderResultado(nivel, porcentagem);
    //scrolla pro fim
    setTimeout(scrollToBottom(), 200);
}

function calcularPorcentagem(qtdAcertos, qtdPerguntas) {
    return Math.ceil((qtdAcertos / qtdPerguntas) * 100);
}

function getNivel(porcentagem) {
    //pegar o nivel onde a porcentagem é a maior entre as menores que o resultado
    const nivel = {};
    return nivel;
}

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

function scrollToTop() {
    window.scrollTo(0, 0);
}

iniciarBuzzQuizz();
