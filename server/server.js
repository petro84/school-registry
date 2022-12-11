'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');

let app = express();
app.use(bodyParser.json());

let urlEncodedParser = bodyParser.urlencoded({ extended: false });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

function getNextId(counterType) {
  let data = fs.readFileSync(__dirname + '/data/counters.json', 'utf-8');
  data = JSON.parse(data);

  let id = -1;
  switch (counterType.toLowerCase()) {
    case 'teacher':
      id = data.nextTeacher;
      data.nextTeacher++;
      break;
    case 'student':
      id = data.nextStudent;
      data.nextStudent++;
      break;
    case 'admin':
      id = data.nextAdmin;
      data.nextAdmin++;
      break;
  }

  fs.writeFileSync(__dirname + '/data/counters.json', JSON.stringify(data));

  return id;
}

function isValidTeacher(teacher) {
  console.log(teacher);

  if (teacher.teacherName === undefined || teacher.teacherName.trim() === '')
    return 1;
  if (teacher.gradeId === undefined || teacher.gradeId.trim() === '') return 2;
  if (teacher.phone === undefined || teacher.phone.trim() === '') return 3;
  if (teacher.email === undefined || teacher.email.trim() === '') return 4;
  if (teacher.maxClassSize === undefined || isNaN(teacher.maxClassSize))
    return 5;

  return -1;
}

function isValidStudent(student) {
  console.log(student);

  if (student.studentName === undefined || student.studentName.trim() === '')
    return 1;
  if (student.phone === undefined || student.phone.trim() === '')
    return 2;
  if (student.email === undefined || student.email.trim() === '')
    return 3;

  return -1;
}

function fetchContent(content) {
  let data = fs.readFileSync(__dirname + `/data/${content}.json`, 'utf-8');

  return JSON.parse(data);
}

// GET Grades (Organizations)
app.get('/api/grades', (req, res) => {
  console.log('Received a GET request for all grades.');

  let data = fetchContent('grades');

  console.log(`Returned payload is: \n${JSON.stringify(data)}`);
  res.end(JSON.stringify(data));
});

// GET All Teachers (Groups)
app.get('/api/teachers', (req, res) => {
  console.log('Received a GET request for all teachers.');

  let data = fetchContent('teachers');
  console.log(`Data - ${data}`);

  console.log(`Returned payload is: \n${JSON.stringify(data)}`);
  res.end(JSON.stringify(data));
});

// GET Teacher by Id
app.get('/api/teachers/:id', (req, res) => {
  let id = req.params.id;
  console.log(`Received a GET request for teacher id: ${id}`);

  let data = fetchContent('teachers');

  let match = data.find((teacher) => teacher.teacherId === Number(id));
  if (match == null) {
    res.status(404).send('Teacher Not Found');
    console.log('Teacher Not Found');
    return;
  }

  console.log(`Returned payload is \n${JSON.stringify(match)}`);
  res.end(JSON.stringify(match));
});

// GET Teachers by Grade
app.get('/api/teachers/bygrade/:id', (req, res) => {
  let id = req.params.id;
  console.log(`Received a GET request for teachers by grade ${id}`);

  let gradeData = fetchContent('grades');

  let grade = gradeData.find(
    (g) => g.gradeId.toLowerCase() === id.toLowerCase()
  );

  if (grade == null) {
    res.status(404).send('Grade Not Found');
    console.log('Grade Not Found');
    return;
  }

  let teachers = fetchContent('teachers');

  let matches = teachers.filter((teacher) => teacher.gradeId === grade.gradeId);

  console.log(`Returned payload is: \n${JSON.stringify(matches)}`);

  res.end(JSON.stringify(matches));
});

// GET Student in Class
app.get('/api/teachers/:id/students/:studentId', (req, res) => {
  let teacherid = req.params.id;
  let studentid = req.params.studentId;
  console.log(
    `Received a GET request for student - ${studentid} in class - ${teacherid}`
  );

  let teachers = fetchContent('teachers');

  let teacher = teachers.find((t) => t.teacherId === Number(teacherid));

  if (teacher == null) {
    res.status(404).send('Teacher Not Found.');
    console.log('Teacher Not Found.');
    return;
  }

  let student = teacher.students.find((s) => s.studentId === Number(studentid));
  if (student == null) {
    res.status(404).send('Student Not Found.');
    console.log('Student Not Found.');
    return;
  }

  console.log(`Returned payload is: \n${JSON.stringify(student)}`);
  res.end(JSON.stringify(student));
});

