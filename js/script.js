// global variables and elements
let userInput;
let currentRegion = "johto";
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

updateRegion();
// form submission
$('form').on('submit', handleGetData);

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
}

// nested function to get an entity's English name
function getName(data){
//   for(const e of data){
    for(const f of data.names){
      if(f.language.name == 'en')
      {
        return f.name;
      }
    }
    
//   } 
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

    // console.log(regions[e.region.name]);
  } 
//   render();
}

// function to clear the listed regions
function clearLocationList(objList){
    for (const e in objList) {
        objList[e] = [];
    }
}

function updateRegion(){
    $('#current').append(currentRegion);
}

// function to display retrieved data
function render() {
    // for(const e in regions){
    //     console.log(regions[e]);
    // }
    console.log(regions.johto);
    console.log(regions);
    console.log(regions.johto[0]);
    $('#region-results').empty();
    for(const location of regions["johto"]){
        let listLoc = ("<li>" + location + "</li>");
        $('#region-results').append(listLoc);
    }
}





/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropDownRegion() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  } 