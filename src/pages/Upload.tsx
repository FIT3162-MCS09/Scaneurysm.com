import React, { useState } from 'react';

const Upload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        // Handle file upload logic here
    };

    return (
        <div className="upload-page">
            <h2>Upload MRI/CT Scan</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default Upload;