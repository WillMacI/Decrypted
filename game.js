let score = 0
let team_name = ""
let current_hint = ""
const PENALTY_FOR_HINT = 2
const TIME_FOR_HINT = 10
let log_book = []

//Load first slide
loadExternalContent('start_game')

function getCurrentTime() {
    var options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    var currentTime = new Date().toLocaleTimeString('en-US', options);
    return currentTime;
}
function update_score(){
    document.getElementById('score').textContent = score
    log_book.push([[getCurrentTime()],["Score updated to "+score]])
}
function update_directions(direction){
    document.getElementById('direction').innerHTML = direction
}
function reset_hint(){
    document.getElementById('hint').textContent = ""
    document.getElementById('hint_button').style.display = 'block'
    document.getElementById('countdown').style.display = 'none'
}
function get_hint(){
    log_book.push([[getCurrentTime()],["Hint requested"]])
    document.getElementById('hint').textContent = current_hint
    document.getElementById('hint_button').style.display = 'none'
    score-=PENALTY_FOR_HINT
    update_score()
    let timeLeft = TIME_FOR_HINT; // seconds
    const countdownElement = document.getElementById('countdown');
    countdownElement.style.display = "block"
    const countdownInterval = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            reset_hint();
        } else {
            countdownElement.innerHTML = timeLeft;
            timeLeft--;
        }
    }, TIME_FOR_HINT*100);
}
// Start of game - TPS login portal
function start_game(){
    team_name = document.getElementById('team-name').value
    log_book.push([[getCurrentTime()],["Game started for team "+team_name]])
    score+=2;
    update_score()
    loadExternalContent('login')
    update_directions("Login to the Toronto Police database to continue to the next stage. ")
    current_hint = "Sometimes, the answer lies where you least expect it—beneath a button meant to retrieve what's lost, you might find a way to connect. Look closely, and you’ll dial right into the solution."
}
// PROBLEM 1 - Hex to Plaintext
function check_ans_problem_1(){
    const badge_input = document.getElementById('badge').value
    const password_input = document.getElementById('password').value
    if(badge_input == "20327579" && password_input == "TPSpassword2001"){
        //Move on to next stage
        score+=5
        update_score()
        display_problem_2()
        log_book.push([[getCurrentTime()],["Moving to problem 2:  "+team_name]])
    } else {
        alert("Wrong password.")
        log_book.push([[getCurrentTime()],["Wrong password for P1 "+team_name]])
    }
}

