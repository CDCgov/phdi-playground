'use client'
import { ProcessList, ProcessListItem, ProcessListHeading, Button } from '@trussworks/react-uswds'

export default function upload_tutorial() {
    return (
        <div className="margin-3">
            <h1>eCR Viewer Tool</h1>
            <p>Easily see only the information you need in an eCR</p>
            <ProcessList>
                <ProcessListItem>
                    <ProcessListHeading type="h4">Start a process</ProcessListHeading>
                    <p className="margin-top-05">
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo,
                        ipsum sed pharetra gravida, orci magna rhoncus neque.
                    </p>
                    <ul>
                        <li>
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi
                            commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id
                            pulvinar odio lorem non turpis.
                        </li>
                        <li>
                            Nullam sit amet enim. Suspendisse id velit vitae ligula volutpat
                            condimentum.
                        </li>
                        <li>Aliquam erat volutpat. Sed quis velit.</li>
                    </ul>
                </ProcessListItem>
                <ProcessListItem>
                    <ProcessListHeading type="h4">
                        Proceed to the second step
                    </ProcessListHeading>
                    <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo,
                        ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio
                        lorem non turpis. Nullam sit amet enim. Suspendisse id velit vitae
                        ligula volutpat condimentum. Aliquam erat volutpat. Sed quis velit.
                        Nulla facilisi. Nulla libero. Vivamus pharetra posuere sapien.
                    </p>
                </ProcessListItem>
                <ProcessListItem>
                    <ProcessListHeading type="h4">
                        Complete the step-by-step process
                    </ProcessListHeading>
                    <p>
                        Nullam sit amet enim. Suspendisse id velit vitae ligula volutpat
                        condimentum. Aliquam erat volutpat. Sed quis velit. Nulla facilisi.
                        Nulla libero. Vivamus pharetra posuere sapien.
                    </p>
                </ProcessListItem>
            </ProcessList>
            <Button type="button">Get Started</Button>
        </div>
    )
}
