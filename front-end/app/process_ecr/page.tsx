'use client'
import { Button, StepIndicator, StepIndicatorStep } from '@trussworks/react-uswds'

export default function ProcessECR() {
    return (
        <div className="margin-3">
            <h1>Processing your eCR</h1>

            <StepIndicator counters="default" headingLevel="h4">
                <StepIndicatorStep label="Validation BB" status="complete" />
                <StepIndicatorStep label="Conversion BB" status="complete" />
                <StepIndicatorStep label="Ingestion BB" status="current" />
                <StepIndicatorStep label="Message Parser BB" status="incomplete" />
            </StepIndicator>
            <Button type="button">Continue</Button>
        </div>
    )
}
