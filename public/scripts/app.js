console.log(' i am app js');

let state = {
	username: '',
	chatrooms: [],
};

const userNameEl = document.getElementById('userName');
const navChatEl = document.getElementById('nav-chat');

const displayChats = () => {
	return state.chatrooms.map(chatroom => {
		return `
			<div class="card">
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