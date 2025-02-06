function deleteUploadedFile(el) {
    const uploadedFile = el.parentNode;
    const uploadedFilesSection = uploadedFile.parentNode;
    uploadedFile.remove();
    handle_files({
        parentElement: uploadedFilesSection.getAttribute('data-parentElement'),
        enableCamera: uploadedFilesSection.getAttribute('data-enableCamera'),
        enableFileInput: !!parseInt(uploadedFilesSection.getAttribute('data-enableFileInput')),
        fileType: uploadedFilesSection.getAttribute('data-fileType'),
        previewImage: !!parseInt(uploadedFilesSection.getAttribute('data-previewImage')),
        fileLimitQty: parseInt(uploadedFilesSection.getAttribute('data-fileLimitQty')),
        uploadedFileQty: uploadedFilesSection.querySelectorAll('.uploaded-file').length,
        modal: !!parseInt(uploadedFilesSection.getAttribute('data-modal')),
        btnUploadTextModal: uploadedFilesSection.getAttribute('data-btnUploadTextModal') ? uploadedFilesSection.getAttribute('data-btnUploadTextModal') : 'Upload Files',
        btnUploadedTextmodal: uploadedFilesSection.getAttribute('data-btnUploadedTextmodal') ? uploadedFilesSection.getAttribute('data-btnUploadedTextmodal') : 'See Uploaded Files',
    })
}

// GLOBAL VARIABLE TO SAVING FILES AND TO SHOW FILES;
let SAVED_FILES = [];

// FUNCTION TO ACTIVATION CAMERA AND CHANGE CAMERA POSITION
let currentFacingMode = "user";
function change_camera_postion() {
    // Ganti mode facing antara "user" dan "environment"
    currentFacingMode = currentFacingMode === "user" ? "environment" : "user";

    // Minta akses ke kamera dengan mode yang dipilih
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: {
                exact: currentFacingMode
            }
        }
    }).then(function (stream) {
        const videoElement = document.getElementById('video');
        videoElement.srcObject = stream;
    }).catch(function (error) {
        console.error("Error accessing the camera", error);
        console.error("access with mobile");
    });
}
var stop = () => video.srcObject && video.srcObject.getTracks().forEach(t => t.stop());
// Inisialisasi pertama kali dengan kamera depan
change_camera_postion();

