import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

interface QuizProps {
    question: string;
    options: string[];
    correctAnswer: string;
    onNext: (isCorrect: boolean,selectedAnswer:string) => void,
    coinCount: number;
    setCoinCount: (newCount: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ question, options, correctAnswer, onNext, coinCount, setCoinCount }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [animationClass, setAnimationClass] = useState<string>("");
    const [isQuestionVisible, setIsQuestionVisible] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [marioPosition, setMarioPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isRedFlagVisible, setIsRedFlagVisible] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [activeMarioIndex, setActiveMarioIndex] = useState<number>(0);

    const optionImages = [
        { src: "./optionA.png", x: 65, y: 0 },
        { src: "./optionB.png", x: 140, y: 0 },
        { src: "./optionC.png", x: 220, y: 0 },
        { src: "./optionD.png", x: 290, y: 0 },
    ];

    useEffect(() => {
        setSelectedOption(null);
        setIsAnswered(false);
        setAnimationClass("");
        setIsQuestionVisible(false);
        setIsOptionsVisible(false);

        const timer = setTimeout(() => {
            setIsQuestionVisible(true);
            setIsOptionsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, [question]);

    const handleOptionClick = (option: string, index: number) => {
        if (isAnswered) return;

        setSelectedOption(option);
        setIsAnswered(true);

        // Set Mario's initial position and the red flag's initial position
        setMarioPosition({ x: optionImages[index].x, y: 0 });
        setIsRedFlagVisible({ x: optionImages[index].x, y: -10 }); // Place the red flag slightly above the option

        // Animate Mario and Red Flag
        setTimeout(() => {
            setMarioPosition((prevPosition) => ({ ...prevPosition, y: 15 }));
            setIsRedFlagVisible((prevPosition) => ({ ...prevPosition, y: 30 }));
        }, 1000);  // Move Mario and flag up

        // Once Mario and the flag reach their initial positions, perform the rest of the animations
        setTimeout(() => {
            setMarioPosition((prevPosition) => ({ ...prevPosition, y: 0 }));
            setIsRedFlagVisible((prevPosition) => ({ ...prevPosition, y: 0 }));
        }, 2000);  // Smooth animation for Mario

        // Mario moves right (from his current position to 550px)
        setTimeout(() => {
            setMarioPosition({ x: 550, y: 0 });
        }, 3000);  // Mario starts moving after flag animation

        // Show the next question after Mario finishes his movement
        setTimeout(() => {
            // Reset Mario's position off-screen to simulate him disappearing
            setMarioPosition({ x: 0, y: 0 });
            setIsRedFlagVisible({ x: 0, y: 0 });

            // Show the next question and options after Mario finishes his movement
            setIsQuestionVisible(true);
            setIsOptionsVisible(true);
            setActiveMarioIndex((prevIndex) => prevIndex + 1);
        }, 6000); // Duration of Mario's rightward movement

        // Evaluate the selected option
        const isCorrect = option === correctAnswer;
        setAnimationClass(isCorrect ? "correct" : "incorrect");

        setTimeout(() => {
            onNext(isCorrect , option);
        }, 4000);
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center relative bg-[url('./gamebg.png')] bg-cover bg-repeat bg-center">
            {/* Background Animation */}
            <motion.div
                className="absolute top-0 left-0 h-full"
                style={{
                    backgroundImage: "url('./gamebg.png')",
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "auto",
                    width: "100vw",
                    zIndex: -1,
                    left: `${-marioPosition.x}px`,  // Adjust background movement based on Mario's position
                    transition: "left 1s ease-out",
                }}
            />

            {/* Mario Character */}
            <div className="absolute bottom-0 flex justify-center items-center gap-5 w-full">
                {[...Array(question.length)].map((_, index) => (
                    <AnimatePresence key={index}>
                        {activeMarioIndex === index && (
                            <motion.img
                                src="./marioChar.png"
                                alt={`Mario ${index + 1}`}
                                className="absolute  "
                                style={{
                                    left: `${marioPosition.x}px`,
                                    bottom: `${marioPosition.y}px`,
                                    transition: "left 1s ease-out, bottom 1s ease-out",
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                    </AnimatePresence>
                ))}
            </div>


            {/* Question and Options */}
            <div className="absolute top-0 right-0 py-5 px-8 flex flex-col justify-end items-end">
                <div className="flex justify-center items-center bg-[#88F0C8] px-3 py-1 rounded-full gap-2">
                    <img src="./coin1.png" alt="" className="w-[16px] h-[23px]" />
                    <h1 className="text-xl font-medium">{coinCount}</h1>
                </div>
                <div>
                    <img src="./hint 2.png" alt="" />
                </div>
                <div>
                    <img src="./Frame 41.png" alt="" />
                </div>
            </div>

            <div className="flex flex-col justify-between items-center w-3/4 h-1/2">
                <AnimatePresence>
                    {isQuestionVisible && (
                        <motion.div
                            key="question"
                            initial={{ y: "-70%", opacity: 0, scale: 0.1 }}
                            animate={{ y: "0", opacity: 1, scale: 1 }}
                            transition={{
                                duration: 2,
                                ease: "easeOut",
                            }}
                            onAnimationComplete={() => {
                                setIsOptionsVisible(true);
                            }}
                            className="bg-[#1E3848] rounded-2xl flex justify-center items-center w-full p-2"
                        >
                            <h2 className={`text-center font-bold mb-4 text-white font-Bagel ${question.length > 7 ? 'text-lg' : 'text-[1em]'} tracking-wider`}>
                                {question}
                            </h2>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isOptionsVisible && (
                        <motion.div
                            key="options"
                            initial={{ y: "-70%", opacity: 0, scale: 0.1 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{
                                duration: 2,
                                staggerChildren: 0.3,
                            }}
                            className="w-full flex flex-col gap-3 p-4"
                        >
                            {options.map((option, index) => {
                                let optionClass = "bg-white";
                                if (isAnswered) {
                                    if (option === correctAnswer) {
                                        optionClass = "bg-green-500";
                                    } else if (option === selectedOption) {
                                        optionClass = "bg-red-500";
                                    }
                                }

                                return (
                                    <motion.button
                                        key={index}
                                        className={`w-full flex items-center gap-3 rounded-full p-2 pl-1 shadow hover:shadow-md transition-shadow border border-gray-200 ${optionClass} ${animationClass}`}
                                        onClick={() => handleOptionClick(option, index)}
                                        disabled={isAnswered}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.3 }}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full ${index === 0
                                                ? "bg-amber-400"
                                                : index === 1
                                                    ? "bg-blue-500"
                                                    : index === 2
                                                        ? "bg-purple-500"
                                                        : "bg-pink-500"
                                                } flex items-center justify-center text-white font-semibold`}
                                        >
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className="text-gray-800 font-medium">{option}</span>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-center items-center gap-5 w-full absolute bottom-24">
                {optionImages.map((option, i) => {
                    return (
                        <div key={i}>
                            <img src={option.src} alt="" />
                            {isRedFlagVisible && selectedOption === options[i] && (
                                <motion.div
                                    className="absolute flex justify-center items-center left-4 "
                                    style={{
                                        left: `${isRedFlagVisible.x}px`,
                                        bottom: `${isRedFlagVisible.y + 30}px`,  // Position the flag above the selected option
                                        transition: " 1s ease-out",
                                    }}
                                    // transition={{ duration: 2, ease: "easeOut" }}
                                >
                                    <span className="text-3xl">🚩</span>
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Quiz;
