import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import "./contacts.css";
const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  

  return (
    <Box m="20px">
      <Header
        title="Policy Coverage"
        // subtitle="List of Contacts for Future Reference"
      />

      <div>
        <table border="1px">
          
            <tr style={{backgroundColor:colors.blueAccent[500] , color:'white'}}>
              <th colSpan={2}>Coverage</th>
            </tr>

            <tr>
              <th className="tableHeader">Sum Assured</th>
              <th>3 Lacs INR</th>
            </tr>

            <tr>
              <th>Policy Type</th>
              <th>Group Mediclaim Policy</th>
            </tr>

            <tr style={{backgroundColor:colors.blueAccent[500] , color:'white'}}>
              <th colSpan={2} >Family Definition</th>
            </tr>
            <tr>
              <th>Family Definition</th>
              <th>Self + Spouse + 5 dependent Kids + 2 Dep. Parents/ Parents In Laws</th>
            </tr>

            <tr style={{backgroundColor:colors.blueAccent[500] , color:'white'}}>
              <th colSpan={2}>Room Rent Limits</th>
            </tr>

            <tr>
              <th>Normal room rent capping</th>
              <th>2% for Normal</th>
              </tr>

              <tr>
              <th>ICU room rent capping</th>
              <th>4% for ICU</th>
              </tr>

              <tr>
              <th>Pre-existing diseases</th>
              <th>Covered from Day 1</th>
              </tr>

              <tr>
                <th>30 days waiting period</th>
                <th>Waived off</th>
              </tr>

              <tr>
                <th>1st / 2nd / 3rd / 4th Year Waiting Period</th>
                <th>Waived off</th>
              </tr>


              <tr style={{backgroundColor:colors.blueAccent[500] , color:'white'}}>
                <th colSpan={2}>Maternity</th>
              </tr>

              <tr>
                <th>9 months Waiting Period</th>
                <th>Waived off</th>
              </tr>

              <tr>
                <th>Maternity Limit</th>
                <th>Rs 60,000 for Both Normal & Caesearean</th>
              </tr>

              <tr>
                <th>New Born Cover </th>
                <th>Covered from Day 1</th>
              </tr>

              <tr style={{backgroundColor:colors.blueAccent[500] , color:'white'}}>
                <th colSpan={2}>Pre & Post Hospitalization</th>
              </tr>

              <tr>
                <th>Pre-hospitalization costs </th>
                <th>30 days </th>
              </tr>

              <tr>
                <th>Post Hospitalization costs</th>
                <th>60 days</th>
              </tr>

              <tr style={{backgroundColor:colors.blueAccent[500] , color:'white'}}>
                <th colSpan={2}>Other Conditions</th>
              </tr>

              <tr>
                <th>Oral Chemotherapy</th>
                <th>Covered upto Family SI</th>
              </tr>

              <tr>
                <th>Ambulance Charges</th>
                <th>Rs 2,000 per Incident</th>
              </tr>

              <tr>
                <th>Organ Donor</th>
                <th>Covered upto Family SI</th>
              </tr>

              <tr>
                <th>Disease-wise capping</th>
                <th>No Capping on Diseases</th>
              </tr>

              <tr>
                <th>Addition / Deletion of Lives</th>
                <th>Pro-rata</th>
              </tr>

              <tr>
                <th>Day Care Procedures</th>
                <th>Covered from day 1 </th>
              </tr>

              <tr>
                <th>Co-pay</th>
                <th>5% Copay on All Claims</th>
           </tr>

              <tr>
                <th>Corporate Buffer</th>
                <th>Covered upto Rs 10 Lakhs applicable for all diseases</th>
              </tr>

              <tr>
                <th>Parental Sum Insured Restriction</th>
                <th>Parents Sum Insured Restriction for Claim up to 50% of sum insured</th>
              </tr>

              <tr>
                <th>Disease-wise capping for Parents Only</th>
                <th>Cataract limited to Rs.25,000/-per eye only.</th>
              </tr>

        </table>
      </div>
      
    </Box>
  );
};

export default Contacts;
