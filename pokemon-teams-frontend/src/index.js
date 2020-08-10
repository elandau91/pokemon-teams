const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers/`
const POKEMONS_URL = `${BASE_URL}/pokemons/`
const MAIN = document.querySelector('main')


document.addEventListener("DOMContentLoaded", initiation())

function initiation() {
    renderTrainers();
};

function renderTrainers() {
    getTrainers().then(trainers => trainers.forEach(trainer => renderTrainer(trainer)))
}

function renderTrainer(trainer) {
    const trainerBlock = document.createElement("div");
    trainerBlock.classList.add("card");
    trainerBlock.dataset.trainerId = trainer.id
    const trainerName = trainer.name
    const pokemonArray = trainer.pokemons
    const pokemonUl = document.createElement("ul");

    trainerBlock.innerHTML = `
    <p>${trainerName}</p>
    <button data-trainer-id=${trainer.id}>Add Pokemon</button>
    `

    trainerBlock.append(pokemonUl);
    MAIN.append(trainerBlock);

    for (const pokemon of pokemonArray) {
        renderPokemon(pokemon);
    };
};


function renderPokemon(pokemon) {
    const trainerBlocks = document.querySelectorAll('div[data-trainer-id]');
    trainerBlocks.forEach(trainer => {
        if (parseInt(trainer.dataset.trainerId) === pokemon.trainer_id){
            const pokemonUl = trainer.querySelector("ul")
            const pokemonLi = document.createElement("li")
            pokemonLi.innerHTML = `
            ${pokemon.nickname} (${pokemon.species})
            <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
            `
            pokemonUl.append(pokemonLi)
        };
    });
};


function getTrainers(){
    return fetch(TRAINERS_URL)
    .then(res => res.json())
};


// fucntion //post Pokemon
function clickHandler() {
    document.addEventListener("click", function(event) {
        if (event.target.matches("button")){
            if (event.target.matches(".release")) {
                let button = event.target
                releasePokemon(button)
            } else {
                let button = event.target
                addPokemon(button)
            }
        }
    })
}

clickHandler();

function addPokemon(button) {
    const trainerId = button.dataset.trainerId
    
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            "trainer_id": trainerId
        })
    }

    fetch(POKEMONS_URL, options)
    .then(res => res.json())
    .then(renderPokemon)
};


function releasePokemon(button) {
    const pokemonId = button.dataset.pokemonId
    
    const options = {
        method: "DELETE",
    }

    fetch(POKEMONS_URL + pokemonId, options) 
    .then(resp => resp.json())
    .then(button.parentElement.remove())
};



