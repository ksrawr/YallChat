console.log('I am chatroom.js');

let chatFormState = {
	name: '',
	availableUsers: [],
};

const usersEl = document.getElementById('usersInput');

const chatFormSetState = (obj) => {
	chatFormState = {...chatFormState, ...obj}
	console.log(chatFormState);
	renderChatForm();
}

const displaySuggestedUsers = () => {
	return chatFormState.availableUsers.map(user => {
		return `<option value="${user.name}  (${user.email})">`
	}).join('');
}

const renderChatForm = () => {

	const suggestionsEl = document.getElementById('suggestions');

	suggestionsEl.innerHTML = '';

	if(chatFormState.availableUsers) {
		suggestionsEl.insertAdjacentHTML('beforeend', displaySuggestedUsers());
	}
}

const getTheseUsers = () => {

	console.log(event.target.value);

	if(event.target.value) {

		fetch(`/api/v1/users/search?name=${event.target.value}`, {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);

				const users = data.data;

				chatFormSetState({
					availableUsers: users
				});

			})
			.catch(err => console.warn(err));

	} else {
		chatFormSetState({
			'availableUsers': []
		})
	}
}

const createChatRoom = () => {

// 	fetch(``, {
// 
// 	})

};

usersEl.addEventListener('input', getTheseUsers);

// document.getElementById('createChatRoom').addEventListener('createChatRoom');