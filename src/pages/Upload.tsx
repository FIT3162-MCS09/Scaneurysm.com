import React, { useEffect, useState } from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import SidebarPatient from "../components/SidebarPatient";
import API from "../services/apiClient";
import "./Upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await API.get("/auth/profile/");
        setRole(res.data.role);
      } catch (err) {
        console.error("Error fetching user role", err);
      }
    };

    fetchRole();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const Sidebar = role === "doctor" ? SidebarDoctor : SidebarPatient;

  return (
    <div className="upload-page">
      <Sidebar />
      <div className="upload-content">
        <h1>Upload Scan</h1>
        <input type="file" onChange={handleFileChange} />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        <button>Analyze</button>
      </div>
    </div>
  );
};

export default Upload;