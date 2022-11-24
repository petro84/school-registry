## API Endpoints
> All endpoints will have base path - http://localhost:8085/api

### Grades
`GET` [/grades](#get-grades)

### Teachers
`GET`    [/teachers](#get-teachers) <br/>
`POST`   [/teachers](#post-teachers) <br/>
`PUT`    [/teachers](#put-teachers) <br/>
`DELETE` [/teachers](#delete-teachers) <br/>

### Students
`GET`    [/teachers/:id/students/:studentId](#get-teachersidstudentsstudentId) <br/>
`POST`   [/teachers/:id/students](#post-teachersidstudents) <br/>
`PUT`    [/teachers/:id/students](#put-teachersidstudents) <br/>
`DELETE` [/teachers/:id/students/studentId](#delete-teachersidstudentsstudentId)
___
#### GET /grades
Method fetches list of grades from the server. <br/>

**Parameters** <br/>
None<br/>
**Response**
```
[
    {
        "gradeId": "K",
        "description": "Kindergarten"
    },
    {
        "gradeId": "1",
        "description": "1st Grade"
    },
    ...
]
```
___
#### GET /teachers
Three endpoints, each fetching information pertaining to teachers. <br/>

**Parameters**<br/>
   Parameter   | Required |   Type  | Description                                                                                                                                                         |
|-------------:|:--------:|:-------:| :---------------------------------|
 ``            |     -    |    -    | Returns full list of teachers.
 `/bygrade/:id`   | required | number  | Fetches list of teachers by grade.
 `/:id` | required | number  | Fetches specific teacher.

**Response**
```
[
    {
        "teacherId": 1,
        "teacherName": "Ms. Rachelle",
        "gradeId": "K",
        "phone": "555-000-0000",
        "email": "nat214@gmail.com",
        "maxClassSize": 7,
        "students": [
            {
                "studentId": 2,
                "studentName": "Ezra Aiden",
                "phone": "555-000-0002"
                "email": "theaterkid0625@gmail.com",
            },
            {
                "studentId": 4,
                "studentName": "Elisha Aslan",
                "phone": "555-000-0003"
                "email": "aslan_the_great@gmail.com",
            },
            {
                "studentId": 6,
                "studentName": "Siddalee Grace",
                "phone": "555-000-0020"
                "email": "susa2007@gmail.com",
            }
        ]
    },
]
```
___
#### POST /teachers
Create new teacher <br/>

**Body**
```
{
    "teacherId": 0,
    "teacherName": "Mr. Test Tester",
    "gradeId": "4",
    "phone": "123-123-1234",
    "email": "test@tester.com",
    "maxClassSize": 8,
    "students": []
}
```

**Response**
```
{
    "teacherId": 7,
    "teacherName": "Mr. Test Tester",
    "gradeId": "4",
    "phone": "123-123-1234",
    "email": "test@tester.com",
    "maxClassSize": 8,
    "students": []
}
```
___
#### PUT /teachers
Update existing teacher <br/>

**Body**
```
{
    "teacherId": 7,
    "teacherName": "Mr. Test Tester",
    "gradeId": "5",
    "phone": "123-123-1234",
    "email": "test@tester.com",
    "maxClassSize": 6,
    "students": []
}
```

**Response**
HTTPStatus 200 OK
___
#### DELETE /teachers
Delete an existing teacher <br/>

**Parameters**<br/>
   Parameter   | Required |   Type  | Description                                                                                                                                                         |
|---:|:----:|:---:| :-----------|
`/:id` | required | number | Id of teacher to delete

**Response**
HTTPStatus 200 OK
___
#### GET /teachers/:id/students/:studentId
Fetch a single, known student by Id. <br/>

**Parameters**<br/>
   Parameter   | Required |   Type  | Description                                                                                                                                                         |
|------:|:----:|:-----:| :----------------|
 `/:id` | required | number  | Fetches specific teacher.
 `/:studentId` | required | number | Fetch specific student by teacher.

**Response**
```
{
    "studentId": 4,
    "studentName": "Elisha Aslan",
    "phone": "555-000-0003"
    "email": "aslan_the_great@gmail.com",
}
```
___
#### POST /teachers/:id/students
Create new student <br/>

**Body**
```
{
    "studentId": 0,
    "studentName": "Tim Taylor",
    "email": "tt@test.com",
    "phone": "123-123-4343"
}
```

**Response**
```
{
    "studentId": 15,
    "studentName": "Tim Taylor",
    "email": "tt@test.com",
    "phone": "123-123-4343"
}
```
___
#### PUT /teachers/:id/students
Update an existing student <br/>

**Body**
```
{
    "studentId": 15,
    "studentName": "Tim Taylor",
    "email": "tt@test.com",
    "phone": "123-123-9876"
}
```

**Response**
HTTPStatus 200 OK
___
#### DELETE /teachers/:id/students/:studentId
Delete an existing student <br/>

**Parameters**<br/>
   Parameter   | Required |   Type  | Description                                                                                                                                                         |
|---:|:----:|:---:| :-----------|
`/:id` | required | number | Id of teacher of student to be deleted
`/:studentId` | required | number | Id of student to delete

**Response**
HTTPStatus 200 OK