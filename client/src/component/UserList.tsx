import React from 'react';
import { connect } from 'react-redux';

import { actions } from '../store/reducers/user';
import { IGlobalStore } from '../types/interfaces/IGlobalStore';
import { WebSocketService } from '../services/WebSocketService';

interface IUserListProps {
  users: string[];
  wsService: WebSocketService;
  addUser: typeof actions.addUser
}

const UserListComponent: React.FC<IUserListProps> = (props) => {
  const { users, wsService, addUser } = props;
  
  const handleWsMessage = React.useCallback(
    (event: MessageEvent) => {
      addUser(JSON.parse(event.data).data.id);
    },
    [addUser]
  );

  React.useEffect(() => {
    wsService.ws.addEventListener('message', handleWsMessage);
    return () => {
      wsService.ws.removeEventListener('message', handleWsMessage);
    }
  }, [wsService.ws, handleWsMessage]);

  return (
    <ul>
      {users.map(id => <li>{id}</li>)}
    </ul>
  );
};

const mapStateToProps = (store: IGlobalStore) => ({
  users: store.users
});

const actionCreators = {
  addUser: actions.addUser
};

const ConnectedUserList = connect(mapStateToProps, actionCreators)(UserListComponent);

export { ConnectedUserList as UserList };
