window.onload = function() {
    openTrivia();
}

function objetoAjax() {
    var xmlhttp = false;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

/* Función implementada con AJAX (se llama al recargar la página y al darle a: Volver a jugar!) */
function openTrivia() {
    numQuestion = 0;
    correctAnswers = 0;
    results = {}; // Parte del JSON devuelto que contiene las preguntas...

    /* Inicializar un objeto AJAX */
    var ajax = objetoAjax();

    ajax.open("GET", "https://opentdb.com/api.php?amount=10&category=18", true);
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var respuesta = JSON.parse(this.responseText);
            /* Leerá la respuesta que es devuelta por el controlador: */
            results = respuesta.results;
            console.log(results);
            question();
        }
    }
    ajax.send();
}

// La función question() se mosta la estructura de pregunta y respuestas, además del Next Question
function question() {
    var test = document.getElementById('test');

    var recarga = '';
    if (numQuestion == 10) {
        recarga += '<h1>FINAL!!!</h1><h2>Respuestas correctas: ' + correctAnswers + '</h2>';
        recarga += '<input class="btn btn-primary" type="submit" value="Volver a jugar" onclick="openTrivia()">';

    } else {
        recarga += '<h3>' + results[numQuestion].question + '</h3>';

        if (results[numQuestion].type == 'boolean') {
            recarga += '<button type="submit" class="btn btn-info btn-lg btn-block m-1" onclick="checkResponse(this);">' + results[numQuestion].correct_answer + '</button><br>'
            recarga += '<button type="submit" class="btn btn-info btn-lg btn-block m-1" onclick="checkResponse(this);">' + results[numQuestion].incorrect_answers[0] + '</button><br>'
        } else {

            // Falta orden aleatorio en las respuestas
            recarga += '<button type="submit" class="btn btn-info btn-lg btn-block m-1" onclick="checkResponse(this);">' + results[numQuestion].correct_answer + '</button><br>'
            recarga += '<button type="submit" class="btn btn-info btn-lg btn-block m-1" onclick="checkResponse(this);">' + results[numQuestion].incorrect_answers[0] + '</button><br>'
            recarga += '<button type="submit" class="btn btn-info btn-lg btn-block m-1" onclick="checkResponse(this);">' + results[numQuestion].incorrect_answers[1] + '</button><br>'
            recarga += '<button type="submit" class="btn btn-info btn-lg btn-block m-1" onclick="checkResponse(this);">' + results[numQuestion].incorrect_answers[2] + '</button>'
        }
        recarga += '<br>'

        recarga += '<button type="submit" class="btn btn-dark btn-lg btn-block m-1" onclick="question();" id="next">Next Question</button>';
    }
    test.innerHTML = recarga;
}

function checkResponse(button) {
    // si la respuesta es correcta
    if (results[numQuestion].correct_answer == button.innerHTML) {
        correctAnswers++;
        // cambio los estilos del botón asociado a la respuesta correcta
        button.classList.remove("btn-info");
        button.classList.add("btn-success");
    } else {
        // cambio los estilos del botón asociado a la respuesta correcta
        button.classList.remove("btn-info");
        button.classList.add("btn-warning");
    }

    // bloqueo todos los botones para no poder hacer más intentos
    var buttons = document.getElementsByTagName('button')
    for (let i = 0; i < buttons.length - 1; i++) {
        buttons[i].disabled = true;
    }

    numQuestion++;
}