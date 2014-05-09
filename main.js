/*global Handlebars, common, samples */
var SpeechRecognition = window.mozSpeechRecognition ||
	window.msSpeechRecognition ||
	window.oSpeechRecognition ||
	window.webkitSpeechRecognition ||
	window.SpeechRecognition;

var currentProblem;
var currentScore = 0;
var scoreLoopCounter = -1;
var highScore = 0;
var timerCtx = document.getElementById('cnvTimer').getContext('2d');
var timerCanvasHeight = document.getElementById('cnvTimer').height;
var beginTime;
var errorOccurred = false;
var selectedCategory = 'builtin-AmeliaAddition';
var problemsForSelectedCategory;
var selectedLanguage = navigator.language;



function getQuestionFromList(theList) {
	var index = getRandomInteger(theList.length) - 1;
	return theList[index];
}

function getRandomInteger(ceiling) {
	return Math.floor(Math.random() * ceiling + 1);
}

function showNextProblem() {
	var problemText;
	var previousProblem = currentProblem;
	while (previousProblem === currentProblem) {
		switch (selectedCategory) {
			case 'builtin-AmeliaAddition':
				currentProblem = getQuestionFromList(samples.AmeliaAddition);
				problemText = currentProblem.key;
				
      break;
			default:
				currentProblem = getQuestionFromList(window.problemsForSelectedCategory);
				problemText = currentProblem.key;
				break;
		}
	}
	document.getElementsByClassName('problem')[0].textContent = problemText;
}

function startSpeechRecognition() {
	
	var speech = new SpeechRecognition();
	speech.continuous = true;
	speech.interimResults = true;
	speech.lang = 'en-NZ';
	speech.onstart = function() {
		
		if (scoreLoopCounter == -1) {
		document.getElementsByClassName('scores')[0].classList.remove('hidden');
		document.getElementsByClassName('unicorn')[0].classList.remove('hidden');
		document.getElementsByClassName('card')[0].classList.remove('hidden');
		document.getElementsByClassName('iHeard')[0].classList.remove('hidden');
		document.getElementById('secondInstructions').style.display = '';

		var msg = new SpeechSynthesisUtterance('Hi Amelia!);
    window.speechSynthesis.speak(msg);
    showNextProblem();
		scoreLoopCounter = 0;
    }
    
		errorOccurred = false;
		currentScore = 0;
		document.getElementById('currentScoreValue').textContent = currentScore;
		
		// Show the first question
		
		if(currentScore !== scoreLoopCounter){
		showNextProblem();
		}
		
	};

  speech.onresult = function(event) {
		var iHeard = '';

		for (var i = event.resultIndex; i < event.results.length; i++) {
			if (!event.results[i].isFinal) {
				iHeard += event.results[i][0].transcript;
			}
		}
		setIHeardText(iHeard);
		checkAnswer(iHeard);
	};
	
	// keep it listening
    speech.onend = function(){
      speech.start();
    }

	speech.start();
}



function checkAnswer(guess) {
	var trimmedGuess = guess.trim().toLowerCase();
	var answer = currentProblem.value;
	// add a couple of alternative answers to help out children
	// with unclear speech
	var altval1 = currentProblem.altval1;
	var altval2 = currentProblem.altval2;
	if (typeof answer === 'string') {
		answer = answer.toLowerCase();
	}


	if (/skip|next question/gi.test(guess) || trimmedGuess.indexOf(answer) >= 0
	    || trimmedGuess.indexOf(altval1) >= 0 || trimmedGuess.indexOf(altval2) >= 0) {
		showNextProblem();
	}

	if (trimmedGuess.indexOf(answer) >= 0) {
		currentScore++;
		var scoreElement = document.getElementById('currentScoreValue');
		scoreElement.textContent = currentScore;

		if (currentScore > highScore) {
			scoreElement.classList.add('highlight');
		}
	}
}

function setIHeardText(textToDisplay) {
	document.getElementById('iHeardText').textContent = textToDisplay;
}

function detectIfSpeechSupported() {
	var supportMessage;
	var warningsElement = document.getElementsByClassName('warnings')[0];
	if (SpeechRecognition) {
		supportMessage = "Cool!  Your browser supports speech recognition.  Have fun!";
	}
	else {
		warningsElement.classList.add('unsupported');
		supportMessage = "Sorry... Your browser doesn't support speech recognition yet.  Try Google Chrome version 25.";
	}
	warningsElement.innerHTML = supportMessage;
}

function switchToSecondInstructions() {
	var first = document.getElementById('firstInstructions');
	if (first.style.display !== 'none') {
		document.getElementById('secondInstructions').style.display = 'block';
		first.style.display = 'none';
	}
}

detectIfSpeechSupported();
common.renderCategories();



setTimeout(function() {
	document.getElementsByClassName('leftArrow')[0].style['margin-left'] ='0';
	setTimeout(function() {
		document.getElementsByClassName('leftArrow')[0].style['opacity'] ='0';
		document.getElementById('categoryComponent').style['box-shadow'] ='0 0 0 rgb(0, 115, 121)';
	}, 1500);
}, 300);

var startButton = document.getElementsByClassName('startButton')[0];
startButton.addEventListener('click', function() {
	if (this.classList.contains('disabled')) {
		window.alert('Please choose a category');
		return ;
	}
  
	startSpeechRecognition();
});




