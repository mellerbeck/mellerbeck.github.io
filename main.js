/*global Handlebars, common, samples */
var SpeechRecognition = window.mozSpeechRecognition ||
	window.msSpeechRecognition ||
	window.oSpeechRecognition ||
	window.webkitSpeechRecognition ||
	window.SpeechRecognition;

var currentProblem;
var currentScore = 0;
var answeredCorrectly = -1;
var highScore = 0;
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

  //set answeredCorrectly to false;
  answeredCorrectly = 0;

	var problemText;
	var previousProblem = currentProblem;
	while (previousProblem === currentProblem) {
		switch (selectedCategory) {
			case 'builtin-AmeliaAddition':
				currentProblem = getQuestionFromList(samples.AmeliaAddition);
				problemText = currentProblem.key;
				
				// change the animated .gif to 'talking'
        document.getElementById("unicornpic").src="UnicornAnimate.gif";
  
 				msg = new SpeechSynthesisUtterance('OK, whats');
        window.speechSynthesis.speak(msg);
        
				var msgProblem = new SpeechSynthesisUtterance();
				msgProblem.text = problemText;
				
				// change the animated .gif to 'thinking'
				msgProblem.onend = function (event) {
          document.getElementById("unicornpic").src="UnicornThinking.gif";
        };
        window.speechSynthesis.speak(msgProblem);
      
      break;
			default:
				currentProblem = getQuestionFromList(window.problemsForSelectedCategory);
				problemText = currentProblem.key;
				break;
		}
	}
	document.getElementsByClassName('problem')[0].textContent = problemText;
}

function checkAnswer(guess) {
  
	var trimmedGuess = guess;
	var answer = currentProblem.value;
	
	if (typeof answer === 'string') {
		answer = answer.toLowerCase();
	}

  if (trimmedGuess.indexOf(answer) >= 0) {
    congratulate();
  }  else {
    
    msg = new SpeechSynthesisUtterance('please try again');
    window.speechSynthesis.speak(msg);
  
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

function congratulate(){
  
  // get a random number to choose celebration image
  var rndnum = getRandomInteger(5);
  
  // change the animated .gif to 'celebration!'
	document.getElementById("unicornpic").src="images/celebrate" + rndnum + ".gif";
	
	var msg = new SpeechSynthesisUtterance();
	msg.text = 'Awesome! you got it right!';
	window.speechSynthesis.speak(msg);
	
	// another random number to choose celebration sound
  rndnum = getRandomInteger(5);

	var snd = new Audio("audio/happy" + rndnum + ".mp3"); // buffers automatically when created
	snd.addEventListener('ended', showNextProblem);
	snd.play();     
}

function setIHeardText(textToDisplay) {
	document.getElementById('iHeardText').textContent = textToDisplay;
}

function detectIfSpeechSupported() {
	var supportMessage;
	var warningsElement = document.getElementsByClassName('warnings')[0];
	if (SpeechRecognition) {
		supportMessage = "1.86 Cool!  Your browser supports speech recognition & Speech Synthesis Have fun!";
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
  
    startAnnyang();
    
});

function startAnnyang() {

if (answeredCorrectly == -1) {
		document.getElementsByClassName('scores')[0].classList.remove('hidden');
		document.getElementsByClassName('unicorn')[0].classList.remove('hidden');
		document.getElementsByClassName('card')[0].classList.remove('hidden');
		document.getElementById('secondInstructions').style.display = '';
    
    var msgHi = new SpeechSynthesisUtterance('Hi Amelia!');
    window.speechSynthesis.speak(msgHi);
    var msgReady = new SpeechSynthesisUtterance('Are you ready to play the unicorn math game');
    window.speechSynthesis.speak(msgReady);
    
    currentScore = 0;
    showNextProblem();
		
    }
    
		document.getElementById('currentScoreValue').textContent = currentScore;

    if (annyang) {
  
				var gotwo = function() {
					checkAnswer('2');
				}
						
				var gothree = function() {
					checkAnswer('3');
				}
						
				var gofour = function() {
					checkAnswer('4');
				}
						
				var gofive = function() {
					checkAnswer('5');
				}
				
				var gosix = function() {
					checkAnswer('6');
				}
				
				var goseven = function() {
					checkAnswer('7');
				}
        
        var commands = {
            '2': gotwo,
            'two': gotwo,
            '3': gothree,
            'three': gothree,
            '4': gofour,
            'four': gofour,
            '5': gofive,
            'five': gofive,
            '6': gofive,
            'six': gosix,
            '7': goseven,
            'seven': goseven,
        };
        
        annyang.addCommands(commands);
        annyang.start(); 
    }
}