// POST - Add A Teacher
app.post('/api/teachers', urlEncodedParser, (req, res) => {
  console.log('Received a POST request to create new teacher');
  console.log(`BODY --------> ${JSON.stringify(req.body)}`);

  let teacher = {
    teacherId: getNextId('teacher'),
    teacherName: req.body.teacherName,
    gradeId: req.body.gradeId,
    phone: req.body.phone,
    email: req.body.email,
    maxClassSize: Number(req.body.maxClassSize),
    students: [],
    avatar: req.body.avatar ? req.body.avatar : null
  };

  console.log('Validating information....');
  let errorCode = isValidTeacher(teacher);
  if (errorCode != -1) {
    console.log(`Invalid data found! Reason: ${errorCode}`);
    res.status(400).send('Bad Request - Incorrect or Missing Data');
    return;
  }

  let teachers = fetchContent('teachers');

  teachers.push(teacher);

  fs.writeFileSync(__dirname + '/data/teachers.json', JSON.stringify(teachers));

  console.log(`Added Teacher: \n${JSON.stringify(teacher)}`);

  res.end(JSON.stringify(teacher));
});

// PUT - Edit A Teacher
app.put('/api/teachers', urlEncodedParser, (req, res) => {
  console.log('Received a PUT request to update teacher');
  console.log(`BODY --------> ${JSON.stringify(req.body)}`);

  let teacher = {
    avatar: req.body.avatar,
    teacherId: req.body.teacherId,
    teacherName: req.body.teacherName,
    gradeId: req.body.gradeId,
    phone: req.body.phone,
    email: req.body.email,
    maxClassSize: Number(req.body.maxClassSize),
  };

  console.log('Validating information....');
  let errorCode = isValidTeacher(teacher);
  if (errorCode != -1) {
    console.log(`Invalid data found! Reason: ${errorCode}`);
    res.status(400).send('Bad Request - Incorrect or Missing Data');
    return;
  }

  let teachers = fetchContent('teachers');

  let match = teachers.find(
    (t) => Number(t.teacherId) === Number(teacher.teacherId)
  );
  if (match == null) {
    console.log('Teacher Not Found.');
    res.status(404).send('Teacher Not Found.');
    return;
  }

  match.teacherName = teacher.teacherName;
  match.gradeId = teacher.gradeId;
  match.phone = teacher.phone;
  match.email = teacher.email;
  match.avatar = teacher.avatar;

  if (Number(teacher.maxClassSize) < match.students.length) {
    res
      .status(409)
      .send('New class size too small based on current number of students');
    console.log('New class size too small based on current number of students');
    return;
  }
  match.maxClassSize = teacher.maxClassSize;

  fs.writeFileSync(__dirname + '/data/teachers.json', JSON.stringify(teachers));

  console.log(`Update successful! New values: ${JSON.stringify(match)}`);
  res.status(200).send();
});

// DELETE Teacher
app.delete('/api/teachers/:id', (req, res) => {
  let id = req.params.id;
  console.log(`Received a DELETE request for teacher: ${id}`);

  let teachers = fetchContent('teachers');

  let index = teachers.findIndex((teacher) => teacher.teacherId == id);

  if (index != -1) {
    teachers.splice(index, 1);
  }

  fs.writeFileSync(__dirname + '/data/teachers.json', JSON.stringify(teachers));

  console.log('Delete request processed');
  res.status(200).send();
});

// POST - Add A Student
app.post('/api/teachers/:id/students', urlEncodedParser, (req, res) => {
  let id = req.params.id;
  console.log(`Received a POST request to add new student to class: ${id}`);
  console.log(`BODY --------> ${JSON.stringify(req.body)}`);

  let student = {
    studentId: getNextId('student'),
    studentName: req.body.studentName,
    phone: req.body.phone,
    email: req.body.email,
    avatar: req.body.avatar
  };

  console.log('Validating information....');
  let errorCode = isValidStudent(student);
  if (errorCode != -1) {
    console.log(`Invalid data found! Reason: ${errorCode}`);
    res.status(400).send('Bad Request - Incorrect or Missing Data.');
    return;
  }

  let teachers = fetchContent('teachers');

  let match = teachers.find((teacher) => teacher.teacherId === Number(id));
  if (match == null) {
    console.log('Teacher Not Found.');
    res.status(404).send('Teacher Not Found.');
    return;
  }

  if (match.students.length == match.maxClassSize) {
    console.log('Student not added - class at capacity');
    res.status(409).send('Studne not added - class at capacity');
    return;
  }

  match.students.push(student);

  fs.writeFileSync(__dirname + '/data/teachers.json', JSON.stringify(teachers));

  console.log(`Added new student: \n${JSON.stringify(student)}`);

  res.send(JSON.stringify(student));
});

