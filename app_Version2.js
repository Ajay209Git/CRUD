// --- Replace with your Supabase project credentials ---
const SUPABASE_URL = 'https://pmtmwsdoychmljlbidfs.supabase.co'; // <-- CHANGE THIS
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdG13c2RveWNobWxqbGJpZGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzgxODIsImV4cCI6MjA2MzU1NDE4Mn0.Uy12AWheVn186awNIMuImleHFGe4ydPfgMDUNBJnktc'; // <-- CHANGE THIS
// -----------------------------------------------------

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const addForm = document.getElementById('addForm');
const itemList = document.getElementById('itemList');

// Modal elements for editing
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const editForm = document.getElementById('editForm');
const editId = document.getElementById('editId');
const editName = document.getElementById('editName');
const editValue = document.getElementById('editValue');

// Fetch and display items
async function fetchItems() {
  const { data, error } = await supabase.from('items').select().order('id', { ascending: false });
  itemList.innerHTML = '';
  if (error) {
    itemList.innerHTML = '<li>Error loading items.</li>';
    return;
  }
  data.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.name}</strong>: ${item.value}
      <button onclick="editItem(${item.id}, '${encodeURIComponent(item.name)}', '${encodeURIComponent(item.value)}')">Edit</button>
      <button onclick="deleteItem(${item.id})">Delete</button>`;
    itemList.appendChild(li);
  });
}

window.deleteItem = async (id) => {
  await supabase.from('items').delete().eq('id', id);
  fetchItems();
};

addForm.onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('itemName').value;
  const value = document.getElementById('itemValue').value;
  await supabase.from('items').insert([{ name, value }]);
  addForm.reset();
  fetchItems();
};

window.editItem = (id, name, value) => {
  editId.value = id;
  editName.value = decodeURIComponent(name);
  editValue.value = decodeURIComponent(value);
  editModal.style.display = 'block';
};

closeModal.onclick = () => {
  editModal.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == editModal) {
    editModal.style.display = 'none';
  }
};

editForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = editId.value;
  const name = editName.value;
  const value = editValue.value;
  await supabase.from('items').update({ name, value }).eq('id', id);
  editModal.style.display = 'none';
  fetchItems();
};


fetchItems();
