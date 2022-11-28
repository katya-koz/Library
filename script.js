/*-----------------------------------

DON'T DELETE THIS

This is the initial data for your project. You MUST use this data. You can use these just like regular variables, don't overthink what this line of code is doing.

-----------------------------------*/
import { firstNames, lastNames, uids, titles, references } from './data.js'

//------------------------------------

//To create function using the module type, you need to create them like this:

// window.myFunc = function myFunc(){
    
// // }
const numberOfEntriesPerPage = 50; // entries per page on data table
let pageNumber = 0; // initial page number 
const importedArray = [firstNames,lastNames,titles,uids]; //3d array of imports
let arrayResults = []; // empty array of results (to be filled iwth search results, later... needs to b global)
let arrayToDisplay = importedArray; // relevent later, but this is the type of sorted array (eg sortedByFN, sortedByLn...) which is displayed on the data table page
let performanceCounter = 0; // declaring global performance counter variable

function del(arr) {
  // a lil function to delete first element of an array and return that element (replacing shift method)

  // O(n)
  const n = arr.length
  let element1 = arr[0];
  for(let i = 0; i < n; i++) { 
      let next = i + 1;
      arr[i] = arr[next];
  }
  arr.length--;
  arr; 
  return element1;
}
function slice(arr, start, end){
  // function replacing slice method.. slices arr from point start to point end
  // O(n)
  let outputArr = [];
  let x  = 0;
  if(end===undefined || end > arr.length)
  end = arr.length;
  
  for(let i = start; i < end; i++){
    outputArr[x] = arr[i];
    x++;
  }
  return outputArr;
}
function swap(arr,a, b) { 
  // swaps two elements in an array - used in fixMergeOrder function to rearrange the 3d array in order of fn,ln,uid,title
  // O(n)
  let temp = arr[a];   
  arr[a] = arr[b];
  arr[b] = temp;                          
  return arr;                             
}
window.merge = function merge(arrLeft, arrRight,arr1Left, arr1Right,arr2Left, arr2Right,arr3Left, arr3Right){
  // O(nlogn)
  // parallel merge function
    let sorted = [];
    let sorted1 = [];
    let sorted2 = [];
    let sorted3 = [];
    let i = 0;
    while (arrLeft.length !== 0 && arrRight.length !== 0) { 
      if (arrLeft[0] < arrRight[0]) { // order the segmetns of the arrays 
        sorted[i] = del(arrLeft);
        sorted1[i] = del(arr1Left);
        sorted2[i] = del(arr2Left);
        sorted3[i] = del(arr3Left);
      } else {
        sorted[i] = del(arrRight);
        sorted1[i] = del(arr1Right);
        sorted2[i] = del(arr2Right);
        sorted3[i] = del(arr3Right);
      }
      i++;
    }  
    return [[...sorted, ...arrLeft, ...arrRight],[...sorted1, ...arr1Left, ...arr1Right],[...sorted2, ...arr2Left, ...arr2Right],[...sorted3, ...arr3Left, ...arr3Right]]; // SPREAD IS NOT A METHOD!! I GOOGLED IT!!! (you told me IN PERSON that it was okay to use since by definition its not a method :)) 
}

window.mergeSort = function mergeSort(arr,arr1,arr2,arr3){ 
  // O(nlogn)
  // merge sort no methods function;; sort is based on first array in parameter 
  if (arr.length <= 1) {
    return [arr, arr1, arr2, arr3]; // return array if null
  }
  let mid = Math.floor(arr.length/2);  // mid value is mid between left and right 
  let left = mergeSort(slice(arr, 0, mid),slice(arr1, 0, mid), slice(arr2, 0, mid),slice(arr3, 0, mid)); // (applied to each paralllel array) left is a slice of the array from the start to the middle
  let right = mergeSort(slice(arr, mid, arr.length), slice(arr1, mid, arr.length),slice(arr2, mid, arr.length),slice(arr3, mid, arr.length)); // (applied to each parallel array) right is a slice of the array from the middle to the end

  return merge(left[0], right[0], left[1], right[1], left[2], right[2],left[3], right[3]);
}

