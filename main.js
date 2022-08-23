const tableBody = document.querySelector('table tbody');
const modal = document.querySelector('#my-modal');
const closeBtn = document.querySelector('.close');
const addNewUserBtn = document.querySelector('#add-new-btn');
const form = document.querySelector('form');
const modalHeader = document.querySelector('.modal-header h2');
const alertMsg = document.querySelector('.alert span');
const apiUrl = 'https://630028dd9350a1e548eab35e.mockapi.io/anything/here/v1/users/';
let selectedUserId;
const formElements = Array.from(form.children);

closeBtn.addEventListener('click', closeModalFn);

function closeModalFn() {
  modal.style.display = 'none';
}

// addNewUserBtn.addEventListener('click', () => {
//   modal.style.display = 'block';
// });

async function getUsers() {
  const response = await fetch(apiUrl, {
    method: 'GET', // default method for fetch is GET
  });
  const data = await response.json();

  createUsersTable(data);
}

getUsers();

function createUsersTable(users) {
  tableBody.innerHTML = '';

  for (let user of users) {
    const { id, fname, lname, age, email, title, avatar } = user;

    // In index.html file, I changed the avatar input type to be url. It is the first step to validate the url.
    // The second step is to use custom url validator. I added a custom validator function in validateUrl.js file.
    // isValidUrl('Enter your url here') will validate the url, if invalid url, then it will use default url/avatar below.
    const validAvatarUrl = isValidUrl(avatar)
      ? avatar
      : 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1220.jpg';

    const userRow = `
      <tr>
        <td>${id}</td>
        <td>
          <img src="${validAvatarUrl}" alt="user-${id}">
        </td>
        <td>${fname}</td>
        <td>${lname}</td>
        <td>${title}</td>
        <td>${email}</td>
        <td>${age}</td>
        <td class='actions'>
          <button class='edit-btn' onclick="editUser(${id})">Edit</button>
          <button class='delete-btn' onclick="deleteUserFromAPI(${id})">Delete</button>
        </td>
      </tr>
    `;

    tableBody.innerHTML += userRow;
  }
}

async function deleteUserFromAPI(id) {
  // const url = `${apiUrl}${id}`;
  const url = apiUrl + id;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.log('Something went wrong!', response);
  } else {
    alertMsg.style.display = 'block';
    alertMsg.innerHTML = 'User has been successfully deleted!';
    setTimeout(() => {
      alertMsg.style.display = 'none';
    }, 3000);
    getUsers();
  }
}

async function editUser(id) {
  const { fname, lname, title, age, email, avatar } = form.children;
  modal.style.display = 'block';
  modalHeader.innerHTML = 'Edit User';
  selectedUserId = id;
  const user = await (await fetch(apiUrl + id)).json();

  fname.value = user.fname;
  lname.value = user.lname;
  title.value = user.title;
  age.value = user.age;
  email.value = user.email;
  avatar.value = user.avatar;
}

function addNewUserFn() {
  formElements.forEach((i) => {
    if (i.value && i.id !== 'submit-btn') i.value = '';
  });
  modal.style.display = 'block';
  modalHeader.innerHTML = 'Add New User';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userInfo = {
    fname: e.target.fname.value,
    lname: e.target.lname.value,
    title: e.target.title.value,
    age: e.target.age.value,
    email: e.target.email.value,
    avatar: e.target.avatar.value,
  };

  createUpdateUser(userInfo);
  closeModalFn();
});

// fetch with a POST method - Add New User
async function createUpdateUser(userInfo) {
  const addBtnClicked = modalHeader.innerHTML === 'Add New User';

  const url = addBtnClicked ? apiUrl : apiUrl + selectedUserId;

  const response = await fetch(url, {
    method: addBtnClicked ? 'POST' : 'PUT',
    // Headers needed to specify what type of content is being sent over to the backend (mockapi endpoint)
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  if (!response.ok) {
    console.log('Something went wrong!', response);
  } else {
    const text = addBtnClicked ? 'created' : 'updated';
    alertMsg.style.display = 'block';
    alertMsg.innerHTML = `User has been successfully ${text}!`;
    setTimeout(() => {
      alertMsg.style.display = 'none';
    }, 3000);
    getUsers();
  }
}
