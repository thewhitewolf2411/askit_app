import { Badge, Card, ListGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { User } from "../../models/User";

interface Props{
    users: User[];
    isLoading: boolean;
    numberOfUsers?: number
    loadMoreUsersHandler?: () => void
}

const UsersCard = ({users, isLoading, numberOfUsers, loadMoreUsersHandler}:Props) => {

    const {user} = useSelector((state:any) => state.auth);

    if(isLoading){
        return (
            <Card >
                <Card.Header>Latest users</Card.Header>
                <Card.Body style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Spinner as="span" animation="border" role="status" aria-hidden="true"/>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card>
            <Card.Header>Latest users</Card.Header>
            {users.length !== 0 &&
            <Card.Body>
                <ListGroup>
                {users.map((registeredUser, index) => {
                    return(
                        <Link to={user ? `/user/${registeredUser.id}` : '/login'} key={index} style={{textDecoration: 'none'}}>
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                                >
                                <div className="ms-2 me-auto">
                                <div className="fw-bold">{registeredUser.firstName || registeredUser.email}</div>
                                Cras justo odio
                                </div>
                                <Badge bg="primary" pill>
                                {registeredUser.questions?.length || 0}
                                </Badge>
                            </ListGroup.Item>
                        </Link>                   
                      );
                })}
                {users.length === numberOfUsers && 
                    <ListGroup.Item
                        as="li"
                        role="button"
                        className="d-flex justify-content-between align-items-start text-primary"
                        onClick={loadMoreUsersHandler}
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

export default UsersCard;