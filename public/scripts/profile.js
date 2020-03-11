console.log(' i am profile js');

let profileState = {
	username: '',
	email: '',
	date: '', 
};

const setProfileState = (obj, callback) => {

	profileState = {...profileState, ...obj};
	console.log('setState', profileState);
	render();
	if(callback) callback();
}

const handleEditUserFormSubmit = () => {

	event.preventDefault();

	console.log('i am handle edit user form submit');

	const formEl = document.querySelector('form');

	const formInputs = [...formEl.elements];

	const userObj = {};

	formInputs.forEach(input => {
 		if(input.type !== 'submit') userObj[input.name] = input.value;
 	});

 	console.log(userObj);

	fetch(`/api/v1/users/${localStorage.getItem('uid')}`, {
		method: 'PUT',
		headers: {
 	 		'Content-Type': 'application/json',
 	 	},
 	 	body: JSON.stringify(userObj)
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(data.status === 200) {

				window.location.reload();
			}

		})
		.catch(err => console.log(err));

}

const handleOpenEditForm = () => {
	const container = document.querySelector('.container');

	container.innerHTML = '';

	container.innerHTML = `
		<form id="editUserForm">
			<h2>Edit Profile Information</h2>
			<div>
				<label>Name</label>
				<input type="text" name="name" value="${profileState.username}">
			</div>
			<div>
				<label>Email</label>
				<input type="text" name="email" value="${profileState.email}">
			</div>
			<button type="submit" class="btn btn-primary">Save Changes</button>
		</form>
	`;

	document.getElementById('editUserForm').addEventListener('submit', handleEditUserFormSubmit);
}

const render = () => {
	const usernameEl = document.getElementById('username');
	const userJoinedEl = document.getElementById('userJoined');
	const userEmailEl = document.getElementById('userEmail');

	username.innerHTML = '';
	userJoinedEl.innerHTML = '';
	userEmailEl.innerHTML = '';

	const date = Date(profileState.date);

	usernameEl.innerHTML = profileState.username;
	userJoinedEl.innerHTML = date;
	userEmailEl.innerHTML = profileState.email;

	document.getElementById('editBtn').addEventListener('click', handleOpenEditForm);

}

const getProfileUser = () => {
	fetch(`/api/v1/users/${localStorage.getItem('uid')}`, {
		method: 'GET',
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(data.status === 200) {

				const { name, email, createdAt } = data.data;

				setProfileState({
					username: name,
					email: email,
					date: createdAt
				});
			}
		})
		.catch(err => console.warn(err));
}

getProfileUser();