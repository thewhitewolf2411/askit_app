import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Card } from "react-bootstrap";

import { useHttpClient } from "../../shared/hooks/HttpHook";

const Answer = (props:any) => {

    const [userAnswerLiked, setUserAnswerLiked] = useState<boolean>(false);
    const [userAnswerDisliked, setUserAnswerDisliked] = useState<boolean>(false);
    const [positiveAnswerVotes, setPositiveVotes] = useState<number>(0);
    const [negativeAnswerVotes, setNegativeVotes] = useState<number>(0);

    const {user} = useSelector((state:any) => state.auth);

    const { sendRequest } = useHttpClient();

    useEffect(() => {
        let positiveVotesResponse = 0;
        let negativeVotesResponse = 0;

        for(let i=0; i<props.answer.upvotes.length; i++){
            if(props.answer.upvotes[i].upvote){
                if(props.answer.upvotes[i].userId === user.userId){
                    setUserAnswerLiked(true);
                }
                positiveVotesResponse++;
            }
            else{
                if(props.answer.upvotes[i].userId === user.userId){
                    setUserAnswerDisliked(true);
                }
                negativeVotesResponse++;
            }
        }
        setPositiveVotes(positiveVotesResponse);
        setNegativeVotes(negativeVotesResponse);
    }, [props.answer.id]);

    const commentUpvoteHandler = async (upvote: boolean) => {
        const bodyData = JSON.stringify({
            userId: user.userId,
            upvote: upvote
        });

        const response = await sendRequest(`http://localhost:8000/api/upvoteanswer/${props.answer.id}`, 
            'POST', 
            bodyData, 
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            }
        );

        if(response.message === 'Success'){
            if(upvote && userAnswerLiked){
                setUserAnswerLiked(false);
                setPositiveVotes(positiveAnswerVotes - 1);
            }
            if(!upvote && userAnswerDisliked){
                setUserAnswerDisliked(false);
                setNegativeVotes(negativeAnswerVotes - 1);
            }
            if(upvote && userAnswerDisliked){
                setUserAnswerDisliked(false);
                setUserAnswerLiked(true);
                setNegativeVotes(negativeAnswerVotes - 1);
                setPositiveVotes(positiveAnswerVotes + 1);
            }
            if(!upvote && userAnswerLiked){
                setUserAnswerDisliked(true);
                setUserAnswerLiked(false);
                setNegativeVotes(negativeAnswerVotes + 1);
                setPositiveVotes(positiveAnswerVotes - 1);
            }

            if(upvote && !userAnswerLiked){
                setUserAnswerLiked(true);
                setPositiveVotes(positiveAnswerVotes + 1);
            }

            if(!upvote && !userAnswerDisliked){
                setUserAnswerDisliked(true);
                setNegativeVotes(negativeAnswerVotes + 1);
            }
        }
    }

    return(
        <Card>
            <Card.Header>
                {props.answer.answer}
            </Card.Header>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <p>Answered by: {props.answer.author.firstName + ' ' + props.answer.author.lastName || props.answer.author.email}</p>
                    <div>
                        Upvote: <div style={{cursor: 'pointer'}} onClick={() => commentUpvoteHandler(true)}><FontAwesomeIcon color={userAnswerLiked ? "blue" : undefined} icon={faThumbsUp} /> {positiveAnswerVotes} </div>
                        Downvote: <div style={{cursor: 'pointer'}} onClick={() => commentUpvoteHandler(false)}><FontAwesomeIcon color={userAnswerDisliked ? "red" : undefined} icon={faThumbsDown} /> {negativeAnswerVotes} </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Answer;