// PUT - Update A Student
app.put('/api/teachers/:id/students', urlEncodedParser, (req, res) => {
  let id = req.params.id;
  console.log(`Received a PUT request to update student in class: ${id}`);
  console.log(`BODY --------> ${JSON.stringify(req.body)}`);

  let student = {
    studentId: req.body.studentId,
    studentName: req.body.studentName,
    phone: req.body.phone,
    email: req.body.email,
    avatar: req.body.avatar
  };

  console.log('Validating information....');
  let errorCode = isValidStudent(student);
  if (errorCode != -1) {
    console.log(`Invalid data found! Reason: ${errorCode}`);
    res.status(400).send('Bad Request - Incorrect or Missing Data.');
    return;
  }

  let teachers = fetchContent('teachers');

  let teacher = teachers.find((t) => Number(t.teacherId) === Number(id));
  if (teacher == null) {
    console.log('Teacher Not Found.');
    res.status(404).send('Teacher Not Found.');
    return;
  }

  let match = teacher.students.find(
    (s) => Number(s.studentId) === Number(req.body.studentId)
  );
  if (match == null) {
    res.status(404).send('Student Not Found.');
    return;
  }

  match.email = req.body.email;
  match.phone = req.body.phone;
  match.studentName = req.body.studentName;
  match.avatar = req.body.avatar

  fs.writeFileSync(__dirname + '/data/teachers.json', JSON.stringify(teachers));
  console.log('Student updated!');
  res.status(200).send();
});

// DELETE Student
app.delete('/api/teachers/:id/students/:studentId', (req, res) => {
  const teacherid = req.params.id;
  const studentid = req.params.studentId;
  console.log(
    `Received a DELETE request for student ${studentid} in class ${teacherid}`
  );

  let teachers = fetchContent('teachers');
  let teacher;

  if (teachers && teachers.length > 1) {
    teacher = teachers.find((t) => t.teacherId === Number(teacherid));
  } else {
    teacher = teachers;
  }

  if (teacher == null) {
    console.log('Teacher Not Found.');
    res.status(404).send('Teacher Not Found.');
    return;
  }

  let index = teacher.students.findIndex(
    (student) => Number(student.studentId) === Number(studentid)
  );

  if (index != -1) {
    teacher.students.splice(index, 1);
  }

  fs.writeFileSync(__dirname + '/data/teachers.json', JSON.stringify(teachers));

  console.log('Student has been removed.');
  res.status(202).send();
});

// GET Admin Availability
app.get('/api/admin/isAvailable/:username', (req, res) => {
  let username = req.params.username;
  console.log(
    `Received a GET request to check if username (${JSON.stringify(
      username
    )}) is available.`
  );

  let users = fetchContent('admins');

  let user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  let msg;
  if (user == null) {
    msg = 'YES';
  } else {
    msg = 'NO';
  }

  console.log(`username available? ${msg}`);
  res.end(msg);
});

// POST - Create new Admin
app.post('/api/admin', urlEncodedParser, (req, res) => {
  console.log('Received a POST request to add new admin');
  console.log(`BODY --------> ${JSON.stringify(req.body)}`);

  let users = fetchContent('admins');

  let user = users.find(
    (u) => u.username.toLowerCase() === req.body.username.toLowerCase()
  );
  if (user != null) {
    console.log('ERROR: username already exists');
    res.status(403).send();
    return;
  }

  let admin = {
    id: getNextId('admin'),
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
  };

  users.push(admin);

  fs.writeFileSync(__dirname + '/data/admins.json', JSON.stringify(users));

  console.log(`Created admin: \n${JSON.stringify(admin)}`);
  res.status(200).send();
});

// POST Admin Login
app.post('/api/admin/login', urlEncodedParser, (req, res) => {
  console.log('Received a POST request for admin login.');
  console.log(`BODY --------> ${JSON.stringify(req.body)}`);

  let admins = fetchContent('admins');

  let match = admins.find(
    (admin) =>
      admin.username.toLowerCase() === req.body.username.toLowerCase() &&
      admin.password.toLowerCase() === req.body.password.toLowerCase()
  );
  if (match == null) {
    console.log('Error: credentials do not match known user');
    res.sendStatus(403);
    return;
  }

  let admin = {
    id: match.id,
    name: match.name,
    username: match.username,
  };

  console.log(`Login successful for: ${JSON.stringify(admin)}`);
  res.end(JSON.stringify(admin));
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

let server = app.listen(8085, () => {
  let port = server.address().port;

  console.log(`App listening on port ${port}`);
});
