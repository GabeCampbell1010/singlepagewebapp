
var currentList = {};

function createShoppingList() {
    
    currentList.name = $("#shoppingListName").val();
    currentList.items = new Array();

    //web service call
    $.ajax({//this is getting the shopping list from the internet or something
        type: "POST",
        dataType: "json",
        url: "api/ShoppingListsEF/",
        data: currentList,
        success: function (result) {
            currentList = result;
            showShoppingList();
            history.pushState({ id: result.id }, result.name, "?id=" + result.id);
        }
    });  
}

function showShoppingList() {
    $("#shoppingListTitle").html(currentList.name);
    $("#shoppingListItems").empty();

    $("#createListDiv").hide();
    $("#shoppingListDiv").show();

    $("#newItemName").val("");
    $("#newItemName").focus();//focus cursor in new item box
    $("#newItemName").unbind("keyup");
    $("#newItemName").keyup(function (event) {
        if (event.keyCode === 13) {//on enter make the new item so dont have to click button
            addItem();
        }
    });


}

function addItem() {
    var newItem = {};
    newItem.name = $("#newItemName").val();//take the name from the input box with id newItemName, # is how you call by id
    newItem.shoppingListId = currentList.id;

    $.ajax({//this is getting the shopping list from the internet or something
        type: "POST",
        dataType: "json",
        url: "api/ItemsEF/",//cuz item controller
        data: newItem,
        success: function (result) {
            currentList = result;
            drawItems();//call draw items function
            $("#newItemName").val("");//trying to clear the input box after adding an item
        }
    });    
}

function drawItems() {
    var $list = $("#shoppingListItems").empty();

    for (var i = 0; i < currentList.items.length; i++) {
        var currentItem = currentList.items[i];
        var $li = $("<li>").html(currentItem.name).attr("id", "item_" + i);//create li tags with the item name between them and id="item_i" where i is the number
        var $deleteBtn =
            $("<button onclick='deleteItem(" + currentItem.id + ")'>D</button>").appendTo($li);//add two button tags between the li tags
        var $checkBtn =
            $("<button onclick='checkItem(" + currentItem.id + ")'>C</button>").appendTo($li);

        if (currentItem.checked) {
            $li.addClass("checked");
        }

        $li.appendTo($list);//add this newly created li tags and its internal parts to the list, which is the shoppinglistitems list

    }
}

function deleteItem(itemId) {
    $.ajax({//this is getting the shopping list from the internet or something
        type: "DELETE",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,//cuz item controller
        success: function (result) {
            currentList = result;
            drawItems();//call draw items function
        }
    });
}


function checkItem(itemId) {//check and uncheck items on the list when clicking C button
    var changedItem = {};

    for (var i = 0; i < currentList.items.length; i++) {
        if (currentList.items[i].id === itemId) {//why does it want === and not ==
            changedItem = currentList.items[i];
        }
    }

    changedItem.checked = !changedItem.checked;

    $.ajax({//this is getting the shopping list from the internet or something
        type: "PUT",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,//cuz item controller
        data: changedItem,
        success: function (result) {
            changedItem = result;
            drawItems();//call draw items function
            
        }
    });
}

function getShoppingListById(id) {

    $.ajax({//this is getting the shopping list from the internet or something
        type: "GET",
        dataType: "json",
        url: "api/ShoppingListsEF/" + id,
        success: function (result) {
            currentList = result;
            showShoppingList();
            drawItems();
        }//,
        //error: function () {
        //    console.error("error");//this just shows in the console, check jquery documentation for how to throw error cases better
        //}
    });

}

function hideShoppingList()
{
    $("#createListDiv").show();
    $("#shoppingListDiv").hide();

    $("#shoppingListName").val("");
    $("#shoppingListName").focus();
    $("#shoppingListName").unbind("keyup");
    $("#shoppingListName").keyup(function (event) {
        if (event.keyCode === 13) {
            createShoppingList();
        }
    });
}

$(document).ready(function () {
    console.info("ready now");

    hideShoppingList();

    var pageUrl = window.location.href;
    var idIndex = pageUrl.indexOf("?id=");
    if (idIndex !== -1) {//this is, if there is a unique id//!= or !==? VS doesn't like != here
        getShoppingListById(pageUrl.substring(idIndex + 4));
    }

    window.onpopstate = function (event) {
        if (event.state === null) {
            hideShoppingList();
        }
        else {
            getShoppingListById(event.state.id);
        }
    }
});


//i could change this to like taxi pickup schedule that checks off people you pick up and deletes them when you drop them off