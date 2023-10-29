import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
    NotificationContainer,
    NotificationManager,
  } from "react-notifications";
import "react-notifications/lib/notifications.css";

import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

import { MdOutlineArrowBackIosNew } from "react-icons/md";

import Single from '../../components/create/Single';
import Multiple from '../../components/create/Multiple';
import Select from '../../components/create/Select';

export default function Questionnaire() {
    const router = useRouter();
    const { id } = router.query;
    const [currentQuestionType, setCurrentQuestionType] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [currentQuestionText, setCurrentQuestionText] = useState("");
    const [currentAnswers, setCurrentAnswers] = useState([]);

    useEffect(() => {
        const { id } = router.query;

        if (!checkValidId(id)) return;

        if (!id || !Array.isArray(id)) return;

        if (!id[1]) {
            router.replace(`/create/${id[0]}/1`);
            return;
        }

        setCurrentIndex(id[1] - 1);
    }, [router.query]);

    useEffect(() => {
        const existingQuestion = questions[currentIndex];
        if (existingQuestion) {
            setCurrentQuestionText(existingQuestion.Question);
            setCurrentAnswers(existingQuestion.Answers);
            setCurrentQuestionType(existingQuestion.isSingleChoice ? 'single' : Array.isArray(existingQuestion.Answers.Options) ? 'select' : 'multiple');
        } else {
            setCurrentQuestionText("");
            setCurrentAnswers([]);
        }
    }, [currentIndex, questions]);

    const checkValidId = (id) => {
        if (id == undefined) return true;
        if (Array.isArray(id) && id.length === 2) {
            const [firstElement, secondElement] = id;

            // Validate the first element to include only letters, numbers, and underscores
            const firstElementValid = /^[A-Za-z0-9_]+$/.test(firstElement);

            // Validate the second element to include only numbers
            const secondElementValid = /^[0-9]+$/.test(secondElement);

            if (!firstElementValid || !secondElementValid) {
                console.error('Invalid or malicious ID detected');
                alert("Invalid or malisious ID")
                router.replace(`/create`)
                return false;
            }
        } else {
            console.error('Invalid ID format');
            alert("Invalid or malisious ID")
            router.replace(`/create`)
            return false;
        }
        return true;
    }

    const addOrUpdateQuestion = (question) => {
        const newQuestions = [...questions];
        const formattedQuestion = {
            Question: DOMPurify.sanitize(question.text),
            isSingleChoice: currentQuestionType === 'single',
            Answers: question.answers.map(answer => ({
                text: DOMPurify.sanitize(answer.text),
                isTrue: answer.isTrue ? true : false
            }))
        };
        newQuestions[currentIndex] = formattedQuestion;
        setQuestions(newQuestions);
    };

    const goToPage = (page, collectDataCallback) => {
        if (!checkValidId(id)) return;
        if (page <= 0) return;

        const collectedData = collectDataCallback();

        if (collectedData.text == "" || collectedData.answers == null || collectedData.answers == [] || collectedData.answers.length == 0) return;

        addOrUpdateQuestion({
            ...questions[currentIndex],
            ...collectedData,
        });

        setCurrentIndex(page - 1);

        router.push(`/create/${id[0]}/${page}`);

        setCurrentQuestionText("");
        setCurrentQuestionType(null);
    };

    const finishQuiz = async () => {
        if (!checkValidId(id)) return;
        const name = id[0];

        const response = await fetch('/api/submitQuestionnaire', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, questions }),
        });

        if (response.ok) {
            NotificationManager.success(
                `You will be redirectd ...`,
                "Quiz correctly created!")
            router.push('/');
            return;
        } else {
            NotificationManager.error(
                `There ws an error during the creation.\nPlease check everything.`,
                "Error.")
        }

    };



    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 p-8 text-black dark:bg-darkmode-1000 dark:text-white">
            
          <NotificationContainer />

            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md dark:bg-darkmode-900">
                <div className="mb-8 flex w-full max-w-lg justify-between">
                    <button
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                        onClick={() => {
                            if (confirm("Are you sure?\nEvery change not saved will be lost.")) {
                                router.push('/create');
                            }
                        }}
                    >
                        <MdOutlineArrowBackIosNew />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Enter your question here"
                    className="border p-2 mb-4"
                    value={currentQuestionText}
                    onChange={(e) => setCurrentQuestionText(e.target.value)}
                />
                <div className="flex">
                    <button onClick={() => setCurrentQuestionType('single')} className="p-2 bg-blue-500 text-white m-2">Single Choice</button>
                    <button onClick={() => setCurrentQuestionType('multiple')} className="p-2 bg-blue-500 text-white m-2">Multiple Choice</button>
                </div>
                <div>

                    {
                        currentQuestionType === 'single'
                        && (
                            (currentAnswers != null && currentAnswers.length != 0 &&
                                <Single
                                    startingValues={currentAnswers}
                                    collectDataCallback={(data) => setCurrentAnswers(data)}
                                />
                            ) || (
                                ((currentAnswers != null && currentAnswers.length == 0) || (currentAnswers == null)) &&
                                <Single
                                    collectDataCallback={(data) => setCurrentAnswers(data)}
                                />
                            )
                        )
                    }
                    {
                        currentQuestionType === 'multiple'
                        && (
                            (currentAnswers != null && currentAnswers.length != 0 &&
                                <Multiple
                                    startingValues={currentAnswers}
                                    collectDataCallback={(data) => setCurrentAnswers(data)}
                                />
                            ) || (
                                ((currentAnswers != null && currentAnswers.length == 0) || (currentAnswers == null)) &&
                                <Multiple
                                    collectDataCallback={(data) => setCurrentAnswers(data)}
                                />
                            )
                        )
                    }
                    {
                        /*currentQuestionType === 'select'
                        && (
                            (currentAnswers != null && currentAnswers.length != 0 &&
                                <Select
                                    startingValues={currentAnswers}
                                    collectDataCallback={(data) => setCurrentAnswers(data)}
                                />
                            ) || (
                                ((currentAnswers != null && currentAnswers.length == 0) || (currentAnswers == null)) &&
                                <Select
                                    collectDataCallback={(data) => setCurrentAnswers(data)}
                                />
                            )
                        )*/
                    }
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => {
                            goToPage(currentIndex, () => ({
                                text: currentQuestionText,
                                answers: currentAnswers,
                            }));
                        }}
                    >
                        Previous
                    </button>
                    <button
                        onClick={finishQuiz}
                        className="ml-4 rounded px-4 py-2 text-white bg-green-600"
                    >
                        Finish
                    </button>

                    <button
                        onClick={() => {
                            goToPage(currentIndex + 2, () => ({
                                text: currentQuestionText,
                                answers: currentAnswers,
                            }));
                        }}
                    >
                        Next
                    </button>


                </div>
            </div>
        </div >
    );
}