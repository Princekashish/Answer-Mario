import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Quiz from "../Quiz";

const Start1: React.FC = () => {
    const questions = [
        { question: "What is the capital of Japan?", answer: "Tokyo", options: ["Beijing", "Tokyo", "Seoul", "Bangkok"] },
        { question: "Which planet is known as the Red Planet?", answer: "Mars", options: ["Earth", "Mars", "Venus", "Jupiter"] },
        { question: "Who wrote the play 'Romeo and Juliet'?", answer: "William Shakespeare", options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "Jane Austen"] },
        { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean", options: ["Atlantic Ocean", "Arctic Ocean", "Indian Ocean", "Pacific Ocean"] },
        { question: "Which animal is known as the King of the Jungle?", answer: "Lion", options: ["Elephant", "Tiger", "Lion", "Giraffe"] },
    ];

    const [showForm, setShowForm] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [coinCount, setCoinCount] = useState(50); 
    const [moveMario, setMoveMario] = useState(false);

    const handleStart = () => {
        setShowForm(true);
        setShowQuiz(true);
        setMoveMario(true);
    };

    const handleNextQuestion = (isCorrect: boolean) => {
        if (isCorrect) {
            setCoinCount(prevCount => prevCount + 5);
        }
        setTimeout(() => {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }, 1000);
    };

    const handleRestart = () => {
        setCoinCount(50); // Reset coin count to 50
        setCurrentQuestionIndex(0);
        setShowQuiz(true);
    };

    const handleHome = () => {
        setShowForm(false);
        setShowQuiz(false);
    };

    return (
        <div className="overflow-hidden">
            <AnimatePresence>
                {!showForm ? (
                    <div
                        key="start"
                        className="h-screen bg-[url('./starting.png')] bg-contain bg-center relative flex justify-center flex-col items-center"
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 2 }}
                            className="flex flex-col justify-center items-center gap-5 "
                        >
                            <div className="bg-[#990F10] rounded-2xl py-5 px-14">
                                <h1 className="text-[#FDA4A4] font-bold text-[3em] font-Bagel text-center">Answer <br/> Mario</h1>
                            </div>
                            <button onClick={handleStart} className="text-[#ffffff] font-bold text-2xl tracking-wider font-Bagel text-center">
                                Start
                            </button>
                        </motion.div>

                        {/* Animate Mario Character */}
                        <div className=" ">
                        <motion.img
                            src="./marioChar.png"
                            alt="Mario Character"
                            className={`absolute bottom-0 left-5  `}
                            initial={{ x: "-100%" }} // Initially off-screen to the left
                            animate={{ x: moveMario ? "-100%" : "0" }} // Move to the right (0%) when 'moveMario' is true
                            exit={{ x: moveMario ? "-100%" : "100%", opacity: 0 }} // Exit to the right if 'moveMario' is true
                            transition={{ duration: 2, ease: "easeInOut" ,staggerChildren:0.2 }} // Smooth transition to the right
                        />
                        </div>
                    </div>
                ) : (
                    currentQuestionIndex < questions.length ? (
                        <Quiz
                            question={questions[currentQuestionIndex].question}
                            options={questions[currentQuestionIndex].options}
                            correctAnswer={questions[currentQuestionIndex].answer} // Pass correctAnswer prop
                            onNext={handleNextQuestion}
                            coinCount={coinCount} // Pass current coin count
                            setCoinCount={setCoinCount} // Pass the function to update coin count
                        />
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.5 }}
                            className="h-screen bg-[url('./final.png')] bg-contain bg-center relative"
                        >
                            <div className="flex flex-col justify-center items-center h-screen gap-5">
                                <div className="bg-[#990F10] rounded-2xl py-5 px-5">
                                    <h1 className="text-[#FDA4A4] font-bold text-[2.1em] font-Bagel text-center">Final Score: {coinCount}</h1>
                                </div>

                                {/* Buttons for Restart and Home */}
                                <div className="flex gap-4 font-Bagel">
                                    <button onClick={handleRestart} className="bg-green-500 text-white px-6 py-2 rounded-full">Restart</button>
                                    <button onClick={handleHome} className="bg-blue-500 text-white px-6 py-2 rounded-full">Home</button>
                                </div>
                            </div>
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
};

export default Start1;