window.binarySearch = function binarySearch(target, arr){
  // O(logn)
  // this function takes in an array and a target as its parameters...the array is dependent on the search method the user chooses (first name, last name....)
  let leftIndex = 0; // define the left and rightmost points of the array
  let rightIndex = arr.length - 1;

  while (leftIndex <= rightIndex) {
      let midIndex = Math.floor((leftIndex + rightIndex) / 2); // find mid of left and right index... this value is redeclared every loop

      if (arr[midIndex] === target) {
          return midIndex; // as soon as the target is found, the index (relative to the sorted array being used-- again dependent on the user's input) of the target is returned
      } else if (arr[midIndex] < target) {
          leftIndex = midIndex + 1; //search to the right of the array if current index is less than target
      } else {
          rightIndex = midIndex - 1; //search to the left of the array if current index is less than target
      }
  }
    return -1; //return -1 if target DNE
}

window.collectResultIndexes = function collectResultIndexes(arr, initialIndex, target){
 // O(n)
//initial index is the first result initially found in previous function. this function assumes that there could be another instance of the target on either side of the arr 
  let collectedResults = [initialIndex]; // initial index is automatically placed in the collected resutls array --- this array collects the indexes (relative to the search method array) in order to record them later
  let leftIndex = initialIndex - 1;  // count to the left of the initial index
  let rightIndex = initialIndex + 1; // count to the right of the initial index
  let i = 1; // i starts at 1 since there is already an element in the collectedResults array
  while(arr[leftIndex] === target || arr[rightIndex] === target){ // continue searching as long as there exists another target on either side of the initial index
    if (arr[leftIndex] === target){
      collectedResults[i] = leftIndex; // once another target is found, record its index in the collectedResults array 
      leftIndex-=1; // proceed the serach to the left
      i++; // add 1 to the counter (this counter keeps track of the next element to add in the collectedResults array)
    }
    if (arr[rightIndex] === target){ // ^^^
      collectedResults[i] = rightIndex;
      rightIndex +=1;
      i++;
    } 
  }
  return collectedResults;
}

window.fixMergeOrder = function fixMergeOrder(arr, targetArr){
  // O(1)
  // since mergesort is based on the first array in the parameter, the sorted array it spits out (if sorted based on anything other than first names) will be out of order, so this function rearranges the 3d array properly. eg: sortedByLastNames = [[sortedLN],[sortedFN],[sortedUid],[sortedT]].. swap sortedByLastNames[0], sortedByLastNames[1] --> [[sortedFN],[sortedLN],[sortedUid],[sortedT]]. 
    if(targetArr === "last-names"){
    swap(arr,0, 1);
  }else if(targetArr === "uids"){
    swap(arr, 0, 2);
  }else if(targetArr === "titles"){
    swap(arr,0, 3);
  }
  return arr;
  //my code is very dependent on the positions and orders of array, so this fucntion is very important as it insures the arrangement of (fn, ln, uid, title) is closely followed by every array.
}

//***********************************************************************************declaring constants - these are 3d arrays which are sorted by each search method. they are declared here since they require the previous fucntions to be declared in order to work. they all strictly follow my (fn,ln,uid,title)
const sortedByFirstNames = mergeSort(firstNames, lastNames, uids, titles);
const sortedByLastNames = fixMergeOrder(mergeSort(lastNames, firstNames, uids, titles), "last-names");
const sortedByUids = fixMergeOrder(mergeSort(uids, lastNames, firstNames, titles), "uids");
const sortedByTitles = fixMergeOrder(mergeSort(titles,lastNames, uids, firstNames),"titles");
//***********************************************************************************

