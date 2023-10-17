'use client'
import React, { useState, useEffect, useRef } from 'react';
import { FileInput, FormGroup, Label, Button } from '@trussworks/react-uswds'

function Ws() {
  const url = 'ws://localhost:8080/process-ws'
  const [formData, setFormData] = useState({}); // State for form data
  const [progress, setProgress] = useState(0); // State for progress
  const [socket, setSocket] = useState(null);
  //  const fileInputRef = useRef(); // Define the ref

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Send form data to the server via a WebSocket
    const formData = new FormData();
  // Add the file data to the FormData object (assuming you have a file input with the name "file")
    
    const file = fileInputRef.current.files[0];
    formData.append("file", file);
    console.log(JSON.stringify(fileToUpload))
    socket.send(JSON.stringify(formData));
  };

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data["progress"]);
    };

    ws.onclose = () => {
      // Handle WebSocket closed
    };

    setSocket(ws);

    return () => {
      ws.close(); // Close the WebSocket when the component unmounts
    };
  }, []);
  let fileToUpload: any = null
  const addFile = (event: any): void => {
      console.log("adding file", event.target.files[0])
      fileToUpload = event.target.files[0];
  }

  const uploadFile = (e: any): void => {
      console.log(fileToUpload)
  }

  if(progress === 0){
      return (
        <div className="margin-3">
            <FormGroup>
                <Label htmlFor="file-input-single">Input accepts a single file</Label>
                <FileInput
                  id="file-input-single"
                  name="file-input-single"
                  onChange={(addFile)}
                  itemRef='fileInputRef'
                />
                <Button type="button" disabled={fileToUpload} onClick={handleSubmit}>Upload</Button>
            </FormGroup>
        </div>
      );
  } else {
    return (
      <>
        <p>{progress}</p>
      </>
    )
  }

  
}

export default Ws;
