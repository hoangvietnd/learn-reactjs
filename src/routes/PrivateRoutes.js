import React from 'react';
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function PrivateRoutes(props) {
  const user = useSelector(state => state.user.account);

  if (user && user.auth === false) {
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
