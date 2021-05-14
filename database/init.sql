SET TIMEZONE='Asia/Singapore';

DROP TABLE IF EXISTS attendance_record;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;

CREATE TABLE classes (
    class_id SMALLINT NOT NULL,
    class_name TEXT NOT NULL,
    level_id SMALLINT NOT NULL,
    PRIMARY KEY(class_id)
);
COMMENT ON TABLE classes is 'List of Classes';
COMMENT ON COLUMN classes.class_id is 'Class ID';
COMMENT ON COLUMN classes.class_name is 'Class Name';
COMMENT ON COLUMN classes.level_id is 'Level ID';

CREATE TABLE students (
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    class_id SMALLINT,
    PRIMARY KEY(student_id),
    CONSTRAINT fk_class
        FOREIGN KEY(class_id)
            REFERENCES classes(class_id)
);
COMMENT ON TABLE students is 'List of Students';
COMMENT ON COLUMN students.student_id is 'Student ID';
COMMENT ON COLUMN students.student_name is 'Student Name';
COMMENT ON COLUMN students.class_id is 'Class ID';

CREATE TABLE attendance_record (
    record_id SERIAL NOT NULL,
    date DATE NOT NULL,
    student_id TEXT,
    attendance BOOLEAN,
    PRIMARY KEY(record_id),
    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
            REFERENCES students(student_id)
);
COMMENT ON TABLE attendance_record is 'List of Attendance Records';
COMMENT ON COLUMN attendance_record.record_id is 'Record ID';
COMMENT ON COLUMN attendance_record.date is 'Date';
COMMENT ON COLUMN attendance_record.student_id is 'Student ID';
COMMENT ON COLUMN attendance_record.attendance is 'Attendance Status';


INSERT INTO classes (class_id, class_name, level_id)
    VALUES (0, 'None', 0);
INSERT INTO students (student_id, student_name, class_id)
    VALUES ('0001A', 'Testing', 0)
