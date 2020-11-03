import React from 'react';
import { connect } from 'react-redux';
import { SocketEventTypes } from '@webrtc_experiment/shared';

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
  
  const handleAddUser = React.useCallback(
    (data: { id: string }) => {
      addUser(data.id);
    },
    [addUser]
  );

  React.useEffect(() => {
    wsService.addOnEventHandler(SocketEventTypes.UPDATE_USERS_LIST, handleAddUser);
    return () => {
      wsService.removeOnEventHandler(SocketEventTypes.UPDATE_USERS_LIST, handleAddUser);
    }
  }, [wsService, handleAddUser]);

  return (
    <ul>
      {users.map(id => <li key={id}>{id}</li>)}
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
