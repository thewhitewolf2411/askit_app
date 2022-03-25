import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/FormHook";
import { useHttpClient } from "../../shared/hooks/HttpHook";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

const AskQuestion = () => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const {user} = useSelector((state:any) => state.auth);

    const [formState, inputHandler] = useForm(
        {
            question: {
                value: "",
                isValid: false,
            },
        },
        false
      );

    const formSubmitHandler = async (e: React.SyntheticEvent):Promise<void> => {
        e.preventDefault();

        const questionData = JSON.stringify({
            question: formState.inputs.question.value,
            author: user.userId
        });

        const response = await sendRequest("http://localhost:8000/api/questions", "POST", questionData, {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json" 
        });
    }


    return(
        <>  
            <Card>
                <Card.Header>Ask new question</Card.Header>
                <Card.Body>
                    <Form onSubmit={(e) => formSubmitHandler(e)}>

                        <Form.Group className="mb-3" >
                            <Form.Label>Question</Form.Label>
                            <Input type="text" placeholder="Enter your question" disabled={isLoading} id="question" onInput={inputHandler} validators={[VALIDATOR_REQUIRE()]} errorText="Question is required."/>
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {!isLoading && <span>Create question</span>}
                            {isLoading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}

export default AskQuestion;