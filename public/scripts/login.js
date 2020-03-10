console.log(' i am login js');

const formEl = document.querySelector('form');
	
const handleSubmit = () => {
	event.preventDefault();

	let formIsValid = true;
	const userData = {};

	/* pull all the form's children */
 	const formInputs = [...formEl.elements];

 	formInputs.forEach(input => {
 		if(input.type !== 'submit') userData[input.name] = input.value;
 	});

 	console.log(userData);

 	fetch('/api/v1/login', {
 		method: 'POST',
 		headers: {
 			'Content-Type': 'application/json',
 		},
 		body: JSON.stringify(userData)
 	})
 		.then(res => res.json())
 		.then(data => {
 			console.log(data);

 			if(data.status === 200) {
 				localStorage.setItem('uid', data.data);
 				window.location = '/home';
 			}
 			
 		})
 		.catch(err => console.warn(err));
}

formEl.addEventListener('submit', handleSubmit);