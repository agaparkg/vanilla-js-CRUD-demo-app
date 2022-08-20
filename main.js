const tableBody = document.querySelector('table tbody');
const modal = document.querySelector('#my-modal');
const closeBtn = document.querySelector('.close');
const addNewUserBtn = document.querySelector('#add-new-btn');
const form = document.querySelector('form');

closeBtn.addEventListener('click', closeModalFn);

function closeModalFn() {
  modal.style.display = 'none';
}

// addNewUserBtn.addEventListener('click', () => {
//   modal.style.display = 'block';
// });

async function getUsers() {
  const url = 'https://630028dd9350a1e548eab35e.mockapi.io/anything/here/v1/users';

  const response = await fetch(url, {
    method: 'GET', // default method for fetch is GET
  });
  const data = await response.json();

  // console.log(data);
  createUsersTable(data);
}

getUsers();

function createUsersTable(users) {
  tableBody.innerHTML = '';

  for (let user of users) {
    const { id, fname, lname, age, email, title, avatar } = user;

    // Check if the avatar url starts with 'http', if not, use the fake avatar link as a default value
    // This validation is not a recommended validation (what is it is something like: 'http://blah-blah').
    // Custom url validator can be used to validate the url.
    const validAvatarUrl = avatar.startsWith('http')
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
        <td>
          <button onclick="editUser(${id})">Edit</button>
          <button onclick="deleteUserFromAPI(${id})">Delete</button>
        </td>
      </tr>
    `;

    tableBody.innerHTML += userRow;
  }
}

// fetch with a PUT method - Edit
// fetch with a DELETE method - Delete
async function deleteUserFromAPI(id) {
  // const url = `https://630028dd9350a1e548eab35e.mockapi.io/anything/here/v1/users/${id}`;
  const url = 'https://630028dd9350a1e548eab35e.mockapi.io/anything/here/v1/users/' + id;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.log('Something went wrong!', response);
  } else {
    getUsers();
  }
}
// fetch with a POST method - Add New User

function editUser(id) {
  console.log('edit user btn', id);
}

// function deleteUser(id) {
//   deleteUserFromAPI(id);
// }

function addNewUserFn() {
  modal.style.display = 'block';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newUser = {
    fname: e.target.fname.value,
    lname: e.target.lname.value,
    title: e.target.title.value,
    age: e.target.age.value,
    email: e.target.email.value,
    avatar: e.target.avatar.value,
  };

  postNewUser(newUser);
  closeModalFn();
});

async function postNewUser(newUser) {
  const url = 'https://630028dd9350a1e548eab35e.mockapi.io/anything/here/v1/users/';

  const response = await fetch(url, {
    method: 'POST',
    // Headers needed to specify what type of content is being sent over to the backend (mockapi endpoint)
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    console.log('Something went wrong!', response);
  } else {
    getUsers();
  }
}
