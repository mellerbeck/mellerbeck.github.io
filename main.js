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
				msg = new SpeechSynthesisUtterance('OK, whats');
        window.speechSynthesis.speak(msg);
				var msg = new SpeechSynthesisUtterance(problemText);
        window.speechSynthesis.speak(msg);
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
    var msg = new SpeechSynthesisUtterance('Hi Amelia!');
    window.speechSynthesis.speak(msg);
    msg = new SpeechSynthesisUtterance('Are you ready to play the unicorn math game?');
    window.speechSynthesis.speak(msg);
    
    // change the animated .gif to 'thinking'
    document.getElementById("unicorn1").src="UnicornThinking.gif";
    
    currentScore = 0;
    showNextProblem();
		scoreLoopCounter = 0;
    }
    
		errorOccurred = false;
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
	var altval3 = currentProblem.altval3;
	if (typeof answer === 'string') {
		answer = answer.toLowerCase();
	}

  if ( trimmedGuess.indexOf(answer) >= 0
	    || trimmedGuess.indexOf(altval1) >= 0 || trimmedGuess.indexOf(altval2) >= 0
	    || trimmedGuess.indexOf(altval3) >= 0) {
	    
	    // say you're right
	    var snd = new Audio("audio/applause.mp3"); // buffers automatically when created
	    snd.addEventListener('ended', showNextProblem);
      snd.play();
	    var msg = new SpeechSynthesisUtterance('Awesome! you got it right!');
      window.speechSynthesis.speak(msg);
      
      currentScore++;
      scoreLoopCounter++;
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
		supportMessage = "Cool!  Your browser supports speech recognition & Speech Synthesis Have fun!";
	}
	else {
		warningsElement.classList.add('unsupported');
		supportMessage = "Sorry... Your browser doesn't support speech recognition yet.  Try Google Chrome version 25.";
	}
	warningsElement.innerHTML = supportMessage;
}

function detectIfVoiceSynthesSupported() {
	var supportMessage;
	var warningsElement = document.getElementsByClassName('warnings')[0];
	if ('speechSynthesis' in window) {
    // You're good to go!
  } else {
    warningsElement.classList.add('unsupported');
		supportMessage = "Sorry... Your browser doesn't support speech synthesis yet.  Try Google Chrome version 33.";
		warningsElement.innerHTML = supportMessage;
	}	
}



function switchToSecondInstructions() {
	var first = document.getElementById('firstInstructions');
	if (first.style.display !== 'none') {
		document.getElementById('secondInstructions').style.display = 'block';
		first.style.display = 'none';
	}
}

detectIfSpeechSupported();
detectIfVoiceSynthesSupported(); 
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




