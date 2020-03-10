console.log('i am logout.js');

const logoutEl = document.getElementById('logout');

const handleLogout = () => {
	event.preventDefault();

	fetch('/api/v1/logout', {
		method: 'DELETE',
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if(data.status === 200) {
				localStorage.removeItem('uid');
				window.location = '/login';
			}
		})
		.catch(error => console.warn(error));

};

if(logoutEl) {
	logoutEl.addEventListener('click', handleLogout);
}