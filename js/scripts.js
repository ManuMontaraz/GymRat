/**********************************************************************************
    GymRat [Provisional name] - Generate mesocycles easily.
    Copyright (C) 2025 Manu Montaraz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
**********************************************************************************/

let languageLoaded = false
let exercisesLoaded = false

const version = document.querySelector("html").getAttribute("data-version")
const [exercises,muscles,categories,equipments,positions,measurements] = await getExercises().then(data => data)
const buttonSpanish = document.querySelector("#button_spanish")
const buttonEnglish = document.querySelector("#button_english")
const buttonNewMesocycle = document.querySelector("#button_new_mesocycle")
const buttonCancelNewMesocycle = document.querySelector("#button_new_mesocycle_cancel")
const buttonNextNewMesocycle = document.querySelector("#button_new_mesocycle_next")
const buttonBackNewMesocycle = document.querySelector("#button_new_mesocycle_back")
const buttonAcceptNewMesocycle = document.querySelector("#button_new_mesocycle_accept")
const elementLoader = document.querySelector("#loader")
const containerYourMesocycles = document.querySelector("#your_mesocycles")
const containerNewMesocycle = document.querySelector("#new_mesocycle")
const containerNewMesocyclePage2 = document.querySelector("#new_mesocycle_page2")

console.log({exercises})
console.log({muscles})
console.log({categories})
console.log({equipments})
console.log({positions})
console.log({measurements})

init()

function init(){
    loadExercises()
    setLanguage(getLanguage())
    setEvents()
}

///////////////////////////////////////////////////////////////////////////////

async function getExercises() {
    const response = await fetch('exercises.json')
    const exercises = (await response.json()).sort((a, b) => a.category.localeCompare(b.category))

    const muscles = [...new Set(exercises.flatMap((exercise)=>exercise.muscle))]
    const categories = [...new Set(exercises.flatMap((exercise)=>exercise.category))]
    const equipments = [...new Set(exercises.flatMap((exercise)=>exercise.equipment))]
    const positions = [...new Set(exercises.flatMap((exercise)=>exercise.position))]
    const measurements = [...new Set(exercises.flatMap((exercise)=>exercise.measurement))]

    if(!exercisesLoaded){
        exercisesLoaded = true
        checkLoad()
    }

    return [exercises,muscles,categories,equipments,positions,measurements]
}

function loadExercises(){
    const containerExerciseList = containerNewMesocyclePage2.querySelector("#exercise_list")
    containerExerciseList.innerHTML = ""

    for(let indexExercise = 0 ; indexExercise < exercises.length ; indexExercise++){
        const exercise = exercises[indexExercise]

        console.log(exercise)

        containerNewMesocyclePage2.querySelector("#exercise_list").innerHTML += `
            <li id="exercise_list_${exercise.id}" class="exercise">
                <h2>${translate(exercise.title)}</h2>
                <input type="checkbox" id="exercise_${exercise.id}" name="exercise_${exercise.id}" value="${exercise.id}">
                <div class="exercise_container">
                    <h6>${translate("for")}:</h6>
                    <p>${translate("category_"+exercise.category)}</p>
                    <p>${translate("muscle_"+exercise.muscle)}</p>
                </div>
                <div class="exercise_container">
                    <h6>${translate("equipment")}:</h6>
                    ${exercise.equipment.map(equipment => `<div><label for="exercise_${exercise.id}_${equipment}">${translate("equipment_"+equipment)}</label><input type="checkbox" id="exercise_${exercise.id}_${equipment}" name="exercise_${exercise.id}_${equipment}"></div>`).join('')}
                </div>
                <div class="exercise_container">
                    <h6>${translate("position")}:</h6>
                    ${exercise.position.map(position => `<div><label for="exercise_${exercise.id}_${position}">${translate("position_"+position)}</label><input type="checkbox" id="exercise_${exercise.id}_${position}" name="exercise_${exercise.id}_${position}"></div>`).join('')}
                </div>
                <div class="exercise_container">
                    <h6>${translate("measurement")}:</h6>
                    ${exercise.measurement.map(measurement => `<div><label for="exercise_${exercise.id}_${measurement}">${translate("measurement_"+measurement)}</label><input type="checkbox" id="exercise_${exercise.id}_${measurement}" name="exercise_${exercise.id}_${measurement}"></div>`).join('')}
                </div>
            </li>
        `
    }
}

