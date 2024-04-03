import React, { useContext } from 'react';
import { Alert } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';

function PrivateRoutes(props) {
  const { user } = useContext(UserContext);

  if (user && !user.auth) {
    return (
      <>
        <Alert variant="danger" className="mt-3">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>You don't have permission to acces this route.</p>
        </Alert>
      </>
    );
  }

  return <>{props.children}</>;
}

export default PrivateRoutes;