window.recordResults = function recordResults(resultIndexes, arr){
  // O(n)
  // this function takes in the indexes of the search results and they array they were referenced from... eg... if sorted by titles, then the array used would be the sortedByTitles array
  arrayResults = [[],[],[],[]]; // make sure arrayResults is EMPTY at the start of call
  if(resultIndexes[0] === -1){
    arrayResults = [["Search not found :("],[""],[""],[""]]; // a little bit of a lazy way to show the user their search doesn't exist :p
  }else{
    for(let i = 0; i < resultIndexes.length; i++){ // for every index in resultIndexes array, find corresponding element and copy it into arrayResults (the results master array)
      arrayResults[0][i] =  arr[0][resultIndexes[i]]; // arr[0] = first names
      arrayResults[1][i] = arr[1][resultIndexes[i]]; // arr[1] = last names
      arrayResults[2][i] =  arr[2][resultIndexes[i]]; // arr[3] = uids
      arrayResults[3][i] = arr[3][resultIndexes[i]]; // arr[4] = titles
    }
    if(arr === sortedByFirstNames){ // there is a possibility that the results may have repeating first names, in this case, reorganize the results array to be organzied by last name
    arrayResults = fixMergeOrder(mergeSort(arrayResults[1], arrayResults[0], arrayResults[2], arrayResults[3]), "last-names");
    }else if(arr === sortedByLastNames){ // does the same thing as the previous if statement, only this time it aims to organize results by first names if the last name results have repeating entries
      arrayResults = mergeSort(arrayResults[0], arrayResults[1], arrayResults[2], arrayResults[3], "first-names");
    }
  }
}

window.loadSearchPage = function loadSearchPage() {
  //O(1)
  //function launched onload of index.html... loads up all the event listeners for the buttons on the index page 
  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", function(){searchButtonPressed()});
}

window.loadDataPage = function loadDataPage() { // runs 'onload' when dataTable.html is opened. this function loads all the starting elements in the dataTable.html and initializes all the buttons, adding event listeners to each
  //O(1)
    
  displaySortedData(arrayToDisplay, pageNumber);// display initial state of array, at initial page number (importedArray, page 0)
  
  const sortIndexButton = document.getElementById("sort-by-index");
  const sortFNButton =  document.getElementById("sort-by-first-names");
  const sortLNButton = document.getElementById("sort-by-last-names");
  const sortUButton = document.getElementById("sort-by-uids");
  const sortTButton = document.getElementById("sort-by-titles");
  const pageNumberNext = document.getElementById("page-number-next");
  const pageNumberBack = document.getElementById("page-number-back");
// event listeners for sorting/page navigation buttons-- each run the refreshPage function upon click
  sortIndexButton.addEventListener("click", function(){refreshPage(importedArray)});
  sortFNButton.addEventListener("click", function(){refreshPage(sortedByFirstNames)});
  sortLNButton.addEventListener("click", function(){refreshPage(sortedByLastNames)});
  sortUButton.addEventListener("click", function(){refreshPage(sortedByUids)});
  sortTButton.addEventListener("click", function(){refreshPage(sortedByTitles)});
  
  pageNumberNext.addEventListener("click", function() {refreshPage(arrayToDisplay, "next")});
  pageNumberBack.addEventListener("click", function() {refreshPage(arrayToDisplay, "previous")});
}

window.refreshPage = function refreshPage(arr, direction){
  //O(1)
  //this function takes in an array and direction as parameters. the direction parameter is only relevent to the page navigator buttons
  arrayToDisplay = arr; // on launch, the arrayToDisplay is the 'importedArray', which is just a 3d array of the original data you've imported for me at the start
  
  if (direction === "next" && pageNumber < 400){ // 20,000/50 = 400
    pageNumber +=1; // add page number if navigated to the right arrow
  }else if (direction === "previous" && pageNumber > 0){
    pageNumber -=1;
  }
  displaySortedData(arrayToDisplay); // at the end of the refresh page function, the displaySortedData function is called again, with the new array to display... either the sort of the array has changed or the page number (thus the start and end index of displayed array)
}

window.runSearch = function runSearch(searchMethod, searchTarget){
  //O(1)
  //console.log(arrayResults);
  let t1 = performance.now(); // call performance.now as search button is clicked
  //this function runs when the user presses the search button. it takes in the user's search method and the user's search target in as parameters 
  let organizeByType = 0; // initializing a variable (this variable will be filled with the search method)
  let x = 0; // initializing a variable to reference fn, ln, uid, title in 3d array
  
  // the search method dropbox returns a string, so this section turns that string into a variable... from then on, every instance "organizeByType" is used, it uses the sorted array relative to what search method the user had picked
  if(searchMethod === "first-names"){ 
    organizeByType = sortedByFirstNames;
    x = 0;
  }else if(searchMethod==="last-names"){
    organizeByType = sortedByLastNames;
    x = 1;
  }else if(searchMethod==="uids"){
    organizeByType = sortedByUids;
    x = 2;
  }else if(searchMethod==="titles"){
    organizeByType = sortedByTitles;
    x = 3;
  } 
  let initialIndex = binarySearch(searchTarget,organizeByType[x]);
  let collectedResults = collectResultIndexes(organizeByType[x],initialIndex, searchTarget);
  recordResults(collectedResults, organizeByType); // call function using returns of two previous functions.. these three functions used to all run in one line but i sepeated them into 3 for readability 
  let t2 = performance.now();
  performanceCounter = t2 - t1;

}

