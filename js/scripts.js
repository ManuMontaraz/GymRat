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
    containerExerciseList.innerHTML = `
        <li id="exercise_list_search">
            <input id="search_exercise_title" type="text" translation="placeholder|search">
            <select id="search_exercise_muscles">
                <option value="" translation="text|muscles"></option>
            </select>
            <select id="search_exercise_categories">
                <option value="" translation="text|categories"></option>
            </select>
            <select id="search_exercise_equipments">
                <option value="" translation="text|equipments"></option>
            </select>
            <select id="search_exercise_positions">
                <option value="" translation="text|positions"></option>
            </select>
            <select id="search_exercise_measurements">
                <option value="" translation="text|measurements"></option>
            </select>
        </li>
    `
    
    const selectMuscles = document.querySelector("#search_exercise_muscles")
    const selectCategories = document.querySelector("#search_exercise_categories")
    const selectEquipments = document.querySelector("#search_exercise_equipments")
    const selectPositions = document.querySelector("#search_exercise_positions")
    const selectMeasurements = document.querySelector("#search_exercise_measurements")

    for(let indexMuscles = 0 ; indexMuscles < muscles.length ; indexMuscles++){
        const muscle = muscles[indexMuscles]
        selectMuscles.insertAdjacentHTML("beforeend",`<option value="${muscle}" translation="text|muscle_${muscle}"></option>`)
    }

    for(let indexCategories = 0 ; indexCategories < categories.length ; indexCategories++){
        const category = categories[indexCategories]
        selectCategories.insertAdjacentHTML("beforeend",`<option value="${category}" translation="text|category_${category}"></option>`)
    }

    for(let indexEquipments = 0 ; indexEquipments < equipments.length ; indexEquipments++){
        const equipment = equipments[indexEquipments]
        selectEquipments.insertAdjacentHTML("beforeend",`<option value="${equipment}" translation="text|equipment_${equipment}"></option>`)
    }

    for(let indexPositions = 0 ; indexPositions < positions.length ; indexPositions++){
        const position = positions[indexPositions]
        selectPositions.insertAdjacentHTML("beforeend",`<option value="${position}" translation="text|position_${position}"></option>`)
    }

    for(let indexMeasurements = 0 ; indexMeasurements < measurements.length ; indexMeasurements++){
        const measurement = measurements[indexMeasurements]
        selectMeasurements.insertAdjacentHTML("beforeend",`<option value="${measurement}" translation="text|measurement_${measurement}"></option>`)
    }

    for(let indexExercise = 0 ; indexExercise < exercises.length ; indexExercise++){
        const exercise = exercises[indexExercise]

        console.log(exercise)

        containerNewMesocyclePage2.querySelector("#exercise_list").innerHTML += `
            <li id="exercise_list_${exercise.id}" class="exercise searchable">
                <h2 search="title" translation="text|${exercise.title}"></h2>
                <div class="exercise_container">
                    <h6 translation="text|for"></h6>
                    <p search="title" translation="text|category_${exercise.category}"></p>
                    <p translation="text|muscle_${exercise.muscle}"></p>
                </div>
                <div class="exercise_container">
                    <h6 translation="text|equipment">${translate("equipment")}:</h6>
                    ${exercise.equipment
                        .map(equipment => `
                            <div>
                                <label for="exercise_${exercise.id}_${equipment}" translation="text|equipment_${equipment}"></label>
                                <input type="checkbox" id="exercise_${exercise.id}_${equipment}" name="exercise_${exercise.id}_${equipment}">
                            </div>`)
                        .join('')
                    }
                </div>
                <div class="exercise_container">
                    <h6 translation="text|position"></h6>
                    ${exercise.position
                        .map(position => `
                            <div>
                                <label for="exercise_${exercise.id}_${position}" translation="text|position_${position}"></label>
                                <input type="checkbox" id="exercise_${exercise.id}_${position}" name="exercise_${exercise.id}_${position}">
                            </div>`)
                        .join('')
                    }
                </div>
                <div class="exercise_container">
                    <h6 translation="text|measurement">${translate("measurement")}:</h6>
                    ${exercise.measurement
                        .map(measurement => `
                            <div>
                                <label for="exercise_${exercise.id}_${measurement}" translation="text|measurement_${measurement}"></label>
                                <input type="checkbox" id="exercise_${exercise.id}_${measurement}" name="exercise_${exercise.id}_${measurement}">
                            </div>`)
                        .join('')
                    }
                </div>
            </li>
        `
    }

    setExercisesEvents()
}

function setExercisesEvents(){
    const searchExercise = document.querySelector("#search_exercise_title")
    const selectMuscles = document.querySelector("#search_exercise_muscles")
    const selectCategories = document.querySelector("#search_exercise_categories")
    const selectEquipments = document.querySelector("#search_exercise_equipments")
    const selectPositions = document.querySelector("#search_exercise_positions")
    const selectMeasurements = document.querySelector("#search_exercise_measurements")

    const elementExerciseList = document.querySelector("#exercise_list")
    const elementsExercises = elementExerciseList.querySelectorAll(".exercise")

    const getValue = () => {
        return [
            searchExercise.value,
            (selectMuscles.value?selectMuscles.querySelector(`option[value=${selectMuscles.value}]`).textContent:undefined),
            (selectCategories.value?selectCategories.querySelector(`option[value=${selectCategories.value}]`).textContent:undefined),
            (selectEquipments.value?selectEquipments.querySelector(`option[value=${selectEquipments.value}]`).textContent:undefined),
            (selectPositions.value?selectPositions.querySelector(`option[value=${selectPositions.value}]`).textContent:undefined),
            (selectMeasurements.value?selectMeasurements.querySelector(`option[value=${selectMeasurements.value}]`).textContent:undefined)
        ]
    }

    const search = (element, searchValues) => {
        if (!element.classList.contains("searchable")) {
            console.warn(translate("error_element_not_searchable"))
            return
        }
        
        const text = element.textContent.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const terms = Array.isArray(searchValues) ? searchValues : [searchValues]
        const cleanTerms = terms.filter(Boolean).map(term => term.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        const matches = cleanTerms.every(term => text.includes(term))

        element.classList.toggle("hide", !matches)
    }

    searchExercise.addEventListener("input",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
    })

    selectMuscles.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    selectCategories.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    selectEquipments.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    selectPositions.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    selectMeasurements.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })
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
        //RETURN SI *REQUIRED* ESTÁ VACÍO
        //ACTUALIZAR ESTRUCTURA EN containerNewMesocyclePage2 (Weider y Fullbody = Oculto | Torso - Pierna = (Tirón y Empuje = Torso) | Tirón - Empuje - Pierna = Predeterminado)
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