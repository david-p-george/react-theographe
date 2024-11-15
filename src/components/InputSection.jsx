import React, { useState } from "react";
import {
  Input,
  Heading,
  Button,
} from "@chakra-ui/react";
import {
    FormControl,
    FormLabel,
} from "@chakra-ui/form-control";
import { AddIcon, RepeatIcon, DeleteIcon } from "@chakra-ui/icons";
import { Formatter } from "fracturedjsonjs";

const InputSection = () => {
    const [variants, setVariants] = useState([ { variantNo: 1, readings: [{ no: 1 }] } ]);
    const formatter = new Formatter();
    
    const returnRandomId = () => {
        return Math.floor(Math.random() * 100000);
    };

    const convertWitnessesStringToArray = (witnessesString) => {
        let witnessesArray = [];

        if (witnessesString.includes('.')) {
            witnessesArray = witnessesString.replace(/\s/g, '').split('.').filter((i) => i !== '');
        } else {
            witnessesArray = witnessesString.split(' ').filter((i) => i !== '')
        }

        witnessesArray.map((w) => {
            if (w.includes('*')) {
                let newW = w.replace('*', '');
                let wIndex = witnessesArray.indexOf(w);
                witnessesArray[wIndex] = newW;
            } else if (w.includes('CV')) {
                let wIndex = witnessesArray.indexOf(w);
                witnessesArray.splice(wIndex, 1);
            } else if (w.includes('C')) {
                let wIndex = witnessesArray.indexOf(w);
                witnessesArray.splice(wIndex, 1);
            } else if (w.includes('V')) {
                let newW = w.replace('V', '');
                let wIndex = witnessesArray.indexOf(w);
                witnessesArray[wIndex] = newW;
            }
        })

        return witnessesArray;
    }

    const handleAddVariant = () => {
        let currentVariants = [...variants];
        let randomID = returnRandomId();
        currentVariants.push({
        variantNo: randomID,
        readings: [{ no: 1 }],
        });
        setVariants(currentVariants);
    };

    const handleRemoveVariant = (variantNo) => {
        let currentVariants = [...variants];
        let updatedVariants = currentVariants.filter(
        (obj) => obj.variantNo !== variantNo
        );
        setVariants(updatedVariants);
    };

    const handleAddReading = (i) => {
        let currentVariants = [...variants];
        let randomID = returnRandomId();
        let indexVariant = currentVariants[i];
        indexVariant.readings?.push({
        no: randomID,
        });
        currentVariants[i] = indexVariant;
        setVariants(currentVariants);
    };

    const handleRemoveReading = (i, readingNo) => {
        let currentVariants = [...variants];
        let indexVariant = currentVariants[i];
        let updatedReadings = indexVariant.readings?.filter(
        (obj) => obj.no !== readingNo
        );
        currentVariants[i].readings = updatedReadings;
        setVariants(currentVariants);
    };

    const lowLevelConvert = () => {
        const responseObj = []

        Array.from(document.querySelectorAll('[id^="variantDiv"]')).map((variant) => {
            let variantNo = variant.querySelector("[id^='variantNo']").value;
            let variantVerse = variant.querySelector("[id^='variantVerse']").value;
            let lacunaeWitnessesString = variant.querySelector("[id^='lacunaeWitnesses']").value;
            let lacunaeWitnessesArray = convertWitnessesStringToArray(lacunaeWitnessesString);

            let variantObj = {
                type: "variant",
                variantNo: variantNo,
                verse: variantVerse,
                readings: [],
                lacunae: lacunaeWitnessesArray
            }

            Array.from(variant.querySelectorAll("#readingDiv")).map((reading) => {
                let readingSiglum = reading.querySelector("[id^='readingSiglum']").value;
                let readingText = reading.querySelector("[id^='readingText']").value;
                let readingWitnessesString = reading.querySelector("[id^='witnesses']").value;
                let readingWitnessesArray = convertWitnessesStringToArray(readingWitnessesString);

                let readingObj = {
                    type: "reading",
                    "siglum": readingSiglum,
                    "readingText": readingText,
                    "witnesses": readingWitnessesArray
                }

                variantObj.readings.push(readingObj)
            })

            responseObj.push(variantObj);
        })

        return formatter.Reformat(JSON.stringify(responseObj, null, 2));
    }

    const handleConvert = () => {
        document.getElementById("outputPRE").innerHTML = lowLevelConvert();
        document.getElementById("copiedTextPara").textContent = "";
    };

    return (
        <div className="w-screen sm:w-[500px] h-1/2 sm:h-[700px] bg-white overflow-y-auto overflow-x-auto" id="inputSection">
            <div className="flex justify-around w-full">
                <Button className="mr-2 mt-2">
                    Reset
                </Button>

                <Button className="mr-2 mt-2" leftIcon={<RepeatIcon w={7} h={7} paddingLeft="2" />} onClick={handleConvert}>
                    <span className="pr-2">Convert</span>
                </Button>
            </div>

            <div className="flex justify-between w-full max-w-full mt-4">
                <Heading as="h2" className="ml-3">
                    Variants
                </Heading>

                <Button colorScheme="gray" leftIcon={<AddIcon />} variant="solid" onClick={handleAddVariant} className="mr-4">
                    Variant
                </Button>
            </div>

            <div className="w-full flex flex-col justify-center items-center">
                {variants?.map((variant, i) => (
                    <div className="flex flex-col border-2 mt-3 mb-3 w-full sm:w-[450px]" id={"variantDiv" + i} key={variant.variantNo}>
                        <div className="flex justify-end mr-2">
                            <Button colorScheme="gray" leftIcon={<AddIcon />} variant="solid" onClick={() => handleAddReading(i)} className="mt-2">
                                Reading
                            </Button>

                            <Button className="mr-2 mt-2 ml-3" bgColor="blue.100" onClick={(e) => handleRemoveVariant(variant.variantNo)}>
                                <DeleteIcon color="red.600" />
                            </Button>
                        </div>

                        <div className="flex flex-row mt-3">
                            <FormControl className="ml-4">
                                <FormLabel htmlFor={"variantNo" + variant.variantNo}>
                                    <span className="font-semibold text-lg">No.</span>
                                </FormLabel>
                                <Input id={"variantNo" + variant.variantNo} name={"variantNo" + variant.variantNo} htmlSize={8} width="auto" />
                            </FormControl>

                            <FormControl className="ml-4">
                                <FormLabel htmlFor={"variantVerse" + variant.variantNo}>
                                    <span className="font-semibold text-lg">Verse</span>
                                </FormLabel>
                                <Input id={"variantVerse" + variant.variantNo} name={"variantVerse" + variant.variantNo} htmlSize={8} width="auto" />
                            </FormControl>
                        </div>
            
                        <div>
                            <Heading size="lg" className="ml-1 sm:ml-4 mt-3 mb-2">
                                Readings
                            </Heading>

                            {variant?.readings?.map((reading) => (
                                <div className="flex flex-row w-full sm:w-[400px] justify-center items-center mb-4 mt-4 sm:ml-4 bg-gray-100 rounded-lg" id="readingDiv" key={reading.no} >
                                    <div className="flex flex-col mt-2">
                                        <FormControl className="ml-2">
                                            <FormLabel htmlFor={"readingSiglum" + variant.variantNo + reading.no}>
                                                <span className="font-semibold text-lg">Siglum</span>
                                            </FormLabel>
                                            <Input id={"readingSiglum" + variant.variantNo + reading.no} name={"readingSiglum" + variant.variantNo + reading.no} htmlSize={30} width="auto" className="mb-3" borderColor="blue.200" />
                                        </FormControl>

                                        <FormControl className="ml-2">
                                            <FormLabel htmlFor={"readingText" + variant.variantNo + reading.no}>
                                                <span className="font-semibold text-lg">Reading Text</span>
                                            </FormLabel>
                                            <Input id={"readingText" + variant.variantNo + reading.no} name={"readingText" + variant.variantNo + reading.no} htmlSize={30} width="auto" className="mb-3" borderColor="blue.200" />
                                        </FormControl>

                                        <FormControl className="ml-2">
                                            <FormLabel htmlFor={"witnesses" + variant.variantNo + reading.no}>
                                                <span className="font-semibold text-lg">Witnesses</span>
                                            </FormLabel>
                                            <Input id={"witnesses" + variant.variantNo + reading.no} name={"witnesses" + variant.variantNo + reading.no} htmlSize={30} width="auto" className="mb-3" borderColor="blue.200" />
                                        </FormControl>
                                    </div>

                                    <div className="ml-3">
                                        <Button bgColor="blue.100" onClick={() => handleRemoveReading(i, reading.no)}>
                                            <DeleteIcon color="red.600" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <FormControl className="ml-4">
                                <FormLabel htmlFor={"lacunaeWitnesses" + variant.variantNo}>
                                    <span className="font-semibold text-lg">Lacunae</span>
                                </FormLabel>
                                <Input id={"lacunaeWitnesses" + variant.variantNo} name={"lacunaeWitnesses" + variant.variantNo} htmlSize={15} width="80" />
                            </FormControl>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InputSection;