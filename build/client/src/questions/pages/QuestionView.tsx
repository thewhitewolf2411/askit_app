import { useEffect, useState } from "react";
import { Card, Container, Form, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { Question } from "../../models/Question";
import Input from "../../shared/components/FormElements/Input";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import { useForm } from "../../shared/hooks/FormHook";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import Answers from "./Answers";

const QuestionView = () => {

    const {user} = useSelector((state:any) => state.auth);

    const questionId = useParams().qid;

    const [question, setQuestion] = useState<Question | null>(null);
    const [positiveVotes, setPositiveVotes] = useState<number>(0);
    const [negativeVotes, setNegativeVotes] = useState<number>(0);
    const [userLiked, setUserLiked] = useState<boolean>(false);
    const [userDisliked, setUserDisliked] = useState<boolean>(false);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {

        const fetchQuestionData = async () => {
            const response = await sendRequest(`http://localhost:8000/api/question/${questionId}`, 'GET', null, {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            });

            setQuestion(response.question);

            let positiveVotesResponse = 0;
            let negativeVotesResponse = 0;

            for(let i=0; i<response.question.upvotes.length; i++){
                if(response.question.upvotes[i].upvote){
                    if(response.question.upvotes[i].userId === user.userId){
                        setUserLiked(true);
                    }
                    positiveVotesResponse++;
                }
                else{
                    if(response.question.upvotes[i].userId === user.userId){
                        setUserDisliked(true);
                    }
                    negativeVotesResponse++;
                }
            }
            setPositiveVotes(positiveVotesResponse);
            setNegativeVotes(negativeVotesResponse);
        }

        fetchQuestionData();

    }, [questionId]);

    const [formState, inputHandler] = useForm(
        {
            answer: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const commentHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if(formState.isValid){
            const bodyData = JSON.stringify({
                userId: user.userId,
                answer: formState.inputs.answer.value
            });
    
            const response = await sendRequest(`http://localhost:8000/api/answer/${questionId}`, 
                'POST', 
                bodyData, 
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            );

            if(response.status === 201){
                let answer = response.createdAnswer;

                const questionTemp = question;
                questionTemp?.answers.push(answer);

                setQuestion(questionTemp);
            }
        }
    }

    const upvoteHandler = async (upvote: boolean) => {

        const bodyData = JSON.stringify({
            userId: user.userId,
            upvote: upvote
        });

        const response = await sendRequest(`http://localhost:8000/api/upvotequestion/${questionId}`, 
            'POST', 
            bodyData, 
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            }
        );

        if(response.message === 'Success'){
            if(upvote && userLiked){
                setUserLiked(false);
                setPositiveVotes(positiveVotes - 1);
            }
            if(!upvote && userDisliked){
                setUserDisliked(false);
                setNegativeVotes(negativeVotes - 1);
            }
            if(upvote && userDisliked){
                setUserDisliked(false);
                setUserLiked(true);
                setNegativeVotes(negativeVotes - 1);
                setPositiveVotes(positiveVotes + 1);
            }
            if(!upvote && userLiked){
                setUserDisliked(true);
                setUserLiked(false);
                setNegativeVotes(negativeVotes + 1);
                setPositiveVotes(positiveVotes - 1);
            }

            if(upvote && !userLiked){
                setUserLiked(true);
                setPositiveVotes(positiveVotes + 1);
            }

            if(!upvote && !userDisliked){
                setUserDisliked(true);
                setNegativeVotes(negativeVotes + 1);
            }
        }
    }



    if(question === null){
        return(
            <Container className="d-flex justify-content-center align-items-center">
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
            </Container>
        );
    }


    return(
        <Container className="mb-5">
            <Card>
                <Card.Header>
                    <Card.Title>{question.question}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <p>Asked by: {question.author.firstName + ' ' + question.author.lastName || question.author.email}</p>
                        <div>
                            Upvote: <div style={{cursor: 'pointer'}} onClick={() => upvoteHandler(true)}><FontAwesomeIcon color={userLiked ? "blue" : undefined} icon={faThumbsUp} /> {positiveVotes} </div>
                            Downvote: <div style={{cursor: 'pointer'}} onClick={() => upvoteHandler(false)}><FontAwesomeIcon color={userDisliked ? "red" : undefined} icon={faThumbsDown} /> {negativeVotes} </div>
                        </div>
                        
                    </div>
                </Card.Body>
            </Card>

            <div className="py-3">
                <h3>Odgovori:</h3>
            </div>

            <Answers answers={question.answers} />
            
            <Card>
                <Card.Header>
                    <Form onSubmit={(e) => commentHandler(e)}>
                        {isLoading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>}
                        {!isLoading && <Input onInput={inputHandler} id="answer" placeholder={'Answer this question'} validators={[VALIDATOR_MINLENGTH(1)]}/>}
                    </Form>
                    
                </Card.Header>
            </Card>
        </Container>
    );
}

export default QuestionView;