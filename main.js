// MODULES

// Elements
const DOMElements = (function () {
    return{
        elements: function () {
            const button1 = document.querySelector('.button1');
            const button2 = document.querySelector('.button2');
            const button3 = document.querySelector('.button3');
            const button4 = document.querySelector('.button4');

            const meal = document.querySelector('#input-meal');
            const calories = document.querySelector('#input-calories');

            const list = document.querySelector('.list');

            const pencil = document.querySelector('.pencil');

            const totalCaloriesElement = document.getElementById('total-calories');

            const error = document.querySelector('.error');

            return {
                button1, 
                button2, 
                button3, 
                button4, 
                meal,
                calories, 
                list,
                pencil,
                totalCaloriesElement,
                error 
            };
        }
    }
})();


// Data
const dataController = (function () {
    const Item = function(mealValue, caloriesValue){
            this.mealValue = mealValue;
            this.caloriesValue = caloriesValue;
            const randomNumber = Math.floor(Math.random() * 20000) + 1;
            return{
                mealValue,
                caloriesValue,
                randomNumber
            }
    }

    let arraryOfItems = [];

    const pushItems = function(newItem) {
        dataController.getValues().arraryOfItems.push(newItem);
    }

    let currentItem = [];

    const pushCurrentItem = function(newItem){
        currentItem = newItem;
    }

        return{
            getValues: function () {
                return{
                    mealValue: DOMElements.elements().meal.value,
                    caloriesValue: DOMElements.elements().calories.value,
                    Item,
                    arraryOfItems,
                    pushItems,
                    currentItem,
                    pushCurrentItem
                }
            }
        }
})();