function getLanguage() {
    let lang = localStorage.getItem("language") || navigator.language || navigator.userLanguage || 'en'
    
    lang = lang.toLowerCase()

    if(lang.startsWith("en")) lang = "en"
    else if(lang.startsWith("es")) lang = "es"
    else if(lang.startsWith("fr")) lang = "fr"
    else if(lang.startsWith("de")) lang = "de"
    else if(lang.startsWith("it")) lang = "it"
    else if(lang.startsWith("pt")) lang = "pt"
    else if(lang.startsWith("ru")) lang = "ru"
    else lang = "en"
    
    return lang
}

function setLanguage(language=getLanguage()){

    if(localStorage.getItem('language') === language && localStorage.getItem('version') === version){
        const elementsTranslation = document.querySelectorAll("[translation]")

        translate(elementsTranslation)

        if(!languageLoaded){
            languageLoaded = true
            checkLoad()
        }
    }else{
        localStorage.setItem('language', language)
        localStorage.setItem('version', version)
        document.querySelector("html").lang = language

        fetch(`./lang/${language}.json`)
        .then(response => response.json())
        .then(data => {

            console.log("Language loaded:", language, data)
            localStorage.setItem('languageData', JSON.stringify(data))
            localStorage.setItem('version', version)

            const elementsTranslation = document.querySelectorAll("[translation]")

            translate(elementsTranslation)

            if(!languageLoaded){
                languageLoaded = true
                checkLoad()
            }
        })
    }
}

function translate(toTranslate){

    if(!localStorage.getItem('language')){
        setLanguage(getLanguage())
        return
    }

    const dataTranslation = JSON.parse(localStorage.getItem("languageData"))

    if(typeof toTranslate === "object"){
        for(let indexElementTranslation = 0 ; indexElementTranslation < toTranslate.length ; indexElementTranslation++){
            const elementTranslation = toTranslate[indexElementTranslation]

            const translations = elementTranslation.getAttribute("translation").split(",")

            for(let indexTranslation = 0 ; indexTranslation < translations.length ; indexTranslation++){
                const translation = translations[indexTranslation].trim()
                const [method, key, extra] = translation.split("|")

                switch(method){
                    case "text":
                        elementTranslation.textContent = dataTranslation[key] ?? key
                    break
                    case "html":
                        elementTranslation.innerHTML = dataTranslation[key] ?? key
                    break
                    case "placeholder":
                        elementTranslation.placeholder = dataTranslation[key] ?? key
                    break
                    case "title":
                        elementTranslation.title = dataTranslation[key] ?? key
                    break
                    case "value":
                        elementTranslation.value = dataTranslation[key] ?? key
                    break
                    case "attribute":
                        if(extra) elementTranslation.setAttribute(extra, dataTranslation[key] ?? key)
                        else console.warn(`No attribute specified for translation key "${key}"`)
                    break
                    default:
                        console.warn(`Translation method "${method}" not recognized`)
                    break
                }
            }
        }
    }else if(toTranslate){
        return dataTranslation[toTranslate] ?? toTranslate
    }
}

function checkLoad(){
    console.log({languageLoaded},{exercisesLoaded})
    if(languageLoaded && exercisesLoaded){
        elementLoader.style.display = "none"
    }
}

function showContainer(container){
    const containers = document.querySelectorAll(".container:not(.hide)")

    for(let indexContainers = 0 ; indexContainers < containers.length ; indexContainers++){
        containers[indexContainers].classList.add("hide")
    }

    container.classList.remove("hide")
}

function setEvents(){

    buttonSpanish.addEventListener("click", (event)=>{
        event.preventDefault()
        setLanguage('es')
    })

    buttonEnglish.addEventListener("click", (event)=>{
        event.preventDefault()
        setLanguage('en')
    })

    buttonNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        showContainer(containerNewMesocycle)
    })

    buttonCancelNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        showContainer(containerYourMesocycles)
    })

    buttonNextNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        //CALCULAR EJERCICIOS SI NO ESTÁN YA!
        showContainer(containerNewMesocyclePage2)
    })

    buttonBackNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        showContainer(containerNewMesocycle)
    })

    buttonAcceptNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        alert(translate("error_not_implemented_yet"))
    })
}