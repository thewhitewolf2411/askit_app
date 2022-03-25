import { Badge, Card, ListGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Answer } from "../../models/Answers";
import { Question } from "../../models/Question";

interface Props{
    questions: Question[];
    isLoading: boolean;
    answers?: Answer[]
    title?: string
    numberOfQuestions?: number
    loadMoreQuestionsHandler?: () => void
}

const QuestionsCard = ({questions, isLoading, answers, title, numberOfQuestions, loadMoreQuestionsHandler}:Props) => {

    const {user} = useSelector((state:any) => state.auth);

    const arrayOfQuestions:number[] = [];
    if(numberOfQuestions){
        for(let i = 0; i<numberOfQuestions; i++){
            arrayOfQuestions.push(i);
        }
    }

    if(isLoading){
        return (
            <Card >
                <Card.Header>{title || 'Latest questions'}</Card.Header>
                <Card.Body style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <ListGroup className="w-100">
                {arrayOfQuestions.map((element) => {
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
            {questions.length !== 0 && 
            <Card.Body>
                <ListGroup>
                {questions.map((question, index) => {
                    return(
                        <Link to={user ? `/question/${question.id}` : '/login'} key={index} style={{textDecoration: 'none'}}>
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                                >
                                <div className="ms-2 me-auto">
                                <div className="fw-bold">{question.question}</div>
                                {question.author.firstName || question.author.email}
                                </div>
                                <Badge bg="primary" pill>
                                {question.answers.length}
                                </Badge>
                            </ListGroup.Item>     
                        </Link>
               
                      );
                })}
                {questions.length === numberOfQuestions && 
                    <ListGroup.Item
                        as="li"
                        role="button"
                        className="d-flex justify-content-between align-items-start text-primary"
                        onClick={loadMoreQuestionsHandler}
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Load more...</div>
                        </div>
                    </ListGroup.Item>    
                }
                </ListGroup>

            </Card.Body>}
        </Card>
    )

}

export default QuestionsCard;