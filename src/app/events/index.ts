import initStudentEvents from "../modules/student/student.events";
import initFacultyEvents from "../modules/faculty/faculty.events";

const subscribeToEvents = () => {
  initStudentEvents();
  initFacultyEvents();
}

export default subscribeToEvents;