// UI
const uiController = (function () {
    // creating new item
    const newItem = function (){
        if(dataController.getValues().mealValue !== '' && dataController.getValues().caloriesValue !== ''){
            // creating new item when add meal is pressed
            const newItem = dataController.getValues().Item(dataController.getValues().mealValue, parseInt(dataController.getValues().caloriesValue));

            // displaying new item
            uiController.displayValues(newItem);

            // clear input values
            uiController.clearingFields();

            // pushing each unique item into arrayOfNumbers
            dataController.getValues().pushItems(newItem);

            // pushing each unique item into local storage
            localStorageController.pushTotalCalories(newItem.caloriesValue, newItem.randomNumber);

            // pushing each item into local storage
            localStorageController.pushAllItems(newItem);

            // setting current item
            dataController.getValues().pushCurrentItem(newItem.caloriesValue);
        }else{
            // display error
            uiController.displayError();
        }

    }

    const displayValues = function(item) {
        const list = DOMElements.elements().list;
        const blank = document.createElement('div');
  
        blank.innerHTML = `
            <div>
                <ul id=${item.randomNumber}>
                    <li><strong>${item.mealValue}</strong> <span class="calorie-text">${item.caloriesValue}</span> calories</li>
                    <li><i class="fas fa-pencil-alt pencil"></i></li>
                </ul>
            </div>
        `;
        list.appendChild(blank);
    }

    const displayTotalCalories = function(totalCalories){
        const totalCaloriesElement = DOMElements.elements().totalCaloriesElement;

        if(totalCalories.length >= 2){
            let sum = 0;
            totalCalories.forEach((x) => {
            sum += x.calories;
        });
        totalCaloriesElement.textContent = sum;
        }else{
            totalCaloriesElement.textContent = totalCalories.calories;
        }
    }

    const clearingFields = function() {
        DOMElements.elements().meal.value = '';
        DOMElements.elements().calories.value = '';
    }

    const updatingItem = function(e){
        if(e.target.classList.contains('pencil')){
            // display buttons
            uiController.displayButtons(e);

            // displaying current item
            uiController.displayCurrentItem(e);
        }

        if(e.target.classList.contains('button2')){
            // when update button is clicked
            uiController.updateCurrentItem();
        }

        if(e.target.classList.contains('button3')){
            // when delete button is clicked
            uiController.deleteCurrentItem();
        }

        if(e.target.classList.contains('button4')){
            // when back button is clicked
            uiController.back();
        }

        if(e.target.classList.contains('clear-all')){
            // when clear all button is clicked
            uiController.clearAll();
        }
    }

    const displayCurrentItem = function (e){
        // Checking to see if ul id equals pushRandomNumbers

        const arraryOfItems = JSON.parse(localStorage.getItem('items'));
        const targetID = e.target.parentNode.parentNode.id;

        arraryOfItems.forEach((x) => {
            if(targetID == x.randomNumber){
                // displaying data in inputs
                DOMElements.elements().meal.value = x.mealValue;
                DOMElements.elements().calories.value = x.caloriesValue;

                // setting current item
                dataController.getValues().pushCurrentItem(x);
            }
        });
    }
        
    const displayButtons = function (e) {
        // display buttons
        DOMElements.elements().button1.classList.toggle('none');
        DOMElements.elements().button2.classList.toggle('none');
        DOMElements.elements().button3.classList.toggle('none');
        DOMElements.elements().button4.classList.toggle('none');
    }

    const baseItems = function(){
        const newMeal = dataController.getValues().mealValue;
        const newCalories = dataController.getValues().caloriesValue;
        const currentItem = dataController.getValues().currentItem;

        // setting new calories
        currentItem.mealValue = newMeal;
        // setting new calories
        currentItem.caloriesValue = parseInt(newCalories);

        // showing pencil and hiding buttons
        uiController.displayButtons();
        
        // clearing input fields
        uiController.clearingFields();

        return currentItem;
    }

    const updateCurrentItem = function() {
        // calls baseitems, which avoids repeate code. Baseitems returns current item
        const currentItem = uiController.baseItems();        

        // Displaying updated item

        // looping through all ul's in page and matching their id to random number
        // then setting the ul's innerHTML equal to the updated current item
        document.querySelectorAll('ul').forEach((x) => {
            if(x.id == currentItem.randomNumber){
                x.innerHTML = `
                    <li><strong>${currentItem.mealValue}</strong> <span class="calorie-text">${currentItem.caloriesValue}</span> calories</li>
                    <li><i class="fas fa-pencil-alt pencil"></i></li>
            `;
            }

        });

        // passing in calories and random number into local storage
        localStorageController.removeTotalCalories(currentItem.caloriesValue, currentItem.randomNumber);

        // setting new item to local storage
        localStorageController.updatingItems(currentItem);
    }

    const deleteCurrentItem = function(){
        const currentItem = uiController.baseItems();
        // Deleting updated item

        // looping through all ul's in page and matching their id to random number
        // then deleting the current ul
        document.querySelectorAll('ul').forEach((x) => {
            if(x.id == currentItem.randomNumber){
                // removing current item
                x.remove();
                console.log(x);
                // passing in the random number of the deleted item
                localStorageController.deleteTotalCalories(currentItem.randomNumber);

                // passing in the random number of the deleted item
                localStorageController.deleteCurrentItems(currentItem.randomNumber);
            }
        });

    }

    const back = function(){
        uiController.displayButtons();
        uiController.clearingFields();
    }

    const clearAll = function(){
        // looping through all ul's in page and deleting them all
        document.querySelectorAll('ul').forEach((x) => {
            x.remove();
        });

        uiController.clearingFields();

        // deleting all calories in local storage
        localStorageController.deleteAllCalories();

        // delete all items in local storage
        localStorageController.deleteAllItems();

        DOMElements.elements().totalCaloriesElement.textContent = 0;    
    }

    const displayError = function(){
        setTimeout(() => {
            DOMElements.elements().error.classList.toggle('none');
        }, 0);

        setTimeout(() => {
            DOMElements.elements().error.classList.toggle('none');
        }, 5000);
    }

    return{
        newItem,
        displayValues,
        displayTotalCalories,
        clearingFields,
        displayButtons,
        baseItems, 
        updatingItem,
        displayCurrentItem,
        updateCurrentItem, 
        deleteCurrentItem,
        back, 
        clearAll, 
        displayError
    }
})();


