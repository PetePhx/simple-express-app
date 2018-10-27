const express = require('express');
const app = express();

app.use(express.json());

const courses = [
	{id: 1, name: 'course 1'},
	{id: 2, name: 'course 2'},
	{id: 3, name: 'course 3'},
];

app.get('/', (req, res) => {
	res.send('1 .. 2 .. 3');
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
	let course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) res.status(404)
									.send('The course with the given id was not found.');
	res.send(course);
});

app.post('/api/courses', (req, res) => {
	if (!req.body.name || req.body.name.length < 3) {
		// 400 bad request
		res.status(400)
			 .send('Name is required -- minimum 3 characters.');
		return;
	}
	
	let course = {
		id: courses.length + 1,
		name: req.body.name,
	};

	courses.push(course);
	res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port} ...`));