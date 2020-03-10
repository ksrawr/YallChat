console.log(' i am app js');

let state = {
	username: '',
	chatrooms: [],
};

const userNameEl = document.getElementById('userName');

const render = () => {
	userNameEl.innerHTML = '';
	userNameEl.innerHTML = `${state.username}!`;
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