import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logout, reset } from '../../features/auth/authSlice';


const MainHeader = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state:any) => state.auth);
  const navigate = useNavigate();

  const onLogoutHandler = async () => {
    await dispatch(logout());
    await dispatch(reset());

    navigate('/login');
  }


  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
      <Navbar.Brand as={Link} to="/">Ask.It</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/questions">Questions</Nav.Link>
          <Nav.Link as={Link} to="/users">Users</Nav.Link>
        </Nav>
        {user ? (
          <Nav>
            <NavDropdown title="Menu" id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to={`/user/${user.userId}`}>Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/askquestion">Ask Question</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogoutHandler}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : (
          <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainHeader;