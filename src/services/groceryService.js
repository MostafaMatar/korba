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
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError

  const { data, error } = await supabase
    .from('grocery_lists')
    .insert([{ 
      name,
      user_id: user.id
    }])
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
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError

  // Verify the list belongs to the current user
  const { error: listError } = await supabase
    .from('grocery_lists')
    .select('id')
    .eq('id', listId)
    .eq('user_id', user.id)
    .single()

  if (listError) throw new Error('Unauthorized: This list does not belong to you')

  // Pre-process items to handle the reversal issue
  const itemsWithListId = items.map(item => ({
    ...item,
    // Reverse the name string to counteract the reversal issue
    name: item.name.split('').reverse().join(''),
    list_id: listId
  }))

  // If we get here, the user owns the list, so we can add items
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
  // Get the list (no ownership check - anyone with link can view)
  const { data: list, error: listError } = await supabase
    .from('grocery_lists')
    .select()
    .eq('id', listId)
    .single()

  if (listError) throw listError

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
  // Anyone with the link can update purchase status
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
  // Anyone with the link can add replies to items
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
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError

  const { data, error } = await supabase
    .from('grocery_lists')
    .select()
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
