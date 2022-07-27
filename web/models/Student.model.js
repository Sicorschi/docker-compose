const sql = require('../index').CONN;

// constructor
class Student {
    constructor(st) {
        this.student_name = st.student_name;
        this.student_age = st.student_age;
    }
    static create(newStudent, result) {
        sql.query("INSERT INTO Student SET ?", newStudent, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            console.log("created student row: ", { id: res.insertId, ...newStudent });
            result(null, { id: res.insertId, ...newStudent });
        });
    }
    static findById(id, result) {
        sql.query(`SELECT * FROM Student WHERE id = ${id}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (res.length) {
                console.log("found student: ", res[0]);
                result(null, res[0]);
                return;
            }
            // not found Tutorial with the id
            result({ kind: "not_found" }, null);
        });
    }
    static findByName(name, result) {
        let query = "SELECT * FROM Student";
        if (name) {
            query += ` WHERE name LIKE '%${name}%'`;
        }
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            console.log("Students with the same name: ", res);
            result(null, res);
        });
    }
    static findAll(result) {
        let query = "SELECT * FROM Student";
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            console.log("Students: ", res);
            result(null, res);
        });
    }
    static updateById(id, student, result) {
        sql.query(
            "UPDATE Student SET name = ?, age = ? WHERE id = ?",
            [student.name, student.age, id],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                }
                if (res.affectedRows == 0) {
                    // not found Tutorial with the id
                    result({ kind: "not_found" }, null);
                    return;
                }
                console.log("updated student: ", { id: id, ...student });
                result(null, { id: id, ...student });
            }
        );
    }
    static remove(id, result) {
        sql.query("DELETE FROM Student WHERE id = ?", id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                // not found Tutorial with the id
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("deleted student with id: ", id);
            result(null, res);
        });
    }
    static removeAll(result) {
        sql.query("DELETE FROM Student", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            console.log(`deleted ${res.affectedRows} students`);
            result(null, res);
        });
    }
}
module.exports = Student;