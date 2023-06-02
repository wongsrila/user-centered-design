var voice = {
  // INIT VOICE COMMAND
  wrap: null, // html demo <div> wrapper
  btn: null, // html demo button
  recog: null, // speech recognition object
  init: () => {
    // GET HTML ELEMENTS
    voice.wrap = document.getElementById('vwrap');
    voice.btn = document.getElementById('vbtn');

    // GET MIC ACCESS PERMISSION
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // SPEECH RECOGNITION OBJECT & SETTINGS
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        voice.recog = new SpeechRecognition();
        voice.recog.lang = 'en-US';
        voice.recog.continuous = false;
        voice.recog.interimResults = false;

        // ON SPEECH RECOGNITION - RUN CORRESPONDING COMMAND
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

        // ON SPEECH RECOGNITION ERROR
        voice.recog.onerror = (err) => console.error(evt);

        // READY!
        voice.btn.disabled = false;
        voice.stop();
      })
      .catch((err) => {
        console.error(err);
        voice.wrap.innerHTML = 'Please enable access and attach a microphone.';
      });
  },

  // START SPEECH RECOGNITION
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

import Cropper from 'cropperjs';

const result = document.getElementById('result');

let cmd = {};

window.addEventListener('DOMContentLoaded', function () {
  var avatar = document.getElementById('avatar');
  var image = document.getElementById('image');
  var input = document.getElementById('input');
  // var rotateBtn = document.getElementById('rotateBtn');
  // var zoomInBtn = document.getElementById('zoomInBtn');
  // var zoomOutBtn = document.getElementById('zoomOutBtn');

  var $progress = $('.progress');
  var $progressBar = $('.progress-bar');
  var $alert = $('.alert');
  var $modal = $('#modal');
  var cropper;

  $('[data-toggle="tooltip"]').tooltip();

  input.addEventListener('change', function (e) {
    var files = e.target.files;
    var done = function (url) {
      input.value = '';
      image.src = url;
      $alert.hide();
      $modal.modal('show');
    };
    var reader;
    var file;
    var url;

    if (files && files.length > 0) {
      file = files[0];

      if (URL) {
        done(URL.createObjectURL(file));
      } else if (FileReader) {
        reader = new FileReader();
        reader.onload = function (e) {
          done(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  $modal
    .on('shown.bs.modal', function () {
      cropper = new Cropper(image, {
        viewMode: 1,
        center: true,
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

            'move right': () => {
              this.cropper.move(-20, 0);
            },
            'move left': () => {
              this.cropper.move(20, 0);
            },

            'flip horizontal': () => {
              this.cropper.scale(-1, 1);
            },
            'flip vertical': () => {
              this.cropper.scale(1, -1);
            },
            'flip reset': () => {
              this.cropper.scale(1);
            },

            reset: () => {
              this.cropper.reset();
            },
          };
          document.querySelector('#rotateBtn').addEventListener('click', () => {
            cropper.rotate(45);
          });

          document.querySelector('#zoomInBtn').addEventListener('click', () => {
            cropper.zoom(0.1);
          });

          document
            .querySelector('#zoomOutBtn')
            .addEventListener('click', () => {
              cropper.zoom(-0.1);
            });
        },
      });
    })
    .on('hidden.bs.modal', function () {
      cropper.destroy();
      cropper = null;
    });

  document.getElementById('crop').addEventListener('click', function () {
    if (cropper) {
      let canvas = cropper.getCroppedCanvas();
      // Convert our canvas to a data URL
      let canvasUrl = canvas.toDataURL();
      // Create an anchor, and set the href value to our data URL
      const createEl = document.createElement('a');
      createEl.href = canvasUrl;

      // This is the name of our downloaded file
      createEl.download = 'cropped-image';

      // Click the download button, causing a download, and then remove it
      createEl.click();
      createEl.remove();
    }
  });
});
