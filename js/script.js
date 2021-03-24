// global variables and elements
let userInput;
let currentRegion = "kanto";
const $input = $('input[type="text"]');

let regions = {
  kanto: [],
  johto:[],
  hoenn:[],
  sinnoh:[],
  unova:[],
  kalos:[],
  alola:[],
  galar:[]
}

// form submission
$('form').on('submit', handleGetData);

  // $.ajax({
  //     url: 'https://pokeapi.co/api/v2/region/'
  //   }).then(
  //     (data) => {
  //       console.log(data);
  //     },
  //     (error) => {
  //     console.log('bad request', error);
  //     }
  // );  

// retrieving data from API
function handleGetData(event) {
    event.preventDefault();
    // calling preventDefault() on a 'submit' event will prevent a page refresh  

    // getting the user input
    userInput = $input.val();
    // reset field

    $.ajax({
        url:'https://pokeapi.co/api/v2/pokemon/' + userInput
      }).then(
        (data) => {
          let pokeLink = 'https://pokeapi.co/api/v2/pokemon/' + data.id + '/encounters'
          // collect location encounter info
          clearLocationList(regions);
          getData(pokeLink, getPokemonLocations);
          $input.val('');
        },
        (error) => {
         console.log('bad request', error);
        }
    );    
}

// standardized data collection function that takes in an API url and a function with variant arguments
function getData(linkTo, dataFunction ){
  $.ajax({
      url: linkTo
    }).then(
      (data) => {
        dataFunction(data);
      },
      (error) => {
      console.log('bad request', error);
      }
  );  
}

// function sent to get the Pokemon's location areas
function getPokemonLocations(){
  for(const e of arguments){
    for(const f of e){
      getData(f.location_area.url, getLocations);
    }
  }
  render();
}

// nested function to get an entity's English name
function getName(){
  for(const e of arguments){
    for(const f of e.names){
      if(f.language.name == 'en')
      {
        return f.name;
      }
    }
  } 
}

// nested sent function to get the location that contains the area
function getLocations(){
  for(const e of arguments){
    getData(e.location.url, getLocationRegionPair);
  } 
}

// nested sent function to get the region/location pairing
function getLocationRegionPair(){
  for(const e of arguments){
    // add location to associated region
    regions[e.region.name].push(getName(e));
  } 
}

// function to clear the listed regions
function clearLocationList(objList){
    for (const e in objList) {
        objList[e] = [];
    }
}

// function to display retrieved data
function render() {
    console.log(regions);
}