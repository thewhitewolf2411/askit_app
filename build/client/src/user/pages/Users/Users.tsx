import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap"
import { Question } from "../../../models/Question";
import { User } from "../../../models/User";
import { useHttpClient } from "../../../shared/hooks/HttpHook";

import UserCard from "../../../home/components/UsersCard";

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(20);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {

        const getHomePageData = async () => {
            
            try{
                const responseQuestionData = await sendRequest("/api/users");
                setUsers(responseQuestionData.users);
            } catch (err) {}
        }

        getHomePageData();
    }, [sendRequest]);

    return(
        <Container>
        <Row>
            <Col md={12}>
                <UserCard users={users} isLoading={isLoading} />
            </Col>
        </Row>
    </Container>
    );
}

export default Users;