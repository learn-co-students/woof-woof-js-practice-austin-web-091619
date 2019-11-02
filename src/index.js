// document.addEventListener("DOMContentLoaded", function(){
    
//     pupFetch();
// } )

// function pupFetch(){
//     let dogBar = document.querySelector("#dog-bar")
//     fetch("http://localhost:3000/pups")
//     .then(response => response.json())
//     .then(pups => {
//         pups.forEach(function(pup){
//             let span = document.createElement("span")
//             span.innerHTML = pup.name
//             span.id = pup.id
//             let pupId = span.id
//             span.addEventListener("click", showPup(pupId))
            
//             dogBar.append(span)
//         })
        
//     })
// }


// function showPup(pupId){
    
//     let pup = fetchOnePup(pupId)
//     let dogInfo = document.querySelector("#dog-info")
//     let img = document.createElement("img")
//     let dogName = document.createElement("h2")
//     let goodBadButton = document.createElement("button")
//     img.src = pup.image
//     dogName.innerHTML = pup.name
//     goodBadButton.innerHTML = pup.isGoodDog
//     dogInfo.append(img, dogName, goodBadButton)


// }


// function fetchOnePup(){
//     fetch(`http://localhost:3000/pups/${pupId}`)
//     .then(response => response.json())
//     .then(pup => {
//         return pup
//     })
// }




document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar")
    const url = "http://localhost:3000/pups";
    const dogInfoDiv = document.querySelector("#dog-info");
    const goodDogFilter = document.querySelector("#good-dog-filter")
    goodDogFilter.addEventListener("click", filterDogs)

    fetchDogs().then(renderDogBar)



function fetchDogs(){
    return fetch(url)
    .then(r => r.json())
  
}


function renderDogBar(dogs){
    dogs.forEach(dog => addDogToDogBar(dog))
}

function addDogToDogBar(dog){
    const span = document.createElement("span")
    span.innerText = dog.name;
    span.setAttribute("data-id", dog.id)
    span.addEventListener("click", showDogInfo)
    dogBar.append(span)
}

function showDogInfo(event){
    currentDogId = event.target.dataset.id
   
    
    fetch(`http://localhost:3000/pups/${currentDogId}`)
        .then(r => r.json())
        .then(dog => {
            const goodOrBad = dog.isGoodDog ? "Good dog!" : "Bad dog!"
            dogInfoDiv.innerHTML = `
            <img src=${dog.image}>
            <h2>${dog.name}</h2>
            <button data-id=${dog.id}>${goodOrBad}</button>`
            const button = dogInfoDiv.querySelector('button')
            button.addEventListener("click", behaviorToggle)
            
           
        })
}

function behaviorToggle(event){
    const goodOrBad = event.target.innerText.slice(0, 1)
    const isGoodDog = goodOrBad === "G" ? true : false
    const newStatus = isGoodDog ? "Bad dog!" : "Good dog!"
    const dogId = event.target.dataset.id

    fetch(`http://localhost:3000/pups/${dogId}`, {
        method: "PATCH",
        body: JSON.stringify({isGoodDog: !isGoodDog}),
        headers: {"Content-Type": "application/json"}

    })
        .then(r => r.json())
        event.target.innerText = newStatus
}

function filterDogs(event){
    dogBar.innerHTML = ""
    const onOrOff = event.target.innerText.split(": ")[1]
    if (onOrOff === "OFF"){
        event.target.innerText = "Filter good dogs: ON"
        fetchDogs().then(dogs => dogs.filter(dog => dog.isGoodDog)).then(goodDogs => renderDogBar(goodDogs))
    } else {
        event.target.innerText = "Filter good dogs: OFF"
        fetchDogs().then(renderDogBar)
    }
    
}

})