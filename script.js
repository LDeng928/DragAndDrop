const draggable_list = document.getElementById('draggable-list');
const check = document.getElementById('check');


// Store listItems
const listItems = [];

let dragStartIndex;

// Swap items that are drag and drop
function swapItems(fromIndex, endIndex) {
    const itemOne = listItems[fromIndex].querySelector('.draggable');
    const itemTwo = listItems[endIndex].querySelector('.draggable');

    listItems[fromIndex].appendChild(itemTwo);
    listItems[endIndex].appendChild(itemOne)
}

// Store json file
let myRequest = new Request('./names.json');

// Fetch data from local JSON file and manipulate data
fetch(myRequest).then(res => res.json()).then(data => {
    //console.log(data.names);   
    // New array of richest people and spread in the data.names into the empty
    richestPeople = [...data.names];  
    //console.log(richestPeople);

    // Insert list items into DOM
    // Transform the ordered array by chaining the array methods
    // 1. map to a new array -> passing in 2 object values, value and sort
    // 2. use sort -> based on the sort value from step 1
    // 3. map the sorted array to a new array
    // 4. use forEach to loop through the new sorted array
    richestPeople.map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort ).map(a => a.value).forEach((person, idx) => {  
        // Create the li element      
        const listItem = document.createElement('li');        

        listItem.setAttribute('data-index', idx) // Set the custom attribute data=index to idx from the array

        listItem.innerHTML = `<span class='number'>${idx + 1}</span>
        <div class='draggable' draggable='true'>
            <p class='person-name'>${person}</p>
            <i class='fas fa-grip-lines'></i>
        </div>
        `;

        // Push each html listItem into the listItems empty array
        listItems.push(listItem);

        // Append listItem into the UI
        draggable_list.appendChild(listItem);
    });

    // Get the new elements from the DOM
    const draggables = document.querySelectorAll('.draggable');
    const dragListItems = document.querySelectorAll('.draggable-list li');
    
    function dragStart() {
        // console.log('Event: ', 'dragstart')
        dragStartIndex = +this.closest('li').getAttribute('data-index'); // the + makes it to a number
    }

    function dragEnter() {
        // console.log('Event: ', 'dragenter')
        this.classList.add('over')
    }

    function dragLeave() {
        // console.log('Event: ', 'dragleave')
        this.classList.remove('over')
    }

    function dragOver(e) {
        // console.log('Event: ', 'dragover')
        e.preventDefault();
    }

    function dragDrop() {
        // console.log('Event: ', 'drop')
        const dragEndIndex = +this.getAttribute('data-index');
        this.classList.remove('over');

        swapItems(dragStartIndex, dragEndIndex);                    
    }

    // Check order function
    function checkOrder() {
        listItems.forEach((item, idx) => {
            const personName = item.querySelector('.draggable').innerText.trim();

            if(personName !== richestPeople[idx]) {
                item.classList.add('wrong');
            } else {
                item.classList.remove('wrong');
                item.classList.add('right');
            }
        })
    }
    
    // Add event listeners
    draggables.forEach(draggable => draggable.addEventListener('dragstart', dragStart));

    dragListItems.forEach(item => {
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    })

    check.addEventListener('click', checkOrder);
});
