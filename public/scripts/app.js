console.log(' i am app js');

let state = {
	username: '',
	email: '',
	chatrooms: [],
	currentChat: null,
	messages: [],
	selectedUsers: [],
	openChannel: null,
	availableUsers: [],
	currentUsers: [],
};

const userNameEl = document.getElementById('userName');
const userEmailEl = document.getElementById('userEmail');
// const navChatEl = document.getElementById('nav-chat');
const navChatEl = document.querySelector('.card-list');

const displayChats = () => {
	return state.chatrooms.map((chatroom, index) => {
		return `
			<div class="card" data-id="${index}">
				<div class="card-body" data-id="${index}">
					<div class="d-flex justify-content-between align-items-center" data-id="${index}">
				  	<p data-id="${index}"><strong class='chat-name' data-id="${index}">${chatroom.name}</strong></p>
				  	<p data-id="${index}"><span class='chat-time' data-id="${index}">11:20pm</span></p>
				  </div>
				  <p data-id="${index}"> ${chatroom.messages[chatroom.messages.length - 1].content}</p>
				</div>

			</div>
		`
	}).join('');
}

const displayMessages = () => {
	return state.messages.map((message, index) => {
		if(message.author._id === localStorage.getItem('uid')) {
			return `
				<div class="message-user">
					<p class="message">${message.content}</p>
					<small class="message-author">${message.createdAt} by ${message.author.name}</small>
				</div>
			`;
		} else {
			return `
				<div class="message-other">
					<p class="message">${message.content}</p>
					<small class="message-author">${message.createdAt} by ${message.author.name}</small>
				</div>
			`;
		}
	}).join('')
}

const displaySelectedUsers = () => {

	return state.selectedUsers.map((user, index) => {
		return `
			<div class="user-added d-flex justify-content-between align-items-center">
				<button class="remove-user btn" data-id="${index}">X</button>
		  	<p><strong class='chat-name'>${user.name}</strong></p>
		  	<p><span class='chat-time'>${user.email}</span></p>
			</div>
		`;
	}).join('');

}

const displayEditSuggestedUsers = () => {
	return 'Found users...' + state.availableUsers.map((user, index) => {
		return `
							<div class="edit-suggestion d-flex justify-content-between align-items-center" data-id="${index}">
							  	<p data-id="${index}"><strong class='chat-name' data-id="${index}">${user.name}</strong></p>
							  	<p data-id="${index}"><span data-id="${index}" class='chat-time'>${user.email}</span></p>
							</div>
						`;
	}).join('');
}

const displayCurrentUsers = () => {
	return state.currentUsers.map((user) => {
		return `
			<div class="current-user d-flex justify-content-between align-items-center">
				<p><strong>${user.name}</strong></p>
				<p><span>${user.email}</span></p>
			</div>
		`;
	}).join('');
}

const handleChatClick = () => {

	console.log(' i am handle chat click');
	console.log('ev.target', event.target.nodeName);

	const index = event.target.getAttribute('data-id');
	console.log(index);
	const id = state.chatrooms[index]._id;

	if(id) {
		fetch(`/api/v1/chatrooms/${id}`, {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);

				////// For mobile
				const chatContainerEl = document.querySelector('.chat-container');
				console.log(chatContainerEl);

				// Initial Display of Block
				const chatContainerDisplay = chatContainerEl.currentStyle ? chatContainerEl.currentStyle.display : getComputedStyle(chatContainerEl, null).display;

				console.log(chatContainerDisplay);

				const chatroomContainerEL = document.querySelector('.message-container');

				console.log(chatroomContainerEL.currentStyle ? element.currentStyle.display : getComputedStyle(chatroomContainerEL, null).display);

				// Initial Display of Flex;
				const chatroomDisplay = chatroomContainerEL.currentStyle ? chatroomContainerEL.currentStyle.display : getComputedStyle(chatroomContainerEL, null).display;

				if(chatContainerDisplay === 'block' && chatroomDisplay === 'none') {
					chatroomContainerEL.style.display = 'flex';
					chatContainerEl.style.display = 'none';
				}

				//////////////

				setState({
					currentChat: data.data,
					// messages: data.data.messages.slice(-5),
					messages: data.data.messages,
					currentUsers: data.data.users,
				},initializeSocket);
				
			})
			.catch(err => console.warn(err));
	} else {
		console.log({id});
	}

}

const handleRemoveSelectedUser = () => {
	console.log('i am handle remove selected user');

	const btn = event.target;
	const index = btn.getAttribute('data-id');

	state.selectedUsers.splice(index, 1);

	renderSelectedUsers();
}

