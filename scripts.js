const API_URL = 'https://mock-api.driven.com.br/api/v6/buzzquizz';
const RECURSO_QUIZZES_URL = '/quizzes'; //Aceita GET e POST

let qtdPerguntas;
let qtdNiveis;

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

function iniciarBuzzQuizz() {
    document.querySelector("main").innerHTML = `
    <div class="usuario">
            <div class="text">
                Você não criou nenhum quizz ainda :(
            </div>
            <button onclick="renderFormInfoBasicaQuizz()"> Criar Quizz</button>
        </div>`;

    getQuizzes();
}


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
    document.querySelector("main").innerHTML += quizzesList;
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



function renderFormNiveisQuizz() {
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
function renderFormPerguntasQuizz() {
    let perguntas = "";
    for (let i = 0; i < qtdPerguntas; i++) {
        perguntas += `
        <form action='javascript:validarPerguntas()'>
            <div class="fields">
                <div class="title-text-field">Pergunta ${i + 1}  <img src="/img/preencher.png" alt="" onclick="abrirElemento(this)"></div>
                <div class="hide-questions ${i != 0 ? 'hidden' : ''}">
                    <div><input class="text-field" name="titleQuestion${i + 1}" type="text" placeholder="Texto da pergunta"></div>    
                    <div><input class="text-field" name="colorQuestion${i + 1}" type="text" placeholder="Cor de fundo da pergunta (#FFFFFF)"></div>
                
                    <div class="title-text-field">Resposta correta </div>
                    <div><input class="text-field" name="textAnswer${i + 1}" type="text" placeholder="Texto da pergunta"></div>
                    <div><input class="text-field" name="urlAnswer${i + 1}" type="url" placeholder="Url da imagem"></div>
            
                    <div class="title-text-field">Resposta incorreta </div>
                    <div><input class="text-field" name="textAnswer1${i + 1}" type="text" placeholder="Texto da pergunta"></div>
                    <div><input class="text-field" name="urlAnswer1${i + 1}" type="url" placeholder="Url da imagem"></div>
                    <div><input class="text-field" name="textAnswer2${i + 1}" type="text" placeholder="Texto da pergunta"></div>
                    <div><input class="text-field" name="urlAnswer2${i + 1}" type="url" placeholder="Url da imagem"></div>
                    <div><input class="text-field" name="textAnswer3${i + 1}" type="text" placeholder="Texto da pergunta"></div>
                    <div><input class="text-field" name="urlAnswer3${i + 1}" type="url" placeholder="Url da imagem"></div>
                </div>
            </div> 
        </form>`
    }
    const form = `<div class="title-form">Crie suas perguntas</div>
    <div>
        ${perguntas}
        <button type="submit" onclick = "submitAll()" class="btn-criar">Prosseguir para criar níveis</button>
    </div>`;
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
    if (validadores.indexOf(false) == -1) {
        quizzCriadoObj.questions = questions;
        console.log(quizzCriadoObj);
        renderFormNiveisQuizz();
    } else {
        alert("Ops! Um ou mais campos foram preenchidos de forma errada!");
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

function validarNivel(titulo, acertos, url, descricao) {
    if (tituloNivelisValid(titulo) && acertoIsValid(acertos) && urlIsValid(url) && descricaoNivelisValid(descricao)) {
        contador++
    }
}

function tituloNivelisValid(titulo) {
    if (titulo.length > 10) {
        return true;
    } else {
        return false;
    }
}

function acertoIsValid(acertos) {
    const percAcertos = Number(acertos);
    if (percAcertos >= 0 && percAcertos <= 100) {
        if (percAcertos === 0) {
            contadorNiveis++;
        }
        return true;
    } else {
        return false;
    }
}

function descricaoNivelisValid(titulo) {
    if (titulo.length > 30) {
        return true;
    } else {
        return false;
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

function submitAllNiveis() {
    const forms = document.forms;
    contador = 0;
    for (let i = 0; i < forms.length; i++) {
        const formValido = forms[i].reportValidity();
        if (formValido) {
            forms[i].submit();
        }
    }
    if (contador === (forms.length - 1) && contadorNiveis >= 1) {
        //aqui vai renderizar a proxima etapa das perguntas
    }
    else {
        alert("Você preencheu os dados de forma errada, preencha novamente!");
    }
}


iniciarBuzzQuizz();
