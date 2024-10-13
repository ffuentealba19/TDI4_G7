import EditInfo from "../components/EditInfo";
import { Navbar } from "../components/Navbar";


export default function EditProfile() {
  return (
    <div>
      <Navbar />
      <div className="Profile-box" >
       <EditInfo/>  
      </div>
    </div>
  );
};