//***********************************************************************************
// this section handles the search results display
window.addSearchResults = function addSearchResults (index) {
  //O(1)
  // this function creates the search result elements 
  const searchResults = document.getElementById('results-element'); // parent
  const resultEntry = document.createElement("div");
  resultEntry.setAttribute("id","result-entry");
  const authorName = document.createElement('h4'); // children vvv 
  const uid = document.createElement('h4');
  const title = document.createElement('h4');
  const performance = document.getElementById("performance");
 
 
  authorName.innerText = arrayResults[0][index] + " " + arrayResults[1][index];
  uid.innerText = arrayResults[2][index];
  title.innerText = arrayResults[3][index];
  performance.innerText = (performanceCounter + " ms");
  
  searchResults.appendChild(resultEntry); // append child to parent
  resultEntry.appendChild(authorName);  
  resultEntry.appendChild(uid);
  resultEntry.appendChild(title);
}

window.displaySearchResults = function displaySearchResults(){
  //O(n)
  // this function runs every search done by the user, it displays the results whilst making sure the interface starts out blank for every search
  const searchResult = document.getElementById('results-element');
  while(searchResult.firstChild){ // refresh search results whilst a 'first child' exists
    searchResult.removeChild(searchResult.firstChild); // remove child 
  }
  for(let i = 0; i < arrayResults[0].length; i++){ // run for as many results are in the first array in the arrayResults 3d array (all arrays in the 3d array are the same length)
    addSearchResults(i); // call addSearchResults function to add each 'block' of results to the interface
  }
}

window.searchButtonPressed = function searchButtonPressed() {
  //O(1)
  // this fucntion runs when the search button is pressed (duh....)
  let userInput = document.getElementById('search-input').value; // value of the user input
  let searchMethod = document.getElementById('search-category').value; // value of the drop down menu
  runSearch(searchMethod, userInput); // runs the search using the parameters in the type box and the dropdown menu
  displaySearchResults(); // call display results fucntion to display resutls from runSearch function
}
//***********************************************************************************
// this section handles the dataTable data entry display
window.addSortedEntry = function addSortedEntry(arr, index) {
  //O(1)
  // this function creates the elements which display the data on the table 
  const dataEntries = document.getElementById('data-entries'); //parent
 
  const dataEntry = document.createElement("div");
  dataEntry.setAttribute("id","result-entry");
  const authorNameData = document.createElement('h4'); // children vvv
  const uidData = document.createElement('h4');
  const titleData = document.createElement('h4');

  authorNameData.innerText = arr[0][index] + " " + arr[1][index]; // fn + ln
  uidData.innerText = arr[2][index]; // uid
  titleData.innerText = arr[3][index]; // title

  dataEntries.appendChild(dataEntry);
  dataEntry.appendChild(authorNameData); //append child
  dataEntry.appendChild(uidData);
  dataEntry.appendChild(titleData);
}

window.displaySortedData = function displaySortedData(arr) {
  //O(n)
  // refreshes results every new pageturn
    const dataEntry = document.getElementById('data-entries');
    while (dataEntry.firstChild) { // cleans current array being displayed to make way for new array (new sort or new pageturn)
      dataEntry.removeChild(dataEntry.firstChild);
    }
    for (let i = pageNumber*numberOfEntriesPerPage; i < numberOfEntriesPerPage + pageNumber*numberOfEntriesPerPage; i++) { // start at page number*numberOfEntriesPerPage (eg page 2 = 2*50 = 100, start at index 100), final index is that number plus numberOfEntriesPerPage (this would be the last index displayed)
      addSortedEntry(arr, i); // add data entry 
    }
}
