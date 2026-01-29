/**
 * Database service for guest book messages
 * Using Supabase (PostgreSQL) - https://supabase.com
 * 
 * Setup instructions:
 * 1. Create a free account at https://supabase.com
 * 2. Create a new project
 * 3. Go to SQL Editor and run this SQL to create the messages table:
 * 
 * CREATE TABLE messages (
 *   id BIGSERIAL PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   content TEXT NOT NULL,
 *   pin TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * 4. (Optional) Enable Row Level Security for public read, authenticated write:
 * 
 * ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Anyone can read messages" ON messages
 *   FOR SELECT USING (true);
 * 
 * CREATE POLICY "Anyone can insert messages" ON messages
 *   FOR INSERT WITH CHECK (true);
 * 
 * CREATE POLICY "Users can update their own messages" ON messages
 *   FOR UPDATE USING (true);
 * 
 * CREATE POLICY "Users can delete their own messages" ON messages
 *   FOR DELETE USING (true);
 * 
 * 5. Get your project URL and anon key from Settings > API
 * 6. Add to .env file:
 *    VITE_SUPABASE_URL=your-project-url
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using local storage fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all messages from database
 */
export const fetchMessages = async () => {
  // If using Supabase:
  if (!supabase) {
    console.log('📦 Using localStorage (Supabase not configured)');
    return getLocalMessages();
  }
  
  console.log('🗄️ Fetching messages from Supabase...');
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error fetching messages:', error);
    return getLocalMessages();
  }
  
  console.log(`✅ Loaded ${data.length} messages from Supabase`);
  return data.map(msg => ({
    id: msg.id,
    name: msg.name,
    content: msg.content,
    pin: msg.pin,
    createdAt: msg.created_at,
  }));
};

/**
 * Add a new message to database
 */
export const addMessage = async (message) => {
  // If using Supabase:
  if (!supabase) {
    console.log('📦 Saving to localStorage (Supabase not configured)');
    return addLocalMessage(message);
  }
  
  console.log('🗄️ Saving message to Supabase...', { name: message.name });
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        name: message.name,
        content: message.content,
        pin: message.pin,
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error adding message:', error);
    throw error;
  }
  
  console.log('✅ Message saved to Supabase!', { id: data.id });
  return {
    id: data.id,
    name: data.name,
    content: data.content,
    pin: data.pin,
    createdAt: data.created_at,
  };
};

/**
 * Update a message in database
 */
export const updateMessage = async (id, updates) => {
  // If using Supabase:
  if (!supabase) {
    return updateLocalMessage(id, updates);
  }
  
  const { data, error } = await supabase
    .from('messages')
    .update({
      name: updates.name,
      content: updates.content,
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating message:', error);
    throw error;
  }
  
  return {
    id: data.id,
    name: data.name,
    content: data.content,
    pin: data.pin,
    createdAt: data.created_at,
  };
};

/**
 * Delete a message from database
 */
export const deleteMessage = async (id) => {
  // If using Supabase:
  if (!supabase) {
    return deleteLocalMessage(id);
  }
  
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// ============================================
// Local Storage Fallback (for development)
// ============================================

const STORAGE_KEY = 'wedding_guestbook_messages';

const getLocalMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return [];
};

const saveLocalMessages = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const addLocalMessage = (message) => {
  const messages = getLocalMessages();
  const newMessage = {
    id: Date.now(),
    name: message.name,
    content: message.content,
    pin: message.pin,
    createdAt: new Date().toISOString(),
  };
  messages.unshift(newMessage);
  saveLocalMessages(messages);
  return newMessage;
};

const updateLocalMessage = (id, updates) => {
  const messages = getLocalMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) {
    throw new Error('Message not found');
  }
  messages[index] = {
    ...messages[index],
    ...updates,
  };
  saveLocalMessages(messages);
  return messages[index];
};

const deleteLocalMessage = (id) => {
  const messages = getLocalMessages();
  const filtered = messages.filter((m) => m.id !== id);
  saveLocalMessages(filtered);
};
