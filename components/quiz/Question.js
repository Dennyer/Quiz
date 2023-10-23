import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import LoadingSpinner from "../LoadingSpinner";

import "tailwindcss/tailwind.css";
import "react-notifications/lib/notifications.css";

// Shuffles the array in place using Fisher-Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Question() {
  const router = useRouter();

  let {
    id,
    shuffle: shouldShuffle,
    random: shouldRandomize,
    challenge: shouldChallenge,
  } = router.query;

  // State for storing the fetched quiz data
  const [data, setData] = useState(null);
  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // 
  useEffect(() => {

    // Async function to fetch quiz data from specified JSON file
    const fetchData = async () => {
      if (!router.isReady) return;

      const quizName = id[0];

      if (id.length === 1) {
        router.push(
          `/quiz/${quizName}/1?shuffle=false&random=false&challenge=false`
        );
        return;
      }

      try {
        const quizData = await import(
          `../../public/quizJson/${quizName}.json`
        );
        setData(quizData.default);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push(
          `/`
        );
        return;
      }
    };
    fetchData();
  }, [router.isReady]);

  shouldShuffle = shouldShuffle ? shouldShuffle : false;
  shouldRandomize = shouldRandomize ? shouldRandomize : false;
  shouldChallenge = shouldChallenge ? shouldChallenge : false;

  // State to manage randomized quiz data
  const [randomizedData, setRandomizedData] = useState(null);
  // id[1] is the question number
  const question = randomizedData ? randomizedData[parseInt(id[1]) - 1] : null;

  // State to manage user's answer selections
  const [selected, setSelected] = useState([]);
  // State to manage user's answer selections with radio buttons
  const [radioSelected, setRadioSelected] = useState(null);
  // State to manage whether answers have been submitted
  const [submitted, setSubmitted] = useState(false);
  // State to manage the correctness of the answer
  const [isCorrect, setIsCorrect] = useState(null);
  // State to manage shuffled answer options
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  // State to manage user's status in challenge mode
  const [userLost, setUserLost] = useState(false);

  // Sets the randomized data based on the shouldRandomize boolean flag
  useEffect(() => {
    if (loading) return;

    if (shouldRandomize === "true") {
      setRandomizedData(shuffle([...data]));
    } else {
      setRandomizedData(data);
    }
  }, [shouldRandomize, loading]);

  // Shuffles the answer options or resets related states when a new question appears
  useEffect(() => {
    if (loading) return;

    setSelected([]);
    setSubmitted(false);
    setIsCorrect(null);

    if (question) {

      question.isSingleChoice = question.hasOwnProperty('isSingleChoice') ? question.isSingleChoice : false;

      const modifiedAnswers = question.Answers.map((answer) => {
        if (Array.isArray(answer.Options)) {
          const modifiedOptions = answer.Options.map((option) => {
            return {
              ...option,
              isTrue: option.hasOwnProperty('isTrue') ? option.isTrue : false,
            };
          });

          return {
            ...answer,
            Options: modifiedOptions,
          };
        } else {
          return {
            ...answer,
            isTrue: answer.hasOwnProperty('isTrue') ? answer.isTrue : false,
          };
        }
      });

      if (shouldShuffle === "true") {
        setShuffledAnswers(shuffle([...modifiedAnswers]));
      } else {
        setShuffledAnswers([...modifiedAnswers]);
      }
    }
  }, [id, question, shouldShuffle, loading]);

  // Toggles the selection status of an answer given the index
  // This is used for checkboxes
  const toggleSelected = (index) => {
    setSelected((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  // Changes the selection status of an answer given the index
  // This is used for radio buttons
  const handleRadioChange = (index) => {
    setRadioSelected(index);
  };

  // Handles changes in dropdown selection
  const handleDropdownChange = (answerIndex, optionIndex) => {
    setSelected((prevSelected) => {
      const newSelection = [...prevSelected];
      newSelection[answerIndex] = optionIndex;
      return newSelection;
    });
  };

  // Handles the submission of answers
  const handleSubmit = () => {
    setSubmitted(true);

    let correctSelected = 0;
    let maybeSelected = 0;
    let totalCorrect = 0;
    let totalMaybe = 0;

    let skip = false;

    shuffledAnswers.forEach((answer, index) => {
      if (skip) return;
      if (question.isSingleChoice) {
        if (
          radioSelected == -1 ||
          radioSelected == null
        ) {
          alert("Please select an option");
          skip = true;
          return;
        }

        if (index == radioSelected && answer.isTrue === true) correctSelected++;
        if (index == radioSelected && answer.isTrue === "maybe") maybeSelected++;
        if (answer.isTrue === true) totalCorrect++;
        if (answer.isTrue === "maybe") totalMaybe++;

      } else if (answer.Options) {

        if (
          selected[index] == -1 ||
          selected[index] == null ||
          selected.length != answer.Options.length
        ) {
          alert("Please select all options");
          skip = true;
          return;
        }

        if (answer.Options[selected[index]].isTrue === true) correctSelected++;
        if (answer.Options[selected[index]].isTrue === "maybe") maybeSelected++;

        totalCorrect++;
      } else {
        if (answer.isTrue === true) totalCorrect++;
        if (answer.isTrue === "maybe") totalMaybe++;

        if (selected.includes(index)) {
          if (answer.isTrue === true) correctSelected++;
          if (answer.isTrue === "maybe") maybeSelected++;
        }
      }
    });

    if (skip) {
      setSubmitted(false);
      return;
    }

    if (shouldChallenge === "true" && !userLost) {
      let correctAnswers = 0;
      let maybeAnswers = 0;

      let done = false;
      shuffledAnswers.forEach((answer, index) => {
        if (done) return;

        if (answer.isTrue === true || answer.isTrue === "maybe") {
          correctAnswers++;
          if (!selected.includes(index)) {
            setUserLost(true);
            alert("You lost");
            done = true;
          }
        } else if (selected.includes(index)) {
          setUserLost(true);
          alert("You lost");
          done = true;
        }
      });
    }

    const allSelectedCorrect = selected.every((index) => {
      const answer = shuffledAnswers[index];
      return answer.isTrue === true || answer.isTrue === "maybe";
    });

    if (
      correctSelected + maybeSelected == totalCorrect + totalMaybe &&
      correctSelected + maybeSelected > 0
    ) {
      NotificationManager.success(
        `${correctSelected + maybeSelected} / ${totalCorrect + totalMaybe}`,
        "Perfect!"
      );
    } else {
      NotificationManager.error(
        `${correctSelected + maybeSelected} / ${totalCorrect + totalMaybe}`,
        "Try again!"
      );
    }
  };

  // Handles navigating to the next question
  const handleNext = () => {
    // Reset state
    setSelected([]);
    setSubmitted(false);
    setIsCorrect(null);

    if (userLost) {
      router.push(
        `/quiz/${id[0]}/1?shuffle=${shouldShuffle}&random=${shouldRandomize}&challenge=${shouldChallenge}`
      );
      setUserLost(false);
    } else {
      const nextId =
        parseInt(id[1]) + 1 <= randomizedData.length ? parseInt(id[1]) + 1 : 1;
      router.push(
        `/quiz/${id[0]}/${nextId}?shuffle=${shouldShuffle}&random=${shouldRandomize}&challenge=${shouldChallenge}`
      );
    }
  };

  // Handles navigating to the previous question
  const handlePrevious = () => {
    // Reset state
    setSelected([]);
    setSubmitted(false);
    setIsCorrect(null);

    if (userLost) {
      router.push(
        `/quiz/${id[0]}/1?shuffle=${shouldShuffle}&random=${shouldRandomize}&challenge=${shouldChallenge}`
      );
      setUserLost(false);
    } else {
      const nextId =
        parseInt(id[1]) - 1 > 0 ? parseInt(id[1]) - 1 : randomizedData.length;
      router.push(
        `/quiz/${id[0]}/${nextId}?shuffle=${shouldShuffle}&random=${shouldRandomize}&challenge=${shouldChallenge}`
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-8 text-black dark:bg-darkmode-1000 dark:text-white">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <NotificationContainer />
          {shuffledAnswers && question && (
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md dark:bg-darkmode-900">
              <div className="mb-8 flex w-full max-w-lg justify-between">
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                  onClick={() => router.push(`/`)}
                >
                  <MdOutlineArrowBackIosNew />
                </button>
              </div>
              <h1 className="mb-4 text-2xl">{question.Question}</h1>
              <ul>
                {shuffledAnswers.map((answer, index) => (
                  <li
                    key={`${id[1]}-${index}`}
                    className="mb-4 flex items-center justify-between rounded border-gray-100 pl-4 dark:border-gray-700"
                  >
                    {answer.Options ? (
                      <>
                        <span className="flex items-center justify-center">
                          {answer.text}
                        </span>
                        <select
                          onChange={(e) =>
                            handleDropdownChange(index, e.target.value)
                          }
                          className="w-15 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        >
                          <option value="-1">Select</option>
                          {answer.Options.map((option, optionIndex) => (
                            <option
                              key={`${id[1]}-option-${optionIndex}`}
                              value={optionIndex}
                            >
                              {option.text}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        {question.isSingleChoice ? (
                          <label
                            className={`my-2 block p-4 ${submitted
                              ? index == radioSelected
                                ? answer.isTrue === true
                                  ? "bg-green-300"
                                  : answer.isTrue === "maybe"
                                    ? "bg-yellow-200"
                                    : "bg-red-300"
                                : answer.isTrue === true ||
                                  answer.isTrue === "maybe"
                                  ? "bg-red-300"
                                  : ""
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              name="singleChoice"
                              checked={radioSelected === index}
                              onChange={() => handleRadioChange(index)}
                              disabled={submitted}
                              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 accent-darkmode-800 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-darkmode-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />

                            <span className="ml-2 w-full py-4 text-sm font-medium">
                              {answer.text}
                            </span>
                          </label>
                        ) : (
                          <label
                            className={`my-2 block p-4 ${submitted
                              ? selected.includes(index)
                                ? answer.isTrue === true
                                  ? "bg-green-300"
                                  : answer.isTrue === "maybe"
                                    ? "bg-yellow-200"
                                    : "bg-red-300"
                                : answer.isTrue === true ||
                                  answer.isTrue === "maybe"
                                  ? "bg-red-300"
                                  : ""
                              : ""
                              }`}
                          >
                            <input
                              type="checkbox"
                              onChange={() => toggleSelected(index)}
                              disabled={submitted}
                              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 accent-darkmode-800 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-darkmode-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />

                            <span className="ml-2 w-full py-4 text-sm font-medium">
                              {answer.text}
                            </span>
                          </label>
                        )}

                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex justify-between">
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-white dark:bg-blue-700"
                  onClick={handlePrevious}
                >
                  Previous
                </button>
                <button
                  className={`ml-4 rounded px-4 py-2 text-white ${submitted
                    ? "bg-gray-500 dark:bg-gray-700"
                    : "bg-blue-600 dark:bg-blue-700"
                    }`}
                  onClick={handleSubmit}
                  disabled={submitted}
                >
                  Confirm
                </button>
                <button
                  className={`ml-4 rounded px-4 py-2 text-white ${submitted
                    ? "bg-blue-600 dark:bg-blue-700"
                    : "bg-gray-500 dark:bg-gray-700"
                    }`}
                  onClick={handleNext}
                  disabled={!submitted}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