//PROBLEM 2 - Enigma
// Show TPS mainframe
function display_problem_2(){
    loadExternalContent('tps_mainframe_encrypted')
    update_directions("Using the secret ciphertext turn it into plaintext using the following settings. <br><br> <b>Model:</b> I<br><b>Reflector: </b>UKW B<br><b>Rotor 1: </b> I <b>Position:</b> 1A <b>Ring: </b> 1A<br><b>Rotor 2: </b> II <b>Position:</b> 1A <b>Ring: </b> 1A<br><b>Rotor 3: </b> I <b>Position:</b> 12L <b>Ring: </b> 1A")
    current_hint = "Align the rotors carefully, for every letter hides another. Begin with the correct starting position, then turn the machine after each key press, allowing the secrets to unfold. Remember, the key to unraveling the code lies in knowing where to start, and which paths the current takes."
}
//Check problem 2
function check_ans_problem_2(){
    const user_input = document.getElementById('plain-text-P2').value
    if(user_input == "passw ord"){
        //Move to next stage
        score+=10
        update_score()
        display_problem_3_1()
        log_book.push([[getCurrentTime()],["Moving to problem 3 "+team_name]])

    } else {
        alert('Wrong password. ')
    }
}
//PROBLEM 3 - Comprehension
//Displays an unencrypted vers/ of the TPS mainframe
function display_problem_3_1(){
    loadExternalContent('tps_mainframe_problem_3')
    update_directions("Read over the highlighted file and answer the comprehension question. ")
    current_hint = "No hint for this problem!"
}
function display_problem_3_2(){
    loadExternalContent('problem_3_(report)')
}
//PROBLEM 4
function display_problem_4_1(){
    log_book.push([[getCurrentTime()],["Moving to problem 4 "+team_name]])

    score+=5
    update_score()
    loadExternalContent('tps_mainframe_problem_4')
    update_directions("Listen to the wiretap. It seems to be backwards.  ")
    current_hint = "Try to reverse the wiretap."
}
function display_problem_4_2(){
    loadExternalContent('wiretap')
}
function check_input_problem_4(){
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file || file.type !== 'text/plain') {
        alert('Please select a valid .txt file');
        return;
    }

    // Read the uploaded file
    const reader = new FileReader();
    reader.onload = function(e) {
        const uploadedFileContent = e.target.result;

        // Fetch the server file content
        fetch('game_slides/wiretap_correct.txt') // Replace with the actual path to the server file
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(serverFileContent => {
                // Compare the contents
                if (uploadedFileContent === serverFileContent) {
                    document.getElementById('listen').style.display = "block"
                    alert("You have correctly reversed the file!")
                    score+=10
                    log_book.push([[getCurrentTime()],["Moving to problem 5 "+team_name]])

                    update_score()
                } else {
                    alert("Not correct try again.")
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    reader.readAsText(file);

}

//PROBLEM 5
function load_problem_5(){
    loadExternalContent('tps_mainframe_problem_5')
    update_directions("Decode the message to find the address.  ")
    current_hint = "Using morse code. "
}
function load_problem_5_2(){
    document.getElementById('map').style.display = "block"
    loadExternalContent('map')
}
function finished_game(){
    log_book.push([[getCurrentTime()],["Finished game "+team_name]])
    document.getElementById('map').style.display = "none"
    score+=10
    update_score()
    update_directions("Well done!  ")
    current_hint = "You did it! "
    loadExternalContent('finished_game')
    const arrayString = log_book.join(",\n ");

    document.getElementById('game-log').innerHTML = arrayString
}

//Loading each game slide
function loadExternalContent(slide_name) {
    fetch(`game_slides/${slide_name}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('content').innerHTML = data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Load the external content when the page is ready
document.addEventListener('DOMContentLoaded', loadExternalContent);


function onContainerLoaded(file_name) {
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
    });

    // Load an audio file
    wavesurfer.load(`game_slides/${file_name}.mp3`); // Replace with your file's path

    // Ensure audio is fully loaded before attaching event listeners
    wavesurfer.on('ready', function() {
        console.log('Audio is ready for playback.');

        // Play/Pause button functionality
        document.getElementById('playPauseBtn').addEventListener('click', function() {
            wavesurfer.playPause();
        });

        // Reverse audio button functionality
    });

    // Handle loading errors
    wavesurfer.on('error', function(e) {
        console.error('Error loading audio:', e);
    });

}

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            const container = document.getElementById('waveform');
            if (container) {
                onContainerLoaded('wiretap');
                observer.disconnect(); // Stop observing once #container is found
            }
        }
    });
});
function initMap() {
    const mapCenter = {lat: 44.40605174926262, lng: -76.66537752643113}; // Approximate center for visualization
    const targetLocation = {lat: 44.40605174926262, lng: -76.66537752643113}; // Coordinates of 4946 Rd. 38, Harrowsmith, ON K0H 1V0

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: mapCenter,
    });

    // Add a marker for the target location
    const marker = new google.maps.Marker({
        position: targetLocation,
        map: map,
        icon: 'game_slides/transparent.png',
        title: "Target Location",
    });

    // Add a click listener for the marker
    marker.addListener("click", () => {
        finished_game()

    });
}
// Start observing the body for added elements
observer.observe(document.body, { childList: true, subtree: true });
// Helper function to log messages