const renderSelectedUsers = () => {
	const selectedUsersListEl = document.getElementById('usersSelected');

	/* Re-render Selected Users List */
	selectedUsersListEl.innerHTML = '';
	selectedUsersListEl.insertAdjacentHTML('afterbegin', displaySelectedUsers());

	document.querySelectorAll('.remove-user').forEach(btn => btn.addEventListener('click', handleRemoveSelectedUser));
}

const handleEditClickSuggestion = () => {

	const element = event.target;

	if(!element) return;

	const id = element.getAttribute('data-id');
	const newUser = state.availableUsers[id];

	state.selectedUsers.push(newUser);
	state.availableUsers.splice(id, 1);

	console.log(state);

	renderSuggestUsers();
	renderSelectedUsers();
}

const renderSuggestUsers = () => {
	const suggestedUsers = document.getElementById('editUserSuggestions');
	suggestedUsers.innerHTML = '';
	suggestedUsers.insertAdjacentHTML('afterbegin', displayEditSuggestedUsers());

	document.querySelectorAll('.edit-suggestion').forEach(suggestion => suggestion.addEventListener('click', handleEditClickSuggestion))

}

const handleSubmitMessage = () => {
	event.preventDefault();

	console.log('i am handle submit message');

	const messageInput = document.getElementById('messageInput')

	if(messageInput) {

		const messageObj = {
			content: messageInput.value,
			author: localStorage.getItem('uid')
		};

		fetch(`/api/v1/chatrooms/${state.currentChat._id}/messsages`, {
			method: 'PUT',
			headers: {
	 	 		'Content-Type': 'application/json',
	 	 	},
	 	 	body: JSON.stringify(messageObj)
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				state.messages.push(data.data.messages.slice(-1).shift());
				render();
			})
			.catch(err => console.log(err))
	}
}

const render = () => {
	userNameEl.innerHTML = '';
	userNameEl.innerHTML = `${state.username}!`;

	userEmailEl.innerHTML = '';
	userEmailEl.innerHTML = ` (${state.email})`;

	navChatEl.innerHTML = '';
	
	if(state.chatrooms.length > 0) {
		navChatEl.insertAdjacentHTML('beforeend', displayChats());

		document.querySelectorAll('.card').forEach(chatroom => chatroom.addEventListener('click', handleChatClick));
	}

	if(state.currentChat) {
		const { name, date } = state.currentChat;
		const formattedDate = new Date(date);
		const chatHeaderEl = document.getElementById('chatHeader');
		const messageStateEl = document.getElementById('messageState');
		const messageFormEl = document.getElementById('messageForm');
		const messageListEl = document.getElementById('messageList');

		chatHeaderEl.innerHTML = '';

		chatHeaderEl.innerHTML = `
			<div class="row">	
				<div class="col-sm-10">
					<h4>${name}</h4>
					<p>${formattedDate}</p>
				</div>
				<div class="col-sm-2">
					<button class="btn btn-primary btn-settings" data-toggle="modal" data-target="#settings-form">Settings</button>
				</div>
			</div>

			<div class="modal fade" id="settings-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
			  <div class="modal-dialog modal-dialog-centered" role="document">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h5 class="modal-title" >${state.currentChat.name}'s Settings</h5>
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div class="modal-body">
			      	<div class="container">
			      		<div class="row">
			      			
			      			<div class="col-sm-8">
			      				<div class="container chatroom-form text-center d-flex justify-content-between align-items-center">
						        	<form id="editChatRoomForm">
						        		<div class="chatroom-input">
						        			<h5>Edit Chat Room</h5>
						        			<input id="editChatRoomNameInput" type="text" name="name" value="${state.currentChat.name}">
						        		</div>
							        		<div class="chatroom-input">
							        			<input id="editUsersInput" type="text" name="user" placeholder="Add Users" list=suggestions autocomplete="off">
							        			
							        			<div id="editUserSuggestions">
							        				
							        			</div>

							        		</div>
							        		<button type="submit" class="btn btn-primary">Save Changes</button>
							        	</form>
							        </div>
							      </div>

							      <div class="col-sm-4 currentusers-box">
							      	<div class="container">
							      		<p class="currentuser-header">Current Users...</p>
							      	</div>
							      	<div class=" currentusers-container">
							      		${displayCurrentUsers()}
							      	</div>
							      	<div class="container usersselected-list">
				      					<p>Users added... </p>
				      					<div id="usersSelected">

				      					</div>
							      	</div>
			      					
			      			</div>
			      		</div>

			     		 </div>
			     	</div>
			        
			      <div class="modal-footer" id="settings-footer">
			      	<button id="deleteChatRoom">Delete</button>
			        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
			      </div>
			    </div>
			  </div>
			</div>
		`;

		messageStateEl.innerHTML = '';
		messageFormEl.innerHTML = '';

		messageFormEl.innerHTML = `
		<form id="form-message">
			<div class="row">
				<div class="col-sm-10">
					<input id="messageInput" type="text" name="" placeholder="Message...">
				</div>
				<div class="col-sm-2">
					<button type="submit" class="btn btn-primary">Send</button>
				</div>
			</div>
		</form>
		`;

		document.getElementById('form-message').addEventListener('submit', handleSubmitMessage);

		messageListEl.innerHTML = '';
		messageListEl.insertAdjacentHTML('afterbegin', displayMessages());

		renderSelectedUsers();

		document.getElementById('editUsersInput').addEventListener('input', handleGetSuggestedUsers);

		document.getElementById('editChatRoomForm').addEventListener('submit', editChatRoom);

		document.getElementById('deleteChatRoom').addEventListener('click', handleDeleteChatRoom);
	}
}

