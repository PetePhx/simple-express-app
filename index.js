const Joi = require('joi');
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
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) res.status(404)
									.send('The course with the given id was not found.');
	res.send(course);
});

app.post('/api/courses', (req, res) => {
	const { error } = validateCourse(req.body);
	if (error) {
		res.status(400)
			 .send(error.details[0].message);
		return;
	}
	
	let course = {
		id: courses.length + 1,
		name: req.body.name,
	};

	courses.push(course);
	res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
	// Look up the course, if non existant, return 404 not found
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) {
		res.status(404)
			 .send('The course with the given id was not found.');
		return;
	}
									
	// Validate the updates, if invalid, return 400 bad request
	const { error } = validateCourse(req.body);
	if (error) {
		res.status(400)
			 .send(error.details[0].message);
		return;
	}

	// Update and return the updated course
	course.name = req.body.name;
	res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port} ...`));

function validateCourse(course) {
	const schema = {
		name: Joi.string().min(3).required()
	};

	return Joi.validate(course, schema);
}