function handle_files(object) {
    if (!SAVED_FILES.some(file => file.id === object.parentElement)) {
        SAVED_FILES.push({ id: object.parentElement, files: [] });
    }
    let obj_saved = SAVED_FILES.find(file => file.id === object.parentElement);
    let limitFile;
    if (object.fileLimitQty !== -1) {
        limitFile = object.fileLimitQty - object.uploadedFileQty;
    }
    const containerElements = document.querySelector(object.parentElement);
    const savedFilesInputElement = containerElements.querySelector('.saved'); //element input type file yang akan menyimpan semua file yg di upload untuk diambil value(files)-nya
    const fileListSection = containerElements.querySelector('.file-list-section');
    if (!containerElements.querySelector('.alert-limit')) {
        const div = document.createElement('div');
        div.classList = 'w-100 alert-limit';
        containerElements.prepend(div);
    }
    if (!containerElements.querySelector('.alert-uploaded')) {
        const div = document.createElement('div');
        div.classList = 'w-100 alert-uploaded';
        containerElements.prepend(div);
    }
    const alertUploaded = containerElements.querySelector('.alert-uploaded');
    const alertLimit = containerElements.querySelector('.alert-limit');

    if (object.uploadedFileQty > 0) {
        alertUploaded.innerHTML = `
            <div class="alert alert-info mb-1" style="font-size: 12px;">
                Uploaded photos by customer is ${object.uploadedFileQty}
            </div>
        `
    }

    function handle_qty_file(_uploadedFileQty) {
        remainingFileElement.innerHTML = _uploadedFileQty + object.uploadedFileQty;
        const btnInput = containerElements.querySelector('.file-input');
        const btnTakePhoto = containerElements.querySelector('.btn-take-photo');
        if (object.fileLimitQty !== -1) {
            if (_uploadedFileQty >= limitFile) {
                alertLimit.innerHTML += `
                    <div class="alert alert-danger alert-limit mb-1" style="font-size: 12px;">
                        You can only upload up to ${object.fileLimitQty} files
                    </div>
                `
                if (object.enableFileInput) btnInput.disabled = true;
                if (object.enableCamera) btnTakePhoto.disabled = true;
            } else {
                alertLimit.innerHTML = '';
                if (object.enableFileInput) btnInput.disabled = false;
                if (object.enableCamera) btnTakePhoto.disabled = false;
            }
        }
    }

    function handle_text_modal(qty) {
        const btnTriggerModal = containerElements.querySelector('.btn-modal');
        if (qty > 0) {
            btnTriggerModal.innerHTML = `${object.btnUploadedTextModal ? object.btnUploadedTextModal : 'See Uploaded Files'}`;
        } else if (qty === 0) {
            btnTriggerModal.innerHTML = `${object.btnUploadTextModal ? object.btnUploadTextModal : 'Upload Files'}`;
        }
    }

    // OBJECT: handle input file by element
    if (object.enableFileInput) {
        const fileInputSection = containerElements.querySelector('.file-input-section');
        if (object.fileType) {
            fileInputSection.innerHTML = `
                <input type="file" class="form-control text-sm file-input limit-size-multiple" multiple data-limit-size="20" accept="${object.fileType}" style="color: transparent; style: 100vw;">
            `;
        } else {
            fileInputSection.innerHTML = `
                <input type="file" class="form-control text-sm file-input limit-size-multiple" multiple data-limit-size="20" style="color: transparent; style: 100vw;">
            `;
        }

        const fileInputElement = fileInputSection.querySelector('input.file-input');
        if (fileInputSection.classList.contains('disabled')) fileInputElement.disabled = true;
        else fileInputElement.disabled = false;

        if (!object.enableCamera && object.fileLimitQty !== -1) {
            fileInputSection.classList = "file-input-section w-100 d-flex align-items-center gap-1 mt-2";
            if (!fileInputSection.querySelector(".info-qty")) {
                const div = document.createElement('div');
                div.classList = 'info-qty';
                fileInputSection.append(div);
            }
            const infoSection = fileInputSection.querySelector('.info-qty');
            infoSection.innerHTML = `
                <span class="remaining-file">0</span>/<span class="limit-file"></span>
            `
        }

        fileInputElement.addEventListener('change', handle_file_input);
        function handle_file_input() {
            if (fileInputElement.classList.contains('limit-size-multiple')) {
                let limit_size = parseInt(fileInputElement.dataset.limitSize) * 1024 * 1024;
                for (let i = 0; i < fileInputElement.files.length; i++) {
                    // jika size dari file melebihi size limit maka tidak akan di push ke SAVED_FILES
                    if (fileInputElement.files[i].size > limit_size) {
                        alert(`The file size of ${fileInputElement.files[i].name} exceeds ${fileInputElement.dataset.limitSize}MB. Please make sure your file does not exceed ${fileInputElement.dataset.limitSize}MB`)
                    } else { // jika size dari file kurang dari size limit maka akan di push ke SAVED_FILES
                        if (object.fileLimitQty !== -1) {
                            if (obj_saved.files.length < limitFile) {
                                obj_saved.files.push(fileInputElement.files[i]);
                                handle_qty_file(obj_saved.files.length);
                                if (object.modal) handle_text_modal(obj_saved.files.length);
                            } else console.log(`you can only upload up to ${object.fileLimitQty}`)
                        } else {
                            obj_saved.files.push(fileInputElement.files[i]);
                            if (object.modal) handle_text_modal(obj_saved.files.length);
                        }
                    }
                }
            } else {
                const files = Array.from(fileInputElement.files);
                if (object.fileLimitQty !== -1) {
                    if ((files.length + obj_saved.files.length) < limitFile) {
                        obj_saved.files = obj_saved.files.concat(files);
                    } else {
                        obj_saved.files = obj_saved.files.concat(files.splice(0, limitFile)); // hanya mengambil 10 file
                        console.log(`you can only upload up to ${object.fileLimitQty}`)
                    }
                } else obj_saved.files = obj_saved.files.concat(files);
                handle_qty_file(obj_saved.files.length);
                if (object.modal) handle_text_modal(obj_saved.files.length);
            }
            fileInputElement.value = null;
            update_file_list();
        }
    }

    // OBJECT: handle input image by camera
    if (object.enableCamera) {
        const cameraSection = containerElements.querySelector('.camera-section');
        cameraSection.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" onclick="stop();change_camera_postion()" style="cursor: pointer;"
                class="icon icon-tabler icon-tabler-camera-rotate float-right" width="44" height="44" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                    d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                <path d="M11.245 15.904a3 3 0 0 0 3.755 -2.904m-2.25 -2.905a3 3 0 0 0 -3.75 2.905" />
                <path d="M10 13h-2v-2" />
                <path d="M14 13h2v2" />
            </svg>
            <video id="video" autoplay style="width: 100%; height: 300px;"></video>
            <button type="button" class="btn w-100 btn-dark btn-take-photo">
                Take Photo
            </button>
            <canvas id="canvas" width="500" height="500" hidden></canvas>
        `;

        const btnTakePhoto = cameraSection.querySelector(".btn-take-photo");
        if (object.fileLimitQty !== -1) {
            btnTakePhoto.innerHTML = `Take Photo <span class="remaining-file">0</span>/<span class="limit-file"></span>`;
        }

        if (cameraSection.classList.contains('disabled')) btnTakePhoto.disabled = true;
        else btnTakePhoto.disabled = false;

        const canvas = cameraSection.querySelector("#canvas");
        btnTakePhoto.addEventListener('click', () => {
            // Mengatur ukuran canvas agar sesuai dengan ukuran video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let imageDataURL = canvas.toDataURL('image/jpeg');

            // Convert data URL to Blob
            fetch(imageDataURL)
                .then(res => res.blob())
                .then(blob => {
                    // Convert Blob to File
                    const file = new File([blob], `photo_${Date.now()}.jpeg`, { type: 'image/jpeg' });
                    // Store the file in the array
                    obj_saved.files.push(file);
                    if (object.fileLimitQty !== -1) handle_qty_file(obj_saved.files.length);
                    if (object.modal) handle_text_modal(obj_saved.files.length);
                    update_file_list();
                })
                .catch(error => console.error('Error converting data URL to Blob:', error));
        })
    }


    function update_file_list() {
        const fileList = fileListSection.querySelector('.fileList');
        fileList.innerHTML = "";

        if (object.fileLimitQty !== -1 && obj_saved.files.length > limitFile) {
            obj_saved.files = obj_saved.files.splice(0, limitFile);
            handle_qty_file(obj_saved.files.length);
            if (object.modal) handle_text_modal(obj_saved.files.length);
        }

        obj_saved.files.forEach((file, index) => {
            let typeFile = file.name.split('.').pop();
            const div = document.createElement('div');

            // OBJECT: Hanya untuk preview image
            if (object.previewImage && (typeFile === 'jpeg' || typeFile === 'png' || typeFile === 'jpg')) {
                div.classList = "d-flex justify-content-center align-items-center w-100 mt-4 bg-light rounded-lg position-relative";
                div.innerHTML = `
                    <a class="fancybox-item" data-fancybox="photos" data-src="">
                        <canvas class="imageCanvas w-100" style="height: 150px;"></canvas>
                        <span class="cancelBtn position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            X
                            <span class="visually-hidden">delete file</span>
                        </span>
                    </a>
                `;

                // Render the image to canvas
                const canvas = div.querySelector(".imageCanvas");
                const fancybox = div.querySelector(".fancybox-item");
                const ctx = canvas.getContext("2d");
                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = new Image();
                    img.onload = function () {
                        // Set canvas size to the image's original size
                        canvas.width = img.width;
                        canvas.height = img.height;

                        // Draw the image without scaling (use the original size)
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        // Set the href for fancybox to the image src
                        fancybox.setAttribute('data-src', event.target.result);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file); // Read the file as Data URL
            } else { // OBJECT : jika previewImage 'false'
                div.classList = "d-flex justify-content-between align-items-center w-100 mt-1 bg-light pl-2 rounded-lg"
                div.innerHTML = `
                    <span>${file.name}</span>
                    <button type="button" class="cancelBtn btn btn-danger btn-xs w-25px">X</button>
                `;
            }
            //handle delete file
            div.querySelector(".cancelBtn").addEventListener("click", () =>
                cancel_file(index)
            );
            fileList.appendChild(div);
        })

        //store to saved from sample
        const dataTransfer = new DataTransfer();
        obj_saved.files.forEach((file) => {
            dataTransfer.items.add(file);
        });
        // menyimpan files yang berada di obj_saved.files ke Element Input File (Saved)
        savedFilesInputElement.files = dataTransfer.files;
    }

    function cancel_file(index) {
        obj_saved.files.splice(index, 1);
        if (object.fileLimitQty !== -1) handle_qty_file(obj_saved.files.length);
        if (object.modal) handle_text_modal(obj_saved.files.length);
        alertLimit.innerHTML = '';
        update_file_list();
    }

    let remainingFileElement;
    let limitFileElement;
    if (object.fileLimitQty !== -1) {
        remainingFileElement = document.querySelector('.remaining-file');
        remainingFileElement.innerHTML = object.uploadedFileQty;
        limitFileElement = document.querySelector('.limit-file');
        limitFileElement.innerHTML = object.fileLimitQty;
    }
}