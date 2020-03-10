console.log(' i am app js');

let state = {
	username: '',
	chatrooms: [],
	currentChat: null,
};

const userNameEl = document.getElementById('userName');
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
			})
			.catch(err => console.warn(err));
	} else {
		console.log({id});
	}

}

const render = () => {
	userNameEl.innerHTML = '';
	userNameEl.innerHTML = `${state.username}!`;

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
}

const setState = (obj) => {
	/* this btw says create an object with state and obj */
	/* NOTE any existing values in state will be overridden if obj has different values for them */
	state = { ...state, ...obj};
	console.log(state);
	render();
}

const getUserInfo = () => {

	const id = localStorage.getItem('uid');

	fetch(`/api/v1/users/${id}`, {
		method: 'GET',
	})
		.then(res => res.json())
		.then(data => {

			const { name, chatrooms} = data.data;

			setState({
				'username': name,
				'chatrooms': chatrooms
			});

		})
		.catch(err => console.warn(err));
};

getUserInfo();