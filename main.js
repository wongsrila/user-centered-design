var voice = {
  // (A) INIT VOICE COMMAND
  wrap: null, // html demo <div> wrapper
  btn: null, // html demo button
  recog: null, // speech recognition object
  init: () => {
    // (A1) GET HTML ELEMENTS
    voice.wrap = document.getElementById('vwrap');
    voice.btn = document.getElementById('vbtn');

    // (A2) GET MIC ACCESS PERMISSION
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // (A3) SPEECH RECOGNITION OBJECT & SETTINGS
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        voice.recog = new SpeechRecognition();
        voice.recog.lang = 'en-US';
        voice.recog.continuous = false;
        voice.recog.interimResults = false;

        // (A4) ON SPEECH RECOGNITION - RUN CORRESPONDING COMMAND
        voice.recog.onresult = (evt) => {
          let said = evt.results[0][0].transcript.toLowerCase();
          if (cmd[said]) {
            cmd[said]();
          } else {
            said += ' (command not found)';
          }
          voice.wrap.innerHTML = said;
          voice.stop();
        };

        // (A5) ON SPEECH RECOGNITION ERROR
        voice.recog.onerror = (err) => console.error(evt);

        // (A6) READY!
        voice.btn.disabled = false;
        voice.stop();
      })
      .catch((err) => {
        console.error(err);
        voice.wrap.innerHTML = 'Please enable access and attach a microphone.';
      });
  },

  // (B) START SPEECH RECOGNITION
  start: () => {
    voice.recog.start();
    voice.btn.onclick = voice.stop;
    voice.btn.value = 'Speak Now Or Click Again To Cancel';
  },

  // (C) STOP/CANCEL SPEECH RECOGNITION
  stop: () => {
    voice.recog.stop();
    voice.btn.onclick = voice.start;
    voice.btn.value = 'Press To Speak';
  },
};
window.addEventListener('DOMContentLoaded', voice.init);

// import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';

const image = document.getElementById('image');
const rotateBtn = document.querySelector('.rotate-btn');
let cmd = {};

const cropper = new Cropper(image, {
  aspectRatio: 1 / 1,
  crop(event) {
    console.log(event.detail.x);
    console.log(event.detail.y);
    console.log(event.detail.width);
    console.log(event.detail.height);
    console.log(event.detail.rotate);
    console.log(event.detail.scaleX);
    console.log(event.detail.scaleY);
  },
  // modal: true,
  // guides: true,
  // rotatable: true,
  ready() {
    cmd = {
      'zoom in': () => {
        this.cropper.zoom(0.1);
      },

      'zoom out': () => {
        this.cropper.zoom(-0.1);
      },

      rotate: () => {
        this.cropper.rotate(45);
      },

      'rotate twice': () => {
        this.cropper.rotate(90);
      },
    };
    // And then
    this.cropper.crop();
  },
});
