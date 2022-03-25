import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap"
import { Question } from "../../models/Question";
import { User } from "../../models/User";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import QuestionsCard from "../components/QuestionsCard";
import UsersCard from "../components/UsersCard";

const Home = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(20);
    const [numberOfUsers, setNumberOfUsers] = useState<number>(20);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {

        const getHomePageData = async () => {
            
            try{
                const responseUserData = await sendRequest(`http://localhost:8000/api/users?numberofusers=${numberOfUsers}`);
                const responseQuestionData = await sendRequest(`http://localhost:8000/api/questions?numberofquestions=${numberOfQuestions}`);
                setUsers(responseUserData.users);
                setQuestions(responseQuestionData.questions);
            } catch (err) {}
        }

        getHomePageData();
    }, [sendRequest, numberOfQuestions, numberOfUsers]);

    const loadMoreQuestionsHandler = () => {
        setNumberOfQuestions(numberOfQuestions + 20);
    }

    const loadMoreUsersHadndler = () => {
        setNumberOfUsers(numberOfUsers + 20);
    }

    return(
        <Container>
            <Row>
                <Col md={6}>
                    <QuestionsCard questions={questions} isLoading={isLoading} numberOfQuestions={numberOfQuestions} loadMoreQuestionsHandler={loadMoreQuestionsHandler}/>
                </Col>
                <Col md={6}>
                    <UsersCard users={users} isLoading={isLoading} numberOfUsers={numberOfUsers} loadMoreUsersHandler={loadMoreUsersHadndler}/>
                </Col>
            </Row>
        </Container>
    );

}

export default Home;