const openModalBtn = document.querySelector("#info");
const closeModalBtn = document.querySelector("#close");
const modal = document.querySelector(".modal");
const overlay = document.querySelector("#overlay");

openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    overlay.classList.add("active");
    openModalBtn.style.cursor = "default";
})

function closeModal() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    openModalBtn.style.cursor = "pointer";
}

closeModalBtn.addEventListener("click", () => {
    closeModal();
})

overlay.addEventListener("click", () => {
    closeModal();
})


if ("speechSynthesis" in window) {

    let dictation = new SpeechSynthesisUtterance();

    let voices = [];
    let voiceSelect = document.querySelector("select");

    window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        dictation.voice = voices[177]; //defaults to CN voice
        

        voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
        voiceSelect.options[177].selected = true; //auto selects CN voice in dropdown/selection menu
    };

    /* change output audio voice when user chooses new option in dropdown menu */ 
    voiceSelect.addEventListener("change", () => {
        dictation.voice = voices[voiceSelect.value];
    })

    /* on 'Randomize!' button click, randomize user inputted text and output audio of the randomized order */
    document.getElementById("randomize").addEventListener("click", () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        let text = document.querySelector("textarea").value;

        let wordArray = text.split("\n");
        shuffle(wordArray);

        dictation.text = wordArray.join(". \n");
        dictation.lang = "zh-CN";
        dictation.rate = document.querySelector("#rate").value;

        window.speechSynthesis.speak(dictation);

        document.querySelector("textarea").value = wordArray.join("\n"); //returns shuffled ver. on text area

        document.getElementById("repeat").disabled = false;
    })

    /* randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffle(array) {
        for (let i = array.length-1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
    }

    let paused = false;
    document.addEventListener("keyup", event => {
        if (event.code === "Space") {
            if (!paused) {
                window.speechSynthesis.pause();
                paused = true;
            }
            else {
                window.speechSynthesis.resume();
                paused = false;
            }
        }
    })

    document.getElementById("repeat").addEventListener("click", () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        window.speechSynthesis.speak(dictation);
    })

}
else {
    alert("sorry, your browser doesn't support tts");
}
