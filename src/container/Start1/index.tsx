import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Quiz from "../Quiz";
import quizData from "../../utils/quiz.json";
import { BookCheck, CircleCheck, CircleX, NotepadTextDashed, RotateCcw, X } from "lucide-react";
import Button from "../../components/base/Button/input";

const Start1: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [coinCount, setCoinCount] = useState(50);
    const [moveMario, setMoveMario] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [userAnswers, setUserAnswers] = useState<any[]>([]); // Track answers
    const [showSummary, setShowSummary] = useState(false); // Show or hide summary

    // Loading the quiz data
    useEffect(() => {
        setQuestions(quizData.data.questions.map((question: any) => ({
            question: question.question,
            correctAnswer: question.options[question.correctOptionsIndex],
            options: question.options
        })));
    }, []);

    // Start the quiz
    const handleStart = () => {
        setShowForm(true);
        setShowQuiz(true);
        setMoveMario(true);
    };

    // Handle when the user answers a question
    const handleNextQuestion = (isCorrect: boolean, selectedAnswer: string ) => {
        setUserAnswers((prevAnswers) => [
            ...prevAnswers,
            { answer: selectedAnswer, correct: isCorrect }
        ]);

        if (isCorrect) {
            setCorrectAnswersCount((prevCount) => prevCount + 1);
            setCoinCount((prevCount) => prevCount + 5); // Add 5 coins for correct answer
        }

        setTimeout(() => {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }, 1000);
    };

    

    // Show/Hide the summary
    const handleShowSummary = () => {
        setShowSummary(!showSummary);
    };

    // Restart the quiz
    const handleRestart = () => {
        setCoinCount(50);
        setCorrectAnswersCount(0);
        setCurrentQuestionIndex(0);
        setShowQuiz(true);
        setUserAnswers([]);
        setShowSummary(false); // Hide summary when restarting
    };

    // Go back to the home screen
    const handleHome = () => {
        setShowForm(false);
        setShowQuiz(false);
    };

    console.log(userAnswers);
    
    return (
        <div className="overflow-hidden">
            <AnimatePresence>
                {!showForm ? (
                    <div key="start" className="h-screen bg-[url('./starting.png')] bg-contain bg-center relative flex justify-center flex-col items-center">
                        <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 2 }} className="flex flex-col justify-center items-center gap-5 ">
                            <div className="bg-[#990F10] rounded-2xl py-5 px-14">
                                <h1 className="text-[#FDA4A4] font-bold text-[3em] font-Bagel text-center">Answer <br /> Mario</h1>
                            </div>
                            <button onClick={handleStart} className="text-[#ffffff] font-bold text-2xl tracking-wider font-Bagel text-center">
                                Start
                            </button>
                        </motion.div>

                        <div>
                            <motion.img
                                src="./marioChar.png"
                                alt="Mario Character"
                                className={`absolute bottom-0 left-5`}
                                initial={{ x: "-100%" }}
                                animate={{ x: moveMario ? "-100%" : "0" }}
                                exit={{ x: moveMario ? "-100%" : "100%", opacity: 0 }}
                                transition={{ duration: 2, ease: "easeInOut", staggerChildren: 0.2 }}
                            />
                        </div>
                    </div>
                ) : (
                    currentQuestionIndex < questions.length ? (
                        <Quiz
                            question={questions[currentQuestionIndex]?.question || "Loading..."}
                            options={questions[currentQuestionIndex]?.options || []}
                            correctAnswer={questions[currentQuestionIndex]?.correctAnswer || ""}
                            onNext={handleNextQuestion}
                            coinCount={coinCount}
                            setCoinCount={setCoinCount}
                        />
                    ) : (
                        <motion.div key="form" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.5 }} className="h-screen bg-[#f2f2f2] flex justify-center flex-col items-center p-3 gap-5">
                            {/* Result section */}
                            {!showSummary && (
                                <div className="flex flex-col justify-center items-center w-full gap-5 ">
                                    <div className=" bg-white w-full rounded-xl h-[195px] relative">
                                        <div className="flex justify-center items-center flex-col gap-3 border-b w-full border-black p-5">
                                            <img src="https://png.pngtree.com/png-clipart/20220117/original/pngtree-trophy-gold-cup-award-winning-decorative-elements-png-image_7121786.png" alt="" className="h-[150px] w-[150px] rotate-45 absolute -top-24" />
                                            <h2 className="font-semibold text-xl tracking-wide">Congratulations!</h2>
                                            <p className="text-[#b1b0b0]">You have scored <span className="text-green-600">+ {coinCount}</span> points</p>
                                        </div>
                                        <div className="flex justify-around items-center w-full">
                                            <div className="flex flex-col justify-center items-center border-r border-black w-full">
                                                <h1 className="font-semibold">{questions.length}</h1>
                                                <p className="text-[#b1b0b0]">Total</p>
                                            </div>
                                            <div className="flex flex-col justify-center items-center border-r border-black w-full">
                                                <h1 className="font-semibold">{correctAnswersCount}</h1>
                                                <p className="text-[#b1b0b0] flex justify-center items-center gap-1">
                                                    <span className="text-green-600"><CircleCheck /></span>
                                                    Correct
                                                </p>
                                            </div>
                                            <div className="flex flex-col justify-center items-center w-full">
                                                <h1 className="font-semibold">{questions.length - correctAnswersCount}</h1>
                                                <p className="text-[#b1b0b0] flex justify-center items-center gap-1">
                                                    <span className="text-red-600"><CircleX /></span>
                                                    Wrong
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center gap-5 w-full ">
                                        <Button bgColor="bg-green-700" icon={<RotateCcw />} text="Play More" onclick={handleRestart} />
                                        <Button bgColor="bg-blue-600" icon={<BookCheck />} text="Summary" onclick={handleShowSummary} />
                                        <Button bgColor="bg-orange-600" icon={<NotepadTextDashed />} text="Dashboard" onclick={handleHome} />
                                    </div>
                                </div>
                            )}



                            {/* Summary section */}
                            {showSummary && (
                                <div className=" h-[80vh] w-full overflow-hidden overflow-y-scroll">
                                    <button
                                        onClick={() => setShowSummary(false)} // Assuming setShowSummary is used to toggle the summary
                                        className=" text-black bg-black/10 rounded-full  p-2  mb-4 "
                                    >
                                        <X />
                                    </button>
                                    {userAnswers.map((answer, index) => {
                                        console.log(`Question ${index + 1}: ${answer.question}`);
                                        console.log("Options: ");
                                        questions[index].options.forEach((option: string, optionIndex: number) => {
                                            console.log(`Option ${optionIndex + 1}: ${option}`);
                                        });
                                        console.log(`User selected: ${answer.selectedAnswer}`);
                                        console.log(`Correct answer: ${questions[index].correctAnswer}`);
                                        console.log("--------"); // Separator for clarity

                                        return (
                                            <div key={index} className="question-summary p-3 my-2">
                                                {/* Display Question */}
                                                <p className="font-semibold">Question. {index+1}</p>

                                                {/* Display Options */}
                                                <div className="options">
                                                    {questions[index].options.map((option: string, optionIndex: number) => {
                                                        const isSelected = option === answer.selectedAnswer; // Check if this option is selected by the user
                                                        const isCorrect = option === questions[index].correctAnswer; // Check if this option is correct

                                                        return (
                                                            <div
                                                                key={optionIndex}
                                                                className={`option px-3 py-3 my-2 rounded-full ${isSelected
                                                                    ? (isCorrect ? "bg-green-500" : "bg-red-500")  // Red for incorrect answer, Green for correct answer
                                                                    : (isCorrect ? "bg-green-300" : "bg-gray-200") // Light Green for correct answer, Gray for unselected wrong option
                                                                    }`}
                                                            >
                                                                {option}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Display Correct/Incorrect feedback */}
                                                <p className={answer.correct ? "text-green-600" : "text-red-600"}>
                                                    {answer.correct ? "Correct!" : "Incorrect"}
                                                </p>
                                            </div>
                                        );
                                    })}




                                </div>
                            )}
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
};

export default Start1;