const handleDeleteChatRoom = () => {

	fetch(`/api/v1/chatrooms/${state.currentChat._id}`, {
		method: 'DELETE',
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if(data.status === 200) {

				clearInterval(state.openChannel);

				setTimeout(()=> {
					$('#settings-form').modal('hide');
					setState({
						currentChat: [],
						selectedUsers: [],
						currentUsers: []
					})

					window.location.reload();
				}, 2000);
			}
		})
		.catch(err => console.log(err));
}

const handleGetSuggestedUsers = () => {

	console.log(event.target.value);

	if(event.target.value) {

		fetch(`/api/v1/users/search?name=${event.target.value}`, {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);

				const users = data.data;

				state.availableUsers = users;

				if(state.availableUsers.length > 0) {
					renderSuggestUsers();
				}

			})
			.catch(err => console.warn(err));

	} else {
		state.availableUsers = [];
	}
}

const getIncomingCurrentChatMsgs = () => {
	if(!state.currentChat) {
		clearInterval(state.openChannel);
	} else {

		fetch(`/api/v1/chatrooms/${state.currentChat._id}`, {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);

				const { messages } = data.data;

				if(messages.length > 0) {

					console.log(state.messages[state.messages.length -1]);

					console.log(messages[messages.length - 1]);

					if(state.messages[state.messages.length -1].author !==messages[messages.length - 1].author || state.messages[state.messages.length -1].content !== messages[messages.length - 1].content) {
					
						// setState({messages: messages.splice(-5)}); 
						setState({messages: messages});
						console.log(messages.splice(-5));
					}

				}
			})
			.catch(err => console.warn(err.message));

	}

}

const initializeSocket = () => {
	if(state.openChannel) {
		clearInterval(state.openChannel);
	}

	// setState({
	// 	openChannel: setInterval(getIncomingCurrentChatMsgs, 5000)
	// });
}

const setState = (obj, callback) => {
	/* this btw says create an object with state and obj */
	/* NOTE any existing values in state will be overridden if obj has different values for them */
	state = { ...state, ...obj};
	console.log(state);
	render();
	if(callback) callback();
}

const editChatRoom = () => {

	event.preventDefault();

	console.log('i am edit chat room event');	

	const newChatRoomNameInput = document.getElementById('editChatRoomNameInput');

	console.log(state);

	const editChatRoomObj = {
		name: newChatRoomNameInput.value,
		users: state.selectedUsers
	}

	fetch(`/api/v1/chatrooms5/${state.currentChat._id}`, {
		method: 'PUT',
		headers: {
 	 		'Content-Type': 'application/json',
 	 	},
 	 	body: JSON.stringify(editChatRoomObj)
	})
		.then(res => res.json())
		.then(data => {
			console.log(data)

			if(data.status === 200) {
				setTimeout(()=> {
					$('#settings-form').modal('hide');
					setState({
						currentChat: data.data,
						currentUsers: data.data.users,
						selectedUsers: []
					})
				}, 2000);
				getUserInfo();
			}

		})
		.catch(err => console.warn(err));
}

const getUserInfo = () => {

	const id = localStorage.getItem('uid');

	fetch(`/api/v1/users/${id}`, {
		method: 'GET',
	})
		.then(res => res.json())
		.then(data => {

			const { name, chatrooms, email } = data.data;

			setState({
				'username': name,
				'email': email,
				'chatrooms': chatrooms
			});

		})
		.catch(err => console.warn(err));
};

getUserInfo();