function Quiz(questions, callback) {
    console.log("in quiz")
    console.log(questions.length)
    this.score = 0;
    this.questions = questions;
    this.currentQuestionIndex = 0;
}

Quiz.prototype.guess = function(answer) {
    if(this.getCurrentQuestion().isCorrectAnswer(answer)) {
        this.score++;
    }
    this.currentQuestionIndex++;
};

Quiz.prototype.getCurrentQuestion = function() {
    return this.questions[this.currentQuestionIndex];
};

Quiz.prototype.hasEnded = function() {
    return this.currentQuestionIndex >= this.questions.length;
};

function QuizUI(currentquiz) { 
    console.log("In Quiz");
    this.quiz = currentquiz;  
}

QuizUI.prototype.displayNext = function () {
        console.log("in displayNext");
        console.log(this.quiz);
       if (this.quiz.hasEnded()) {
            this.displayScore();
        }
         else {
            this.displayQuestion();
            this.displayChoices();
            this.displayProgress();
        }
   };

QuizUI.prototype.displayScore = function() {
        var gameOverHTML = "<h1>Game Over</h1>";
        gameOverHTML += "<h2> Your score is: " + this.quiz.score + "</h2>";
        this.populateIdWithHTML("quiz", gameOverHTML);
    };   

QuizUI.prototype.displayQuestion =  function() {
        this.populateIdWithHTML("question", this.quiz.getCurrentQuestion().text);
    }

QuizUI.prototype.displayChoices = function() {
        var choices = this.quiz.getCurrentQuestion().choices;
        for(var i = 0; i < choices.length; i++) {
            this.populateIdWithHTML("choice" + i, choices[i]);
            this.guessHandler("guess" + i, choices[i]);
        }
    }

QuizUI.prototype.displayScore = function() {
        var gameOverHTML = "<h1>Game Over</h1>";
        gameOverHTML += "<h2> Your score is: " + this.quiz.score + "</h2>";
        gameOverHTML += "<button id=\"return\" class=\"btn--default\" >Try Again?</button>"
        this.populateIdWithHTML("quiz", gameOverHTML);
        var button = document.getElementById("return");
        button.onclick = function() {
            window.location.href = '/index.html';    
        }
    }

QuizUI.prototype.populateIdWithHTML = function(id, text) {
        var element = document.getElementById(id);
        element.innerHTML = text;
    }

QuizUI.prototype.guessHandler = function(id, guess) {
        console.log(this.quiz)
        var button = document.getElementById(id);
        button.onclick = function() {
            quiz.guess(guess);
            quizui.displayNext(quiz);
        }
    }

QuizUI.prototype.displayProgress = function() {
        var currentQuestionNumber = this.quiz.currentQuestionIndex + 1;
        this.populateIdWithHTML("progress", "Question " + currentQuestionNumber + " of " + this.quiz.questions.length);
    }

function Question(topic, text, choices, answer) {
    this.topic = topic;
    this.text = text;
    this.choices = choices;
    this.answer = answer;
}

Question.prototype.isCorrectAnswer = function (choice) {
    if(this.answer != choice) {   
        alert('Sorry, incorrect.' + '\n' + 'The correct answer is: ' + this.answer )
    }
    return this.answer === choice;
};

var allQuestions = new Array()
var newquestions = new Array()
var questions = new Array()
var jsonPromise;
var topic;
var quizui;
var quiz;

function LoadQuestions(topic) { jsonPromise = $.getJSON('questions.json',function(data){             
        console.log(data)
        allQuestions = data.questions   
        console.log(allQuestions[0].question)
        console.log(allQuestions[0].a)
        console.log(allQuestions[0].correct)
        allQuestions.forEach(function(element) {
        console.log(element);
        if(topic != "all"){
        if(element.topic == topic){
        questions.push(new Question(element.topic, element.question, [ element.a, element.b, element.c, element.d ], element.correct))
        }       
        }else {      
        questions.push(new Question(element.topic, element.question, [ element.a, element.b, element.c, element.d ], element.correct))
        }
});
      
    }).error(function(){
        console.log('error: json not loaded');
    })

jsonPromise.done(function(data) {
    // success
    questions.forEach(function(element) {

        console.log(element);
    });
    quiz = new Quiz(questions);
    console.log(quiz)
    topic = "all";
    console.log('json loaded successfully');
    quizui = new QuizUI(quiz);
    console.log(quizui)
    quizui.displayNext()

});

jsonPromise.fail(function(reason) {
    // it failed... handle it
});

jsonPromise.then(function(data) {
    // do moar stuff with data
    // will perhaps fire instantly, since the deferred may already be resolved.  
});
}

function StartPage() {
$('#start').click(function () {
    Start();  
    });
    $('#vikings').click(function () {
    Topic("Vikings");  
    });    
}

function Start() {
 window.location.href = '/quiz.html?topic=all'; 
}

function Topic(topic) {
window.location.href = '/quiz.html?topic=' + topic;
}

function DisplayQuiz(){
var topic = getUrlParameter('topic');
console.log(topic)
LoadQuestions(topic);
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function NewQuiz(currentquestions, callback) {
    var newquiz;
    newquiz = new Quiz(currentquestions);
    console.log(newquiz);
    NewQuizUI(newquiz);
    callback(newquiz);
}

function QuestionUpdate(topic, callback)  {
   console.log("In question update")
   // update questions
   var newquestions = new Array();
   questions.forEach(function(element) {
        console.log(element);
        questions.push(new Question(element.question, [ element.a, element.b, element.c, element.d ], element.correct))
        if(element.topic == topic) {
            newquestions.push(element)
        }    
});
   console.log(newquestions.length)
   callback(newquestions)
}




