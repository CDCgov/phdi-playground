'use client'
import { FileInput, FormGroup, Label } from '@trussworks/react-uswds'

export default function UploadFile(){
    return <>
        <FormGroup>
            <Label htmlFor="file-input-single">Input accepts a single file</Label>
            <FileInput id="file-input-single" name="file-input-single" />
        </FormGroup>
    </>
}