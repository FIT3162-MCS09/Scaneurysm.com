import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

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
