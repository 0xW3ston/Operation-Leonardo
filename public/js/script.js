
$("#s1").css("background","rgba(136, 179, 218, 0.635)");

// function right(){
//         $(".event").css("left","-98%");
// }
// function left(){
//     $(".event").css("left","1%");
// }
// function rightF(){
//     $(".formation").css("left","-98%");
// }
// function leftF(){
// $(".formation").css("left","1%");
// }
function p1(){
    $(".sslider").css("transform"," translateX(0%)");
    $(".sslider").css("-webkit-transform", "translateX(0%)");
    $("#s1").css("background","rgba(136, 179, 218, 0.635)");
    $("#s2").css("background","rgba(255, 255, 255, 1)")
    $("#s3").css("background","rgba(255, 255, 255, 1)")
}
function p2(){
    $(".sslider").css("transform"," translateX(   -100%)");
    $(".sslider").css("-webkit-transform", "translateX(   -100%)");
    $("#s2").css("background","rgba(136, 179, 218, 0.635)");
    $("#s1").css("background","rgba(255, 255, 255, 1)")
    $("#s3").css("background","rgba(255, 255, 255, 1)")
}
function p3(){
    $(".sslider").css("transform"," translateX(-200%)");
    $(".sslider").css("-webkit-transform", "translateX(-200%)");
    $("#s3").css("background","rgba(136, 179, 218, 0.635)");
    $("#s2").css("background","rgba(255, 255, 255, 1)")
    $("#s1").css("background","rgba(255, 255, 255, 1)")
}

//=====================================================

$("#s11").css("background","rgba(136, 179, 218, 0.635)");

// function right1(){
//         $(".event").css("left","-98%");
// }
// function left1(){
//     $(".event").css("left","1%");
// }
// function rightF1(){
//     $(".formation").css("left","-98%");
// }
// function leftF1(){
// $(".formation").css("left","1%");
// }
function p11(){
    $(".sslider1").css("transform"," translateX(0%)");
    $(".sslider1").css("-webkit-transform", "translateX(0%)");
    $("#s11").css("background","rgba(136, 179, 218, 0.635)");
    $("#s21").css("background","rgba(255, 255, 255, 1)")
    $("#s31").css("background","rgba(255, 255, 255, 1)")
}
function p21(){
    $(".sslider1").css("transform"," translateX(   -100%)");
    $(".sslider1").css("-webkit-transform", "translateX(   -100%)");
    $("#s21").css("background","rgba(136, 179, 218, 0.635)");
    $("#s11").css("background","rgba(255, 255, 255, 1)")
    $("#s31").css("background","rgba(255, 255, 255, 1)")
}
function p31(){
    $(".sslider1").css("transform"," translateX(-200%)");
    $(".sslider1").css("-webkit-transform", "translateX(-200%)");
    $("#s31").css("background","rgba(136, 179, 218, 0.635)");
    $("#s21").css("background","rgba(255, 255, 255, 1)")
    $("#s11").css("background","rgba(255, 255, 255, 1)")
}

//-======================== this is new :D ====================
//---------------- delete parent  --for images
// function remove (){
//     this.parentNode.remove()
// }

//------------------ add other input for image and preview
function add(){
    let div = document.createElement("div");
    let inp = document.createElement("input");
    const btn = document.createElement("input");
    btn.type="button",
    btn.value="-";
    btn.addEventListener("click",remove)
    inp.accept=".jpeg,.jpg,.png,.gif,.webp";
    div.setAttribute("id","sp");
    div.setAttribute("class","btn");
    inp.addEventListener('change', event => {
          const file = event.target.files[0];
  
          if (file && file.type.startsWith('image/')) {
              const reader = new FileReader();
  
              reader.onload = event => {
                  const img = new Image();
                  img.src = event.target.result;
                  img.alt = file.name;
                  div.appendChild(btn)
                  div.appendChild(img);
                  
              };
  
              reader.readAsDataURL(file);
      add()
          }})
  
    inp.setAttribute("type","file")
    inp.setAttribute("id","inpImage")
    inp.setAttribute("name","myImage")
    div.appendChild(inp)
    document.querySelector("#inplist").appendChild(div)
  }




const inp = document.querySelector('#inpImage');
const preview = document.querySelector('#sp');

    inp.addEventListener('change', event => {
        const btn = document.createElement("input");
        btn.type="button",
        btn.value="-";
        
        btn.addEventListener("click",remove)
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.alt = file.name;
                
                preview.appendChild(btn)
                preview.appendChild(img);
            };

            reader.readAsDataURL(file);
        }
  
  add()

    });

//-------- delete without reload or redirect
const deleteButtons = document.querySelectorAll('.delete-image');
deleteButtons.forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault();
        const imageId = button.dataset.id;
        fetch(`/deleteImage/${imageId}`, {
            method: 'GET',
        })
        .then(response => {
            if(response.ok) {
                button.parentElement.remove();
            }
        })
        .catch(error => console.error(error));
    });
}); 
//=============
const deleteButtons2 = document.querySelectorAll('.delete-image2');
deleteButtons2.forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault();
        const imageId2 = button.dataset.id;
        fetch(`/deleteImage2/${imageId2}`, {
            method: 'GET',
        })
        .then(response => {
            if(response.ok) {
                button.parentElement.remove();
            }
        })
        .catch(error => console.error(error));
    });
});

