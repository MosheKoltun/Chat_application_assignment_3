function ChatTree(element) {
    //flags 
    let loadWasFiredFlag = false;

    //global variables
    let allListItems =  null;
    let cursorIndex = 0;
    let currentNode = null;

    let globalItems = null;

    //=========================================================
    // load
    //=========================================================
    function load(items) {
        //set global variable according to 'load' function argument
        globalItems = items;
        //don't allow to reload before clearing
        if (loadWasFiredFlag) {
            console.log("please click 'Clear' button before reloading!");
            return;
        }
        printFirstLevelChildren(items);
        addEventListeners();
        //variables initialization
        allListItems =  element.childNodes;
        cursorIndex = 0;
        currentNode = allListItems[cursorIndex];
        currentNode.style.backgroundColor = "aqua";
        //set flag
        loadWasFiredFlag = true;
    }
    //=========================================================
    // clear
    //=========================================================
    function clear() {
        //remove event listeners
        removeEventListeners();
        //remove all Li elements
        let allListItems =  element.childNodes;
        for (let i=0; i<allListItems.length; i++) {
            let currentListItem = allListItems[i];
            element.removeChild(currentListItem);
            //decrement index because 'allListItems' became shorter after removal
            i--;
        }
        loadWasFiredFlag = false;
    }
    //=========================================================
    // printFirstLevelChildren
    //=========================================================
    function printFirstLevelChildren(items) {
        items.forEach((currentArrayMember) => {
            const indentation = 0;
            addListItem(indentation, currentArrayMember, null);
        });
    }
    //=========================================================
    // printImmediateChildrenOfGroup
    //=========================================================
    function printImmediateChildrenOfGroup(parentName, items, previousListItem) {
        //increment indentation
        let indentation = 25 + parseInt(previousListItem.style.textIndent);
        //get immediate children of
        let immediateChildrenArray = getImmediateChildrenOfGroupFromTree(parentName, items);
        //if doesn't have children then exit
        if (immediateChildrenArray.length === 0) {
            return false;
        }
        //if has children then create new List Items
        for (let i=0; i<immediateChildrenArray.length; i++) {
            previousListItem = addListItem(indentation, immediateChildrenArray[i], previousListItem);
        }
        return true;
    }
    //=========================================================
    // unPrintAllChildrenOfGroup
    //=========================================================
    function unPrintAllChildrenOfGroup(parentName, items, allListItems) {
        let childrenArray = getAllChildrenOfGroupFromTree(parentName, items);

        if (childrenArray.length !== 0) {
            //create dictionary
            let dictionaryOfItemsToRemove = {};
            for (let i=0; i<childrenArray.length; i++) {
                let currentArrayMember = childrenArray[i];
                let currentArrayMemberName = currentArrayMember["name"];
                dictionaryOfItemsToRemove[currentArrayMemberName] = true;
            }
            //remove li from ul if name appears in dictionary
            for (let j=0; j<allListItems.length; j++) {
                let currentListItem = allListItems[j];
                let name = currentListItem.innerText;
                if (dictionaryOfItemsToRemove[name]) {
                    element.removeChild(currentListItem);
                    //decrement index because 'allListItems' became shorter after removal
                    j--;
                }
            }
        }
    }
    //=========================================================
    // addListItem
    //=========================================================
    function addListItem(indentation, currentArrayMember, previousListItem) {
        let name = currentArrayMember["name"];
        //create list item
        let newListItem = document.createElement("LI");

        //create span
        let span = document.createElement("SPAN");

        //add span to li
        newListItem.appendChild(span);

        //add image to span
        let image = document.createElement("img");
        if (currentArrayMember["type"] === "group") {
            image.src = "img/group.png";
        } else {
            image.style.marginLeft = "5px";
            image.style.marginRight = "5px";
            image.src = "img/user.png";
        }
        image.height = 16;
        span.appendChild(image);

        //add text to li
        let listItemText = document.createTextNode(name);
        newListItem.appendChild(listItemText);

        //add indentation to li
        newListItem.style.textIndent = indentation + "px";

        //disable user text selection
        newListItem.style.userSelect = "none";
        newListItem.style.cursor = "default";

        //add li to ul
        if (previousListItem === null) {
            element.appendChild(newListItem);
        } else {
            previousListItem.parentNode.insertBefore(newListItem, previousListItem.nextSibling);
        }

        return newListItem;
    }
    //=========================================================
    // getImmediateChildrenOfGroupFromTree
    //=========================================================
    function getImmediateChildrenOfGroupFromTree(parentName, items) {
        for (let i=0; i<items.length; i++) {
            let currentArrayMember = items[i];
            // if parent group name was found
            if (currentArrayMember["name"] === parentName) {
                //if leaf
                if (!currentArrayMember["items"]) {
                    return [];
                }
                //if not leaf then return array of 1st level children
                return currentArrayMember["items"];
            }
            //if parent group name was not found then call recursion
            else if (!!currentArrayMember["items"]) {
                items = getImmediateChildrenOfGroupFromTree(parentName, currentArrayMember["items"]);
                if (items !== []) {
                    return items;
                }
            }
        }
        return [];
    }
    //=========================================================
    // getAllChildrenOfGroupFromTree
    //=========================================================
    function getAllChildrenOfGroupFromTree(parentName, items) {
        let immediateChildrenArray = getImmediateChildrenOfGroupFromTree(parentName, items);
        let allChildrenArray = [];
        getAllChildrenOfGroupFromTreeRecursion(immediateChildrenArray);
        return allChildrenArray;

        //---------------------------------------------------------
        function getAllChildrenOfGroupFromTreeRecursion(items) {
            for (let i = 0; i < items.length; i++) {
                let currentArrayMember = items[i];
                if (!currentArrayMember["items"]) {
                    allChildrenArray.push(currentArrayMember);
                    return;
                } else if (!!currentArrayMember["items"]) {
                    allChildrenArray.push(currentArrayMember);
                    getAllChildrenOfGroupFromTreeRecursion(currentArrayMember["items"]);
                }
            }
        }
    }
    //=========================================================
    // addEventListeners
    //=========================================================
    function addEventListeners() {
        console.log("event listener added!");
        element.addEventListener("click", handleClickEvent);
        element.addEventListener("dblclick", handleDoubleClickEvent);
        element.addEventListener('keydown', handleKeyDownEvent);
    }
    //=========================================================
    // removeEventListeners
    //=========================================================
    function removeEventListeners() {
        console.log("event listener removed!");
        element.removeEventListener("click", handleClickEvent);
        element.removeEventListener("dblclick", handleDoubleClickEvent);
        element.removeEventListener('keydown', handleKeyDownEvent);
    }
    //=========================================================
    //event handlers
    //=========================================================
    //this function is responsible for li selection using the mouse
    function handleClickEvent(event) {
        if(event.target && event.target.nodeName === "LI") {
            //remove background of previous selection
            currentNode.style.backgroundColor = "white";
            //get index of clicked list item
            for (let j = 0; j < allListItems.length; j++) {
                if (allListItems[j] === event.target) {
                    cursorIndex=j;
                    break;
                }
            }
            //update current node according to index
            currentNode = allListItems[cursorIndex];
            currentNode.style.backgroundColor = "aqua";
        }
    }
    //---------------------------------------------------------
    //this function is responsible for expand/collapse using the mouse
    function handleDoubleClickEvent(event) {
        handleClickEvent(event);
        expandOrCollapse();
    }
    //---------------------------------------------------------
    function handleKeyDownEvent(event) {
        const keyName = event.key;
        switch(keyName) {
            case 'ArrowDown':
                goDown();
                break;
            case 'ArrowUp':
                goUp();
                break;
            case 'ArrowRight':
                expand();
                break;
            case 'ArrowLeft':
                collapse();
                break;
            case 'Enter':
                expandOrCollapse();
                break;
        }
    }
    //---------------------------------------------------------
    function goDown() {
        //check if selector reached the end of list
        if (cursorIndex === allListItems.length - 1) {
            return;
        }
        currentNode.style.backgroundColor = "white";
        cursorIndex++;
        currentNode = allListItems[cursorIndex];
        currentNode.style.backgroundColor = "aqua";
    }
    //---------------------------------------------------------
    function goUp() {
        //check if selector reached the beginning of list
        if (cursorIndex === 0) {
            return;
        }
        currentNode.style.backgroundColor = "white";
        cursorIndex--;
        currentNode = allListItems[cursorIndex];
        currentNode.style.backgroundColor = "aqua";
    }
    //---------------------------------------------------------
    function expand(){
        if (currentNode.dataset.dataToggle === "expanded") {
            return;
        }
        let parentName = currentNode.innerText;
        let res = printImmediateChildrenOfGroup(parentName, globalItems, currentNode);
        //set dataToggle attribute as "expanded" on li only in case it was really expanded
        if (res) {
            currentNode.dataset.dataToggle = "expanded";
        }
    }
    //---------------------------------------------------------
    function collapse() {
        if (currentNode.dataset.dataToggle === "collapsed") {
            goUp();
            return;
        }
        //prevents getting 'dataToggle' attribute on elements that were not expanded
        if (currentNode.dataset.dataToggle === "expanded") {
            let parentName = currentNode.innerText;
            unPrintAllChildrenOfGroup(parentName, globalItems, allListItems);
            currentNode.dataset.dataToggle = "collapsed";
        }
    }
    //---------------------------------------------------------
    function expandOrCollapse() {
        if (currentNode.dataset.dataToggle !== "expanded") {
            expand();
        } else {
            collapse();
        }
    }
    //=========================================================
    // return from 'ChatTree' function 
    //=========================================================
    return {
        load,
        clear,
        element,
    };
}


