import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import QuestionsCard from '../../../home/components/QuestionsCard';
import AnswersCard from '../../../home/components/AnswersCard';
import { Answer } from '../../../models/Answers';
import { Question } from '../../../models/Question';
import { User } from '../../../models/User';
import Input from '../../../shared/components/FormElements/Input';
import { useForm } from '../../../shared/hooks/FormHook';
import { useHttpClient } from '../../../shared/hooks/HttpHook';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../../shared/util/validators";

const  Profile = () => {

    const {user} = useSelector((state:any) => state.auth);
    const userId = useParams().uid;

    const [editMode, setEditMode]           = useState<boolean>(false);
    const [loggedIn, setLoggedIn]           = useState<boolean>(userId === user.userId);
    const [userData, setUserData]           = useState<User | null>(null);
    const [userQuestions, setUserQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers]     = useState<Answer[]>([]);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            firstName: {
                value: "",
                isValid: true,
            },
            lastName: {
                value: "",
                isValid: true,
            },
            email: {
                value: "",
                isValid: false,
            },
            password: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    useEffect(()=> {
        const getProfileData = async () => {
            const response = await sendRequest(`/api/user/${userId}`, 'GET', null, {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              });
            
            const userData  = response.user;
            const questions = response.questions;
            const answers   = response.answers;

            setUserData(userData);
            setUserQuestions(questions);
            setUserAnswers(answers);

            setFormData(
                {
                    firstName: {
                        value: userData.firstName,
                        isValid: true,
                    },
                    lastName: {
                        value: userData.lastName,
                        isValid: true,
                    },
                    email: {
                        value: userData.email,
                        isValid: true,
                    },
                },
                true
            )
        }

        getProfileData();
    }, [userId]);

    if(userData === null || isLoading){
        return(
            <Container>
                <Row className="mt-5" md={12}>
                    <Col md={6}>
                        <QuestionsCard isLoading={isLoading} questions={userQuestions} title={'Latest questions from this user'}/>
                    </Col>
                    <Col md={6}>
                        <QuestionsCard isLoading={isLoading} questions={[]} title={'Latest answers from this user'}/>
                    </Col>
                </Row>
            </Container>
        );
    }

    return(
        <Container className='mb-5'>
            <Row md={12}>
                <Col md={12}>
                    <Card>
                        <Card.Header className='d-flex justify-content-between align-items-center'>
                            <Card.Title>User Profile</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>First name</Form.Label>
                                        <Input type="text" placeholder="Enter first name" disabled={!editMode || isLoading} id="firstName" onInput={inputHandler} validators={[]} initialValue={userData.firstName}/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" >
                                        <Form.Label>Last name</Form.Label>
                                        <Input type="text" placeholder="Enter last name" disabled={!editMode || isLoading} id="lastName" onInput={inputHandler} validators={[]} initialValue={userData.lastName}/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" >
                                        <Form.Label>Email address</Form.Label>
                                        <Input type="email" placeholder="Enter email" disabled={!editMode || isLoading} id="email" onInput={inputHandler} validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]} errorText="Please input valid email." initialValue={userData.email}/>
                                    </Form.Group>
                                </Form>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5" md={12}>
                <Col md={6}>
                    <QuestionsCard isLoading={isLoading} questions={userQuestions} title={'Latest questions from this user'}/>
                </Col>
                <Col md={6}>
                    <AnswersCard isLoading={isLoading} answers={userAnswers} title={'Latest answers from this user'}/>
                </Col>
            </Row>

        </Container>
    );
}

export default Profile;