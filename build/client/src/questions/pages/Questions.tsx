import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap"
import { Question } from "../../models/Question";
import { User } from "../../models/User";
import { useHttpClient } from "../../shared/hooks/HttpHook";

import QuestionsCard from "../../home/components/QuestionsCard";

const Questions = () => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(20);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const loadMoreQuestionsHandler = () => {
        setNumberOfQuestions(numberOfQuestions + 20);
    }

    useEffect(() => {

        const getHomePageData = async () => {
            
            try{
                const responseQuestionData = await sendRequest(`http://localhost:8000/api/questions?numberofquestions=${numberOfQuestions}`);
                setQuestions(responseQuestionData.questions);
            } catch (err) {}
        }

        getHomePageData();
    }, [sendRequest, numberOfQuestions]);

    return(
        <Container className="mb-5">
            <Row>
                <Col md={12}>
                    <QuestionsCard questions={questions} isLoading={isLoading} numberOfQuestions={numberOfQuestions} loadMoreQuestionsHandler={loadMoreQuestionsHandler}/>
                </Col>
            </Row>
        </Container>
    );
}

export default Questions;