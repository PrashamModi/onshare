const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browsebtn");
const fileInput = document.querySelector("#fileInput");
const bgProgress = document.querySelector(".bg-progress");
const progresBar  = document.querySelector(".progress-bar");
const progresContainer  = document.querySelector(".progress-container");
const percentDiv = document.querySelector("#percent");
const fileURL = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");
const sharingContainer = document.querySelector(".sharing-container");
const emailForm = document.querySelector("#emailForm");
const toast = document.querySelector(".toast");

const maxAllowedSize = 100 * 1024 * 1024;

const host = "https://onshare.onrender.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();

    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged")
    }
})

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragged")
})
dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", (e)=>{
    uploadFile();
})

browseBtn.addEventListener("click", ()=>{
    fileInput.click();
});

copyBtn.addEventListener("click", () => {
    fileURL.select();
    document.execCommand('copy');
    showToast("Link Copied");
})

const uploadFile = () => {
    if(fileInput.files.length > 1){
        resetFileInput();
        showToast("Only upload one file");
        return;
    }
    const file = fileInput.files[0];

    if(file.size > maxAllowedSize){
        showToast("Can't upload more than 100mb");
        resetFileInput();
        return;
    }

    progresContainer.style.display = "block";
    
    const formData = new FormData();
    formData.append("myfile", file);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    }

    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = () =>{
        resetFileInput();
        showToast(`Error in upload: ${xhr.statusText}`);
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

const updateProgress = (e)=>{
    const percent = Math.round((e.loaded / e.total) * 100);
    // console.log(percent);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progresBar.style.transform = `scaleX(${percent/100})`
}

const showLink = ({file : url}) => {
    console.log(url);
    resetFileInput();
    emailForm[2].removeAttribute("disbaled");
    progresContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURL.value = url;
}

const resetFileInput = () => {
    fileInput.value = "";
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = (fileURL.value);
    const formData = {
        uuid : url.split("/").splice(-1, 1)[0],
        emailTo : emailForm.elements["to-email"].value,
        emailFrom : emailForm.elements["from-email"].value
    }

    emailForm[2].setAttribute("disbaled", "true");

    fetch(emailURL, {
        method: "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(formData)
    }).then(res => res.json()).then(({success}) => {
        if(success){
            sharingContainer.style.display = "none";
            showToast("Email Sent")
        }
    })
})

const showToast = (msg) => {
    let toastTimer;
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
    clearTimeout(toastTimer);

    toastTimer = setTimeout(()=>{
        toast.style.transform = "translate(-50%, 60px)";
    }, 2000)
}