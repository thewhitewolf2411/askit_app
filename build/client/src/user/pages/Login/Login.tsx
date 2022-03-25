import { useEffect } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useForm } from "../../../shared/hooks/FormHook";

import Input from "../../../shared/components/FormElements/Input";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../../shared/util/validators";

import { login, reset } from "../../../shared/features/auth/authSlice";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user, isLoading, isError, isSuccess, message} = useSelector((state:any) => state.auth);

    useEffect(() => {
        if(isError){
            console.log(message);
        }
        if(isSuccess || user){
            navigate(`/user/${user.userId}`);
        }

        dispatch(reset());

    }, [user, isError, isSuccess, message, dispatch, navigate]);

    const [formState, inputHandler] = useForm(
        {
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

    const formSubmitHandler = async (e: React.SyntheticEvent):Promise<void> => {
        e.preventDefault();

        const userData = JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
        });

        dispatch(login(userData));
    }

    return(
        <>  
            <Card>
                <Card.Header>Log in</Card.Header>
                <Card.Body>
                    <Form onSubmit={(e) => formSubmitHandler(e)}>

                        <Form.Group className="mb-3" >
                            <Form.Label>Email address</Form.Label>
                            <Input type="email" placeholder="Enter email" disabled={isLoading} id="email" onInput={inputHandler} validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]} errorText="Please input valid email."/>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Password</Form.Label>
                            <Input type="password" placeholder="Password" disabled={isLoading} id="password" onInput={inputHandler} validators={[VALIDATOR_MINLENGTH(6)]} errorText="Your password needs to have 6 characters."/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox" >
                            <Form.Check type="checkbox" label="Remember me" disabled={isLoading}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {!isLoading && <span>Login</span>}
                            {isLoading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );

}

export default Login;