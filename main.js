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

// const image = document.getElementById('image');
// const rotateBtn = document.querySelector('.rotate-btn');
// // const cropBtn = document.querySelector('.crop-btn');
const result = document.getElementById('result');

let cmd = {};

// const cropper = new Cropper(image, {
// viewMode: 1,
// center: true,
// autoCrop: false,
// crop(event) {
//   result.innerHTML = '';
//   result.appendChild(cropper.getCroppedCanvas());
// },
//   ready() {
//     cmd = {
//       'zoom in': () => {
//         this.cropper.zoom(0.1);
//       },

//       'zoom out': () => {
//         this.cropper.zoom(-0.1);
//       },

//       rotate: () => {
//         this.cropper.rotate(45);
//       },

//       'rotate twice': () => {
//         this.cropper.rotate(90);
//       },

//       'move right': () => {
//         this.cropper.move(-20, 0);
//       },
//       'move left': () => {
//         this.cropper.move(20, 0);
//       },

//       'flip horizontal': () => {
//         this.cropper.scale(-1, 1);
//       },
//       'flip vertical': () => {
//         this.cropper.scale(1, -1);
//       },
//       'flip reset': () => {
//         this.cropper.scale(1);
//       },

//       reset: () => {
//         this.cropper.reset();
//       },

//       'start editing': () => {
//         this.cropper.crop();
//       },
//     };
//     // And then
//     this.cropper.crop();
//     cropBtn.addEventListener('click', () => {
//       this.cropper.getCroppedCanvas({ maxWidth: 4096, maxHeight: 4096 });
//     });
//   },
// });

window.addEventListener('DOMContentLoaded', function () {
  var avatar = document.getElementById('avatar');
  var image = document.getElementById('image');
  var input = document.getElementById('input');
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
        autoCrop: false,
        crop(event) {
          result.innerHTML = '';
          result.appendChild(cropper.getCroppedCanvas());
        },
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

            'start editing': () => {
              this.cropper.crop();
            },
          };
        },
      });
    })
    .on('hidden.bs.modal', function () {
      cropper.destroy();
      cropper = null;
    });

  document.getElementById('crop').addEventListener('click', function () {
    var initialAvatarURL;
    var canvas;

    $modal.modal('hide');

    if (cropper) {
      canvas = cropper.getCroppedCanvas({
        width: 160,
        height: 160,
      });
      initialAvatarURL = avatar.src;
      avatar.src = canvas.toDataURL();
      $progress.show();
      $alert.removeClass('alert-success alert-warning');
      canvas.toBlob(function (blob) {
        var formData = new FormData();

        formData.append('avatar', blob, 'avatar.jpg');
        console.log(formData);
        $.ajax('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,

          xhr: function () {
            var xhr = new XMLHttpRequest();

            xhr.upload.onprogress = function (e) {
              var percent = '0';
              var percentage = '0%';

              if (e.lengthComputable) {
                percent = Math.round((e.loaded / e.total) * 100);
                percentage = percent + '%';
                $progressBar
                  .width(percentage)
                  .attr('aria-valuenow', percent)
                  .text(percentage);
              }
            };

            return xhr;
          },

          success: function () {
            $alert.show().addClass('alert-success').text('Upload success');
          },

          error: function () {
            avatar.src = initialAvatarURL;
            $alert.show().addClass('alert-warning').text('Upload error');
          },

          complete: function () {
            $progress.hide();
          },
        });
      });
    }
  });
});
