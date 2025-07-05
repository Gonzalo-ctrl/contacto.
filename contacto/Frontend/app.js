const form = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const emailInput = document.getElementById('emailInput');
const imgInput = document.getElementById('imgInput');
const imgPreview = document.getElementById('imgPreview');
const contactList = document.getElementById('contactList');
const searchInput = document.getElementById('searchInput');
const contactIdInput = document.getElementById('contactId');

let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
let currentImageData = '';

function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function renderContacts(filter = '') {
  contactList.innerHTML = '';
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
  if (filtered.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Sin resultados',
      text: 'No se encontraron contactos con ese nombre.',
      confirmButtonColor: '#2563eb'
    });
    return;
  }

  filtered.forEach(contact => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = contact.image || 'https://via.placeholder.com/60?text=No+Img';

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<strong>${contact.name}</strong><br/>${contact.phone}<br/>${contact.email}`;

    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'Editar';
    editBtn.onclick = () => editContact(contact.id);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = 'Eliminar';
    delBtn.onclick = () => deleteContact(contact.id);

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    contactList.appendChild(li);
  });
}

function editContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;

  let newImageData = contact.image || '';

  Swal.fire({
    title: 'Editar Contacto',
    html: `
      <input id="swalName" class="swal2-input" placeholder="Nombre" value="${contact.name}">
      <input id="swalPhone" class="swal2-input" placeholder="Teléfono" value="${contact.phone || ''}">
      <input id="swalEmail" class="swal2-input" placeholder="Correo electrónico" value="${contact.email || ''}">
      <input id="swalImage" type="file" accept="image/*" style="margin-top: 10px;">
      <img id="swalImgPreview" src="${contact.image || 'https://via.placeholder.com/60?text=Img'}" 
           style="margin-top: 15px; max-width: 100px; border-radius: 12px; border: 2px solid #38bdf8; box-shadow: 0 2px 10px rgba(56, 189, 248, 0.3);" />
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar cambios',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'swal2-confirm-btn',
      cancelButton: 'swal2-cancel-btn'
    },
    didOpen: () => {
      const imgInput = document.getElementById('swalImage');
      const imgPreview = document.getElementById('swalImgPreview');

      imgInput.addEventListener('change', () => {
        const file = imgInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = e => {
            newImageData = e.target.result;
            imgPreview.src = newImageData;
          };
          reader.readAsDataURL(file);
        }
      });
    },
    preConfirm: () => {
      const name = document.getElementById('swalName').value.trim();
      const phone = document.getElementById('swalPhone').value.trim();
      const email = document.getElementById('swalEmail').value.trim();

      if (!name) {
        Swal.showValidationMessage('El nombre es obligatorio');
        return false;
      }

      return { name, phone, email };
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      contact.name = result.value.name;
      contact.phone = result.value.phone;
      contact.email = result.value.email;
      contact.image = newImageData;

      saveContacts();
      renderContacts(searchInput.value);
      Swal.fire('Contacto actualizado correctamente', '', 'success');
    }
  });
}


function deleteContact(id) {
  Swal.fire({
    title: '¿Eliminar contacto?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      contacts = contacts.filter(c => c.id !== id);
      saveContacts();
      renderContacts(searchInput.value);
      resetForm();
      Swal.fire('Eliminado', 'Contacto eliminado.', 'success');
    }
  });
}

function resetForm() {
  contactIdInput.value = '';
  nameInput.value = '';
  phoneInput.value = '';
  emailInput.value = '';
  imgInput.value = '';
  imgPreview.src = '';
  imgPreview.style.display = 'none';
  currentImageData = '';
}

imgInput.addEventListener('change', () => {
  const file = imgInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      currentImageData = e.target.result;
      imgPreview.src = currentImageData;
      imgPreview.style.display = 'block';
      Swal.fire('Imagen cargada', '', 'info');
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const id = contactIdInput.value;
  const name = nameInput.value.trim();

  if (!name) {
    Swal.fire('Nombre obligatorio', 'Por favor ingresa un nombre.', 'warning');
    return;
  }

  if (id) {
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = {
        id,
        name,
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        image: currentImageData
      };
    }
  } else {
    contacts.push({
      id: Date.now().toString(),
      name,
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      image: currentImageData
    });
  }

  saveContacts();
  renderContacts(searchInput.value);
  resetForm();

  Swal.fire('Contacto guardado', '', 'success');
});


searchInput.addEventListener('input', () => {
  renderContacts(searchInput.value);
});

renderContacts();

// Mostrar/Ocultar el formulario con el botón
const toggleBtn = document.getElementById('toggleFormBtn');
const contactForm = document.getElementById('contactForm');

toggleBtn.addEventListener('click', () => {
  const isVisible = contactForm.style.display === 'block';
  contactForm.style.display = isVisible ? 'none' : 'block';
  toggleBtn.textContent = isVisible ? '➕ Agregar Contacto' : '✖️ Ocultar Formulario';
});

