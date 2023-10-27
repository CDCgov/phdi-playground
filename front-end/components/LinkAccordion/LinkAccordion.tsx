import React, { useState } from 'react';

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
                    <li>&bull; <u>must</u> contain: </li>
                    <ul className="usa-list margin-top-0 margin-bottom-0">
                        <li>&bull; one RR (reportability response) .xml file</li>
                        <li>&bull; one eICR (electronic initial case report) .xml file</li>
                    </ul>
                    <li>&bull; can also contain: </li>
                    <ul className="usa-list margin-top-0">
                        <li>&bull; one RR HTML file</li>
                        <li>&bull; one eICR HTML file</li>
                    </ul>
                </ul>
            </div>
        </div>
        )
    }

    return (
        <div>
            <button
                type="button"
                className={`usa-banner__button ${isAccordionOpen ? 'active' : ''} margin-left-0`}
                aria-expanded={isAccordionOpen ? 'true' : 'false'}
                aria-controls="gov-banner-default-default"
                data-testid="accordion-button"
                onClick={toggleAccordion}
            >
                <span className="usa-banner__button-text">What are the .zip file requirements</span>

            </button>
            {isAccordionOpen ? content() : null}
        </div>
    );
}

export default LinkAccordion;
