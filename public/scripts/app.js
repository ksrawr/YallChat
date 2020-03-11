console.log(' i am app js');

let state = {
	username: '',
	email: '',
	chatrooms: [],
	currentChat: null,
	messages: [],
	selectedUsers: [],
	openChannel: null,
};

const userNameEl = document.getElementById('userName');
const userEmailEl = document.getElementById('userEmail');
const navChatEl = document.getElementById('nav-chat');

const displayChats = () => {
	return state.chatrooms.map((chatroom, index) => {
		return `
			<div class="card" data-id="${index}">
				<div class="card-body">
					<div class="d-flex justify-content-between align-items-center">
				  	<p><strong class='chat-name'>${chatroom.name}</strong></p>
				  	<p><span class='chat-time'>11:20pm</span></p>
				  </div>
				  <p>Display last message.</p>
				</div>

			</div>
		`
	}).join('');
}

const displayMessages = () => {
	return state.messages.map((message, index) => {
		if(message.author === localStorage.getItem('uid')) {
			return `
				<div class="message-user">
					${message.content}
				</div>
			`;
		} else {
			return `
				<div class="message-other">
					${message.content}
				</div>
			`;
		}
	}).join('')
}

const handleChatClick = () => {

	console.log(' i am handle chat click');
	console.log('ev.target', event.target.nodeName);

	let parent;

	if(event.target.nodeName === 'P') {
		// console.log('event.target.parent.parent', event.target.parentNode.parentNode);
		parent = event.target.parentNode.parentNode;
	} else if(event.target.nodeName === 'SPAN' || event.target.nodeName === 'STRONG') {
		// console.log('event.target.parent.parent.parent.parent', event.target.parentNode.parentNode.parentNode.parentNode);
		parent = event.target.parentNode.parentNode.parentNode.parentNode;
	} else if (event.target.classList.length >= 3) {
		// console.log('event.target.parent.parent', event.target.parentNode.parentNode);
		parent = event.target.parentNode.parentNode;
	} else if (event.target.classList !== 'card') {
		// console.log('event.target.parent', event.target.parentNode);
		parent = event.target.parentNode;
	}

	/* Sanity on our edge cases!!!! */
	console.log(parent);

	const index = parent.getAttribute('data-id');
	const id = state.chatrooms[index]._id;

	if(id) {
		fetch(`/api/v1/chatrooms/${id}`, {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setState({
					currentChat: data.data,
					selectedUsers: data.data.users,
					messages: data.data.messages.slice(-5)
				},initializeSocket);

				
			})
			.catch(err => console.warn(err));
	} else {
		console.log({id});
	}

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

	navChatEl.innerHTML = `
		<div class="card search-container container">
			<div class="card-body">
				<form class="form-inline" id="searchChat">
				  <div class="form-group mb-2 mx-sm-1">
				    <input type="text" class="form-control" id="chatQuery" placeholder="Search Chats">
				    <button type="submit" class="btn btn-primary">Search</button>
				  </div>
				</form>
			</div>
		</div>`;
	
	if(state.chatrooms.length > 0) {
		navChatEl.insertAdjacentHTML('beforeend', displayChats());

		document.querySelectorAll('.card').forEach(chatroom => chatroom.addEventListener('click', handleChatClick));
	}

	if(state.currentChat) {
		const { name, date } = state.currentChat;
		const chatHeaderEl = document.getElementById('chatHeader');
		const messageStateEl = document.getElementById('messageState');
		const messageFormEl = document.getElementById('messageForm');
		const messageListEl = document.getElementById('messageList');

		chatHeaderEl.innerHTML = '';

		chatHeaderEl.innerHTML = `
			<div class="row">	
				<div class="col-sm-10">
					<h4>${name}</h4>
					<p>${date}</p>
				</div>
				<div class="col-sm-2">
					<button class="btn btn-primary btn-settings" data-toggle="modal" data-target="#settings-form">Settings</button>
				</div>
			</div>

			<div class="modal fade" id="settings-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
			  <div class="modal-dialog modal-dialog-centered" role="document">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h5 class="modal-title" >Settings</h5>
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div class="modal-body">
			      	<div class="container">
			      		<div class="row">
			      			
			      			<div class="col-sm-8">
			      				<div class="container chatroom-form text-center d-flex justify-content-between align-items-center">
						        	<form id="chatRoomForm">
						        		<div class="chatroom-input">
						        			<input id="chatRoomNameInput" type="text" name="name" placeholder="Chat Room Name">
						        		</div>
							        		<div class="chatroom-input">
							        			<input id="usersInput" type="text" name="user" placeholder="Add Users" list=suggestions autocomplete="off">
							        			
							        			<div id="suggestions">
							        				
							        			</div>

							        		</div>
							        		<button type="submit" class="btn btn-primary">Create Chat Room</button>
							        	</form>
							        </div>
							      </div>

							      <div class="col-sm-4">

							      	<div class="container">
				      					<p>Users added... </p>
				      					<div id="usersAdded">
				      						
				      					</div>
							      	</div>
			      					
			      			</div>
			      		</div>

			     		 </div>
			     	</div>
			        
			      <div class="modal-footer">
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

		/* not real socket btw */
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

				console.log(state.messages[state.messages.length -1]);

				console.log(messages[messages.length - 1]);

				if(state.messages[state.messages.length -1].author !== messages[messages.length - 1].author && state.messages[state.messages.length -1].content !== messages[messages.length - 1].content) {
					
					setState({messages: messages.splice(-5)}); 
					console.log(messages.splice(-5));
				}
			})
			.catch(err => console.warn(err.message));

	}

}

const initializeSocket = () => {
	setState({
		openChannel: setInterval(getIncomingCurrentChatMsgs, 5000)
	});
}

const setState = (obj, callback) => {
	/* this btw says create an object with state and obj */
	/* NOTE any existing values in state will be overridden if obj has different values for them */
	state = { ...state, ...obj};
	console.log(state);
	render();
	if(callback) callback();
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