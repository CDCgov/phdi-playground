'use client'
import { FileInput, FormGroup, Label, Button } from '@trussworks/react-uswds'

export default function UploadFile(){
    let fileToUpload: any = null
    const addFile = (event: any): void => {
        fileToUpload = event.target.files[0];
    }

    const uploadFile = (e: any): void => {
        console.log(fileToUpload)
    }

    return <div>
        <FormGroup>
            <Label htmlFor="file-input-single">Input accepts a single file</Label>
            <FileInput id="file-input-single" name="file-input-single" onChange={(addFile)}/>
            <Button type="button" disabled={fileToUpload} onClick={uploadFile}>Upload</Button>
        </FormGroup>
    </div>
}
