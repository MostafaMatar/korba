import { supabase } from '../lib/supabase'

/**
 * @typedef {Object} GroceryList
 * @property {string} id - UUID
 * @property {string} name - List name
 * @property {string} created_at - Timestamp
 * @property {string} user_id - User ID (for future auth)
 */

/**
 * @typedef {Object} GroceryItem
 * @property {string} id - UUID
 * @property {string} list_id - Reference to grocery_lists.id
 * @property {string} name - Item name
 * @property {number} quantity - Item quantity
 * @property {string} category - Item category
 * @property {string} [comment] - Optional note
 * @property {boolean} purchased - Whether item is purchased
 * @property {string} [reply] - Optional reply for unpurchased items
 */

/**
 * Create a new grocery list
 * @param {string} name 
 * @returns {Promise<GroceryList>}
 */
export async function createList(name) {
  const { data, error } = await supabase
    .from('grocery_lists')
    .insert([{ name }])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Add items to a grocery list
 * @param {string} listId 
 * @param {Array<Omit<GroceryItem, 'id' | 'list_id'>>} items 
 * @returns {Promise<GroceryItem[]>}
 */
export async function addItems(listId, items) {
  // Pre-process items to handle the reversal issue
  const itemsWithListId = items.map(item => ({
    ...item,
    // Reverse the name string to counteract the reversal issue
    name: item.name.split('').reverse().join(''),
    list_id: listId
  }))

  const { data, error } = await supabase
    .from('grocery_items')
    .insert(itemsWithListId)
    .select()

  if (error) throw error
  return data
}

/**
 * Get a grocery list with its items
 * @param {string} listId 
 * @returns {Promise<{ list: GroceryList, items: GroceryItem[] }>}
 */
export async function getList(listId) {
  // Get the list
  const { data: list, error: listError } = await supabase
    .from('grocery_lists')
    .select()
    .eq('id', listId)
    .single()

  if (listError) throw listError

  // Get the items
  const { data: items, error: itemsError } = await supabase
    .from('grocery_items')
    .select()
    .eq('list_id', listId)

  if (itemsError) throw itemsError

  return { list, items }
}

/**
 * Update an item's purchased status
 * @param {string} itemId 
 * @param {boolean} purchased 
 * @returns {Promise<void>}
 */
export async function updateItemPurchased(itemId, purchased) {
  const { error } = await supabase
    .from('grocery_items')
    .update({ purchased })
    .eq('id', itemId)

  if (error) throw error
}

/**
 * Add a reply to an item
 * @param {string} itemId 
 * @param {string} reply 
 * @returns {Promise<void>}
 */
export async function addItemReply(itemId, reply) {
  const { error } = await supabase
    .from('grocery_items')
    .update({ reply })
    .eq('id', itemId)

  if (error) throw error
}

/**
 * Get all lists
 * @returns {Promise<GroceryList[]>}
 */
export async function getAllLists() {
  const { data, error } = await supabase
    .from('grocery_lists')
    .select()
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
