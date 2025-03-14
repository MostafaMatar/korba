import { supabase } from '../lib/supabase'

/**
 * @typedef {Object} GroceryList
 * @property {string} id - UUID
 * @property {string} name - List name
 * @property {string} created_at - Timestamp
 * @property {string} [user_id] - Optional user ID for authenticated users
 * @property {string} [purchase_date] - Optional date when items need to be bought
 * @property {string} [store] - Optional preferred store for shopping
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
 * Create a new grocery list. If user is authenticated, the list will be linked to their account.
 * If not authenticated, creates an anonymous list.
 * @param {string} name - List name
 * @param {string|null} [purchaseDate=null] - Optional date when items need to be bought
 * @param {string|null} [store=null] - Optional preferred store for shopping
 * @returns {Promise<GroceryList>} The created grocery list
 */
export async function createList(name, purchaseDate = null, store = null) {
  // Try to get user but don't require authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  // Create list object with required fields
  const listData = { name }
  
  // Add optional fields only if they have valid values
  if (purchaseDate) {
    listData.purchase_date = purchaseDate
  }
  
  if (store) {
    listData.store = store
  }
  
  // Add user_id if authenticated
  if (user) {
    listData.user_id = user.id
  }

  const { data, error } = await supabase
    .from('grocery_lists')
    .insert([listData])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Add items to a grocery list. If the list belongs to an authenticated user,
 * only that user can add items. Anonymous lists can be modified by anyone.
 * @param {string} listId - ID of the grocery list
 * @param {Array<Omit<GroceryItem, 'id' | 'list_id'>>} items - Array of items to add
 * @returns {Promise<GroceryItem[]>}
 */
export async function addItems(listId, items) {
  // Try to get user but don't require authentication
  const { data: { user } } = await supabase.auth.getUser()

  // If user is authenticated, verify ownership
  if (user) {
    const { data: list, error: listError } = await supabase
      .from('grocery_lists')
      .select('id, user_id')
      .eq('id', listId)
      .single()

    if (listError) throw listError

    // If list has a user_id, verify it matches current user
    if (list.user_id && list.user_id !== user.id) {
      throw new Error('Unauthorized: This list does not belong to you')
    }
  }

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
