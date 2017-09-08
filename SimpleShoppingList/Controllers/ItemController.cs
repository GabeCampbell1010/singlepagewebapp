using SimpleShoppingList.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SimpleShoppingList.Controllers
{
    public class ItemController : ApiController
    {

        // POST: api/Item
        public IHttpActionResult Post([FromBody]Item item)//add item to shopping list
        {
            ShoppingList shoppingList = ShoppingListController.shoppingLists.Where(s => s.Id == item.ShoppingListId).FirstOrDefault();

            if(shoppingList == null)//if can't find shopping list then 404
            {
                return NotFound();
            }

            item.Id = shoppingList.Items.Max(i => i.Id) + 1;//search for max id and increase by 1 to get unique id

            shoppingList.Items.Add(item);//else add item to list

            return Ok(shoppingList);//and return list with new item
        }

        // PUT: api/Item/5
        public IHttpActionResult Put(int id, [FromBody]Item item)//update items
        {
            ShoppingList shoppingList = ShoppingListController.shoppingLists.Where(s => s.Id == item.ShoppingListId).FirstOrDefault();

            if (shoppingList == null)//if can't find shopping list then 404
            {
                return NotFound();
            }

            Item changedItem = shoppingList.Items.Where(i => i.Id == id).FirstOrDefault();//look for item on server, if match

            if(changedItem == null)
            {
                return NotFound();
            }

            changedItem.Checked = item.Checked;//set check property to item given

            return Ok(shoppingList);
        }

        // DELETE: api/Item/5
        public IHttpActionResult Delete(int id)//remove items
        {
            ShoppingList shoppingList = ShoppingListController.shoppingLists[0];

            Item item = shoppingList.Items.FirstOrDefault(i => i.Id == id);

            if(item == null)
            {
                return NotFound();
            }

            shoppingList.Items.Remove(item);

            return Ok(shoppingList);
        }
    }
}
