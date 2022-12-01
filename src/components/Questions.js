import React from 'react'


// components
import SingleQuestion from './SingleQuestion'
import Data from './Data'


export default function Questions() {
    
    // questions returned from Trivia API
    const [questions, setQuestions] = React.useState([]);
    // mapping each question & its answers
    const [questionsAndAnswers, setQuestionsAndAnswers] = React.useState([]);
    
    // const [marked, setMarked] = React.useState(false);
    
    const [warning, setWarning] = React.useState(false);
    const [showResult, setShowResult] = React.useState(false);
    const [correctAnswer , setCorrectAnswer ] = React.useState(0);
    
    
    
    function resetGame() {
        setQuestions([]);
        setQuestionsAndAnswers([]);
        setCorrectAnswer(0);
        setShowResult(false);
        setWarning(false);
    }

    // console.log(questionsAndAnswers);

    React.useEffect(() => {
        // questions.length = 0 means first render & new game
        if (questions.length === 0) {
            fetch("https://opentdb.com/api.php?amount=5")
                .then((response) => response.json())
                .then((data) => {
                    setQuestions(data.results);
                    // each item in questionsAndAnswers will be an object of:
                    /*
                      -question
                      -shuffled answers
                      -correct answer
                      -selected answer
                    */
                    setQuestionsAndAnswers(
                        data.results.map((questionObject) => {
                            return {
                                question: questionObject.question,
                                shuffledAnswers: shuffle([
                                    ...questionObject.incorrect_answers,
                                    questionObject.correct_answer
                                ]),
                                correctAnswer: questionObject.correct_answer,
                                selectedAnswer: ""
                            };
                        })
                    );
                });
        }
    }, [questions]);

    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex]
            ];
        }

        return array;
    }

    function updateAnswer(answer, question) {
        // console.log(question + "   " +  answer);
        // console.log(questionsAndAnswers);
        setQuestionsAndAnswers(ans => {
            return ans.map(update => {
                return (
                    update.question == question ? { ...update, selectedAnswer: answer } : update
                )
            })
        })
    }

    const questionsElements = questionsAndAnswers.map((questionObject, index) => {
        return (
            <SingleQuestion
                key={index}
                data={Data.results}
                question={questionObject.question}
                allAnswers={questionObject.shuffledAnswers}
                selectedAnswer={questionObject.selectedAnswer}
                correctAnswer={questionObject.correctAnswer}
                showResult={showResult}
                updateAnswer={updateAnswer}
            />
        );
    });



    function checkAnswers() {
        let checked = 0;
        let correct = 0;
        questionsAndAnswers.map(questions => {
            return (
                questions.selectedAnswer == "" ? questions : (questions && checked++)
            )
        })
        const answered = (checked == questionsAndAnswers.length ? true : false);

        setWarning(!answered);


        if (answered) {
            questionsAndAnswers.map(questions => {
                return (
                    questions.selectedAnswer == questions.correctAnswer ? correct++ : questions
                )
            })
            setCorrectAnswer(correct);
            setShowResult(true);
        }

        // console.log(correct);
    }
    // checkAnswers()



    return (
        <div className='questions'>
            {/* <SingleQuestion data = {Data.results}  /> */}
            {questionsElements}

            { warning && (
                <p className='warning'  >You have not answered all questions yet</p>
            )}

            {!showResult && (questions.length > 0)  && (
                <div className='playAgain'>
                    <button onClick={checkAnswers} className='btn'>Check Answers</button>
                </div>
            )}

            {showResult && (
                <div className='playAgain' >
                    <p>You Scored {correctAnswer}/5 Correct Answers</p>
                    <button className='btn' onClick={resetGame}  >Play Again</button>
                </div>
            )}
        </div>
    )
}