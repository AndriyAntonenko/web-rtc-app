import React from 'react';
import { connect } from 'react-redux';
import { SocketEventTypes, IWebSocketConnectionData } from '@webrtc_experiment/shared';

import { actions } from '../store/reducers/user';
import { IGlobalStore } from '../types/interfaces/IGlobalStore';
import { WebSocketService } from '../services/WebSocketService';

interface IUserListProps {
  users: string[];
  wsConnectionData: Partial<IWebSocketConnectionData>;
  wsService: WebSocketService;
  addUser: typeof actions.addUser
}

const UserListComponent: React.FC<IUserListProps> = (props) => {
  const { users, wsService, addUser, wsConnectionData } = props;
  
  const handleAddUser = React.useCallback(
    (data: { id: string }) => {
      addUser([data.id]);
    },
    [addUser]
  );

  React.useEffect(() => {
    wsService.addOnEventHandler(SocketEventTypes.UPDATE_USERS_LIST, handleAddUser);
    return () => {
      wsService.removeOnEventHandler(SocketEventTypes.UPDATE_USERS_LIST, handleAddUser);
    }
  }, [wsService, handleAddUser]);

  React.useEffect(() => {
    if (wsConnectionData.id) {
      fetch(`http://localhost:5000/users?except=["${wsConnectionData.id}"]`, { method: 'GET' })
        .then(response => response.json())
        .then(({ ids }) => { addUser(ids); })
        .catch(console.error);
    }
  }, [wsConnectionData, addUser]);

  return (
    <ul>
      {users.map(id => <li key={id}>{id}</li>)}
    </ul>
  );
};

const mapStateToProps = (store: IGlobalStore) => ({
  users: store.users,
  wsConnectionData: store.wsConnectionData
});

const actionCreators = {
  addUser: actions.addUser
};

const ConnectedUserList = connect(mapStateToProps, actionCreators)(UserListComponent);

export { ConnectedUserList as UserList };
