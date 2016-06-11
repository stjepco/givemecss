//Border-radius
"use strict"    ;

console.log("border-radius")

var inputi = document.getElementsByClassName('radius');

var promjeniDiv = document.getElementById('promijeniDiv');


function promjeniRadius(koji) {
    // console.log('promjenio sam imput', inputi[koji].value);

    switch (koji){
        case 0:
            promjeniDiv.style.borderTopLeftRadius = inputi[0].value + "px";
        case 1:
            promjeniDiv.style.borderTopRightRadius = inputi[1].value + "px";
        case 2:
            promjeniDiv.style.borderBottomLeftRadius = inputi[2].value + "px";
        case 3:
            promjeniDiv.style.borderBottomRightRadius = inputi[3].value + "px";
    }


}

var clickHandler = function inputClickHandler(event){
    console.log(this.className);
};

// inputi[0].addEventListener('input', clickHandler);