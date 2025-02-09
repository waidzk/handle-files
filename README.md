[DEMO](https://waidzk.github.io/handle-files/)

## Full Feature (with modal BS5) *ini dulu ya 😅

1. tambahin script nya ke kode lu
    
    ```jsx
    <script src="your/path/handle-files.js"></script>
    ```
    
2. terus buat container nya dan tambahin modal nya
    
    ```html
    <div class="container-upload-with-modal">
        <!-- Button trigger modal upload photos -->
        <button type="button" class="btn btn-primary btn-modal" data-bs-toggle="modal" data-bs-target="#uploadFile">
            <i class="fa fa-upload me-2" aria-hidden="true"></i>Upload Photos/ Files
        </button>
        <!-- Modal Upload Photos -->
        <div class="modal fade" id="uploadFile" aria-labelledby="uploadFileLabel" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="uploadFileLabel">Upload Photos/ Files</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="width: 100%;display: flex;flex-direction: column;align-items: center;">
                        <div style="max-width:420px">
                            <input type="file" class="saved form-control mt-3 d-none" multiple id="input-file" />
                            <div class="camera-section w-100"></div>
                            <div class="file-input-section w-100 mt-2"></div>
                            <div class="file-list-section w-100">
                                <div class="fileList mt-2 w-100"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Done</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    ```
    
    ini adalah element yang wajib untuk kode di atas
    
    1. harus memiki container untuk 1 modal. untuk penamaannya bebas, bisa pakai id atau class. nanti di atur aja di function nya.
    2. button modal harus memiliki class “btn-modal”
    3. harus memiliki kode ini.
        
        ```html
        <div style="max-width:420px">
            <input type="file" class="saved form-control mt-3 d-none" multiple id="input-file" />
            <div class="camera-section w-100"></div>
            <div class="file-input-section w-100 mt-2"></div>
            <div class="file-list-section w-100">
                <div class="fileList mt-2 w-100"></div>
            </div>
        </div>
        ```
        
        jika lebar nya ingin di tambah/ kurangi/ full atur saja di `max-width` tersebut, namun jangan dihapus `div` nya. dan child code nya harus sama, kecuali `id` pada input type file dengan class `saved` itu bisa di ganti sesuai dengan keingingan (untuk ambil value files nya).
        
    
    3. panggil function-nya
    
    ```jsx
    handle_files({
        parentElement: `.container-upload-with-modal`,
        enableCamera: true,
        enableFileInput: true,
        fileType: ".jpeg, .jpg, .png, .docx, .xlsx, .pdf",
        previewImage: true,
        fileLimitQty: 10,
        uploadedFileQty: 2,
        modal: true,
        btnUploadedTextModal: `<i class="fa fa-upload me-1" aria-hidden="true"></i>See Uploaded Photos/ Files`,
        btnUploadTextModal: `<i class="fa fa-upload me-1" aria-hidden="true"></i>Upload Photos/ Files`,
        uploadedText: "Jumlah file yang udh di upload orang laen: ",
        limitText: "WEH, selo dong. cuma bisa "
    })
    ```
    
    untuk penjelasan *argument object* nya seperti berikut.
    
    | key | value | notes |
    | --- | --- | --- |
    | parentElement  | **string** | isi nya adalah nama class/ id jika class berawalan titik (`.container`), jika id berawalan hash (`#container`). |
    | enableCamera  | **boolean** |  aktif atau tidak nya kamera. jika ingin tidak aktif maka hapus saja elemen ‘`camera-section`’ pada modal. |
    | enableFileInput  | **boolean**  |  aktif atau tidak nya file input. jika ingin tidak aktif maka hapus saja ‘`file-input-section`’ pada modal. |
    | previewImage  | **boolean** | untuk preview gambar dan ini akan otomatis jika yang diupload bukan gambar maka tidak akan di preview. |
    | fileType | **string** | tipe/ ekstensi pada file. contohnya `".jpeg, .jpg, .png, .docx, .xlsx, .pdf"` dll. pisahkan tipe file nya dengan koma (`,`) |
    | fileLimitQty  | **number/ integer** `-1 (unlimited)` or `number`  | jumlah file yang bisa di-upload. kalau unlimited maka bisa kasih `-1` pada value nya. |
    | uploadedFileQty  | **number/ integer** `0 (unused)` or `number` | biasa nya terpakai saat fileLimitQty juga aktif, ini untuk menandakan bahwa sudah ada file yang telah diupload dan jumlahnya ada berapa. jika tidak ada maka bisa kasih `0` |
    | modal  | **boolean** | ini untuk melihat apakah **handle-files** memakai modal/ tidak, karena ada perbedaan kode untuk `btn-modal, alert-limit, alert-uploaded` dll**.** |
    | btnUploadTextModal  | **string** |  ini untuk custom text button modal sebelum file di-upload. |
    | btnUploadedTextModal  | **string**  | ini untuk custom text button modal setelah file di-upload. |
    | uploadedText  | **string** | ini untuk custom text alert saat ada file yang telah di upload (`uploadedFileQty > 0`). |
    | limitText  | **string** | untuk custom text alert jika file yang di upload melebihi fileLimitQty dan text nya selalu berakhiran ‘**files**’ cthnya: “lu cuma bisa upload 10 **files**”. |

sisa nya nanti lagi ya, belum ada waktu 🥲 silahkan baca sendiri kode nya hehe atau DM ke [@prdhtys](https://instagram.com/prdhtys)
