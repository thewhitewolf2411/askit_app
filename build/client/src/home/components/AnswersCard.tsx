import { Badge, Card, ListGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Answer } from "../../models/Answers";

interface Props{
    answers: Answer[];
    isLoading: boolean;
    title?: string
    numberOfAnswers?: number
    loadMoreQuestionsHandler?: () => void
}

const AnswersCard = ({answers, isLoading, title, numberOfAnswers, loadMoreQuestionsHandler}:Props) => {

    const arrayOfAnswers:number[] = [];
    if(numberOfAnswers){
        for(let i = 0; i<numberOfAnswers; i++){
            arrayOfAnswers.push(i);
        }
    }

    if(isLoading){
        return (
            <Card >
                <Card.Header>{title || 'Latest questions'}</Card.Header>
                <Card.Body style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <ListGroup className="w-100">
                {arrayOfAnswers.map((element) => {
                    return(
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-center align-items-center w-100"
                            key={element}
                            style={{minHeight: 66}}
                            >
                                <Spinner as="span" animation="border" role="status" aria-hidden="true"/>
                        </ListGroup.Item>  
                    );
 
                })}
                </ListGroup>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card>
            <Card.Header>{title || 'Latest questions'}</Card.Header>
            {answers.length !== 0 && 
            <Card.Body>
                <ListGroup>
                {answers.map((answer, index) => {
                    return(
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                            >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">{answer.answer}</div>
                            {answer.author.firstName || answer.author.email}
                            </div>
                        </ListGroup.Item>     
                      );
                })}
                </ListGroup>

            </Card.Body>}
        </Card>
    )

}

export default AnswersCard;