console.log('I am chatroom.js');

let chatFormState = {
	name: '',
	availableUsers: [],
	addedUsers: [],
};

const usersEl = document.getElementById('usersInput');

const chatFormSetState = (obj) => {
	chatFormState = {...chatFormState, ...obj}
	console.log(chatFormState);
	renderChatForm();
}

const displaySuggestedUsers = () => {
	return 'Found users...' + chatFormState.availableUsers.map((user, index) => {
		return `
							<div class="suggestion d-flex justify-content-between align-items-center" data-id="${index}">
							  	<p><strong class='chat-name'>${user.name}</strong></p>
							  	<p><span class='chat-time'>${user.email}</span></p>
							</div>
						`;
	}).join('');
}

const displayAddedUsers = () => {

	return chatFormState.addedUsers.map((user, index) => {
		return `
			<div class="user-added d-flex justify-content-between align-items-center" data-id="${index}">
		  	<p><strong class='chat-name'>${user.name}</strong></p>
		  	<p><span class='chat-time'>${user.email}</span></p>
		</div>
		`;
	}).join('');

}

const handleClickSuggestion = () => {

	const element = event.target;

	if(!element) return;

	console.log(element.nodeName);
	console.log(element.parentNode.parentNode);

	if(element.nodeName === 'SPAN' || element.nodeName === 'STRONG') {
		
		const parent = element.parentNode.parentNode;
		const id = parseInt(parent.getAttribute('data-id'));
		const newUser = chatFormState.availableUsers[id];

		chatFormState.addedUsers.push(newUser);
		chatFormState.availableUsers.splice(id, 1);

		renderChatForm();

	} else {

		const id = element.getAttribute('data-id');
		const newUser = chatFormState.availableUsers[id];
		chatFormState.addedUsers.push(newUser);
		chatFormState.availableUsers.splice(id, 1);

		renderChatForm();

	}


}

const renderChatForm = () => {

	const suggestionsEl = document.getElementById('suggestions');

	suggestionsEl.innerHTML = '';

	if(chatFormState.availableUsers.length > 0) {
		suggestionsEl.insertAdjacentHTML('beforeend', displaySuggestedUsers());

		document.querySelectorAll('.suggestion').forEach(user => user.addEventListener('click', handleClickSuggestion));
	}

	const addedUsersEl = document.getElementById('usersAdded');

	addedUsersEl.innerHTML = '';

	if(chatFormState.addedUsers.length > 0) {
		addedUsersEl.insertAdjacentHTML('beforeend', displayAddedUsers());


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

	

};

usersEl.addEventListener('input', getTheseUsers);

// document.getElementById('createChatRoom').addEventListener('createChatRoom');