const express = require('express');
const router = express.Router();
const Joi = require('joi');

const courses = [
	{id: 1, name: 'course 1'},
	{id: 2, name: 'course 2'},
	{id: 3, name: 'course 3'},
];

router.get('/', (req, res) => {
	res.send(courses);
});

router.get('/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404)
												 .send('The course with the given id was not found.');
	res.send(course);
});

router.post('/', (req, res) => {
	const { error } = validateCourse(req.body);
	if (error)	return res.status(400)
			 					 				.send(error.details[0].message);
	
	let course = {
		id: courses.length + 1,
		name: req.body.name,
	};

	courses.push(course);
	res.send(course);
});

router.put('/:id', (req, res) => {
	// Look up the course, if non existant, return 404 not found
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404)
			 									 .send('The course with the given id was not found.');
									
	// Validate the updates, if invalid, return 400 bad request
	const { error } = validateCourse(req.body);
	if (error) return res.status(400)
											 .send(error.details[0].message);

	// Update and return the updated course
	course.name = req.body.name;
	res.send(course);
});

router.delete('/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404)
			 									 .send('The course with the given id was not found.');

	const index = courses.indexOf(course);
	courses.splice(index, 1);

	res.send(course);
});

function validateCourse(course) {
	const schema = {
		name: Joi.string().min(3).required()
	};

	return Joi.validate(course, schema);
}

module.exports = router;