import React, { useState } from 'react';
import {Button} from "@trussworks/react-uswds";

function LinkAccordion() {
    const [isAccordionOpen, setAccordionOpen] = useState(false);

    const toggleAccordion = () => {
        setAccordionOpen(!isAccordionOpen);
    };

    const content = () => {
        return (<div
            className="font-sans-xs content"
            id="gov-banner-default-default"
        >
            <div>
                <p>Our tool expects the .zip file format generated from AIMS. For a successful upload, your .zip file:</p>
                <ul className="usa-list margin-top-0">
                    <li><u>must</u> contain: </li>
                    <ul className="usa-list margin-top-0 margin-bottom-0">
                        <li>one RR (reportability response) .xml file</li>
                        <li>one eICR (electronic initial case report) .xml file</li>
                    </ul>
                    <li>can also contain: </li>
                    <ul className="usa-list margin-top-0">
                        <li>one RR HTML file</li>
                        <li>one eICR HTML file</li>
                    </ul>
                </ul>
            </div>
        </div>
        )
    }

    return (
        <div>
            <Button type="button" unstyled onClick={toggleAccordion} data-testid="accordion-button">
                What are the .zip file requirements
            </Button>

            {isAccordionOpen ? content() : null}
        </div>
    );
}

export default LinkAccordion;
