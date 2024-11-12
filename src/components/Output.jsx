import React, { useEffect } from "react";
import { Heading, Button } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

const Output = () => {
    useEffect(() => {
        document.getElementById("outputPRE").innerHTML = JSON.stringify([], null, 2)}, []);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(document.getElementById("outputPRE").innerHTML);
        document.getElementById("copiedTextPara").textContent = "Copied!";
    };

    return (
        <div className="w-screen sm:w-[500px] h-1/2 sm:h-[700px] bg-white sm:ml-6 overflow-y-auto overflow-x-auto" id="outputSection">
            <div className="sticky top-0 w-full flex justify-between">
                <Heading as="h1" className="ml-2">
                    JSON
                </Heading>

                <Button variant="outline" onClick={handleCopyToClipboard} className="mt-2 mr-2">
                    <CopyIcon />
                    <p id="copiedTextPara" className="text-green-300 ml-2"></p>
                </Button>
            </div>

            <pre id="outputPRE" className="ml-2 mt-3"></pre>
        </div>
    );
};

export default Output;