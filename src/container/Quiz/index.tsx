import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

interface QuizProps {
    question: string;
    options: string[];
    correctAnswer: string;
    onNext: (isCorrect: boolean) => void;
    coinCount: number; 
    setCoinCount: (newCount: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ question, options, correctAnswer, onNext, coinCount, setCoinCount }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null); 
    const [isAnswered, setIsAnswered] = useState(false); 
    const [animationClass, setAnimationClass] = useState<string>(""); 
    const [isQuestionVisible, setIsQuestionVisible] = useState(false); 
    const [isOptionsVisible, setIsOptionsVisible] = useState(false); 
    const option = [
        { image: "./optionA.png" },
        { image: "./optionB.png" },
        { image: "./optionC.png" },
        { image: "./optionD.png" },
    ]

    useEffect(() => {
       
        setSelectedOption(null);
        setIsAnswered(false);
        setAnimationClass("");

        // Show question first
        setIsQuestionVisible(false);
        setIsOptionsVisible(false); // Hide options initially

        // Start the animation sequence
        const timer = setTimeout(() => {
            setIsQuestionVisible(true);
            setIsOptionsVisible(false); // Show options after the question animation completes
        }, 2000); // 2 seconds delay after question animation starts

        // Cleanup timeout
        return () => clearTimeout(timer);

    }, [question]); // Reset every time a new question is loaded

    // Handle option click
    const handleOptionClick = (option: string) => {
        if (isAnswered) return; // Prevent multiple clicks after answering

        setSelectedOption(option); // Set the selected option
        setIsAnswered(true); // Mark the question as answered

        const isCorrect = option === correctAnswer; // Check if the selected answer is correct
        setAnimationClass(isCorrect ? "correct" : "incorrect"); // Set animation class based on answer
        onNext(isCorrect); // Pass the result to the parent component

        if (isCorrect) {
            setCoinCount(coinCount + 5); // Add 5 points to the coin count on correct answer
        }

        // Timeout to move to the next question after 2 seconds
        setTimeout(() => {
            setAnimationClass(""); // Reset animation
            setIsAnswered(false); // Allow next answer
        }, 2000); // 2 seconds timeout
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-100 bg-[url('./gamebg.png')] bg-contain bg-center  relative">

            <img
                src="./marioChar.png"
                alt="Mario Character"
                className={`absolute bottom-0 left-10  `}

            />
            {/* Coin Counter */}
            <div className="absolute top-0 right-0 py-5 px-8 flex flex-col justify-end items-end">
                <div className="flex justify-center items-center bg-[#88F0C8] px-3 py-1 rounded-full gap-2">
                    <img src="./coin1.png" alt="" className="w-[16px] h-[23px]" />
                    <h1 className="text-xl font-medium">{coinCount}</h1> {/* Dynamic coin count */}
                </div>
                <div>
                    <img src="./hint 2.png" alt="" />
                </div>
                <div>
                    <img src="./Frame 41.png" alt="" />
                </div>
            </div>

            <div className="flex flex-col justify-between items-center w-3/4 h-1/2 ">
                {/* Animate Question */}
                <AnimatePresence>
                    {isQuestionVisible && (
                        <motion.div
                            key="question"
                            initial={{ y: "-70%", opacity: 0, scale: 0.1 }} // Start off-screen and small
                            animate={{ y: "0", opacity: 1, scale: 1 }} // Move to center, full opacity, full scale
                            transition={{
                                duration: 2,
                                ease: "easeOut", // Add easing for smoother transition
                            }} // Smooth transition
                            onAnimationComplete={() => {
                                // After the question animation is complete, set isOptionsVisible to true
                                setIsOptionsVisible(true);
                            }}
                            className="bg-[#1E3848] rounded-2xl flex justify-center items-center  w-full"
                        >
                            <h2 className="text-[1.7em] tracking-wider text-center font-bold mb-4 text-white font-Bagel">
                                {question}
                            </h2>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Animate Options */}
                <AnimatePresence>
                    {isOptionsVisible && (
                        <motion.div
                            key="options"
                            initial={{ y: "-70%", opacity: 0, scale: 0.1 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{
                                duration: 2,
                                staggerChildren: 0.3, // Stagger children (options)
                            }}
                            className="w-full flex flex-col gap-3 p-4"
                        >
                            {options.map((option, index) => {
                                let optionClass = 'bg-white';
                                if (isAnswered) {
                                    if (option === correctAnswer) {
                                        optionClass = 'bg-green-500';
                                    } else if (option === selectedOption) {
                                        optionClass = 'bg-red-500'; 
                                    }
                                }

                                return (
                                    <motion.button
                                        key={index}
                                        className={`w-full flex items-center gap-3 rounded-full p-2 pl-1 shadow hover:shadow-md transition-shadow border border-gray-200 ${optionClass} ${animationClass}`}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={isAnswered} 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        transition={{ delay: index * 0.3 }} 
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full ${index === 0
                                                ? 'bg-amber-400'
                                                : index === 1
                                                    ? 'bg-blue-500'
                                                    : index === 2
                                                        ? 'bg-purple-500'
                                                        : 'bg-pink-500'
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
                {
                    option.map((option, i) => {
                        return (
                            <div key={i}>
                                <img src={option.image} alt="" />
                            </div>
                        )
                    })
                }
            </div>

        </div>
    );
};

export default Quiz;
