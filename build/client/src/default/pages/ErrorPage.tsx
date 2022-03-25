import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import './errorpage.css';

const ErrorPage = () => {

    const [number, setNumber] = useState<number>(0);

    useEffect(() => {
        if(number !== 404){
            setTimeout(() => {
                setNumber(number + 1);
            }, 1);
        }
    }, [number]);
    
    return(
        <Container>
            <Row>
                <div className="xs-12 md-6 mx-auto">
                    <div id="countUp">
                        <div className="number" data-count="404">{number}</div>
                        <div className="text">Page not found</div>
                        <div className="text">This may not mean anything.</div>
                        <div className="text">I'm probably working on something that has blown up.</div>
                    </div>
                </div>
            </Row>
        </Container>          
            
    )
}

export default ErrorPage;