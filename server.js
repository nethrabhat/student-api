const http = require('http');

let students = [];

// Email validation
function validateEmail(email) {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
}

const server = http.createServer((req, res) => {

    res.setHeader('Content-Type', 'application/json');

    // GET all students
    if (req.method === 'GET' && req.url === '/students') {

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: students
        }));
    }

    // GET single student
    else if (req.method === 'GET' && req.url.startsWith('/students/')) {

        const id = req.url.split('/')[2];
        const student = students.find(s => s.id === id);

        if (!student) {
            res.writeHead(404);
            return res.end(JSON.stringify({
                success: false,
                message: "Student not found"
            }));
        }

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: student
        }));
    }

    // POST create student
    else if (req.method === 'POST' && req.url === '/students') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            const data = JSON.parse(body);

            if (!data.name || !data.email || !data.course || !data.year) {
                res.writeHead(400);
                return res.end(JSON.stringify({
                    success: false,
                    message: "All fields are required"
                }));
            }

            if (!validateEmail(data.email)) {
                res.writeHead(400);
                return res.end(JSON.stringify({
                    success: false,
                    message: "Invalid email format"
                }));
            }

            if (data.year < 1 || data.year > 4) {
                res.writeHead(400);
                return res.end(JSON.stringify({
                    success: false,
                    message: "Year must be between 1 and 4"
                }));
            }

            const student = {
                id: Date.now().toString(),
                name: data.name,
                email: data.email,
                course: data.course,
                year: data.year
            };

            students.push(student);

            res.writeHead(201);
            res.end(JSON.stringify({
                success: true,
                data: student
            }));
        });
    }

    // PUT update student
    else if (req.method === 'PUT' && req.url.startsWith('/students/')) {

        const id = req.url.split('/')[2];

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            const data = JSON.parse(body);
            const index = students.findIndex(s => s.id === id);

            if (index === -1) {
                res.writeHead(404);
                return res.end(JSON.stringify({
                    success: false,
                    message: "Student not found"
                }));
            }

            students[index] = { ...students[index], ...data };

            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: students[index]
            }));
        });
    }

    // DELETE student
    else if (req.method === 'DELETE' && req.url.startsWith('/students/')) {

        const id = req.url.split('/')[2];
        const student = students.find(s => s.id === id);

        if (!student) {
            res.writeHead(404);
            return res.end(JSON.stringify({
                success: false,
                message: "Student not found"
            }));
        }

        students = students.filter(s => s.id !== id);

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            message: "Student deleted"
        }));
    }

    // Route not found
    else {

        res.writeHead(404);
        res.end(JSON.stringify({
            success: false,
            message: "Route not found"
        }));
    }

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});