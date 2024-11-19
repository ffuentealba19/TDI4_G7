import EditInfo from "@/Components/EditInfo";
import { Navbar } from "@/Components/Navbar";


export default function EditProfile() {
  return (
    <div>
      <Navbar></Navbar>
      <div className="Profile-box">
       <EditInfo/>  
      </div>
    </div>
  );
};
