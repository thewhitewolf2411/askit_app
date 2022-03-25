import Answer from "./Answer";

const Answers = (props:any) => {

    return(
        props.answers.map((answer:any, index:any) => {
            return(
                <Answer key={index} answer={answer}/>
            );
        })
    );


}

export default Answers;