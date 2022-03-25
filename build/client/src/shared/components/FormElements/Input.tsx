import React, { useReducer, useEffect } from "react";
import { Form } from "react-bootstrap";

import './input.css';

import { validate } from "../../util/validators";

const inputReducer = (state:any, action:any) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };

    default:
      return state;
  }
};

const Input = (props:any) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    props.onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event:any) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const element =
      <Form.Control
        onChange={changeHandler}
        onBlur={touchHandler}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={inputState.value}
        className={!inputState.isValid && inputState.isTouched && "form-control--invalid"}
        disabled={props.disabled || false}
      />

  return (
      <>
        {element}
        {!inputState.isValid && inputState.isTouched && <p className="form-control--invalid__text">{props.errorText}</p>}
      </>
  );
};

export default Input;