// Local storage
const localStorageController = function(){
    // START ITEMS

    let allItems = [];

    const pushAllItems = function(item){
        // if local storage equal null push item into allItems
        if(localStorage.getItem('items') == null){
            localStorageController.allItems.push(item);
        }else{
            // if there is something in local storage get it, set it to all items, then push item into allItems
            const localStorageItems = JSON.parse(localStorage.getItem('items'));
            localStorageController.allItems = localStorageItems;
            localStorageController.allItems.push(item);
        }
        // setting item into local storage
        setLocalStorageItems(localStorageController.allItems);
    }

    const updatingItems = function(currentItem){
        const allItems = JSON.parse(localStorage.getItem('items'));

        if(allItems.length >= 2){
            allItems.forEach((x) => {
                if(x.randomNumber == currentItem.randomNumber){
                    allItems.splice(allItems.indexOf(x), 1);
                    allItems.push(currentItem);
                }
            });
        }else{
            allItems.splice(0, 1);
            allItems.push(currentItem);
        }

        // setting new array to all items
        setLocalStorageItems(allItems);
    }

    const deleteCurrentItems = function(randomNumber){
        const totalCurrentItem = JSON.parse(localStorage.getItem('items'));

        const filteredItems = totalCurrentItem.filter((x) => {
            if(x.randomNumber != randomNumber){
                return true;
            }
        });

        // set item to local storage
        setLocalStorageItems(filteredItems);
    }

    const deleteAllItems = function(){
        const totalCurrentItems = JSON.parse(localStorage.getItem('items'));

        if(totalCurrentItems === null){
            uiController.displayError();
        }else{
            totalCurrentItems.length = 0;
        }

        setLocalStorageItems(totalCurrentItems);
    }

    const setLocalStorageItems = function(allItems){
        localStorage.setItem('items', JSON.stringify(allItems));
    }

    const displayItems = function (item){
        // item will always be array
        if(item === null){

        }else if(item.length === 1){
            uiController.displayValues(item[0]);
        }else{
            item.forEach(x => {
                uiController.displayValues(x);
            });
        }
    }

    // START CALORIES

    let totalCalories = [];

    const pushTotalCalories = function(calories, randomNumber){
        let totalCurrentCalories = JSON.parse(localStorage.getItem('totalCalories'));

        // if local storage is empty create an empty array and push calories and random number through. Else push calories and random number onto existing local storage
        if(totalCurrentCalories === null || totalCalories.length === 1){
            totalCurrentCalories = [];
            totalCurrentCalories.push({calories, randomNumber});
        }else{
            totalCurrentCalories.push({calories, randomNumber});
        }
        
        // set item to local storage
        setTotalCalories(totalCurrentCalories);

        // showing updated calories
        displayTotalCalories(totalCurrentCalories);
    }

    const removeTotalCalories = function(calories, randomNumber){
        const totalCurrentCalories = JSON.parse(localStorage.getItem('totalCalories'));

        // loops through calories array and removes the item which matches the random number that is being passed in. It returns the other values just fine.
        const filteredCalories = totalCurrentCalories.filter((x) => {
            if(x.randomNumber != randomNumber){
                return true;
            }
        });
        // pushing the new calories and random number into the filtered array
        filteredCalories.push({calories, randomNumber});

        filteredCalories.forEach((item) => {
            localStorageController.totalCalories.push(item);
        });
        // set item to local storage
        setTotalCalories(filteredCalories);

        // showing updated calories
        displayTotalCalories(filteredCalories);     
    }

    const deleteTotalCalories = function(randomNumber){
        const totalCurrentCalories = JSON.parse(localStorage.getItem('totalCalories'));

        const filteredCalories = totalCurrentCalories.filter((x) => {
            if(x.randomNumber != randomNumber){
                return true;
            }
        });

        // set item to local storage
        setTotalCalories(filteredCalories);

        // showing updated calories
        displayTotalCalories(filteredCalories);
    }

    const deleteAllCalories = function(){
        const totalCurrentCalories = JSON.parse(localStorage.getItem('totalCalories'));

        if(totalCurrentCalories === null){
            uiController.displayError();
        }else{
            totalCurrentCalories.length = 0;
        }

        setTotalCalories(totalCurrentCalories);
    }

    const setTotalCalories = function(item){
        localStorage.setItem('totalCalories', JSON.stringify(item));
    }

    const displayTotalCalories = function(item){
        // item will always be array

        if(item === null || item.length === 0){
            DOMElements.elements().totalCaloriesElement.textContent = 0;
        }else if(item.length === 1){
            uiController.displayTotalCalories(item[0]);
        }else{
            uiController.displayTotalCalories(item);
        }
    }

    const domLoaded = function(){
        displayItems(JSON.parse(localStorage.getItem('items')));

        // displaying total calories with whatever is in local storage when the DOM loads
        displayTotalCalories(JSON.parse(localStorage.getItem('totalCalories')));
    }

    return{
        allItems,
        pushAllItems,
        updatingItems,
        setLocalStorageItems, 
        deleteAllCalories,
        totalCalories,
        pushTotalCalories,
        removeTotalCalories,
        setTotalCalories,
        displayTotalCalories,
        domLoaded,
        displayItems, 
        deleteAllItems,
        deleteTotalCalories, 
        deleteCurrentItems
    }
}();



// App
const appController = (function (uiController, dataController) {
    // Event Listeners
        const loadEventsListeners = function (){
            // add meal clicked
            DOMElements.elements().button1.addEventListener('click', uiController.newItem);

            // pencil clicked
            document.body.addEventListener('click', (e) => {
                uiController.updatingItem(e);
            });

            document.addEventListener('DOMContentLoaded', localStorageController.domLoaded);
    }
    return{
        init: function(){
            return loadEventsListeners()
        }
    }
})(uiController, dataController);

// initializing appController
appController.init();