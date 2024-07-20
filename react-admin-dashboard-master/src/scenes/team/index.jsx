import { Box } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Header from "../../components/Header";
import Profile from '../../images/profile.jpeg'
import './team.css';

const Team = () => {
  const employee = {
    name: 'Tamizh Selvi',
    profileImage: Profile,
    status: 'Active',
    EmployeeId: 'TC00987',
    Mobile: '+91 96553 66921',
    email: 'mrx@xyz.com',
    Self: 'Tamizh Selvi',
    DOB: '18-08-1987',
    Spouse: 'Mrs. X',
    DOB2: '18-08-1987',
    Daughter: '18-08-2023',
    son: '18-08-2023',
    Father: 'Mr. zx',
    DOB3: '08-08-1956',
    Mother: 'Mrs. XX',
    DOB4: '08-08-1958',
  };

  const downloadECard = () => {
    const input = document.getElementById('employee-profile');

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save("e-card.pdf");
    }).catch((err) => {
      console.error("Error generating PDF: ", err);
    });
  };

  return (
    <>
      <Box m="20px">
        <Header title="PROFILE" />
        <div id="employee-profile" className="employee-profile d-flex gap-5 align-items-center justify-content-center">
          <div className="profile-header">
            <img src={employee.profileImage} alt={`${employee.name}'s profile`} className="profile-image" />
            <div className="profile-info">
              <h2 className="profile-name">{employee.name}</h2>
              <span className={`status ${employee.status.toLowerCase()}`}>{employee.status}</span>
            </div>
          </div>
          <div className="profile-details">
            <p><strong>Employee ID:</strong> {employee.EmployeeId}</p>
            <p><strong>Mobile:</strong> {employee.Mobile}</p>
            <p><strong>Email ID:</strong> {employee.email}</p>
            <p><strong>Self:</strong> {employee.Self}, <strong>DOB:</strong> {employee.DOB}</p>
            <p><strong>Spouse:</strong> {employee.Spouse}</p>
            <p><strong>Daughter:</strong> {employee.Daughter}</p>
            <p><strong>Son:</strong> {employee.son}</p>
            <p><strong>Father:</strong> {employee.Father}, <strong>DOB:</strong> {employee.DOB3}</p>
            <p><strong>Mother:</strong> {employee.Mother}, <strong>DOB:</strong> {employee.DOB4}</p>
          </div>
        </div>
      </Box>

      <div className="E_Card" style={{ float: 'right', marginRight: "50px" }}>
        <button className="btn btn-danger" onClick={downloadECard}>Download E-Card</button>
      </div>
    </>
  );
};

export default Team;
