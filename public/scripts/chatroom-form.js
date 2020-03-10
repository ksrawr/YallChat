console.log('I am chatroom.js');

let chatFormState = {
	name: '',
	availableUsers: [],
};

const chatFormSetState = (obj) => {
	chatFormState = {...chatFormState, ...obj}
	console.log(chatFormState);
}

const usersEl = document.getElementById('usersInput');

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
					'availableUsers': users
				});

			})
			.catch(err => console.warn(err));

	}
}

const createChatRoom = () => {

// 	fetch(``, {
// 
// 	})

};

usersEl.addEventListener('input', getTheseUsers);

// document.getElementById('createChatRoom').addEventListener('createChatRoom');